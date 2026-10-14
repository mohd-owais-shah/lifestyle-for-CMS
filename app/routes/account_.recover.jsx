import {data, redirect, useLoaderData} from 'react-router';
import {CustomerAuthCard} from '~/components/CustomerAuthCard';
import {recoverCustomerPassword} from '~/lib/customerAuth.server';
import {seoMeta} from '~/lib/seo';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({location, matches}) =>
  seoMeta({title: "Forgot Password | Lifestyle Stores", noindex: true, location, matches});

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({request, context}) {
  const {session} = context;
  const token = session.get('customerAccessToken');

  if (token) {
    return redirect('/account');
  }

  return {};
}

/**
 * @param {Route.ActionArgs}
 */
export async function action({request, context}) {
  const {storefront} = context;
  const formData = await request.formData();
  const email = String(formData.get('email') || '').trim();

  const result = await recoverCustomerPassword({storefront, email});
  if (result.error) {
    return data({error: result.error, errors: result.errors}, {status: 400});
  }

  return data({success: true, message: result.message});
}

export default function AccountRecoverRoute() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-[#FAFAFA]">
      <div className="w-full max-w-[480px]">
        <CustomerAuthCard
          initialMode="recover"
          redirectTo="/account"
          isModal={false}
        />
      </div>
    </div>
  );
}
