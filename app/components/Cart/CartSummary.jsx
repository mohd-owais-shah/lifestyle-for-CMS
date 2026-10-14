import {CheckoutLink} from '~/components/PendingIndicator';
export function formatPrice(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '0';
  const num = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  if (num % 1 === 0) {
    return String(num);
  }
  const rounded = Math.round(num * 100) / 100;
  return String(rounded);
}

export const PLATFORM_FEE = 19;

/**
 * Price breakdown shared by the desktop "Price Details" card and the mobile
 * "Price breakup" sheet, so both always show the same numbers.
 */
export function getCartPriceBreakup(cart) {
  // Calculate Total MRP and separate offer discount vs promocode discount
  const lines = cart?.lines?.nodes || [];
  let computedTotalMrp = 0;
  let totalLineDiscount = 0;
  let totalCodeDiscount = 0;

  // Active coupon/promo codes on cart
  const appliedCodes = (cart?.discountCodes || [])
    .filter((c) => c.applicable)
    .map((c) => c.code?.toLowerCase());

  for (const line of lines) {
    const qty = line.quantity || 1;
    const priceAmount = parseFloat(line.cost?.totalAmount?.amount || '0');
    const compareAtPerQty = line.merchandise?.compareAtPrice?.amount
      ? parseFloat(line.merchandise.compareAtPrice.amount)
      : null;

    if (compareAtPerQty && compareAtPerQty * qty > priceAmount) {
      computedTotalMrp += compareAtPerQty * qty;
    } else {
      computedTotalMrp += priceAmount;
    }

    // Line discount allocations
    if (line.discountAllocations?.length) {
      for (const alloc of line.discountAllocations) {
        const allocAmount = parseFloat(alloc.discountedAmount?.amount || '0');
        totalLineDiscount += allocAmount;

        const isCodeAlloc =
          Boolean(alloc.code) ||
          Boolean(
            alloc.title && appliedCodes.includes(alloc.title.toLowerCase()),
          );
        if (isCodeAlloc) {
          totalCodeDiscount += allocAmount;
        }
      }
    }
  }

  // Cart-level discount allocations
  let totalCartDiscount = 0;
  if (cart?.discountAllocations?.length) {
    for (const alloc of cart.discountAllocations) {
      const allocAmount = parseFloat(alloc.discountedAmount?.amount || '0');
      totalCartDiscount += allocAmount;

      const isCodeAlloc =
        Boolean(alloc.code) ||
        Boolean(
          alloc.title && appliedCodes.includes(alloc.title.toLowerCase()),
        );
      if (isCodeAlloc) {
        totalCodeDiscount += allocAmount;
      }
    }
  }

  const finalTotalAmount = parseFloat(cart?.cost?.totalAmount?.amount || '0');
  const platformFee = PLATFORM_FEE;

  // Total savings across the order. The platform fee is not part of the
  // Shopify cart total, so it must not be counted as a saving (it showed a
  // phantom "- ₹19" offer discount on undiscounted carts).
  let totalSavings = Math.max(0, computedTotalMrp - finalTotalAmount);
  if (totalSavings === 0 && (totalLineDiscount > 0 || totalCartDiscount > 0)) {
    totalSavings = totalLineDiscount + totalCartDiscount;
  }

  // Promocode discount from coupon codes (e.g. SAVE200)
  let promocodeDiscount = totalCodeDiscount;
  if (
    promocodeDiscount === 0 &&
    appliedCodes.length > 0 &&
    totalCartDiscount > 0
  ) {
    promocodeDiscount = totalCartDiscount;
  }

  // Offer discount (Buy 1 Get 1, Buy 2 Get 15% Off, combo savings, automatic discounts)
  const offerDiscount = Math.max(0, totalSavings - promocodeDiscount);

  return {
    totalMrp: computedTotalMrp,
    offerDiscount,
    promocodeDiscount,
    platformFee,
    total: finalTotalAmount,
  };
}

/**
 * Total MRP / discounts / shipping / platform fee rows.
 * @param {{breakup: ReturnType<typeof getCartPriceBreakup>, className?: string}}
 */
export function CartPriceRows({breakup, className = 'space-y-3 text-xs sm:text-sm'}) {
  const {totalMrp, offerDiscount, promocodeDiscount /* , platformFee */} =
    breakup;

  return (
    <div className={className}>
      {/* Total MRP */}
      <div className="flex items-center justify-between text-gray-700">
        <span>Total MRP</span>
        <span className="font-bold text-gray-900">
          ₹{formatPrice(totalMrp)}
        </span>
      </div>

      {/* Offer Discount (BOGO, Buy 2 Get 15%, Combo offers) */}
      {offerDiscount > 0 && (
        <div className="flex items-center justify-between text-[#1DA463]">
          <span className="text-gray-700">Offer discount</span>
          <span className="font-bold">- ₹{formatPrice(offerDiscount)}</span>
        </div>
      )}

      {/* Promocode Discount (Coupon codes like SAVE200) */}
      {promocodeDiscount > 0 && (
        <div className="flex items-center justify-between text-[#1DA463]">
          <span className="text-gray-700">Promocode discount</span>
          <span className="font-bold">
            - ₹{formatPrice(promocodeDiscount)}
          </span>
        </div>
      )}

      {/* Shipping Fee */}
      <div className="flex items-center justify-between text-gray-700">
        <span>Shipping fee</span>
        <span className="font-bold text-[#1DA463]">Free</span>
      </div>

      {/* Platform Fee hidden for now — not charged yet. Restore this row
          (and `platformFee` above) when the fee goes live.
      <div className="flex items-center justify-between text-gray-700">
        <span className="flex items-center gap-1.5">
          Platform fee
          <span className="text-xs text-[#FAA619] font-medium cursor-pointer underline">
            Details
          </span>
        </span>
        <span className="font-bold text-gray-900">₹{platformFee}</span>
      </div>
      */}
    </div>
  );
}

export function CartSummary({cart}) {
  if (!cart) return null;

  const breakup = getCartPriceBreakup(cart);
  const checkoutUrl = cart.checkoutUrl;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4 shadow-xs">
      <CartPriceRows breakup={breakup} />

      {/* Divider */}
      <div className="pt-4 mt-4 border-t border-gray-200">
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-base sm:text-lg font-bold text-gray-900">
            Total
          </span>
          <span className="text-xl sm:text-2xl font-black text-gray-900">
            ₹{formatPrice(breakup.total)}
          </span>
        </div>

        {/* Checkout Button matching Screenshot 2 */}
        {checkoutUrl ? (
          <CheckoutLink className="w-full flex items-center justify-center py-3.5 bg-[#FAA619] hover:bg-[#E09210] active:bg-[#C97E06] text-white text-sm font-bold uppercase tracking-wider rounded-md transition-colors shadow-sm">
            Checkout now
          </CheckoutLink>
        ) : (
          <button
            type="button"
            disabled
            className="w-full flex items-center justify-center py-3.5 bg-gray-300 text-gray-500 text-sm font-bold uppercase tracking-wider rounded-md cursor-not-allowed"
          >
            Checkout now
          </button>
        )}
      </div>
    </div>
  );
}
