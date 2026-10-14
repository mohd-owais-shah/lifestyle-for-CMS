import {
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from 'react-router';
import {useRef, useState} from 'react';
import {
  Money,
  getPaginationVariables,
  flattenConnection,
} from '@shopify/hydrogen';
import {
  buildOrderSearchQuery,
  parseOrderFilters,
  ORDER_FILTER_FIELDS,
} from '~/lib/orderFilters';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ParticipatingBrands} from '~/components/Account/ParticipatingBrands';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Orders'}];
};

/**
 * @param {Route.LoaderArgs}
 */
export const STOREFRONT_ORDERS_QUERY = `#graphql
  query getCustomerOrders($customerAccessToken: String!, $first: Int) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: $first) {
        nodes {
          id
          name
          orderNumber
          processedAt
          financialStatus
          fulfillmentStatus
          totalPrice {
            amount
            currencyCode
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({request, context}) {
  const {customerAccount, session, storefront} = context;
  const customerAccessToken = session.get('customerAccessToken');
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const url = new URL(request.url);
  const filters = parseOrderFilters(url.searchParams);
  const query = buildOrderSearchQuery(filters);

  // If customer is logged in via Storefront API token
  if (customerAccessToken && storefront) {
    try {
      const response = await storefront.query(STOREFRONT_ORDERS_QUERY, {
        variables: {
          customerAccessToken,
          first: 20,
        },
        cache: storefront.CacheNone(),
      });

      if (response?.customer?.orders) {
        const orders = response.customer.orders;
        const normalizedNodes = (orders.nodes || []).map((order) => ({
          ...order,
          number: order.orderNumber || order.name || '',
          fulfillments: {
            nodes: order.fulfillmentStatus
              ? [{status: order.fulfillmentStatus}]
              : [],
          },
        }));

        return {
          customer: {
            orders: {
              ...orders,
              nodes: normalizedNodes,
            },
          },
          filters,
        };
      }
    } catch (e) {
      console.error('Failed to fetch storefront orders:', e);
    }
  }

  // Fallback to customerAccount (OAuth)
  if (customerAccount?.query) {
    try {
      const {data, errors} = await customerAccount.query(
        CUSTOMER_ORDERS_QUERY,
        {
          variables: {
            ...paginationVariables,
            query,
            language: customerAccount.i18n?.language,
          },
        },
      );

      if (!errors?.length && data?.customer) {
        return {customer: data.customer, filters};
      }
    } catch {
      // Ignore OAuth errors
    }
  }

  return {
    customer: {
      orders: {
        nodes: [],
        pageInfo: {hasNextPage: false, hasPreviousPage: false},
      },
    },
    filters,
  };
}

const TIME_FILTERS = [
  {id: '1m', label: 'Last 1 Month', months: 1},
  {id: '3m', label: 'Last 3 Months', months: 3},
  {id: '6m', label: 'Last 6 Months', months: 6},
  {id: '12m', label: 'Last 12 Months', months: 12},
  {id: 'all', label: 'All Orders'},
];

/**
 * Orders for the selected tab and time filter. Instore orders are not
 * available online yet, so that tab is always empty.
 */
function filterOrders(orders, orderType, timeFilter) {
  if (orderType === 'instore') return {...orders, nodes: []};
  const months = TIME_FILTERS.find((f) => f.id === timeFilter)?.months;
  if (!months) return orders;
  const since = new Date();
  since.setMonth(since.getMonth() - months);
  return {
    ...orders,
    nodes: (orders?.nodes || []).filter(
      (order) => new Date(order.processedAt) >= since,
    ),
  };
}

export default function Orders() {
  /** @type {LoaderReturnData} */
  const {customer, filters} = useLoaderData();
  const [orderType, setOrderType] = useState('online');
  const [timeFilter, setTimeFilter] = useState('all');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const orders = filterOrders(customer.orders, orderType, timeFilter);
  const timeLabel = TIME_FILTERS.find((f) => f.id === timeFilter)?.label;

  return (
    <div className="w-full max-w-[1100px] mx-auto">
      <h1 className="hidden md:block text-base font-semibold text-gray-900 mb-6">
        Order History
      </h1>

      {/* Mobile: Online Orders / Instore Orders tabs, full width (live site) */}
      <div
        className="md:hidden -mx-4 -mt-5 grid grid-cols-2 text-center text-[15px]"
        role="tablist"
        aria-label="Type of order"
      >
        {[
          {id: 'online', label: 'Online Orders'},
          {id: 'instore', label: 'Instore Orders'},
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={orderType === tab.id}
            onClick={() => setOrderType(tab.id)}
            className={`h-[52px] cursor-pointer transition-colors ${
              orderType === tab.id
                ? 'bg-white text-black font-medium'
                : 'bg-[#EEEEEE] text-[#333333]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 lg:gap-12 items-start">
        {/* Left Column: Filters Sidebar (desktop) */}
        <aside className="hidden md:block w-full">
          <h2 className="text-sm font-semibold text-gray-900 mb-3.5">Filters</h2>

          {/* Type of order */}
          <div className="mb-6">
            <span className="block text-xs font-semibold text-gray-700 mb-2.5">
              Type of order
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOrderType('online')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  orderType === 'online'
                    ? 'bg-[#1a1a1a] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Online
              </button>
              <button
                type="button"
                onClick={() => setOrderType('instore')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  orderType === 'instore'
                    ? 'bg-[#1a1a1a] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Instore
              </button>
            </div>
          </div>

          {/* Time Filter */}
          <div>
            <span className="block text-xs font-semibold text-gray-700 mb-2.5">
              Time Filter
            </span>
            <TimeFilterOptions value={timeFilter} onChange={setTimeFilter} />
          </div>
        </aside>

        {/* Right Column: Orders Content */}
        <section className="w-full min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 mt-6 mb-2 md:mt-0 md:mb-4">
            <h2 className="text-[18px] md:text-sm font-medium md:font-semibold text-gray-900">
              {timeLabel}
            </h2>
            <div className="hidden md:block">
              <OrderSearchForm currentFilters={filters} />
            </div>
          </div>

          <OrdersTable orders={orders} filters={filters} />
        </section>
      </div>

      {/* Participating Brands footer */}
      <ParticipatingBrands />

      {/* Mobile: floating Filters button + bottom sheet (live site) */}
      <button
        type="button"
        onClick={() => setIsFilterSheetOpen(true)}
        className="md:hidden fixed right-4 bottom-[max(20px,env(safe-area-inset-bottom))] z-40 h-[46px] pl-5 pr-4 rounded-full bg-[#5C5C5C] text-white text-[15px] font-medium flex items-center gap-3 shadow-[0_4px_12px_rgba(0,0,0,0.25)] cursor-pointer"
      >
        Filters
        <span className="relative">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
            <circle cx="16" cy="6" r="2" />
            <circle cx="10" cy="12" r="2" />
            <circle cx="18" cy="18" r="2" />
          </svg>
          <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-[#FAA619]" />
        </span>
      </button>

      {isFilterSheetOpen && (
        <OrderFilterSheet
          value={timeFilter}
          onApply={(id) => {
            setTimeFilter(id);
            setIsFilterSheetOpen(false);
          }}
          onClose={() => setIsFilterSheetOpen(false)}
        />
      )}
    </div>
  );
}

/**
 * @param {{value: string, onChange: (id: string) => void}}
 */
function TimeFilterOptions({value, onChange}) {
  return (
    <div className="flex flex-col gap-2 items-start">
      {TIME_FILTERS.map((filter) => {
        const isActive = value === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(filter.id)}
            className={`text-xs px-3.5 py-1.5 rounded-full transition-colors cursor-pointer ${
              isActive
                ? 'bg-[#FAA619] text-white font-medium shadow-xs'
                : 'border border-gray-200 text-gray-600 font-normal hover:border-gray-400 bg-white'
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Mobile bottom sheet with the time filters; applies on "Apply".
 * @param {{value: string, onApply: (id: string) => void, onClose: () => void}}
 */
function OrderFilterSheet({value, onApply, onClose}) {
  const [selected, setSelected] = useState(value);

  return (
    <div
      className="md:hidden fixed inset-0 z-[9999] flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Filter orders"
    >
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 cursor-default"
      />
      <div className="relative bg-white rounded-t-2xl px-4 pt-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-semibold text-gray-900">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="p-1 text-gray-500 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <span className="block text-[13px] font-semibold text-gray-700 mb-3">
          Time Filter
        </span>
        <div className="flex flex-col">
          {TIME_FILTERS.map((filter) => (
            <label
              key={filter.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 text-[14px] text-gray-900 cursor-pointer"
            >
              {filter.label}
              <input
                type="radio"
                name="order-time-filter"
                value={filter.id}
                checked={selected === filter.id}
                onChange={() => setSelected(filter.id)}
                className="w-4 h-4 accent-[#FAA619]"
              />
            </label>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onApply(selected)}
          className="mt-5 w-full h-12 rounded-md bg-[#FAA619] text-white text-[14px] font-bold uppercase tracking-wider cursor-pointer"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   orders: CustomerOrdersFragment['orders'];
 *   filters: OrderFilterParams;
 * }}
 */
function OrdersTable({orders, filters}) {
  const hasFilters = !!(filters.name || filters.confirmationNumber);

  return (
    <div className="w-full" aria-live="polite">
      {orders?.nodes?.length ? (
        <PaginatedResourceSection connection={orders}>
          {({node: order}) => <OrderItem key={order.id} order={order} />}
        </PaginatedResourceSection>
      ) : (
        <EmptyOrders hasFilters={hasFilters} />
      )}
    </div>
  );
}

/**
 * @param {{hasFilters?: boolean}}
 */
function EmptyOrders({hasFilters = false}) {
  return (
    <div className="flex flex-col items-center justify-center pt-10 pb-0 md:py-12 text-center -mx-4 md:mx-0 border-b border-gray-200 md:border-0">
      {/* Vector illustration matching the live site */}
      <div className="w-full max-w-[300px] md:w-64 h-[200px] md:h-44 flex items-center justify-center mb-2">
        <svg
          viewBox="0 0 240 160"
          className="w-full h-full select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground shadow */}
          <ellipse cx="120" cy="142" rx="100" ry="12" fill="#F3F4F6" />
          
          {/* Subtle soft hills/bushes behind */}
          <path
            d="M50 142 C58 114, 85 110, 106 128 C124 110, 158 114, 186 142 Z"
            fill="#E5E7EB"
            opacity="0.5"
          />
          <path
            d="M142 74 C148 64, 162 64, 170 72 C178 66, 192 68, 194 78 C200 82, 198 94, 188 94 L142 94 Z"
            fill="#F3F4F6"
          />

          {/* Left Tree */}
          <path
            d="M84 140 L84 105 M84 122 L76 112 M84 126 L92 115 M84 114 L79 104 M84 117 L89 108"
            stroke="#9CA3AF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="84" cy="98" r="14" fill="#E5E7EB" />
          <circle cx="73" cy="110" r="10" fill="#E5E7EB" />
          <circle cx="95" cy="110" r="10" fill="#E5E7EB" />
          <path
            d="M84 140 L84 104"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Right Small Bush */}
          <path
            d="M168 140 L168 122 M168 130 L162 125 M168 132 L174 126"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="168" cy="118" r="9" fill="#E5E7EB" />

          {/* Center Character */}
          {/* Head & Hair */}
          <circle cx="120" cy="74" r="5" fill="#FBBF24" />
          <circle cx="120" cy="72" r="4.5" fill="#4B5563" />
          {/* Neck */}
          <path d="M120 78 L120 80" stroke="#FBBF24" strokeWidth="1.5" />
          {/* Yellow/Amber Shirt */}
          <path
            d="M115 80 L125 80 L127 100 L113 100 Z"
            fill="#FAA619"
          />
          {/* Arms slightly raised */}
          <path
            d="M115 82 L106 90 M125 82 L134 90"
            stroke="#FAA619"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="106" cy="90" r="1.5" fill="#FBBF24" />
          <circle cx="134" cy="90" r="1.5" fill="#FBBF24" />
          {/* Dark Trousers */}
          <path
            d="M114 100 L118 100 L117 122 L114 122 Z"
            fill="#1F2937"
          />
          <path
            d="M122 100 L126 100 L126 122 L123 122 Z"
            fill="#1F2937"
          />
          {/* Shoes */}
          <ellipse cx="115" cy="122.5" rx="2.5" ry="1" fill="#111827" />
          <ellipse cx="125" cy="122.5" rx="2.5" ry="1" fill="#111827" />
        </svg>
      </div>

      <p className="text-[20px] md:text-sm font-normal md:font-medium text-gray-900 mt-2 mb-1 md:mb-0">
        No orders found
      </p>

      {hasFilters && (
        <Link
          to="/account/orders"
          className="mt-3 text-xs font-semibold text-[#FAA619] hover:underline"
        >
          Clear filters →
        </Link>
      )}
    </div>
  );
}

/**
 * @param {{
 *   currentFilters: OrderFilterParams;
 * }}
 */
function OrderSearchForm({currentFilters}) {
  const [, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSearching =
    navigation.state !== 'idle' &&
    navigation.location?.pathname?.includes('orders');
  const formRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const name = formData.get(ORDER_FILTER_FIELDS.NAME)?.toString().trim();
    const confirmationNumber = formData
      .get(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER)
      ?.toString()
      .trim();

    if (name) params.set(ORDER_FILTER_FIELDS.NAME, name);
    if (confirmationNumber)
      params.set(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER, confirmationNumber);

    setSearchParams(params);
  };

  const hasFilters = currentFilters.name || currentFilters.confirmationNumber;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex items-center gap-2"
      aria-label="Search orders"
    >
      <input
        type="search"
        name={ORDER_FILTER_FIELDS.NAME}
        placeholder="Search Order #"
        aria-label="Order number"
        defaultValue={currentFilters.name || ''}
        className="h-8 border border-gray-300 bg-white px-2.5 text-xs text-gray-800 outline-none placeholder:text-gray-400 focus:border-gray-500 rounded-none w-36 sm:w-44"
      />
      <button
        type="submit"
        disabled={isSearching}
        className="h-8 px-3 bg-gray-900 text-white text-xs font-medium hover:bg-black transition-colors disabled:opacity-50"
      >
        {isSearching ? '...' : 'Search'}
      </button>
      {hasFilters && (
        <button
          type="button"
          disabled={isSearching}
          onClick={() => {
            setSearchParams(new URLSearchParams());
            formRef.current?.reset();
          }}
          className="h-8 px-2.5 text-xs text-gray-500 hover:text-gray-900 transition-colors"
        >
          Clear
        </button>
      )}
    </form>
  );
}

/**
 * @param {{order: OrderItemFragment}}
 */
function OrderItem({order}) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;

  return (
    <article className="border border-gray-200 bg-white p-4 sm:p-5 rounded-none mb-3 hover:border-gray-400 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-3">
        <div>
          <Link
            to={`/account/orders/${btoa(order.id)}`}
            className="text-sm font-semibold text-gray-900 hover:text-[#FAA619] transition-colors"
          >
            Order #{order.number}
          </Link>
          <p className="text-xs text-gray-500 mt-0.5">
            Placed on {new Date(order.processedAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {fulfillmentStatus && (
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {fulfillmentStatus}
            </span>
          )}
          {order.financialStatus && (
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
              {order.financialStatus}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] text-gray-500 block">Total Amount</span>
          <span className="text-sm font-semibold text-gray-900">
            <Money data={order.totalPrice} />
          </span>
        </div>

        <Link
          to={`/account/orders/${btoa(order.id)}`}
          className="text-xs font-semibold text-[#FAA619] hover:text-[#e09212] transition-colors"
        >
          View Order Details →
        </Link>
      </div>
    </article>
  );
}

/**
 * @typedef {{
 *   customer: CustomerOrdersFragment;
 *   filters: OrderFilterParams;
 * }} OrdersLoaderData
 */

/** @typedef {import('./+types/account.orders._index').Route} Route */
/** @typedef {import('~/lib/orderFilters').OrderFilterParams} OrderFilterParams */
/** @typedef {import('customer-accountapi.generated').CustomerOrdersFragment} CustomerOrdersFragment */
/** @typedef {import('customer-accountapi.generated').OrderItemFragment} OrderItemFragment */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
