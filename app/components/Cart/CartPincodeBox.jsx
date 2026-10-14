import {useState, useEffect} from 'react';

export function CartPincodeBox({
  deliveryInfo = null,
  onVerifyPincode,
  onResetPincode,
}) {
  const [pincodeInput, setPincodeInput] = useState('');
  const [isEditing, setIsEditing] = useState(!deliveryInfo?.pincode);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (deliveryInfo?.pincode) {
      setIsEditing(false);
      setPincodeInput(deliveryInfo.pincode);
    } else {
      setIsEditing(true);
    }
  }, [deliveryInfo]);

  const handleCheck = async (e) => {
    e.preventDefault();
    const clean = pincodeInput.trim();
    if (!/^\d{6}$/.test(clean)) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/pincode?pincode=${clean}`);
      const data = await response.json();

      if (!response.ok || !data.isServiceable) {
        setError(data.error || 'This pincode is currently not serviceable');
        return;
      }

      if (onVerifyPincode) {
        onVerifyPincode(data);
      }
      setIsEditing(false);
    } catch {
      setError('Unable to verify pincode. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChange = () => {
    setIsEditing(true);
    if (onResetPincode) {
      onResetPincode();
    }
  };

  const isVerified = Boolean(deliveryInfo?.pincode && !isEditing);

  // Verified view matching Image 2: "Delivering to  385520  Change"
  if (isVerified) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-5 sm:gap-8">
            <span className="text-xs sm:text-sm font-medium text-gray-800 shrink-0">
              Delivering to
            </span>
            <span className="text-xs sm:text-sm font-bold text-gray-900 tracking-wide">
              {deliveryInfo.pincode}
            </span>
          </div>

          <button
            type="button"
            onClick={handleStartChange}
            className="text-xs sm:text-sm font-semibold text-[#FAA619] hover:text-[#D98207] transition-colors cursor-pointer"
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  // Input view matching Image 3
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs sm:text-sm font-medium text-gray-800 shrink-0">
          Delivering to
        </span>

        <form
          onSubmit={handleCheck}
          className="flex items-center gap-2 flex-1 max-w-[280px] justify-end"
        >
          <div className="relative w-full">
            <input
              type="text"
              maxLength={6}
              value={pincodeInput}
              onChange={(e) => {
                setPincodeInput(e.target.value.replace(/\D/g, ''));
                if (error) setError('');
              }}
              placeholder="Enter pincode"
              className="w-full text-xs sm:text-sm border border-gray-300 rounded px-3 py-2 pr-7 outline-none focus:border-[#FAA619] transition-colors"
            />

            {pincodeInput && (
              <button
                type="button"
                onClick={() => setPincodeInput('')}
                aria-label="Clear pincode"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 font-bold text-xs cursor-pointer p-0.5"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!pincodeInput || isLoading}
            className="text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300 hover:border-gray-500 hover:bg-gray-50 disabled:border-gray-200 disabled:text-gray-300 disabled:bg-white rounded px-4 py-2 cursor-pointer shrink-0 transition-colors"
          >
            {isLoading ? 'Checking...' : 'Check'}
          </button>
        </form>
      </div>

      {error && (
        <p className="text-[11px] text-red-600 mt-1.5 font-medium">{error}</p>
      )}

      {/* Notice box matching Image 3 */}
      {showNotice && (
        <div className="bg-[#FAF5F5] border border-[#F4EBEB] rounded p-2.5 mt-3 flex items-center justify-between text-xs text-[#7A3636]">
          <span>
            Enter pin code in box above for delivery estimates and charges
          </span>
          <button
            type="button"
            onClick={() => setShowNotice(false)}
            aria-label="Dismiss notice"
            className="text-gray-400 hover:text-gray-700 ml-2 shrink-0 cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
