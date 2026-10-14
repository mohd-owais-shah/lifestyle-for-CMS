import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {useLocation, useNavigate, useRouteLoaderData} from 'react-router';
import {
  useDeliveryLocation,
  openDeliveryLocationPicker,
  closeDeliveryLocationPicker,
  subscribeToDeliveryPickerOpen,
  subscribeToDeliveryPickerClose,
} from '~/lib/deliveryLocation';

export {openDeliveryLocationPicker, closeDeliveryLocationPicker};

const BAR_STYLES = {
  header:
    'px-4 py-3 border-t border-b border-gray-200 bg-[#FAFAFA] text-[14px] font-semibold text-black',
  pdp: 'h-[38px] px-4 bg-[#FAFAFA] border-t border-[#ECEDEB] text-[12px] text-[#212121]',
  cart: 'px-4 py-2.5 border-t border-b border-gray-200 bg-white text-xs font-medium text-gray-800',
};

/**
 * Mobile "Enable location for a better experience" bar.
 * Tapping it opens the global DeliveryLocationModal.
 *
 * @param {{variant?: 'header' | 'pdp' | 'cart', showNotice?: boolean}}
 */
export function DeliveryLocationPicker({variant = 'header', showNotice = false}) {
  const {location} = useDeliveryLocation();
  const [noticeVisible, setNoticeVisible] = useState(true);
  const hasPincode = Boolean(location?.pincode);

  return (
    <div className="lg:hidden">
      {/* Mobile Bar Trigger */}
      <button
        type="button"
        onClick={() => openDeliveryLocationPicker('choose')}
        className={`w-full flex items-center justify-between cursor-pointer ${BAR_STYLES[variant]}`}
      >
        <span className="flex items-center gap-2 min-w-0">
          <PinIcon
            className={`shrink-0 ${variant === 'header' ? 'w-[18px] h-[18px]' : 'w-4 h-4 text-gray-600'}`}
          />
          {hasPincode ? (
            <span className="truncate">
              Delivering to{' '}
              {[location.city, location.pincode].filter(Boolean).join(' ')}
            </span>
          ) : (
            <span className="truncate">
              Enable location for a better experience
            </span>
          )}
        </span>
        <ChevronIcon className="w-4 h-4 text-gray-500 rotate-90 shrink-0 ml-2" />
      </button>

      {/* Notice (cart) */}
      {showNotice && !hasPincode && noticeVisible && (
        <div className="bg-white px-4 pt-3">
          <div className="bg-[#FCEDEE] rounded px-3 py-2.5 flex items-start justify-between gap-3 text-[11px] leading-[16px] text-[#5C3B3B]">
            <span>
              Enter pin code in box above for delivery estimates and charges
            </span>
            <button
              type="button"
              onClick={() => setNoticeVisible(false)}
              aria-label="Dismiss notice"
              className="text-gray-500 hover:text-gray-800 shrink-0 cursor-pointer"
            >
              <CloseIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Shared "Choose your location" modal.
 * - On desktop: centered modal dialog matching live Lifestyle Stores screenshot.
 * - On mobile: bottom sheet sliding up from the bottom.
 *
 * Can be opened from:
 * 1) Desktop top bar ("Delivering To" button)
 * 2) Mobile header location bar
 * 3) PDP location bar
 * 4) Cart page
 */
export function DeliveryLocationModal() {
  const navigate = useNavigate();
  const {pathname, search} = useLocation();
  const rootData = useRouteLoaderData('root');
  const isLoggedIn = Boolean(rootData?.isLoggedIn);
  const {location, save} = useDeliveryLocation();

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(
    /** @type {null | 'choose' | 'pincode' | 'addresses'} */ (null),
  );
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [addresses, setAddresses] = useState(
    /** @type {Array<any> | null} */ (null),
  );
  const inputRef = useRef(null);

  const isOpen = step !== null;

  useEffect(() => {
    setMounted(true);
    const unsubOpen = subscribeToDeliveryPickerOpen((initialStep) => {
      setError('');
      setBusy('');
      setStep(initialStep || 'choose');
    });
    const unsubClose = subscribeToDeliveryPickerClose(() => {
      setStep(null);
      setError('');
      setBusy('');
    });
    return () => {
      unsubOpen();
      unsubClose();
    };
  }, []);

  const close = () => {
    setStep(null);
    setError('');
    setBusy('');
  };

  // Lock page scroll and allow Esc to close while the modal is open
  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  useEffect(() => {
    if (step === 'pincode') {
      inputRef.current?.focus();
    }
  }, [step]);

  /** @param {string} query e.g. `pincode=385520` or `lat=..&lng=..` */
  const verify = async (query, busyKey) => {
    setError('');
    setBusy(busyKey);
    try {
      const response = await fetch(`/api/pincode?${query}`);
      const data = await response.json();
      if (!response.ok || !data.isServiceable) {
        setError(data.error || 'This pincode is currently not serviceable');
        return;
      }
      save(data);
      setPincode('');
      close();
    } catch {
      setError('Unable to verify pincode. Please try again.');
    } finally {
      setBusy('');
    }
  };

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }
    verify(`pincode=${pincode}`, 'pincode');
  };

  const handleSavedAddress = async () => {
    if (!isLoggedIn) {
      close();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('lifestyle:open-auth-modal'));
      }
      navigate(
        `/account/login?return_to=${encodeURIComponent(pathname + search)}`,
      );
      return;
    }
    setError('');
    setStep('addresses');
    if (addresses === null) {
      try {
        const response = await fetch('/api/customer-addresses');
        const data = await response.json();
        setAddresses(data.addresses || []);
      } catch {
        setAddresses([]);
      }
    }
  };

  const handleCurrentLocation = () => {
    setError('');
    if (!('geolocation' in navigator)) {
      setError('Location is not supported on this device. Please enter your pincode.');
      return;
    }
    setBusy('gps');
    navigator.geolocation.getCurrentPosition(
      ({coords}) =>
        verify(`lat=${coords.latitude}&lng=${coords.longitude}`, 'gps'),
      (geoError) => {
        setBusy('');
        setError(
          geoError.code === geoError.PERMISSION_DENIED
            ? 'Location permission denied. Please enter your pincode instead.'
            : 'Unable to get your location. Please enter your pincode instead.',
        );
      },
      {enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000},
    );
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col justify-end lg:items-center lg:justify-center lg:p-4">
      {/* Dark backdrop */}
      <button
        type="button"
        aria-label="Close location picker"
        tabIndex={-1}
        onClick={close}
        className="fixed inset-0 bg-black/60 transition-opacity cursor-default"
      />

      {/* Dialog box (bottom sheet on mobile, centered card on desktop) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={
          step === 'pincode'
            ? 'Enter pincode'
            : step === 'addresses'
              ? 'Select a saved address'
              : 'Choose your location'
        }
        className="relative z-10 bg-white w-full rounded-t-[20px] max-h-[85vh] lg:rounded-[6px] lg:max-w-[460px] lg:w-full lg:max-h-[90vh] lg:shadow-2xl overflow-y-auto text-left shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
      >
        {/* Mobile pull handle */}
        <div className="flex justify-center pt-2.5 pb-1 lg:hidden">
          <span className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 lg:px-6 pt-3 pb-3 lg:pt-6 lg:pb-3 border-b border-transparent">
          <div className="flex items-center gap-3">
            {step !== 'choose' && (
              <button
                type="button"
                onClick={() => {
                  setStep('choose');
                  setError('');
                }}
                aria-label="Back"
                className="text-gray-800 hover:text-black cursor-pointer p-0.5"
              >
                <ChevronIcon className="w-5 h-5 rotate-180" />
              </button>
            )}
            <h2 className="text-[17px] lg:text-[20px] font-semibold text-[#111827]">
              {step === 'pincode'
                ? 'Enter pincode'
                : step === 'addresses'
                  ? 'Select a saved address'
                  : 'Choose your location'}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="text-gray-600 hover:text-black cursor-pointer p-1 transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Step: Choose location */}
        {step === 'choose' && (
          <>
            <div className="bg-[#F2F2F2] px-5 py-3 lg:mx-6 lg:rounded-[4px] lg:px-4 lg:py-3 lg:mt-1 lg:mb-2 text-[12px] leading-[17px] text-[#4A4A4A] font-normal">
              Please share your location to know estimated date of delivery and
              special offers in your area
            </div>
            <ul className="divide-y divide-[#EEEEEE] px-5 lg:px-6 pb-4">
              <SheetOption
                icon={<UserIcon className="w-5 h-5" />}
                label="Login to select a saved address"
                onClick={handleSavedAddress}
              />
              <SheetOption
                icon={<PinIcon className="w-5 h-5" />}
                label="Enter your pincode"
                onClick={() => {
                  setError('');
                  setStep('pincode');
                }}
              />
              <SheetOption
                icon={<LocateIcon className="w-5 h-5" />}
                label={
                  busy === 'gps'
                    ? 'Finding your location…'
                    : 'Share your current location'
                }
                disabled={busy === 'gps'}
                onClick={handleCurrentLocation}
              />
            </ul>
          </>
        )}

        {/* Step: Enter pincode */}
        {step === 'pincode' && (
          <form onSubmit={handlePincodeSubmit} className="px-5 lg:px-6 pt-4 pb-6">
            <div className="flex items-center gap-3">
              <label
                htmlFor="delivery-pincode"
                className="text-[13px] font-semibold text-gray-900 shrink-0"
              >
                Delivering to
              </label>
              <input
                ref={inputRef}
                id="delivery-pincode"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.replace(/\D/g, ''));
                  if (error) setError('');
                }}
                placeholder={location?.pincode || 'Enter pincode'}
                className="flex-1 min-w-0 border border-[#FAA619] rounded-[3px] px-3.5 py-2.5 text-[14px] font-normal outline-none focus:ring-1 focus:ring-[#FAA619]"
              />
            </div>
            <button
              type="submit"
              disabled={pincode.length !== 6 || busy === 'pincode'}
              className="mt-5 w-full py-3 rounded-[3px] text-[13px] font-bold uppercase tracking-wide text-white bg-[#FAA619] hover:bg-[#E59510] disabled:bg-[#FDDDA8] cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              {busy === 'pincode' ? 'Checking…' : 'Submit'}
            </button>
          </form>
        )}

        {/* Step: Select saved address */}
        {step === 'addresses' && (
          <ul className="divide-y divide-[#EEEEEE] px-5 lg:px-6 pb-6">
            {addresses === null ? (
              <li className="py-6 text-[13px] text-gray-600">
                Loading your addresses…
              </li>
            ) : addresses.length === 0 ? (
              <li className="py-6 text-[13px] text-gray-600 font-normal">
                You have no saved addresses yet.{' '}
                <button
                  type="button"
                  onClick={() => setStep('pincode')}
                  className="text-[#FAA619] hover:underline font-semibold cursor-pointer"
                >
                  Enter your pincode
                </button>
              </li>
            ) : (
              addresses.map((address) => (
                <li key={address.id}>
                  <button
                    type="button"
                    disabled={Boolean(busy)}
                    onClick={() =>
                      verify(
                        `pincode=${encodeURIComponent(
                          String(address.zip || '').replace(/\s/g, ''),
                        )}`,
                        address.id,
                      )
                    }
                    className="w-full text-left py-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-50/70 -mx-5 px-5 lg:-mx-6 lg:px-6 disabled:opacity-60 transition-colors"
                  >
                    <span className="min-w-0">
                      <span className="block text-[13px] font-semibold text-gray-900">
                        {[address.firstName, address.lastName]
                          .filter(Boolean)
                          .join(' ') || 'Saved address'}
                      </span>
                      <span className="block text-[12px] font-normal text-gray-600 truncate">
                        {[address.address1, address.city, address.zip]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </span>
                    <span className="text-[12px] text-gray-500 shrink-0 font-medium">
                      {busy === address.id ? 'Checking…' : ''}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}

        {error && (
          <p
            className="px-5 lg:px-6 pb-4 text-[12px] font-normal text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
}

function SheetOption({icon, label, onClick, disabled = false}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="w-full flex items-center justify-between gap-3 py-4 text-[14px] font-medium text-[#212121] cursor-pointer hover:bg-gray-50/80 -mx-5 px-5 lg:-mx-6 lg:px-6 transition-colors disabled:opacity-60"
      >
        <span className="flex items-center gap-3">
          <span className="text-[#212121]">{icon}</span>
          <span>{label}</span>
        </span>
        <ChevronIcon className="w-4 h-4 text-[#888888]" />
      </button>
    </li>
  );
}

const svgProps = {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

function PinIcon({className}) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M17.657 16.657 13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
      <path d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
    </svg>
  );
}

function UserIcon({className}) {
  return (
    <svg className={className} {...svgProps}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.6-4 3.6-6 8-6s7.4 2 8 6" />
    </svg>
  );
}

function LocateIcon({className}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="7" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

function ChevronIcon({className}) {
  return (
    <svg className={className} {...svgProps}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function CloseIcon({className}) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
