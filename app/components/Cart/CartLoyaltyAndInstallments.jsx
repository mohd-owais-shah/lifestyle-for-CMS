import {useState} from 'react';
import {Link} from 'react-router';

export function CartLoyaltyAndInstallments({
  isLoggedIn = false,
  cart = null,
  showInstallments = true,
}) {
  const [isInstallmentsOpen, setIsInstallmentsOpen] = useState(false);

  // Calculate estimated reward points based on cart subtotal (~1 point per ₹400)
  const subtotal = parseFloat(cart?.cost?.subtotalAmount?.amount || '3600');
  const rewardPoints = Math.max(1, Math.round(subtotal / 400));

  const loyaltyUrl = 'https://www.lifestylestores.com/in/en/my-account/loyalty';

  return (
    <div className="space-y-4 mb-4">
      {/* Landmark Reward Points Card matching Screenshots 1 & 2 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {/* Landmark Rewards Brand Icon */}
            <div className="w-8 h-8 rounded shrink-0 flex items-center justify-center mt-0.5">
              <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="10" width="10" height="16" rx="2" fill="#F59E0B" />
                <rect x="18" y="6" width="10" height="20" rx="2" fill="#FAA619" />
                <circle cx="9" cy="6" r="2.5" fill="#F59E0B" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Landmark Reward points</h4>
              
              {isLoggedIn ? (
                /* Logged-in state matching Screenshot 1 */
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Tap now to enrol for Landmark Rewards and get {rewardPoints} points with this purchase and redeem for discounts in next eligible purchase(s)
                </p>
              ) : (
                /* Not logged-in state matching Screenshot 2 */
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Tap here to log in and enrol for Landmark Rewards. Earn with every purchase and redeem for discounts.
                </p>
              )}

              <a
                href={loyaltyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#FAA619] font-semibold hover:underline mt-1.5 inline-block"
              >
                Learn more
              </a>
            </div>
          </div>

          {/* Action Button: Enrol now if logged in, Login if not logged in */}
          {isLoggedIn ? (
            <a
              href={loyaltyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 border border-[#FAA619] text-[#FAA619] hover:bg-[#FFF7ED] text-xs font-bold rounded transition-colors cursor-pointer shrink-0"
            >
              Enrol now
            </a>
          ) : (
            <Link
              to="/account/login?return_to=/cart"
              className="px-4 py-1.5 border border-[#FAA619] text-[#FAA619] hover:bg-[#FFF7ED] text-xs font-bold rounded transition-colors cursor-pointer shrink-0"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Installments Card matching Screenshots 1 & 2 */}
      {showInstallments && (
      <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-xs">
        <button
          type="button"
          onClick={() => setIsInstallmentsOpen(!isInstallmentsOpen)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-gray-800">
            <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Your order is eligible for installments</span>
          </div>
          <svg
            className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isInstallmentsOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isInstallmentsOpen && (
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-1">
            <p>Pay in 3 easy interest-free monthly installments via partner banks.</p>
            <p className="text-[11px] text-gray-500">Available on credit and debit cards at checkout.</p>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
