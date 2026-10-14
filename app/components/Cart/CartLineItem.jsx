import {useState, useEffect} from 'react';
import {CartForm, Image} from '@shopify/hydrogen';
import {Link, useFetcher} from 'react-router';
import {CartRemoveProductModal} from './CartRemoveProductModal';
import {useAccountWishlist} from '~/hooks/useAccountWishlist';
import {productDisplayTitle} from './productTitle';
import {useDelayedFlag} from '~/hooks/useDelayedFlag';

function formatPrice(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '0';
  const num = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  if (num % 1 === 0) {
    return String(num);
  }
  const rounded = Math.round(num * 100) / 100;
  return String(rounded);
}

export function CartLineItem({
  line,
  onWishlist,
  itemIndex,
  deliveryText = 'Delivery in 5-7 days',
  hasPincode = true,
  isNested = false,
}) {
  const {isSaved: isWishlisted, toggle: toggleWishlist} = useAccountWishlist(
    line?.merchandise?.product,
    line?.merchandise,
  );
  const [isQtyModalOpen, setIsQtyModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [tempQty, setTempQty] = useState(line?.quantity || 1);
  const fetcher = useFetcher();

  useEffect(() => {
    if (line?.quantity) {
      setTempQty(line.quantity);
    }
  }, [line?.quantity]);

  // Block clicks at once (no duplicate mutations); dim only if it's slow.
  // Hooks must run before the early return below.
  const showUpdating = useDelayedFlag(
    fetcher.state !== 'idle' || Boolean(line?.isOptimistic),
    250,
  );

  if (!line || !line.merchandise) return null;

  const {id: lineId, quantity, cost, merchandise, isOptimistic} = line;
  const {product, image, selectedOptions, availableForSale} = merchandise;

  const isUpdating = fetcher.state !== 'idle' || isOptimistic;

  // Variant Options
  const sizeOption = selectedOptions?.find(
    (opt) => opt.name.toLowerCase() === 'size',
  )?.value;
  const colorOption = selectedOptions?.find(
    (opt) =>
      opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour',
  )?.value;

  // Price calculations
  const unitPrice = parseFloat(merchandise?.price?.amount || '0');
  const unitCompareAt = merchandise?.compareAtPrice?.amount
    ? parseFloat(merchandise.compareAtPrice.amount)
    : null;
  const lineTotal = parseFloat(cost?.totalAmount?.amount || '0');

  let totalLineDiscountAllocations = 0;
  if (line.discountAllocations?.length) {
    for (const alloc of line.discountAllocations) {
      totalLineDiscountAllocations += parseFloat(
        alloc.discountedAmount?.amount || '0',
      );
    }
  }

  const originalLineTotal = unitCompareAt
    ? unitCompareAt * quantity
    : Math.max(unitPrice * quantity, lineTotal + totalLineDiscountAllocations);

  const savingsAmount = Math.max(0, originalLineTotal - lineTotal);
  const hasDiscount = savingsAmount > 0;

  // Delivery days extraction
  const deliveryDaysText = deliveryText?.startsWith('Delivery in ')
    ? deliveryText.replace('Delivery in ', '')
    : deliveryText || '5-7 days';

  // Real inventory quantity from Shopify
  const availableStock =
    typeof merchandise?.quantityAvailable === 'number' &&
    merchandise.quantityAvailable > 0
      ? merchandise.quantityAvailable
      : 10;
  const maxSelectableQuantity = Math.min(
    Math.max(availableStock, quantity || 1),
    10,
  );

  // Brand Name
  const displayTitle = productDisplayTitle(product);

  const productUrl = `/products/${product.handle}`;

  const handleExecuteRemove = () => {
    fetcher.submit(
      {
        [CartForm.INPUT_NAME]: JSON.stringify({
          action: CartForm.ACTIONS.LinesRemove,
          inputs: {
            lineIds: [lineId],
          },
        }),
      },
      {method: 'POST', action: '/cart'},
    );
    setIsRemoveModalOpen(false);
  };

  const handleWishlistToggle = () => {
    const saved = toggleWishlist();
    if (saved && onWishlist) onWishlist(product);
  };

  const handleMoveToFavouritesFromModal = () => {
    if (!isWishlisted) {
      const saved = toggleWishlist();
      if (!saved) return;
      if (onWishlist) onWishlist(product);
    }
    handleExecuteRemove();
  };

  return (
    <div
      className={`bg-white transition-opacity ${
        isNested
          ? ''
          : 'border-b border-gray-200 lg:border lg:rounded-lg lg:mb-4 overflow-hidden lg:shadow-xs'
      } ${isUpdating ? 'pointer-events-none' : ''} ${showUpdating ? 'opacity-50' : ''}`}
    >
      <div className="flex items-stretch">
        {/* Left vertical rail for item index matching Screenshot */}
        {itemIndex !== undefined && (
          <div className="w-12 sm:w-14 shrink-0 flex items-start justify-center pt-4 sm:pt-5 border-r border-gray-200">
            <div className="w-6 h-6 rounded-full border border-gray-300 bg-white flex items-center justify-center text-xs font-normal text-gray-500">
              {itemIndex}
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="p-4 flex gap-3 sm:gap-4 items-start">
            {/* Product Image matching Screenshot */}
            <Link
              to={productUrl}
              className="w-20 sm:w-24 shrink-0 aspect-[3/4] bg-gray-50 rounded overflow-hidden relative"
            >
              {image ? (
                <Image
                  data={image}
                  alt={image.altText || product.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  No image
                </div>
              )}

              {!availableForSale && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] font-bold uppercase text-center p-1">
                  Out of stock
                </div>
              )}
            </Link>

            {/* Product Details matching Screenshot */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                {/* Title / Brand in bold black */}
                <Link to={productUrl} className="group">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#FAA619] transition-colors line-clamp-2">
                    {displayTitle}
                  </h4>
                </Link>

                {/* Pricing matching Screenshot */}
                <div className="flex items-center flex-wrap gap-2 mt-1.5">
                  {hasDiscount && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{formatPrice(originalLineTotal)}
                    </span>
                  )}

                  <span className="text-sm sm:text-base font-bold text-gray-900">
                    ₹{formatPrice(lineTotal)}
                  </span>

                  {hasDiscount && (
                    <span className="text-xs font-semibold text-[#1DA463]">
                      ₹{formatPrice(savingsAmount)} saved
                    </span>
                  )}
                </div>

                {/* Coupon Applied / Not Applied Badge matching Image 2 */}
                {totalLineDiscountAllocations > 0 ||
                line.discountAllocations?.length > 0 ||
                isNested ? (
                  <div className="mt-1 text-xs text-[#1DA463] font-medium">
                    Coupon applied
                  </div>
                ) : (
                  <div className="hidden lg:block mt-1 text-xs text-gray-500 font-normal">
                    Coupon not applied
                  </div>
                )}

                {/* Variant options & Exchange badge container matching Screenshot */}
                <div className="flex items-end justify-between gap-2 mt-2">
                  <div className="text-xs text-gray-700 space-y-1">
                    {colorOption && (
                      <div className="flex items-center">
                        <span className="text-gray-400 w-14">Colour:</span>
                        <span className="font-medium text-gray-900 ml-1">
                          {colorOption}
                        </span>
                      </div>
                    )}
                    {sizeOption && (
                      <div className="flex items-center">
                        <span className="text-gray-400 w-14">Size:</span>
                        <span className="font-medium text-gray-900 ml-1">
                          {sizeOption}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Easy exchange & return badge matching Screenshot */}
                  <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-700 shrink-0 pb-0.5">
                    <svg
                      className="w-3.5 h-3.5 text-gray-700 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>7 days easy exchange & return</span>
                  </div>
                </div>
              </div>

              {/* Bottom row: Delivery estimate & Quantity dropdown matching Screenshot */}
              <div className="hidden lg:flex mt-3 pt-2 items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-600 truncate">
                  <svg
                    className="w-3.5 h-3.5 text-gray-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="truncate">
                    <span className="text-gray-500">Delivery in </span>
                    <span className="font-medium text-gray-900">
                      {deliveryDaysText}
                    </span>
                  </span>
                </div>

                {/* Quantity Selector button matching Screenshot */}
                <div className="shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setTempQty(quantity);
                      setIsQtyModalOpen(true);
                    }}
                    aria-label={`Change quantity for ${product.title}`}
                    className="inline-flex items-center gap-1.5 bg-[#F5F5F5] hover:bg-[#EAEAEA] text-gray-900 text-xs font-semibold rounded px-2.5 py-1 cursor-pointer outline-none transition-colors"
                  >
                    <span>Qty: {quantity}</span>
                    <span className="text-[#FAA619] text-[9px] leading-none">
                      ▼
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: exchange line, then delivery estimate + quantity */}
          <div className="lg:hidden px-4 pb-3 space-y-2.5 text-[12px] text-gray-800">
            <div className="flex items-center gap-1.5">
              <ExchangeIcon />
              <span>7 days easy exchange &amp; return</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <CalendarIcon />
                <span className="truncate">
                  <span className="text-gray-500">Delivery in </span>
                  <span className="text-gray-900 ml-1">
                    {hasPincode ? deliveryDaysText : 'Enter Pincode above'}
                  </span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTempQty(quantity);
                  setIsQtyModalOpen(true);
                }}
                aria-label={`Change quantity for ${product.title}`}
                className="inline-flex items-center gap-1.5 bg-[#F5F5F5] text-gray-900 text-xs font-semibold rounded px-2.5 py-1 cursor-pointer shrink-0"
              >
                <span>Qty: {quantity}</span>
                <span className="text-[#FAA619] text-[9px] leading-none">▼</span>
              </button>
            </div>
          </div>

          {/* Action Buttons Bar matching Screenshot: Remove | Move to favourites */}
          <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100 bg-white">
            <button
              type="button"
              onClick={() => setIsRemoveModalOpen(true)}
              aria-label={`Remove ${product.title} from basket`}
              className="w-full py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[#FAA619] hover:text-[#D98207] transition-colors cursor-pointer flex items-center justify-center"
            >
              Remove
            </button>

            <button
              type="button"
              onClick={handleWishlistToggle}
              aria-label={`Move ${product.title} to favourites`}
              className="w-full py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[#FAA619] hover:text-[#D98207] transition-colors cursor-pointer flex items-center justify-center"
            >
              {isWishlisted ? 'Saved to favourites' : 'Move to favourites'}
            </button>
          </div>
        </div>
      </div>

      {/* Remove Product Confirmation Modal matching Image 3 */}
      <CartRemoveProductModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        line={line}
        onConfirmRemove={handleExecuteRemove}
        onMoveToFavourites={handleMoveToFavouritesFromModal}
      />

      {/* Quantity Selection Modal matching Image 2 */}
      {isQtyModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-lg p-5 w-full max-w-[340px] sm:max-w-[360px] shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            {/* Header: Thumbnail, Title, Close */}
            <div className="flex items-start gap-3 pr-6">
              <div className="w-12 h-14 bg-gray-50 rounded overflow-hidden shrink-0 border border-gray-100">
                {image ? (
                  <Image
                    data={image}
                    alt={image.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                    No image
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                  {displayTitle}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsQtyModalOpen(false)}
                aria-label="Close quantity selection"
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 font-bold text-base cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Select Quantity Label */}
            <div className="mt-4 mb-3">
              <span className="text-sm font-bold text-gray-900">
                Select Quantity
              </span>
            </div>

            {/* 5-Column Grid */}
            <div className="grid grid-cols-5 gap-2 mb-5">
              {Array.from({length: maxSelectableQuantity}, (_, i) => i + 1).map(
                (num) => {
                  const isSelected = num === tempQty;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTempQty(num)}
                      className={`h-10 rounded border text-sm font-semibold flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FAA619] border-[#FAA619] text-white font-bold shadow-xs'
                          : 'bg-white border-gray-300 text-gray-800 hover:border-gray-400'
                      }`}
                    >
                      {num}
                    </button>
                  );
                },
              )}
            </div>

            {/* SELECT Button */}
            <button
              type="button"
              onClick={() => {
                setIsQtyModalOpen(false);
                if (tempQty !== quantity) {
                  fetcher.submit(
                    {
                      [CartForm.INPUT_NAME]: JSON.stringify({
                        action: CartForm.ACTIONS.LinesUpdate,
                        inputs: {
                          lines: [{id: lineId, quantity: tempQty}],
                        },
                      }),
                    },
                    {method: 'POST', action: '/cart'},
                  );
                }
              }}
              className="w-full py-3 bg-[#FAA619] hover:bg-[#E09210] active:bg-[#C97E06] text-white text-sm font-bold uppercase tracking-wider rounded transition-colors cursor-pointer shadow-xs"
            >
              Select
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ExchangeIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-gray-700 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-gray-500 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}
