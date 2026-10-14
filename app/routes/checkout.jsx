import {redirect} from 'react-router';
import {getCustomerProfile} from '~/lib/customerAuth.server';

const LOGIN_PATH = '/account/login?return_to=/checkout';

/**
 * Checkout gate. Every "Checkout" button links here instead of straight to
 * `cart.checkoutUrl` so that:
 * 1. Guests are sent to sign in first and come back here afterwards.
 * 2. Signed-in customers are attached to the cart (buyerIdentity), so
 *    Shopify checkout opens with their email and saved addresses prefilled.
 *
 * Note: with classic customer accounts checkout cannot show a signed-in
 * session (that needs Multipass or new customer accounts) — it is prefilled.
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const {cart, session, storefront} = context;
  const customerAccessToken = session.get('customerAccessToken');
  const expiresAt = session.get('customerAccessTokenExpiresAt');
  const isExpired = expiresAt && new Date(expiresAt).getTime() <= Date.now();

  if (!customerAccessToken || isExpired) {
    return redirect(LOGIN_PATH);
  }

  const [currentCart, customer] = await Promise.all([
    cart.get(),
    getCustomerProfile({storefront, session}),
  ]);

  // Token was rejected (expired/revoked) — getCustomerProfile cleared it
  if (!customer) {
    return redirect(LOGIN_PATH, {
      headers: {'Set-Cookie': await session.commit()},
    });
  }

  if (!currentCart?.id || !currentCart.totalQuantity) {
    return redirect('/cart');
  }

  const result = await cart.updateBuyerIdentity({
    customerAccessToken,
    ...(customer.email ? {email: customer.email} : {}),
  });
  const updatedCart = result?.cart;

  if (result?.errors?.length || !updatedCart?.checkoutUrl) {
    console.error('Checkout buyer identity update failed', result?.errors);
    // Still let the customer pay rather than blocking checkout
    return redirect(currentCart.checkoutUrl);
  }

  const headers = cart.setCartId(updatedCart.id);
  return redirect(updatedCart.checkoutUrl, {headers});
}

/** @typedef {import('./+types/checkout').Route} Route */
