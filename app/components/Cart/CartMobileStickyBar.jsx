import {useEffect, useState} from 'react';
import {CartPriceRows, formatPrice, getCartPriceBreakup} from './CartSummary';
import {CheckoutLink} from '~/components/PendingIndicator';

/**
 * Mobile sticky "Total ₹X Details | PROCEED" bar. "Details" slides a
 * "Price breakup" sheet up above the bar (the bar stays visible and the
 * link switches to "Hide"), matching the live Lifestyle mobile basket.
 */
export function CartMobileStickyBar({cart}) {
  const [isBreakupOpen, setIsBreakupOpen] = useState(false);

  useEffect(() => {
    if (!isBreakupOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setIsBreakupOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [isBreakupOpen]);

  if (!cart) return null;

  const breakup = getCartPriceBreakup(cart);
  const productCount = cart.totalQuantity || 0;
  const checkoutUrl = cart.checkoutUrl;

  return (
    <div className="lg:hidden">
      {isBreakupOpen && (
        <button
          type="button"
          aria-label="Hide price breakup"
          tabIndex={-1}
          onClick={() => setIsBreakupOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 cursor-default"
        />
      )}

      <div className="fixed bottom-0 inset-x-0 z-50">
        {/* Price breakup sheet (sits directly above the bar) */}
        {isBreakupOpen && (
          <div
            role="dialog"
            aria-label="Price breakup"
            className="bg-white rounded-t-[20px] px-5 pb-4 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
          >
            <div className="flex justify-center pt-2.5 pb-3">
              <span className="w-10 h-1 rounded-full bg-gray-300" />
            </div>
            <h3 className="text-[15px] font-semibold text-gray-900 mb-4">
              Price breakup{' '}
              <span className="text-[12px] font-normal text-gray-500">
                {productCount} {productCount === 1 ? 'Product' : 'Products'}
              </span>
            </h3>
            <CartPriceRows breakup={breakup} className="space-y-3 text-[13px]" />
          </div>
        )}

        {/* Sticky Bottom Bar */}
        <div
          className={`bg-white px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] ${
            isBreakupOpen
              ? 'border-t border-gray-200'
              : 'border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]'
          }`}
        >
          <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
            <div className="min-w-0">
              <span className="text-[11px] text-gray-500 block">Total</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-gray-900">
                  ₹{formatPrice(breakup.total)}
                </span>
                <button
                  type="button"
                  onClick={() => setIsBreakupOpen((open) => !open)}
                  aria-expanded={isBreakupOpen}
                  className="text-xs font-bold text-[#FAA619] cursor-pointer"
                >
                  {isBreakupOpen ? 'Hide' : 'Details'}
                </button>
              </div>
              <p className="text-[10px] text-gray-400">Inclusive of all taxes</p>
            </div>

            {checkoutUrl ? (
              <CheckoutLink className="px-8 py-3 bg-[#FAA619] hover:bg-[#E09210] active:bg-[#C97E06] text-white text-sm font-bold uppercase tracking-wider rounded-[3px] transition-colors text-center shrink-0 min-w-[150px]">
                PROCEED
              </CheckoutLink>
            ) : (
              <button
                type="button"
                disabled
                className="px-8 py-3 bg-gray-300 text-gray-500 text-sm font-bold uppercase tracking-wider rounded-[3px] cursor-not-allowed text-center shrink-0 min-w-[150px]"
              >
                PROCEED
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
