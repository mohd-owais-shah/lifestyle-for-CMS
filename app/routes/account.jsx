import {
  data,
  Link,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useLocation,
} from 'react-router';
import {useAside} from '~/components/Aside';
import {ACCOUNT_CUSTOMER_QUERY} from '~/graphql/customerQueries';
import {SignOutButton} from '~/components/PendingIndicator';

/**
 * Account pages are personal: never store them in any shared or browser
 * cache. Applies to every /account/* child route (they inherit it).
 * @type {Route.HeadersFunction}
 */
export const headers = () => ({
  'Cache-Control': 'private, no-store',
});

export function shouldRevalidate({
  currentUrl,
  nextUrl,
  formMethod,
  defaultShouldRevalidate,
}) {
  if (formMethod && formMethod !== 'GET') return defaultShouldRevalidate;
  if (currentUrl.href === nextUrl.href) return defaultShouldRevalidate;
  return false;
}

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const {session, storefront} = context;
  const customerAccessToken = session.get('customerAccessToken');

  if (!customerAccessToken) {
    return redirect('/account/login');
  }

  try {
    const response = await storefront.query(ACCOUNT_CUSTOMER_QUERY, {
      variables: {customerAccessToken},
      cache: storefront.CacheNone(),
    });

    const customer = response?.customer;

    if (!customer) {
      session.unset('customerAccessToken');
      session.unset('customerAccessTokenExpiresAt');
      return redirect('/account/login', {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      });
    }

    return data(
      {customer},
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      },
    );
  } catch (error) {
    console.error('Account layout loader error:', error);
    session.unset('customerAccessToken');
    session.unset('customerAccessTokenExpiresAt');
    return redirect('/account/login', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  }
}

const NAV_TABS = [
  {label: 'Profile', to: '/account/profile'},
  {label: 'Favourites', to: '/account/favourites'},
  {label: 'Orders', to: '/account/orders'},
  {label: 'Address Book', to: '/account/addresses'},
  {label: 'Payment', to: '/account/payment', hidden: true},
  {label: 'My Credit', to: '/account/credit', hidden: true},
  {label: 'Communication', to: '/account/preferences'},
  {label: 'Reviews', to: '/account/reviews'},
  {label: 'Click & Collect', to: '/account/click-collect', hidden: true},
  {label: 'Landmark Rewards', to: '/account/rewards', hidden: true},
];

export default function AccountLayout() {
  /** @type {LoaderReturnData} */
  const {customer} = useLoaderData();
  const {pathname} = useLocation();
  const isOverview = pathname === '/account' || pathname === '/account/';
  const isOrders = /^\/account\/orders\/?$/.test(pathname);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Mobile overview bar: ☰  My Account  🔍 ♡ 🛍 (site header is hidden here) */}
      {isOverview && <AccountMobileHeader />}

      {/* Mobile Order History bar: ←  Order History  🔍 ♡ 🛍 (site header hidden) */}
      {isOrders && <AccountMobileHeader title="Order History" backTo="/account" />}

      {/* Other mobile sub-pages: just "‹ My Account" under the site header */}
      {!isOverview && !isOrders && (
        <div className="lg:hidden bg-[#F7F7F7] border-b border-gray-200">
          <Link
            to="/account"
            prefetch="intent"
            className="flex items-center gap-2 px-4 h-11 text-[13px] text-gray-800"
          >
            <span className="text-lg leading-none">‹</span>
            My Account
          </Link>
        </div>
      )}

      {/* Top Navigation Bar matching Lifestyle account pages (desktop) */}
      <header className="hidden lg:block border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-[1240px] px-4 flex items-center justify-between gap-4 h-12">
          {/* Back to Account Link */}
          <NavLink
            to="/account"
            end
            prefetch="intent"
            className="shrink-0 flex items-center gap-1 text-xs sm:text-sm font-normal text-gray-700 hover:text-black transition-colors"
          >
            <span className="text-base leading-none">‹</span>
            <span>My Account</span>
          </NavLink>

          {/* Horizontal navigation tabs */}
          <nav
            className="flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none py-1 flex-1 justify-end lg:justify-center"
            aria-label="Account navigation"
          >
            {NAV_TABS.filter((tab) => !tab.hidden).map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                prefetch="intent"
                className={({isActive}) =>
                  `shrink-0 px-2 py-2 text-xs transition-colors whitespace-nowrap border-b-2 ${
                    isActive
                      ? 'border-black text-black font-semibold'
                      : 'border-transparent text-gray-500 font-normal hover:text-black hover:border-gray-300'
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>

          {/* Sign Out Button */}
          <div className="shrink-0 hidden md:block">
            <AccountLogout />
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-[1240px] px-4 py-5 lg:py-8">
        <Outlet context={{customer}} />
      </main>
    </div>
  );
}

/**
 * Mobile account bar. Without `backTo` it opens the menu (☰); with it, it
 * shows a back arrow (←) to that page.
 * @param {{title?: string, backTo?: string}}
 */
function AccountMobileHeader({title = 'My Account', backTo}) {
  const {open} = useAside();

  return (
    <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.06)] h-[56px] px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {backTo ? (
          <Link
            to={backTo}
            prefetch="intent"
            aria-label="Back"
            className="text-gray-900"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => open('mobile')}
            aria-label="Open menu"
            className="text-gray-900 cursor-pointer"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        )}
        <span className="text-[17px] font-semibold text-gray-900">
          {title}
        </span>
      </div>
      <div className="flex items-center gap-5 text-gray-900">
        <button
          type="button"
          onClick={() => open('search')}
          aria-label="Search"
          className="cursor-pointer"
        >
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>
        <Link to="/account/favourites" prefetch="intent" aria-label="Favourites">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.8 8.8c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />
          </svg>
        </Link>
        <Link to="/cart" prefetch="intent" aria-label="Basket">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 8h14l-1.2 12H6.2z" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function AccountLogout() {
  return (
    <SignOutButton className="text-xs text-gray-500 hover:text-gray-900 transition-colors" />
  );
}

/** @typedef {import('./+types/account').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
