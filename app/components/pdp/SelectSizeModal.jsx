import {useState, useEffect} from 'react';
import {AddToCartButton} from '~/components/AddToCartButton';

/**
 * "Select the Size" Sheet / Modal matching Live Lifestyle Store PDP:
 * - Mobile (< sm): Slides up as a Bottom Sheet anchored to the bottom
 * - Desktop (>= sm): Centered modal
 */
export function SelectSizeModal({
  isOpen,
  onClose,
  sizeOption,
  selectedVariant,
  onSelectSize,
  onAddedSuccess,
  onOpenSizeGuide,
}) {
  const [modalSelectedSize, setModalSelectedSize] = useState(null);
  const [modalSelectedVariant, setModalSelectedVariant] = useState(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setModalSelectedSize(null);
      setModalSelectedVariant(null);
      setShowError(false);
      if (typeof document !== 'undefined') {
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = prevOverflow || 'unset';
        };
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const optionValues = sizeOption?.optionValues || [];
  const variantToAdd = modalSelectedVariant || selectedVariant;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[1000] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-[2px] animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-[12px] sm:rounded-[4px] max-w-full sm:max-w-[460px] w-full p-4 sm:p-6 relative shadow-2xl animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-gray-100 sm:border-0">
          <h2 className="text-[16px] sm:text-[20px] font-bold text-[#141414] tracking-tight">
            Select the Size
          </h2>
          <button
            type="button"
            className="text-gray-400 hover:text-black text-2xl font-light leading-none p-1 cursor-pointer bg-transparent border-0"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Size Guide Link */}
        <div className="flex justify-end pt-2 pb-2.5">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenSizeGuide) onOpenSizeGuide();
            }}
            className="text-[12px] sm:text-[13px] font-normal text-[#212121] underline underline-offset-2 hover:text-[#FAA619] transition-colors cursor-pointer bg-transparent border-0"
          >
            Size Guide
          </button>
        </div>

        {/* Size Buttons Grid */}
        <div
          className="flex items-center gap-1.5 sm:gap-2 w-full mb-5 sm:mb-6"

        >
          {optionValues.map((val) => {
            const {name, variantUriQuery, available, exists} = val;
            const isSelected = modalSelectedSize === name;

            return (
              <div key={name} className="flex-1 min-w-0 sm:max-w-[84px]">
                <button
                  type="button"
                  disabled={!exists}
                  onClick={() => {
                    setModalSelectedSize(name);
                    setModalSelectedVariant(val.firstSelectableVariant || selectedVariant);
                    setShowError(false);
                    if (onSelectSize) {
                      onSelectSize(val);
                    }
                  }}
                  className={`relative w-full h-[48px] px-1 sm:px-2 rounded-[2px] flex items-center justify-center text-[12px] xs:text-[13px] sm:text-[14px] font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'border-2 border-[#FAA619] bg-white text-[#FAA619] shadow-sm'
                      : 'border-2 border-[#DFE1E8] bg-white text-[#000000] hover:border-gray-400'
                  } ${
                    !available
                      ? 'text-gray-300 border-2 border-[#E5E7EB] bg-gray-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  <span className="whitespace-nowrap">{name}</span>
                  {!available && (
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                      <span className="w-[120%] h-[1px] bg-gray-300 rotate-45 transform" />
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {showError && (
          <p className="text-red-500 text-xs mb-3 -mt-2">
            Please select a size to proceed.
          </p>
        )}

        {/* Add To Basket CTA */}
        <div className="pb-1 sm:pb-0">
          {modalSelectedSize && variantToAdd?.availableForSale ? (
            <AddToCartButton
              lines={[
                {
                  merchandiseId: variantToAdd.id,
                  quantity: 1,
                  selectedVariant: variantToAdd,
                },
              ]}
              onAdded={() => {
                onClose();
                if (onAddedSuccess) onAddedSuccess();
              }}
              className="w-full h-[48px] sm:h-[50px] py-[6px] px-[16px] rounded-[2px] text-[13px] sm:text-[14px] font-bold uppercase tracking-[0.5px] bg-[#FAA619] hover:bg-[#E09212] active:bg-[#C9800E] text-white shadow-sm transition-all flex items-center justify-center cursor-pointer border-0"
            >
              <span>ADD TO BASKET</span>
            </AddToCartButton>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!modalSelectedSize) {
                  setShowError(true);
                }
              }}
              className="w-full h-[48px] sm:h-[50px] py-[6px] px-[16px] rounded-[2px] text-[13px] sm:text-[14px] font-bold uppercase tracking-[0.5px] bg-[#FAA619] hover:bg-[#E09212] active:bg-[#C9800E] text-white shadow-sm transition-all flex items-center justify-center cursor-pointer border-0"
            >
              <span>ADD TO BASKET</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SelectSizeModal;
