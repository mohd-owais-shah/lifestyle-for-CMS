import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customerQueries';
import {
  data,
  Form,
  redirect,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router';
import {ParticipatingBrands} from '~/components/Account/ParticipatingBrands';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Profile'}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const {session} = context;
  const token = session.get('customerAccessToken');

  if (!token) {
    return redirect('/account/login');
  }

  return {};
}

/**
 * @param {Route.ActionArgs}
 */
export async function action({request, context}) {
  const {storefront, session} = context;
  const customerAccessToken = session.get('customerAccessToken');

  if (!customerAccessToken) {
    return redirect('/account/login');
  }

  if (request.method !== 'PUT' && request.method !== 'POST') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  try {
    const customer = {};
    const validInputKeys = ['firstName', 'lastName', 'email', 'phone'];
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key] = value;
      }
    }

    const {customerUpdate} = await storefront.mutate(CUSTOMER_UPDATE_MUTATION, {
      variables: {
        customerAccessToken,
        customer,
      },
    });

    const userErrors = customerUpdate?.customerUserErrors || [];
    if (userErrors.length > 0) {
      throw new Error(userErrors[0].message);
    }

    if (!customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    if (customerUpdate?.customerAccessToken?.accessToken) {
      session.set(
        'customerAccessToken',
        customerUpdate.customerAccessToken.accessToken,
      );
      session.set(
        'customerAccessTokenExpiresAt',
        customerUpdate.customerAccessToken.expiresAt,
      );
    }

    return data(
      {
        error: null,
        customer: customerUpdate.customer,
      },
      {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      },
    );
  } catch (error) {
    return data(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Customer profile update failed.',
        customer: null,
      },
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  const account =
    /** @type {{customer?: {firstName?: string | null, lastName?: string | null, email?: string | null, phone?: string | null}}} */ (
      useOutletContext()
    );
  const {state} = useNavigation();
  const actionData =
    /** @type {{error?: string | null, customer?: {firstName?: string | null, lastName?: string | null, email?: string | null, phone?: string | null} | null}} */ (
      useActionData()
    );
  const customer = actionData?.customer ?? account?.customer;

  return (
    <div className="w-full max-w-[520px] mx-auto">
      <h1 className="text-sm font-semibold text-gray-900 mb-6">
        Personal Details
      </h1>

      <Form method="POST" className="w-full">
        {/* First Name + Last Name row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label
              className="block text-xs font-normal text-gray-700 mb-1"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              className="h-10 w-full border border-gray-300 bg-white px-3 text-xs sm:text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-gray-500 rounded-none transition-colors"
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="First Name"
              defaultValue={customer?.firstName ?? ''}
              required
            />
          </div>
          <div>
            <label
              className="block text-xs font-normal text-gray-700 mb-1"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              className="h-10 w-full border border-gray-300 bg-white px-3 text-xs sm:text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-gray-500 rounded-none transition-colors"
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Last Name"
              defaultValue={customer?.lastName ?? ''}
              required
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div className="mb-4">
          <label
            className="block text-xs font-normal text-gray-700 mb-1"
            htmlFor="phone"
          >
            Mobile Number
          </label>
          <div className="flex">
            <span className="flex items-center justify-center border border-r-0 border-gray-300 bg-white px-3 text-xs sm:text-sm text-gray-700 h-10 w-14 shrink-0 font-normal">
              +91
            </span>
            <input
              className="h-10 flex-1 border border-gray-300 bg-white px-3 text-xs sm:text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-gray-500 rounded-none transition-colors"
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Mobile Number"
              defaultValue={customer?.phone ?? ''}
            />
          </div>
        </div>

        {/* Email ID */}
        <div className="mb-4">
          <label
            className="block text-xs font-normal text-gray-700 mb-1"
            htmlFor="email"
          >
            Email Id
          </label>
          <input
            className="h-10 w-full border border-gray-300 bg-white px-3 text-xs sm:text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-gray-500 rounded-none transition-colors"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email ID"
            defaultValue={customer?.email ?? ''}
            required
          />
        </div>

        {/* Birthday */}
        <div className="mb-4">
          <label className="block text-xs font-normal text-gray-700 mb-1">
            Birthday (dd/mm/yyyy)
          </label>
          <input
            className="h-10 w-full border border-gray-300 bg-white px-3 text-xs sm:text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-gray-500 rounded-none transition-colors"
            type="text"
            placeholder="Enter Birthday"
          />
        </div>

        {/* Gender */}
        <div className="mb-6">
          <label className="block text-xs font-normal text-gray-700 mb-2">
            Gender
          </label>
          <div className="flex items-center gap-10">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                name="gender"
                value="male"
                defaultChecked
                className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-0 focus:ring-offset-0 accent-gray-900 cursor-pointer"
              />
              <span className="text-xs sm:text-sm text-gray-700 font-normal">Male</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                name="gender"
                value="female"
                className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-0 focus:ring-offset-0 accent-gray-900 cursor-pointer"
              />
              <span className="text-xs sm:text-sm text-gray-700 font-normal">Female</span>
            </label>
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        {/* Error / Success messages */}
        {actionData?.error && (
          <p
            className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
            role="alert"
          >
            {actionData.error}
          </p>
        )}
        {actionData && !actionData.error && (
          <p
            className="mb-4 border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700"
            role="status"
          >
            Your profile has been updated successfully.
          </p>
        )}

        {/* Update Profile button */}
        <button
          type="submit"
          disabled={state !== 'idle'}
          className="w-full h-11 bg-[#FAA619] text-white text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-[#e09212] transition-colors disabled:opacity-60 disabled:cursor-wait rounded-xs"
        >
          {state !== 'idle' ? 'UPDATING...' : 'UPDATE PROFILE'}
        </button>
      </Form>

      {/* Participating Brands footer */}
      <ParticipatingBrands />
    </div>
  );
}
