import {useState} from 'react';
import {data, redirect, useActionData, useNavigation, Form} from 'react-router';
import {resetCustomerPassword} from '~/lib/customerAuth.server';
import {seoMeta} from '~/lib/seo';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({location, matches}) =>
  seoMeta({title: "Reset Password | Lifestyle Stores", noindex: true, location, matches});

/**
 * @param {Route.ActionArgs}
 */
export async function action({request, context}) {
  const {storefront, session} = context;
  const formData = await request.formData();
  const password = String(formData.get('password') || '');
  const confirmPassword = String(formData.get('confirmPassword') || '');

  if (!password || password.length < 5) {
    return data({error: 'Password must be at least 5 characters long.'}, {status: 400});
  }

  if (password !== confirmPassword) {
    return data({error: 'Passwords do not match.'}, {status: 400});
  }

  const result = await resetCustomerPassword({
    storefront,
    session,
    resetUrl: request.url,
    password,
  });

  if (result.error) {
    return data({error: result.error}, {status: 400});
  }

  const cookieHeader = await session.commit();
  return redirect('/account', {
    headers: {
      'Set-Cookie': cookieHeader,
    },
  });
}

export default function ResetPasswordRoute() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-[#FAFAFA]">
      <div className="w-full max-w-[460px] bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="text-center mb-6">
          <h2 className="text-[22px] font-semibold text-gray-900">Reset Your Password</h2>
          <p className="text-[13px] text-gray-500 mt-1.5">
            Please enter your new password below.
          </p>
        </div>

        {actionData?.error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-[13px]">
            {actionData.error}
          </div>
        )}

        <Form method="post" className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1" htmlFor="reset-password">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="reset-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                placeholder="Enter new password"
                className="w-full h-[44px] pl-3.5 pr-10 border border-gray-300 rounded-[3px] text-[14px] text-gray-900 focus:outline-none focus:border-[#FAA619] focus:ring-1 focus:ring-[#FAA619]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1" htmlFor="confirm-password">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              placeholder="Confirm new password"
              className="w-full h-[44px] px-3.5 border border-gray-300 rounded-[3px] text-[14px] text-gray-900 focus:outline-none focus:border-[#FAA619] focus:ring-1 focus:ring-[#FAA619]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[46px] bg-[#FAA619] hover:bg-[#e09415] text-white font-semibold text-[14px] uppercase tracking-wider rounded-[3px] transition-colors flex items-center justify-center disabled:opacity-60 cursor-pointer mt-4"
          >
            {isSubmitting ? 'Updating...' : 'RESET PASSWORD'}
          </button>
        </Form>
      </div>
    </div>
  );
}
