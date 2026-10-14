import {data, redirect, useLoaderData} from 'react-router';
import {CustomerAuthCard} from '~/components/CustomerAuthCard';
import {registerCustomer} from '~/lib/customerAuth.server';
import {seoMeta} from '~/lib/seo';
import {safeRedirect} from '~/lib/safeRedirect';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({location, matches}) =>
  seoMeta({title: "Create Account | Lifestyle Stores", noindex: true, location, matches});

/**
 * After the sign-in form posts, don't re-run this loader: being signed in it
 * would redirect to `return_to` before the form handles it, and a redirect
 * to /checkout (off-site Shopify checkout) can't finish as a client
 * navigation. The root loader still revalidates, so the header updates.
 * @type {Route.ShouldRevalidateFunction}
 */
export const shouldRevalidate = ({formMethod, defaultShouldRevalidate}) =>
  formMethod && formMethod !== 'GET' ? false : defaultShouldRevalidate;

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({request, context}) {
  const {session} = context;
  const token = session.get('customerAccessToken');

  const url = new URL(request.url);
  const redirectTo = safeRedirect(
    url.searchParams.get('return_to') || url.searchParams.get('redirectTo'),
    '/account',
  );

  if (token) {
    return redirect(redirectTo);
  }

  return {redirectTo};
}

/**
 * @param {Route.ActionArgs}
 */
export async function action({request, context}) {
  const {storefront, session} = context;
  const formData = await request.formData();

  const redirectTo = safeRedirect(formData.get('redirectTo'), '/account');
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '').trim();
  const firstName = String(formData.get('firstName') || '').trim();
  const lastName = String(formData.get('lastName') || '').trim();

  const result = await registerCustomer({
    storefront,
    session,
    email,
    password,
    firstName,
    lastName,
  });

  if (result.error) {
    return data({error: result.error, errors: result.errors}, {status: 400});
  }

  // No manual session.commit(): server.js commits the pending session onto
  // the final response — including the redirect a plain (pre-hydration)
  // form POST gets — so the login cookie is never dropped.
  return data({
    success: true,
    autoLoggedIn: result.autoLoggedIn,
    message: result.message,
    redirectTo: result.autoLoggedIn ? redirectTo : undefined,
  });
}

export default function AccountRegisterRoute() {
  const {redirectTo} = useLoaderData();

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-[#FAFAFA]">
      <div className="w-full max-w-[480px]">
        <CustomerAuthCard
          initialMode="signup"
          redirectTo={redirectTo}
          isModal={false}
        />
      </div>
    </div>
  );
}
