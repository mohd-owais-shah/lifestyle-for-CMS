import * as serverBuild from 'virtual:react-router/server-build';
import {createRequestHandler, storefrontRedirect} from '@shopify/hydrogen';
import {createHydrogenRouterContext} from '~/lib/context';

/**
 * Export a fetch handler in module format.
 */
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * True for POST/PUT/PATCH/DELETE sent by a browser from a different site.
 * Uses Sec-Fetch-Site when present, otherwise compares the Origin header.
 * Requests without either header (non-browser clients) are left to the
 * normal session/auth checks.
 * @param {Request} request
 */
function isCrossSiteMutation(request) {
  if (SAFE_METHODS.has(request.method)) return false;

  const fetchSite = request.headers.get('Sec-Fetch-Site');
  if (fetchSite) return fetchSite === 'cross-site';

  const origin = request.headers.get('Origin');
  if (!origin || origin === 'null') return Boolean(origin);
  try {
    return new URL(origin).host !== new URL(request.url).host;
  } catch {
    return true;
  }
}

/**
 * @param {Request} request
 * @param {string} name
 */
function readCookie(request, name) {
  for (const part of (request.headers.get('Cookie') || '').split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }
  return null;
}

// Cart-changing endpoints: cart actions (POST /cart, /cart.data) and the
// shareable GET links /cart/<lines> and /discount/<code>
const CART_ACTION_PATH = /^\/cart(\.data)?$/;
const CART_LINK_PATH = /^\/(cart|discount)\/.+/;

/**
 * Non-secret "state" cookies that let other open tabs of the same browser
 * notice a login/logout or basket change and refresh (see useSessionSync).
 * They contain no token or personal data, so they are readable by JS.
 * @param {Request} request
 * @param {Response} response
 * @param {{get: (key: string) => unknown}} session
 */
function applySessionStateCookies(request, response, session) {
  try {
    const url = new URL(request.url);
    const attrs = `; Path=/; SameSite=Lax${url.protocol === 'https:' ? '; Secure' : ''}`;

    const token = session.get('customerAccessToken');
    const expiresAt = session.get('customerAccessTokenExpiresAt');
    const loggedIn =
      Boolean(token) &&
      !(expiresAt && new Date(String(expiresAt)).getTime() <= Date.now());
    const authState = loggedIn ? '1' : '0';
    if (readCookie(request, 'lf_auth') !== authState) {
      response.headers.append('Set-Cookie', `lf_auth=${authState}${attrs}`);
    }

    const changedCart =
      response.status < 400 &&
      ((!SAFE_METHODS.has(request.method) && CART_ACTION_PATH.test(url.pathname)) ||
        CART_LINK_PATH.test(url.pathname));
    if (changedCart) {
      response.headers.append('Set-Cookie', `lf_cart_v=${Date.now()}${attrs}`);
    }
  } catch {
    // Immutable headers (rare) — tab sync is best-effort, never break a page
  }
}

export default {
  /**
   * @param {Request} request
   * @param {Env} env
   * @param {ExecutionContext} executionContext
   * @return {Promise<Response>}
   */
  async fetch(request, env, executionContext) {
    // CSRF defence in depth (on top of SameSite=Lax cookies): refuse
    // state-changing requests that a browser marks as coming from another site.
    if (isCrossSiteMutation(request)) {
      return new Response('Cross-site request blocked', {status: 403});
    }

    try {
      const hydrogenContext = await createHydrogenRouterContext(
        request,
        env,
        executionContext,
      );

      /**
       * Create a Hydrogen request handler that internally
       * delegates to React Router for routing and rendering.
       */
      const handleRequest = createRequestHandler({
        build: serverBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => hydrogenContext,
      });

      const response = await handleRequest(request);

      if (hydrogenContext.session.isPending) {
        // append, not set: keep other cookies on this response (e.g. cart id)
        response.headers.append(
          'Set-Cookie',
          await hydrogenContext.session.commit(),
        );
      }

      applySessionStateCookies(request, response, hydrogenContext.session);

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({
          request,
          response,
          storefront: hydrogenContext.storefront,
        });
      }

      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};
