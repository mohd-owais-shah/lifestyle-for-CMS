import {useEffect, useState} from 'react';
import {useFetcher} from 'react-router';

const AVAILABLE_VOUCHERS = [
  {
    code: 'SAVE200',
    discount: '₹200 OFF',
    description: 'Get ₹200 off on orders above ₹1,999',
    minOrder: 1999,
  },
  {
    code: 'SAVE501',
    discount: '₹500 OFF',
    description: 'Get ₹500 off on orders above ₹2,999',
    minOrder: 2999,
  },
  {
    code: 'SAVE1001',
    discount: '₹1000 OFF',
    description: 'Get ₹1,000 off on orders above ₹4,999',
    minOrder: 4999,
  },
];

export function CartOffersSection({
  cart,
  isModalOpen,
  setIsModalOpen,
  variant = 'desktop',
}) {
  const [customCode, setCustomCode] = useState('');
  const fetcher = useFetcher();
  const isMobile = variant === 'mobile';

  // Extract applied codes from cart
  const appliedCodes = cart?.discountCodes || [];
  const validAppliedCodes = appliedCodes.filter((d) => d.applicable);
  const invalidAppliedCodes = appliedCodes.filter((d) => !d.applicable);

  const subtotal = parseFloat(cart?.cost?.subtotalAmount?.amount || '0');

  const handleApplyCode = (codeToApply) => {
    const cleanCode = (codeToApply || customCode).trim().toUpperCase();
    if (!cleanCode) return;

    fetcher.submit(
      {
        action: 'DiscountCodesUpdate',
        inputs: JSON.stringify({
          discountCodes: [cleanCode],
        }),
      },
      {method: 'POST', action: '/cart'},
    );

    setCustomCode('');
  };

  const handleRemoveCode = (codeToRemove) => {
    const remainingCodes = validAppliedCodes
      .filter((c) => c.code !== codeToRemove)
      .map((c) => c.code);

    fetcher.submit(
      {
        action: 'DiscountCodesUpdate',
        inputs: JSON.stringify({
          discountCodes: remainingCodes,
        }),
      },
      {method: 'POST', action: '/cart'},
    );
  };

  return (
    <>
      {/* Offers Card matching Screenshot 2 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Colorful Gift Boxes Icon matching Screenshot 2 */}
            <div className="w-11 h-11 shrink-0 flex items-center justify-center">
              <svg
                className="w-10 h-10"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Yellow Box */}
                <rect
                  x="28"
                  y="24"
                  width="28"
                  height="32"
                  rx="2"
                  fill="#FBBF24"
                />
                <rect
                  x="26"
                  y="20"
                  width="32"
                  height="6"
                  rx="1.5"
                  fill="#F59E0B"
                />
                <rect x="40" y="20" width="4" height="36" fill="#EF4444" />
                <path
                  d="M38 16C36 12 40 10 42 14C44 18 40 20 40 20C40 20 44 18 46 14C48 10 52 12 50 16C48 19 44 20 40 20"
                  stroke="#EF4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Pink Box */}
                <rect
                  x="8"
                  y="28"
                  width="28"
                  height="28"
                  rx="2"
                  fill="#EC4899"
                />
                <rect
                  x="6"
                  y="24"
                  width="32"
                  height="6"
                  rx="1.5"
                  fill="#DB2777"
                />
                <rect x="19" y="24" width="4" height="32" fill="#FDE047" />
                <path
                  d="M17 20C15 16 19 14 21 18C23 22 19 24 19 24C19 24 23 22 25 18C27 14 31 16 29 20C27 23 23 24 19 24"
                  stroke="#FDE047"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">
                Offers for you!
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {validAppliedCodes.length > 0 ? (
                  <span className="text-emerald-700 font-semibold">
                    Coupon{' '}
                    <span className="uppercase">
                      {validAppliedCodes.map((c) => c.code).join(', ')}
                    </span>{' '}
                    applied!
                  </span>
                ) : (
                  'Choose and apply voucher in 2 simple steps'
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-bold text-[#FAA619] hover:text-[#D98207] cursor-pointer shrink-0"
          >
            {validAppliedCodes.length > 0 ? 'Change' : 'Select'}
          </button>
        </div>

        {/* Applied Coupon Tag */}
        {/* {validAppliedCodes.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
            {validAppliedCodes.map((c) => (
              <div
                key={c.code}
                className="bg-emerald-50 border border-emerald-200 rounded px-2.5 py-1 flex items-center gap-2 text-xs text-emerald-800"
              >
                <span className="font-bold uppercase tracking-wider">{c.code}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCode(c.code)}
                  aria-label={`Remove coupon ${c.code}`}
                  className="text-emerald-600 hover:text-emerald-900 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )} */}

        {/* Invalid Coupon Notice */}
        {invalidAppliedCodes.length > 0 && (
          <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
            Coupon <strong>{invalidAppliedCodes[0]?.code}</strong> is not
            applicable to current items.
          </div>
        )}
      </div>

      {/* Mobile "Promo codes" bottom sheet */}
      {isMobile && isModalOpen && (
        <MobilePromoSheet
          appliedCodes={validAppliedCodes.map((c) => c.code.toUpperCase())}
          subtotal={subtotal}
          isSubmitting={fetcher.state !== 'idle'}
          onApply={(code) => handleApplyCode(code)}
          onRemove={(code) => handleRemoveCode(code)}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Apply Coupon Modal matching Screenshot 1 */}
      {!isMobile && isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">
                Apply Coupon
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer font-bold text-base"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5">
              {/* Custom Input matching Screenshot 1 */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleApplyCode();
                }}
                className="flex gap-2.5"
              >
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                  placeholder="ENTER COUPON CODE"
                  className="flex-1 border border-gray-300 rounded px-3 py-2.5 text-xs sm:text-sm uppercase tracking-wider outline-none focus:border-[#FAA619] placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={!customCode.trim()}
                  className="px-5 py-2.5 bg-[#EBF0F5] hover:bg-[#FAA619] disabled:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-gray-100 text-gray-700 hover:text-white text-xs font-bold rounded transition-colors cursor-pointer uppercase tracking-wider shrink-0"
                >
                  Apply
                </button>
              </form>

              {/* List of Available Vouchers matching Screenshot 1 */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3.5">
                  Available Coupons
                </h4>
                <div className="space-y-3">
                  {AVAILABLE_VOUCHERS.map((voucher) => {
                    const isApplied = validAppliedCodes.some(
                      (c) =>
                        c.code.toLowerCase() === voucher.code.toLowerCase(),
                    );
                    const isApplicable = subtotal >= voucher.minOrder;

                    return (
                      <div
                        key={voucher.code}
                        className={`border rounded-lg p-3.5 transition-colors ${
                          isApplied
                            ? 'border-emerald-400 bg-emerald-50/40'
                            : 'border-gray-200 bg-white'
                        } ${!isApplicable && !isApplied ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 border border-dashed border-gray-400 rounded text-xs font-bold text-gray-900 uppercase tracking-wider">
                            {voucher.code}
                          </span>
                          {isApplied ? (
                            <button
                              type="button"
                              onClick={() => handleRemoveCode(voucher.code)}
                              className="text-xs font-bold text-red-500 hover:text-red-700 uppercase cursor-pointer"
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={!isApplicable}
                              onClick={() => handleApplyCode(voucher.code)}
                              className={`text-xs font-bold uppercase ${
                                isApplicable
                                  ? 'text-[#FAA619] hover:text-[#D98207] cursor-pointer'
                                  : 'text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              Apply
                            </button>
                          )}
                        </div>
                        <div
                          className={`text-sm font-bold mt-2.5 ${!isApplicable && !isApplied ? 'text-gray-500' : 'text-gray-900'}`}
                        >
                          {voucher.discount}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {voucher.description}
                          {!isApplicable &&
                            !isApplied &&
                            ` (Add ₹${(voucher.minOrder - subtotal).toLocaleString('en-IN')} more)`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Mobile "Promo codes" sheet: voucher input + radio list + OKAY, matching
 * the live Lifestyle mobile basket.
 */
function MobilePromoSheet({
  appliedCodes,
  subtotal,
  isSubmitting,
  onApply,
  onRemove,
  onClose,
}) {
  const [typedCode, setTypedCode] = useState('');
  const [selectedCode, setSelectedCode] = useState(appliedCodes[0] || null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const handleOkay = () => {
    const current = appliedCodes[0] || null;
    if (selectedCode && selectedCode !== current) {
      onApply(selectedCode);
    } else if (!selectedCode && current) {
      onRemove(current);
    }
    onClose();
  };

  const handleTypedApply = (e) => {
    e.preventDefault();
    const code = typedCode.trim().toUpperCase();
    if (!code) return;
    onApply(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col justify-end lg:hidden">
      <button
        type="button"
        aria-label="Close promo codes"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 cursor-default"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Promo codes"
        className="relative bg-white rounded-t-[20px] max-h-[85vh] flex flex-col"
      >
        <div className="flex justify-center pt-2.5 pb-1">
          <span className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        <div className="px-5 pt-2 pb-3">
          <h3 className="text-[15px] font-semibold text-gray-900 mb-3">
            Promo codes
          </h3>
          <form onSubmit={handleTypedApply} className="flex gap-2">
            <input
              type="text"
              value={typedCode}
              onChange={(e) => setTypedCode(e.target.value.toUpperCase())}
              placeholder="Enter voucher code"
              autoCapitalize="characters"
              className="flex-1 min-w-0 border border-gray-300 rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#FAA619] placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={!typedCode.trim() || isSubmitting}
              className="px-4 border border-[#FAA619] text-[#FAA619] rounded-[3px] text-[13px] font-semibold cursor-pointer disabled:border-[#FDDDA8] disabled:text-[#FDDDA8] disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </form>
        </div>

        <ul className="flex-1 overflow-y-auto px-5 border-t border-gray-100 divide-y divide-gray-200">
          {AVAILABLE_VOUCHERS.map((voucher) => {
            const isApplicable =
              subtotal >= voucher.minOrder ||
              appliedCodes.includes(voucher.code);
            const isSelected = selectedCode === voucher.code;
            const inputId = `promo-${voucher.code}`;

            return (
              <li key={voucher.code} className="flex items-start gap-4 py-4">
                <input
                  id={inputId}
                  type="radio"
                  name="promo-code"
                  value={voucher.code}
                  checked={isSelected}
                  disabled={!isApplicable}
                  onChange={() => setSelectedCode(voucher.code)}
                  className="mt-0.5 w-5 h-5 shrink-0 accent-[#FAA619] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                />
                <label
                  htmlFor={inputId}
                  className={`flex-1 ${
                    isApplicable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  }`}
                >
                  <span className="block text-[14px] font-semibold text-gray-900">
                    {voucher.code}
                  </span>
                  <span className="block text-[12px] leading-[18px] text-gray-700 mt-1">
                    {voucher.description}
                    {!isApplicable &&
                      ` (Add ₹${(voucher.minOrder - subtotal).toLocaleString('en-IN')} more)`}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        <div className="px-4 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] border-t border-gray-100">
          <button
            type="button"
            onClick={handleOkay}
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#FAA619] hover:bg-[#E09210] text-white text-[13px] font-bold uppercase tracking-wide rounded-[3px] cursor-pointer disabled:opacity-60"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}
