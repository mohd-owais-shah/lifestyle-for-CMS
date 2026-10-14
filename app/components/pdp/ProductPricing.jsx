/**
 * Product Pricing Component matching Lifestyle Store style:
 * Displays Selling Price, CompareAt Price (MRP), Discount %, and Tax notice
 */
export function ProductPricing({ price, compareAtPrice }) {
  if (!price) return null;

  const currentAmount = parseFloat(price.amount || '0');
  const compareAmount = compareAtPrice ? parseFloat(compareAtPrice.amount || '0') : null;
  const hasDiscount = compareAmount && compareAmount > currentAmount;

  const discountPercent = hasDiscount
    ? Math.round(((compareAmount - currentAmount) / compareAmount) * 100)
    : 0;

  const formatPrice = (val) => {
    return Math.round(val).toLocaleString('en-IN');
  };

  return (
    <div>
      <div className="flex items-baseline flex-wrap">
        {/* MRP label: 14px Figtree-Regular, #000000 */}
        <span className="text-[14px] font-normal text-[#000000] mr-[5px] select-none">
          MRP
        </span>

        {/* Rupee symbol: 14px Figtree-Semibold, #000000 */}
        <span className="text-[14px] font-semibold text-[#000000] mr-[4px] select-none">
          ₹
        </span>

        {/* Selling Price amount: 28px Figtree-Semibold, #000000 */}
        <span className="text-[28px] font-normal text-[#000000] tracking-tight">
          {formatPrice(currentAmount)}
        </span>

        {/* Strikethrough compare price and discount % */}
        {hasDiscount && (
          <span className="inline-flex items-baseline gap-1.5 ml-2.5">
            <span className="text-[14px] text-[#929391] line-through font-normal">
              ₹{formatPrice(compareAmount)}
            </span>
            <span className="text-[14px] font-semibold text-[#E53935]">
              ({discountPercent}% OFF)
            </span>
          </span>
        )}

        {/* Inclusive of all taxes: 14px Figtree-Regular, #929391 */}
        <span className="text-[14px] font-normal text-[#929391] ml-[8px] select-none">
          Inclusive of all taxes
        </span>
      </div>

      <div className="mt-2">
        <a
          href="#delivery-shipping"
          className="text-[14px] font-semibold text-[#FAA619] underline underline-offset-2 leading-[16.8px] hover:text-[#E09415] transition-colors inline-block"
        >
          Free shipping on All orders
        </a>
      </div>

      {/* Exact Lifestyle Divider: hr.MuiDivider-root (393.33 x 1, background: #ECEDEB, margin: 16px 0px 0px) */}
      <hr className="mt-[16px] mb-0 h-[1px] bg-[#ECEDEB] border-0 w-full" />
    </div>
  );
}
