import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import {CUSTOMER_QUERY} from '~/graphql/customerQueries';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import tailwindCss from './styles/tailwind.css?url';
import {PageLayout} from './components/PageLayout';
import {NotFoundHero} from './components/NotFoundHero';
import {seoMeta, getPublicOrigin} from '~/lib/seo';
import {useSessionSync} from '~/hooks/useSessionSync';

/**
 * Default SEO tags for any route without its own `meta` export.
 * @type {Route.MetaFunction}
 */
export const meta = ({location, matches, error}) =>
  error
    ? seoMeta({
        title:
          isRouteErrorResponse(error) && error.status === 404
            ? 'Page not found | Lifestyle Stores'
            : 'Something went wrong | Lifestyle Stores',
        noindex: true,
        location,
        matches,
      })
    : seoMeta({location, matches});

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 * @type {ShouldRevalidateFunction}
 */
export const shouldRevalidate = ({formMethod, currentUrl, nextUrl}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Leaving sign-in / sign-up / password pages means the session may have
  // just changed (e.g. the login page loader redirecting to `return_to`), so
  // the header must re-read login state instead of keeping stale root data.
  // Arriving at them (e.g. an account page redirecting to login because the
  // session ended in another tab) must also refresh the header.
  const AUTH_PAGE = /^\/account_?\/?(login|register|recover|reset|logout)/;
  if (AUTH_PAGE.test(currentUrl.pathname) || AUTH_PAGE.test(nextUrl.pathname)) {
    return true;
  }

  // Defaulting to no revalidation for root loader data to improve performance.
  // When using this feature, you risk your UI getting out of sync with your server.
  // Use with caution. If you are uncomfortable with this optimization, update the
  // line below to `return defaultShouldRevalidate` instead.
  // For more details see: https://remix.run/docs/en/main/route/should-revalidate
  return false;
};

/**
 * The main and reset stylesheets are added in the Layout component
 * to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
 * https://github.com/remix-run/remix/issues/9242
 */
export function links() {
  return [
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap',
    },
    {rel: 'icon', type: 'image/x-icon', href: 'https://assets-cloud.landmarkshops.in/website_images/in/favicons/lifestyle/32x32/favicon.ico'},
  ];
}

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const {storefront, env} = args.context;

  return {
    ...deferredData,
    ...criticalData,
    // Absolute origin for canonical / og:url tags (see ~/lib/seo)
    siteUrl: getPublicOrigin(args.request, env),
    // Basket version this render saw (server.js bumps lf_cart_v on changes);
    // lets other tabs detect a basket change made here (useSessionSync)
    cartVersion: readRequestCookie(args.request, 'lf_cart_v'),
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      // Oxygen sets PUBLIC_CHECKOUT_DOMAIN; locally fall back to the store domain
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN || env.PUBLIC_STORE_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      // localize the privacy banner
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context}) {
  const {storefront} = context;

  const METAOBJECT_QUERY = `#graphql
    query MainHeaderMetaobject {
      metaobject(handle: {type: "main_header", handle: "main-header-azyeqhek"}) {
        fields {
          key
          value
          reference {
            ... on Metaobject {
              fields {
                key
                value
              }
            }
            ... on MediaImage {
              image {
                url
              }
            }
          }
        }
      }
    }
  `;

  // Header content rarely changes: fresh for 1 minute, then served from cache
  // for up to a day while it refreshes in the background. Admin edits show up
  // within ~1 minute and visitors don't wait on Shopify once the cache is warm.
  const headerCache = storefront.CacheCustom({
    mode: 'public',
    maxAge: 60,
    staleWhileRevalidate: 60 * 60 * 24,
  });
  const queryHeader = (headerMenuHandle) =>
    storefront.query(HEADER_QUERY, {
      cache: headerCache,
      variables: {headerMenuHandle},
    });

  // The header metaobject names the menu to use. Fetch it in parallel with the
  // usual menu ("main-menu") so a cold cache costs one round trip, not two;
  // only if the metaobject points to another menu is a second request made.
  const DEFAULT_MENU_HANDLE = 'main-menu';
  const [{metaobject}, defaultHeader] = await Promise.all([
    storefront.query(METAOBJECT_QUERY, {cache: headerCache}),
    queryHeader(DEFAULT_MENU_HANDLE),
  ]);

  const menuField = metaobject?.fields?.find(f => f.key === 'menu')?.value || 'Main menu';
  const headerMenuHandle = menuField.toLowerCase().replace(/\s+/g, '-');

  const header =
    headerMenuHandle === DEFAULT_MENU_HANDLE
      ? defaultHeader
      : await queryHeader(headerMenuHandle);

  header.mainHeaderMetaobject = metaobject;

  return {header};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  const {storefront, cart, session} = context;

  // defer the footer query (below the fold)
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer', // Adjust to your footer menu handle
      },
    })
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  const customerAccessToken = session?.get('customerAccessToken');
  const customer = customerAccessToken
    ? storefront
        .query(CUSTOMER_QUERY, {
          variables: {customerAccessToken},
          cache: storefront.CacheNone(),
        })
        .then((res) => res?.customer || null)
        .catch(() => null)
    : Promise.resolve(null);

  // This app authenticates with the Storefront API customer access token
  // stored on the session. `customerAccount.isLoggedIn()` returns a Promise
  // (always truthy), so it must not be used here as a synchronous boolean.
  // An expired token is not a login (header must not show "Account").
  const expiresAt = session?.get('customerAccessTokenExpiresAt');
  const isLoggedIn =
    Boolean(customerAccessToken) &&
    !(expiresAt && new Date(expiresAt).getTime() <= Date.now());

  return {
    cart: cart.get(),
    isLoggedIn,
    customer,
    footer,
  };
}

/**
 * @param {Request} request
 * @param {string} name
 */
function readRequestCookie(request, name) {
  for (const part of (request.headers.get('Cookie') || '').split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }
  return null;
}

function getStylesheetUrl(url) {
  if (!url) return '';
  // In development Vite requires ?direct for <link rel="stylesheet"> to return text/css MIME type
  if (import.meta.env.DEV) {
    return url.includes('?') ? `${url}&direct` : `${url}?direct`;
  }
  return url;
}

/**
 * @param {{children?: React.ReactNode}}
 */
export function Layout({children}) {
  const nonce = useNonce();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={getStylesheetUrl(tailwindCss)} nonce={nonce} suppressHydrationWarning />
        <link rel="stylesheet" href={getStylesheetUrl(resetStyles)} nonce={nonce} suppressHydrationWarning />
        <link rel="stylesheet" href={getStylesheetUrl(appStyles)} nonce={nonce} suppressHydrationWarning />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  /** @type {RootLoader} */
  const data = useRouteLoaderData('root');

  // Login/logout or basket changes in another tab of this browser
  useSessionSync({
    isLoggedIn: Boolean(data?.isLoggedIn),
    cartVersion: data?.cartVersion ?? null,
    enabled: Boolean(data),
  });

  if (!data) {
    return <Outlet />;
  }

  return (
    <Analytics.Provider
      cart={data.cart}
      shop={data.shop}
      consent={data.consent}
    >
      <PageLayout {...data}>
        <Outlet />
      </PageLayout>
    </Analytics.Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  /** @type {RootLoader} */
  const rootData = useRouteLoaderData('root');
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  if (errorStatus === 404) {
    if (rootData) {
      return (
        <Analytics.Provider
          cart={rootData.cart}
          shop={rootData.shop}
          consent={rootData.consent}
        >
          <PageLayout {...rootData}>
            <NotFoundHero />
          </PageLayout>
        </Analytics.Provider>
      );
    }
    return (
      <PageLayout>
        <NotFoundHero />
      </PageLayout>
    );
  }

  // Never show internal server error details to shoppers in production
  if (errorStatus >= 500 && !import.meta.env.DEV) {
    errorMessage = 'Something went wrong. Please try again in a moment.';
  }

  return (
    <div className="route-error">
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}

/** @typedef {LoaderReturnData} RootLoader */

/** @typedef {import('react-router').ShouldRevalidateFunction} ShouldRevalidateFunction */
/** @typedef {import('./+types/root').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
