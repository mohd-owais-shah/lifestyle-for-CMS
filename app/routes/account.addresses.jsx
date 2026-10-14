import {useEffect, useState} from 'react';
import {data, redirect, useFetcher, useOutletContext} from 'react-router';
import {AccountSection} from '~/components/Account/AccountSection';
import {
  CUSTOMER_ADDRESS_CREATE_MUTATION,
  CUSTOMER_ADDRESS_UPDATE_MUTATION,
  CUSTOMER_DEFAULT_ADDRESS_UPDATE_MUTATION,
  CUSTOMER_ADDRESS_DELETE_MUTATION,
} from '~/graphql/customerQueries';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'Address Book | Lifestyle Stores'},
    {name: 'robots', content: 'noindex, nofollow'},
  ];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const token = context.session.get('customerAccessToken');
  if (!token) {
    return redirect('/account/login?return_to=/account/addresses');
  }

  return {};
}

/**
 * @param {Route.ActionArgs}
 */
export async function action({request, context}) {
  const {storefront, session} = context;
  const customerAccessToken = session.get('customerAccessToken');

  try {
    const form = await request.formData();

    const addressId = form.has('addressId')
      ? String(form.get('addressId'))
      : null;
    if (!addressId) {
      throw new Error('You must provide an address id.');
    }

    if (!customerAccessToken) {
      return data(
        {error: {[addressId]: 'Unauthorized'}},
        {
          status: 401,
        },
      );
    }

    // One-click "Set as default" from an address card
    if (form.get('intent') === 'setDefault') {
      try {
        await setDefaultAddress(
          storefront,
          customerAccessToken,
          decodeURIComponent(addressId),
        );
        return {error: null, defaultAddress: true};
      } catch (error) {
        return data(
          {error: {[addressId]: error?.message || String(error)}},
          {status: 400},
        );
      }
    }

    const defaultAddress = form.has('defaultAddress')
      ? String(form.get('defaultAddress')) === 'on'
      : false;
    const address = {};
    const keys = [
      'address1',
      'address2',
      'city',
      'company',
      'country',
      'firstName',
      'lastName',
      'phone',
      'province',
      'zip',
    ];

    for (const key of keys) {
      const value = form.get(key);
      if (typeof value === 'string') {
        address[key] = value;
      }
    }

    switch (request.method) {
      case 'POST': {
        // handle new address creation
        try {
          const {data: resData, errors} = await storefront.mutate(
            CUSTOMER_ADDRESS_CREATE_MUTATION,
            {
              variables: {
                address,
                customerAccessToken,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (resData?.customerAddressCreate?.customerUserErrors?.length) {
            throw new Error(
              resData.customerAddressCreate.customerUserErrors[0].message,
            );
          }

          const createdAddress =
            resData?.customerAddressCreate?.customerAddress;
          if (!createdAddress) {
            throw new Error('Customer address create failed.');
          }

          if (defaultAddress && createdAddress.id) {
            await setDefaultAddress(
              storefront,
              customerAccessToken,
              createdAddress.id,
            );
          }

          return {
            error: null,
            createdAddress,
            defaultAddress,
          };
        } catch (error) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      case 'PUT': {
        // handle address updates
        try {
          const {data: resData, errors} = await storefront.mutate(
            CUSTOMER_ADDRESS_UPDATE_MUTATION,
            {
              variables: {
                address,
                customerAccessToken,
                id: decodeURIComponent(addressId),
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (resData?.customerAddressUpdate?.customerUserErrors?.length) {
            throw new Error(
              resData.customerAddressUpdate.customerUserErrors[0].message,
            );
          }

          if (!resData?.customerAddressUpdate?.customerAddress) {
            throw new Error('Customer address update failed.');
          }

          if (defaultAddress) {
            await setDefaultAddress(
              storefront,
              customerAccessToken,
              decodeURIComponent(addressId),
            );
          }

          return {
            error: null,
            updatedAddress: address,
            defaultAddress,
          };
        } catch (error) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      case 'DELETE': {
        // handles address deletion
        try {
          const {data: resData, errors} = await storefront.mutate(
            CUSTOMER_ADDRESS_DELETE_MUTATION,
            {
              variables: {
                customerAccessToken,
                id: decodeURIComponent(addressId),
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (resData?.customerAddressDelete?.customerUserErrors?.length) {
            throw new Error(
              resData.customerAddressDelete.customerUserErrors[0].message,
            );
          }

          if (!resData?.customerAddressDelete?.deletedCustomerAddressId) {
            throw new Error('Customer address delete failed.');
          }

          return {error: null, deletedAddress: addressId};
        } catch (error) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      default: {
        return data(
          {error: {[addressId]: 'Method not allowed'}},
          {
            status: 405,
          },
        );
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      return data(
        {error: error.message},
        {
          status: 400,
        },
      );
    }
    return data(
      {error},
      {
        status: 400,
      },
    );
  }
}

async function setDefaultAddress(storefront, customerAccessToken, addressId) {
  const {data: response, errors} = await storefront.mutate(
    CUSTOMER_DEFAULT_ADDRESS_UPDATE_MUTATION,
    {
      variables: {customerAccessToken, addressId},
    },
  );

  if (errors?.length) {
    throw new Error(errors[0].message);
  }

  const userErrors =
    response?.customerDefaultAddressUpdate?.customerUserErrors || [];
  if (userErrors.length) {
    throw new Error(userErrors[0].message);
  }
}

export default function Addresses() {
  const {customer} = /** @type {{customer: StorefrontCustomer}} */ (
    useOutletContext()
  );
  const defaultAddressId = customer?.defaultAddress?.id;
  const rawNodes =
    customer?.addresses?.nodes ||
    customer?.addresses?.edges?.map((e) => e.node) ||
    [];

  // Default address first, like the live Lifestyle address book
  const addresses = [...rawNodes].sort(
    (a, b) =>
      Number(b.id === defaultAddressId) - Number(a.id === defaultAddressId),
  );

  return (
    <AccountSection
      title="Address Book"
      description="Manage your shipping and billing addresses."
      icon="address"
    >
      <div className="mx-auto w-full max-w-[620px] flex flex-col gap-8">
        <NewAddressCard isFirst={addresses.length === 0} />

        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            isDefault={address.id === defaultAddressId}
          />
        ))}
      </div>
    </AccountSection>
  );
}

/**
 * @param {{isFirst: boolean}}
 */
function NewAddressCard({isFirst}) {
  const [isOpen, setIsOpen] = useState(false);
  const fetcher = useFetcher();
  const succeeded = fetcher.state === 'idle' && fetcher.data?.createdAddress;

  useEffect(() => {
    if (succeeded) setIsOpen(false);
  }, [succeeded]);

  return (
    <div className="bg-white border border-[#ECEDEB] shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="w-full flex items-center gap-2 px-6 py-4 text-[13px] text-[#FAA619] hover:text-[#E09210] cursor-pointer text-left"
      >
        <PlusCircleIcon />
        Add a new address
      </button>

      {isOpen && (
        <div className="border-t border-[#ECEDEB] px-6 py-5">
          <AddressForm
            fetcher={fetcher}
            method="POST"
            addressId="NEW_ADDRESS_ID"
            address={null}
            isDefault={isFirst}
            submitLabel="Save address"
            onCancel={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

/**
 * @param {{address: StorefrontAddress; isDefault: boolean}}
 */
function AddressCard({address, isDefault}) {
  const [mode, setMode] = useState(
    /** @type {'view' | 'edit' | 'confirmDelete'} */ ('view'),
  );
  const editFetcher = useFetcher();
  const actionFetcher = useFetcher();

  const editSucceeded =
    editFetcher.state === 'idle' && editFetcher.data?.updatedAddress;
  useEffect(() => {
    if (editSucceeded) setMode('view');
  }, [editSucceeded]);

  const isDeleting =
    actionFetcher.state !== 'idle' &&
    actionFetcher.formMethod?.toUpperCase() === 'DELETE';
  const isSettingDefault =
    actionFetcher.state !== 'idle' &&
    actionFetcher.formData?.get('intent') === 'setDefault';
  const actionError = actionFetcher.data?.error?.[address.id];

  // A failed delete shows its error on the card instead of the confirm bar
  useEffect(() => {
    if (actionFetcher.state === 'idle' && actionError) setMode('view');
  }, [actionFetcher.state, actionError]);

  const fullName = [address.firstName, address.lastName]
    .filter(Boolean)
    .join(' ');
  const street = [address.address1, address.address2]
    .filter(Boolean)
    .join(', ');
  const region = [address.city, address.province].filter(Boolean).join(', ');
  const regionLine = [region, address.zip].filter(Boolean).join(' - ');

  return (
    <div
      className={`bg-white border border-[#ECEDEB] shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-opacity ${
        isDeleting ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      {mode === 'edit' ? (
        <div className="px-6 py-5">
          <AddressForm
            fetcher={editFetcher}
            method="PUT"
            addressId={address.id}
            address={address}
            isDefault={isDefault}
            submitLabel="Update address"
            onCancel={() => setMode('view')}
          />
        </div>
      ) : (
        <div className="px-6 sm:px-14 py-10 min-h-[154px] flex flex-col justify-center">
          <p className="flex items-center gap-2 text-[12px] font-semibold text-[#141414]">
            <span>{fullName || 'Saved address'}</span>
            {isDefault && (
              <span className="bg-[#F0414A] text-white text-[9px] font-bold uppercase px-1 py-[1px] leading-tight">
                Default
              </span>
            )}
          </p>
          {street && (
            <p className="mt-1 text-[11px] leading-[18px] text-[#555]">
              {street},
            </p>
          )}
          {regionLine && (
            <p className="text-[11px] leading-[18px] text-[#555] uppercase">
              {regionLine}
            </p>
          )}
          {address.phone && (
            <p className="text-[11px] leading-[18px] text-[#555]">
              Mobile Number: {formatPhone(address.phone)}
            </p>
          )}
          {actionError && (
            <p className="mt-2 text-[11px] text-[#F0414A]" role="alert">
              {actionError}
            </p>
          )}
        </div>
      )}

      {mode === 'confirmDelete' ? (
        <div className="border-t border-[#ECEDEB] flex flex-wrap items-center justify-between gap-3 px-6 py-3">
          <span className="text-[13px] text-[#333]">
            Delete this address?
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('view')}
              className="px-4 py-2 text-[12px] font-semibold uppercase border border-[#DEDFDF] text-[#333] cursor-pointer"
            >
              Cancel
            </button>
            <actionFetcher.Form method="DELETE">
              <input type="hidden" name="addressId" value={address.id} />
              <button
                type="submit"
                disabled={isDeleting}
                className="px-4 py-2 text-[12px] font-semibold uppercase bg-[#F0414A] text-white cursor-pointer"
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </button>
            </actionFetcher.Form>
          </div>
        </div>
      ) : (
        mode === 'view' && (
          <div className="border-t border-[#ECEDEB] grid grid-cols-3 divide-x divide-[#ECEDEB] text-[13px]">
            <button
              type="button"
              onClick={() => setMode('edit')}
              className="flex items-center justify-center gap-2 py-4 text-[#555] hover:text-black cursor-pointer"
            >
              <PencilIcon />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setMode('confirmDelete')}
              className="flex items-center justify-center gap-2 py-4 text-[#555] hover:text-black cursor-pointer"
            >
              <TrashIcon />
              Delete
            </button>
            <actionFetcher.Form method="PUT" className="flex">
              <input type="hidden" name="addressId" value={address.id} />
              <input type="hidden" name="intent" value="setDefault" />
              <button
                type="submit"
                disabled={isDefault || isSettingDefault}
                className="flex-1 flex items-center justify-center gap-2 py-4 text-[#555] hover:text-black cursor-pointer disabled:text-[#C4C4C4] disabled:cursor-default"
              >
                <CheckCircleIcon />
                {isSettingDefault ? 'Saving…' : 'Set as default'}
              </button>
            </actionFetcher.Form>
          </div>
        )
      )}
    </div>
  );
}

/**
 * @param {{
 *   fetcher: ReturnType<typeof useFetcher>;
 *   method: 'POST' | 'PUT';
 *   addressId: string;
 *   address: StorefrontAddressInput | null;
 *   isDefault: boolean;
 *   submitLabel: string;
 *   onCancel: () => void;
 * }}
 */
export function AddressForm({
  fetcher,
  method,
  addressId,
  address,
  isDefault,
  submitLabel,
  onCancel,
}) {
  const isSubmitting = fetcher.state !== 'idle';
  const actionError = fetcher.data?.error;
  const error =
    typeof actionError === 'string' ? actionError : actionError?.[addressId];
  const fieldId = (name) => `${addressId}-${name}`;

  const fields = [
    {name: 'firstName', label: 'First name*', auto: 'given-name', required: true},
    {name: 'lastName', label: 'Last name*', auto: 'family-name', required: true},
    {name: 'phone', label: 'Mobile number', auto: 'tel', type: 'tel'},
    {name: 'company', label: 'Company', auto: 'organization'},
    {name: 'address1', label: 'Address line 1*', auto: 'address-line1', required: true, full: true},
    {name: 'address2', label: 'Address line 2 (Landmark)', auto: 'address-line2', full: true},
    {name: 'zip', label: 'PIN code*', auto: 'postal-code', required: true},
    {name: 'city', label: 'City*', auto: 'address-level2', required: true},
    {name: 'province', label: 'State*', auto: 'address-level1', required: true},
    {name: 'country', label: 'Country*', auto: 'country-name', required: true},
  ];

  return (
    <fetcher.Form method={method} className="account-addresses">
      <fieldset className="!border-0 !p-0 !m-0">
        <input type="hidden" name="addressId" value={addressId} />
        {fields.map((field) => (
          <div key={field.name} className={field.full ? '' : '!col-auto'}>
            <label htmlFor={fieldId(field.name)}>{field.label}</label>
            <input
              id={fieldId(field.name)}
              name={field.name}
              type={field.type || 'text'}
              autoComplete={field.auto}
              required={field.required}
              defaultValue={
                address?.[field.name] ??
                (field.name === 'country' ? 'India' : '')
              }
            />
          </div>
        ))}
        <div>
          <input
            defaultChecked={isDefault}
            id={fieldId('defaultAddress')}
            name="defaultAddress"
            type="checkbox"
          />
          <label htmlFor={fieldId('defaultAddress')}>
            Set as default address
          </label>
        </div>
        {error && (
          <p className="text-[12px] text-[#F0414A]" role="alert">
            {error}
          </p>
        )}
        <div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : submitLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="!bg-white !text-[#333] border !border-[#DEDFDF]"
          >
            Cancel
          </button>
        </div>
      </fieldset>
    </fetcher.Form>
  );
}

/** +917046957063 -> +91 7046957063 */
function formatPhone(phone) {
  const value = String(phone).replace(/\s+/g, '');
  const match = value.match(/^\+91(\d{10})$/);
  if (match) return `+91 ${match[1]}`;
  if (/^\d{10}$/.test(value)) return `+91 ${value}`;
  return phone;
}

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

function PlusCircleIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg {...iconProps}>
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 6h16M9 6V4h6v2M6 6l1 14h10l1-14M10 10v7M14 10v7" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </svg>
  );
}

/**
 * @typedef {{
 *   addressId?: string | null;
 *   createdAddress?: StorefrontAddress;
 *   defaultAddress?: string | null;
 *   deletedAddress?: string | null;
 *   error: string | Record<string, string> | null;
 *   updatedAddress?: StorefrontAddress;
 * }} ActionResponse
 */

/**
 * @typedef {{
 *   id: string;
 *   firstName?: string | null;
 *   lastName?: string | null;
 *   company?: string | null;
 *   address1?: string | null;
 *   address2?: string | null;
 *   city?: string | null;
 *   province?: string | null;
 *   country?: string | null;
 *   countryCodeV2?: string | null;
 *   zip?: string | null;
 *   phone?: string | null;
 *   formatted?: string | null;
 * }} StorefrontAddress
 */
/** @typedef {Partial<StorefrontAddress>} StorefrontAddressInput */
/** @typedef {{id: string, addresses: {nodes: StorefrontAddress[]}, defaultAddress?: {id: string} | null}} StorefrontCustomer */
/** @typedef {import('./+types/account.addresses').Route} Route */
