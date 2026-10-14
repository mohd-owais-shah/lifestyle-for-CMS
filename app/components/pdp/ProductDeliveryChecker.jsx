import {useEffect, useState} from 'react';
import pincodesData from '~/data/pincodes.json';
import {useDeliveryLocation} from '~/lib/deliveryLocation';

/**
 * Delivery estimate for a pincode (same data as /api/pincode).
 * @param {string} pin
 */
function getDeliveryEstimate(pin) {
  // If pincode matches in json, use specific city/days; otherwise fallback to default
  const matched = pincodesData.pincodes[pin] || pincodesData.default;

  // Parse delivery days range (e.g. "2-4 days", "3-5 days", "5-7 days")
  const matchDays = String(matched.deliveryDays || '5-7 days').match(
    /(\d+)\s*-\s*(\d+)/,
  );
  const minDays = matchDays ? parseInt(matchDays[1], 10) : 5;
  const maxDays = matchDays ? parseInt(matchDays[2], 10) : 7;

  const today = new Date();
  const deliveryMin = new Date(today);
  deliveryMin.setDate(today.getDate() + minDays);
  const deliveryMax = new Date(today);
  deliveryMax.setDate(today.getDate() + maxDays);

  const options = {month: 'short', day: 'numeric'};
  const minStr = deliveryMin.toLocaleDateString('en-IN', options);
  const maxStr = deliveryMax.toLocaleDateString('en-IN', options);

  return {
    location: {
      pincode: pin,
      isServiceable: matched.isServiceable !== false,
      city: matched.city || '',
      state: matched.state || '',
      deliveryDays: matched.deliveryDays || '5-7 days',
      deliveryText: matched.deliveryText || 'Delivery in 5-7 days',
    },
    dateRange: `${minStr} - ${maxStr}`,
  };
}

/**
 * Pincode Delivery Checker matching Lifestyle Store PDP. Uses (and updates)
 * the delivery pincode shared across the store.
 */
export function ProductDeliveryChecker() {
  const {location, save} = useDeliveryLocation();
  const [pincode, setPincode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState(null);
  const [error, setError] = useState('');

  // Pincode chosen on another page (home bar, cart) applies here too
  useEffect(() => {
    if (!location?.pincode) return;
    setPincode(location.pincode);
    setDeliveryResult(getDeliveryEstimate(location.pincode));
    setError('');
  }, [location?.pincode]);

  const handleCheck = (e) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setError('Please enter a valid 6-digit pincode');
      setDeliveryResult(null);
      return;
    }

    const estimate = getDeliveryEstimate(cleanPin);
    if (!estimate.location.isServiceable) {
      setError('This pincode is currently not serviceable');
      setDeliveryResult(null);
      return;
    }

    setError('');
    setDeliveryResult(estimate);
    save(estimate.location);
  };

  return (
    <div className="py-4 border-b border-[#EAEAEA]">
      <div className="flex items-center gap-2 mb-3">
        {/* Delivery Truck Icon */}
        <svg
          className="w-5 h-5 text-[#141414]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-3.75c0-.621-.504-1.125-1.125-1.125h-2.25M16.5 4.5h-9A2.25 2.25 0 005.25 6.75v7.5m11.25-9.75v7.5m0-7.5l4.5 4.5m-4.5 3h4.5"
          />
        </svg>
        <span className="text-[14px] font-semibold text-[#141414] leading-[20px]">
          When I will receive my order
        </span>
      </div>

      <form onSubmit={handleCheck} className="flex items-center gap-2 w-full max-w-[393.33px]">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, ''));
            if (error) setError('');
          }}
          placeholder="Enter your Pincode"
          className="flex-1 min-w-0 h-[48px] pt-[5px] pr-[5px] pb-[5px] pl-[16px] bg-white border border-[#DFE1E8] rounded-[2px] text-[14px] text-black placeholder:text-[#929391] focus:outline-none focus:border-[#FAA619] transition-colors"
        />
        <button
          type="submit"
          className="w-[72px] shrink-0 h-[48px] py-[6px] px-[12px] bg-[#FAA619] hover:bg-[#E09212] text-white text-[14px] font-semibold rounded-[2px] transition-colors cursor-pointer flex items-center justify-center shadow-none border-0"
        >
          Check
        </button>
      </form>

      {error && <p className="text-[11px] text-red-500 mt-1.5">{error}</p>}

      {deliveryResult && (
        <div className="mt-3 bg-[#F9FDF9] border border-[#C8E6C9] p-2.5 rounded text-xs space-y-1">
          <div className="text-[#2E7D32] font-semibold flex items-center gap-1.5">
            <span>✓</span> Standard Delivery by {deliveryResult.dateRange}
          </div>
          <div className="text-gray-600 flex items-center gap-1.5 text-[11px]">
            <span>✓</span> Cash on Delivery available
          </div>
        </div>
      )}
    </div>
  );
}
