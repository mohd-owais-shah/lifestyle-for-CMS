import {redirect} from 'react-router';
import {logoutCustomer} from '~/lib/customerAuth.server';

/**
 * GET must not change state: any page could otherwise log a customer out
 * with <img src="/account/logout">. Signing out is POST-only (the header
 * and account "Sign Out" buttons already use POST forms).
 * @param {Route.LoaderArgs}
 */
export async function loader() {
  return redirect('/account');
}

/**
 * @param {Route.ActionArgs}
 */
export async function action({context}) {
  const {storefront, session} = context;
  await logoutCustomer({storefront, session});

  return redirect('/', {
    headers: {
      'Set-Cookie': await session.commit(),
    },
  });
}
