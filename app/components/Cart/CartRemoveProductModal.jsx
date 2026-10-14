import {Image} from '@shopify/hydrogen';
import {productDisplayTitle} from './productTitle';

export function CartRemoveProductModal({
  isOpen,
  onClose,
  line,
  onConfirmRemove,
  onMoveToFavourites,
}) {
  if (!isOpen || !line || !line.merchandise) return null;

  const {merchandise, cost} = line;
  const {product, image} = merchandise;

  const displayTitle = productDisplayTitle(product);

  const priceAmount = parseFloat(cost?.totalAmount?.amount || '0');

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-5 sm:p-6 w-full max-w-[420px] shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Title and Close button */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h3 className="text-sm sm:text-base font-bold text-gray-900">
            Remove product
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close remove product dialog"
            className="text-gray-400 hover:text-gray-700 font-bold text-base cursor-pointer p-1 -mr-1"
          >
            ✕
          </button>
        </div>

        {/* Product Details matching Image 3 */}
        <div className="flex items-start gap-3.5 py-4">
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

          <div className="flex-1 min-w-0">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
              {displayTitle}
            </h4>
            <div className="mt-1">
              <span className="text-sm font-bold text-gray-900">
                ₹{Math.round(priceAmount).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Confirmation Question matching Image 3 */}
        <div className="pt-1 pb-4">
          <p className="text-xs sm:text-sm text-gray-700 font-medium">
            Are you sure you want to remove this product?
          </p>
          <p className="text-xs text-gray-500 mt-1">
            We suggest you to move this item to your favourites
          </p>
        </div>

        {/* Actions matching Image 3: MOVE TO FAVOURITES and REMOVE */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onMoveToFavourites}
            className="text-xs sm:text-sm font-bold text-[#FAA619] hover:text-[#D98207] uppercase tracking-wide cursor-pointer py-2 px-1 transition-colors"
          >
            Move to favourites
          </button>

          <button
            type="button"
            onClick={onConfirmRemove}
            className="bg-[#FAA619] hover:bg-[#E09210] active:bg-[#C97E06] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-6 py-2.5 rounded transition-colors cursor-pointer shadow-xs"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
