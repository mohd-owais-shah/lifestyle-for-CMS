import {redirect} from 'react-router';

/**
 * Fallback route for all unauthenticated routes in account section
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const token = context.session.get('customerAccessToken');

  if (!token) {
    return redirect('/account/login');
  }

  return redirect('/account');
}
