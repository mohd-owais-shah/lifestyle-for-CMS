import {redirect} from 'react-router';

/**
 * Landing route for the Shopify "Thank you" page button.
 * Accepts `?order_id=` as a numeric id, an Order GID or an OrderIdentity GID
 * (what checkout UI extensions expose) and forwards to the order detail page.
 * @param {Route.LoaderArgs}
 */
export async function loader({request, context}) {
  const url = new URL(request.url);
  const rawId = url.searchParams.get('order_id') || '';
  const numericId = rawId.match(/(\d+)$/)?.[1];

  if (!numericId) {
    return redirect('/account/orders');
  }

  const orderPath = `/account/orders/${btoa(`gid://shopify/Order/${numericId}`)}`;

  if (!context.session.get('customerAccessToken')) {
    return redirect(`/account/login?return_to=${encodeURIComponent(orderPath)}`);
  }

  return redirect(orderPath);
}

/** @typedef {import('./+types/order-confirmed').Route} Route */
