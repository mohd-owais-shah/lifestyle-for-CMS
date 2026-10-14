import {useState, useEffect} from 'react';
import {Image} from '@shopify/hydrogen';
import {productDisplayTitle} from './productTitle';

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function CartSelectSizeModal({
  isOpen,
  onClose,
  product,
  onConfirmSelection,
}) {
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [selectedSizeName, setSelectedSizeName] = useState('');

  const variants = product?.variants?.nodes || [];

  // Initialize selected size when modal opens
  useEffect(() => {
    if (isOpen && product) {
      if (variants.length > 0) {
        const firstAvailable = variants.find((v) => v.availableForSale);
        setSelectedVariantId(firstAvailable?.id || '');
        setSelectedSizeName(firstAvailable?.title || '');
      } else {
        setSelectedSizeName(DEFAULT_SIZES[0]);
      }
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const image = product.featuredImage;
  const displayTitle = productDisplayTitle(product);

  const hasSpecificVariants =
    variants.length > 1 ||
    (variants.length === 1 && variants[0].title !== 'Default Title');
  const canSubmit = hasSpecificVariants
    ? variants.some((v) => v.id === selectedVariantId && v.availableForSale)
    : variants.length > 0;

  const handleSizeClick = (variantOrSize) => {
    if (typeof variantOrSize === 'string') {
      setSelectedSizeName(variantOrSize);
      // If there's only 1 variant or default variant, map to it
      if (variants.length > 0) {
        setSelectedVariantId(variants[0].id);
      }
    } else {
      setSelectedVariantId(variantOrSize.id);
      setSelectedSizeName(variantOrSize.title);
    }
  };

  const handleSelectSubmit = () => {
    if (!canSubmit) return;
    const targetVariantId =
      selectedVariantId || (variants.length > 0 ? variants[0].id : null);
    if (targetVariantId && onConfirmSelection) {
      onConfirmSelection(targetVariantId, selectedSizeName);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-5 sm:p-6 w-full max-w-[360px] sm:max-w-[390px] shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button matching Image 1 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close size selector dialog"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 font-bold text-base cursor-pointer p-1"
        >
          ✕
        </button>

        {/* Top Header: Product Image & Product Title matching Image 1 */}
        <div className="flex items-start gap-3.5 pr-6">
          <div className="w-14 h-18 sm:w-16 sm:h-20 bg-gray-50 rounded overflow-hidden shrink-0 border border-gray-100">
            {image ? (
              <Image
                data={image}
                alt={image.altText || product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                No image
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
              {displayTitle}
            </h4>
          </div>
        </div>

        {/* Select size Label matching Image 1 */}
        <div className="mt-5 mb-3">
          <span className="text-xs sm:text-sm font-bold text-gray-900">
            Select size
          </span>
        </div>

        {/* Size Pills Grid matching Image 1 */}
        <div className="grid grid-cols-4 gap-2.5 mb-6">
          {hasSpecificVariants
            ? variants.map((variant) => {
                const isSelected = selectedVariantId === variant.id;
                const isAvailable = variant.availableForSale;

                return (
                  <button
                    key={variant.id}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => handleSizeClick(variant)}
                    className={`h-11 rounded-md border text-xs sm:text-sm font-semibold flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-2 border-black bg-white text-gray-900 font-bold shadow-xs'
                        : isAvailable
                          ? 'border-gray-300 bg-white text-gray-800 hover:border-gray-500'
                          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                    }`}
                  >
                    {variant.title}
                  </button>
                );
              })
            : DEFAULT_SIZES.map((size) => {
                const isSelected = selectedSizeName === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeClick(size)}
                    className={`h-11 rounded-md border text-xs sm:text-sm font-semibold flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-2 border-black bg-white text-gray-900 font-bold shadow-xs'
                        : 'border-gray-300 bg-white text-gray-800 hover:border-gray-500'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
        </div>

        {/* Full-width SELECT Button matching Image 1 */}
        <button
          type="button"
          onClick={handleSelectSubmit}
          disabled={!canSubmit}
          className="w-full py-3 bg-[#FDB766] hover:bg-[#FAA619] active:bg-[#E09210] text-white text-sm font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer shadow-xs disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          SELECT
        </button>
      </div>
    </div>
  );
}
