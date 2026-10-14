import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customerQueries';
import {AccountSection} from '~/components/Account/AccountSection';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => [{title: 'Email Preferences'}];

/**
 * @param {Route.ActionArgs}
 */
export async function action({request, context}) {
  const {storefront, session} = context;
  const customerAccessToken = session.get('customerAccessToken');

  if (!customerAccessToken) {
    return data(
      {error: 'Your session has expired. Please sign in again.'},
      {status: 401},
    );
  }

  if (request.method !== 'POST') {
    return data({error: 'Method not allowed.'}, {status: 405});
  }

  try {
    const form = await request.formData();
    const {customerUpdate} = await storefront.mutate(CUSTOMER_UPDATE_MUTATION, {
      variables: {
        customerAccessToken,
        customer: {acceptsMarketing: form.get('acceptsMarketing') === 'on'},
      },
    });

    const userError = customerUpdate?.customerUserErrors?.[0];
    if (userError) {
      throw new Error(userError.message);
    }

    if (!customerUpdate?.customer) {
      throw new Error('Email preferences could not be updated.');
    }

    return data({customer: customerUpdate.customer});
  } catch (error) {
    console.error('Email preference update failed:', error);
    return data(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Email preferences could not be updated.',
      },
      {status: 400},
    );
  }
}

export default function AccountPreferences() {
  const account =
    /** @type {{customer?: {acceptsMarketing?: boolean | null}}} */ (
      useOutletContext()
    );
  const actionData =
    /** @type {{error?: string, customer?: {acceptsMarketing?: boolean | null}}} */ (
      useActionData()
    );
  const {state} = useNavigation();
  const customer = actionData?.customer ?? account?.customer;

  return (
    <AccountSection
      title="Email Preferences"
      description="Choose whether you would like to receive news and offers by email."
      icon="email"
    >
      <section className="account-preferences">
        <Form method="POST" className="account-preferences-form">
          <div className="account-preferences-option">
            <input
              id="acceptsMarketing"
              type="checkbox"
              name="acceptsMarketing"
              defaultChecked={customer?.acceptsMarketing ?? false}
            />
            <span>
              <label htmlFor="acceptsMarketing">
                <strong>Email news and offers</strong>
              </label>
              <span>
                Receive product updates, promotions, and the latest news from
                Landmark Group.
              </span>
            </span>
          </div>

          {actionData?.error && (
            <p className="account-form-message account-form-error" role="alert">
              {actionData.error}
            </p>
          )}
          {actionData?.customer && (
            <p
              className="account-form-message account-form-success"
              role="status"
            >
              Your email preferences have been saved.
            </p>
          )}

          <button type="submit" disabled={state !== 'idle'}>
            {state !== 'idle' ? 'Saving...' : 'Save preferences'}
          </button>
        </Form>
      </section>
    </AccountSection>
  );
}

/** @typedef {import('./+types/account.preferences').Route} Route */
