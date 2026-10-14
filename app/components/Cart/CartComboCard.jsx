import {useState} from 'react';
import {CartLineItem} from './CartLineItem';

function formatPrice(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '0';
  const num = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  if (num % 1 === 0) {
    return String(num);
  }
  const rounded = Math.round(num * 100) / 100;
  return String(rounded);
}

export function CartComboCard({
  title = 'Buy 2 Get 15 Percent Off',
  lines = [],
  compareAtTotal = 0,
  priceTotal = 0,
  deliveryText = 'Delivery in 5-7 days',
  onWishlist,
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const displayTitle =
    title && !title.toLowerCase().includes('buy 1 get 1') && title !== 'Combo Offer'
      ? title
      : 'Buy 2 Get 15 Percent Off';

  // Compute calculated amounts if not passed or zero
  let calculatedPriceTotal = 0;
  let calculatedCompareAtTotal = 0;

  for (const line of lines) {
    const qty = line.quantity || 1;
    const lPrice = parseFloat(line.cost?.totalAmount?.amount || '0');
    const uPrice = parseFloat(line.merchandise?.price?.amount || '0');
    const uComp = line.merchandise?.compareAtPrice?.amount
      ? parseFloat(line.merchandise.compareAtPrice.amount)
      : null;

    let allocSum = 0;
    if (line.discountAllocations?.length) {
      for (const alloc of line.discountAllocations) {
        allocSum += parseFloat(alloc.discountedAmount?.amount || '0');
      }
    }

    const lOrig = uComp
      ? uComp * qty
      : Math.max(uPrice * qty, lPrice + allocSum);

    calculatedPriceTotal += lPrice;
    calculatedCompareAtTotal += lOrig;
  }

  const effectivePriceTotal = priceTotal || calculatedPriceTotal;
  const effectiveCompareAtTotal = compareAtTotal || calculatedCompareAtTotal;
  const savings = Math.max(0, effectiveCompareAtTotal - effectivePriceTotal);

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-4 overflow-hidden shadow-xs">
      {/* Combo Summary Header matching Screenshot */}
      <div className="p-4 flex gap-3 sm:gap-4 items-start">
        {/* Thumbnail Preview Collage (supports 2, 4, or 4+ with overlay) */}
        <div className="w-18 sm:w-20 shrink-0 aspect-[3/4] bg-gray-50 rounded overflow-hidden relative border border-gray-100">
          {lines.length <= 2 ? (
            <div className="flex w-full h-full">
              {lines.slice(0, 2).map((line, idx) => (
                <div key={line.id || idx} className="w-1/2 h-full overflow-hidden">
                  {line.merchandise?.image ? (
                    <img
                      src={line.merchandise.image.url}
                      alt={line.merchandise.image.altText || ''}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
              {lines.slice(0, 4).map((line, idx) => {
                const isOverlaySlot = idx === 2 && lines.length > 4;
                const remainingCount = lines.length - 4;

                return (
                  <div
                    key={line.id || idx}
                    className={`relative w-full h-full overflow-hidden ${
                      lines.length === 3 && idx === 2 ? 'col-span-2' : ''
                    }`}
                  >
                    {line.merchandise?.image ? (
                      <img
                        src={line.merchandise.image.url}
                        alt={line.merchandise.image.altText || ''}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100" />
                    )}

                    {isOverlaySlot && (
                      <div className="absolute bottom-1 inset-x-0.5 flex items-center justify-center z-10">
                        <span className="bg-white text-[9px] sm:text-[10px] font-bold text-gray-900 px-1 py-0.5 rounded shadow-xs whitespace-nowrap">
                          + {remainingCount} more
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Combo Info matching Screenshot */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2">
              {displayTitle}
            </h4>

            {/* Pricing matching Screenshot */}
            <div className="flex items-center flex-wrap gap-2 mt-1.5">
              {effectiveCompareAtTotal > effectivePriceTotal && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{formatPrice(effectiveCompareAtTotal)}
                </span>
              )}

              <span className="text-sm sm:text-base font-bold text-gray-900">
                ₹{formatPrice(effectivePriceTotal)}
              </span>

              {savings > 0 && (
                <span className="text-xs font-semibold text-[#1DA463]">
                  ₹{formatPrice(savings)} saved
                </span>
              )}
            </div>

            {/* Sub-attributes matching Screenshot */}
            <div className="mt-2 text-xs text-gray-700 space-y-1">
              <div className="flex items-center">
                <span className="text-gray-400 w-14">Colour:</span>
                <span className="font-medium text-gray-900">
                  Multiple colours
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 w-14">Size:</span>
                <span className="font-medium text-gray-900">
                  Multiple sizes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Toggle matching Screenshot */}
      <div className="border-t border-gray-200 bg-white">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[#FAA619] hover:text-[#D98207] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
        >
          {isExpanded ? (
            <>
              <span>Hide combo</span> <span className="text-[10px] leading-none">▲</span>
            </>
          ) : (
            <>
              <span>View combo</span> <span className="text-[10px] leading-none">▼</span>
            </>
          )}
        </button>
      </div>

      {/* Expanded Sub-items matching Screenshot */}
      {isExpanded && (
        <div className="border-t border-gray-200 divide-y divide-gray-200 bg-white">
          {lines.map((line, idx) => (
            <div key={line.id}>
              <CartLineItem
                line={line}
                itemIndex={idx + 1}
                deliveryText={deliveryText}
                onWishlist={onWishlist}
                isNested
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
