/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const {cart} = context;
  const cartData = await cart.get();

  return Response.json(cartData || {}, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

/**
 * @param {Route.ActionArgs}
 */
export async function action({context}) {
  const {cart} = context;
  const cartData = await cart.get();

  return Response.json(cartData || {}, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

/** @typedef {import('./+types/cart[.json]').Route} Route */
