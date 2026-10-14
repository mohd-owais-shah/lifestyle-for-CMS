import {Link, redirect, useLoaderData} from 'react-router';
import {Money, Image} from '@shopify/hydrogen';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `Order ${data?.order?.name}`}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({params, context}) {
  const {customerAccount, session, storefront} = context;
  if (!params.id) {
    return redirect('/account/orders');
  }

  // Customers signed in with a Storefront API access token (our login flow)
  const customerAccessToken = session.get('customerAccessToken');
  if (customerAccessToken) {
    try {
      return await loadStorefrontOrder({
        storefront,
        customerAccessToken,
        orderId: atob(params.id),
      });
    } catch {
      return redirect('/account/orders');
    }
  }

  try {
    const orderId = atob(params.id);
    const {data, errors} = await customerAccount.query(CUSTOMER_ORDER_QUERY, {
      variables: {
        orderId,
        language: customerAccount.i18n.language,
      },
    });

    if (errors?.length || !data?.order) {
      return redirect('/account/orders');
    }

    const {order} = data;

    // Extract line items directly from nodes array
    const lineItems = order.lineItems.nodes;

    // Extract discount applications directly from nodes array
    const discountApplications = order.discountApplications.nodes;

    // Get fulfillment status from first fulfillment node
    const fulfillmentStatus = order.fulfillments.nodes[0]?.status ?? 'N/A';

    // Get first discount value with proper type checking
    const firstDiscount = discountApplications[0]?.value;

    // Type guard for MoneyV2 discount
    const discountValue =
      firstDiscount?.__typename === 'MoneyV2' ? firstDiscount : null;

    // Type guard for percentage discount
    const discountPercentage =
      firstDiscount?.__typename === 'PricingPercentageValue'
        ? firstDiscount.percentage
        : null;

    return {
      order,
      lineItems,
      discountValue,
      discountPercentage,
      fulfillmentStatus,
    };
  } catch {
    return redirect('/account/orders');
  }
}

/**
 * Fetch one order through the Storefront API and map it to the shape the
 * page already renders (Customer Account API field names).
 */
async function loadStorefrontOrder({storefront, customerAccessToken, orderId}) {
  const {customer, order} = await storefront.query(STOREFRONT_ORDER_QUERY, {
    variables: {orderId, customerAccessToken},
    cache: storefront.CacheNone(),
  });

  // node(id) is not customer-scoped, so confirm the order is this customer's
  const ownsOrder = customer?.orders?.nodes?.some((o) => o.id === orderId);
  if (!order?.id || !ownsOrder) {
    return redirect('/account/orders');
  }

  const lineItems = (order.lineItems?.nodes || []).map((line, index) => {
    const unitPrice = line.variant?.price || {
      amount: String(
        parseFloat(line.originalTotalPrice.amount) / (line.quantity || 1),
      ),
      currencyCode: line.originalTotalPrice.currencyCode,
    };
    const discount =
      parseFloat(line.originalTotalPrice.amount) -
      parseFloat(line.discountedTotalPrice.amount);

    return {
      id: line.variant?.id || `${order.id}-${index}`,
      title: line.title,
      variantTitle: line.variant?.title,
      quantity: line.quantity,
      image: line.variant?.image,
      price: unitPrice,
      totalDiscount: {
        amount: String(Math.max(0, discount)),
        currencyCode: line.originalTotalPrice.currencyCode,
      },
    };
  });

  const discountApplications = order.discountApplications?.nodes || [];
  const firstDiscount = discountApplications[0]?.value;

  return {
    order: {
      ...order,
      subtotal: order.subtotalPrice,
      statusPageUrl: order.statusUrl,
    },
    lineItems,
    discountValue:
      firstDiscount?.__typename === 'MoneyV2' ? firstDiscount : null,
    discountPercentage:
      firstDiscount?.__typename === 'PricingPercentageValue'
        ? firstDiscount.percentage
        : null,
    fulfillmentStatus: order.fulfillmentStatus ?? 'N/A',
  };
}

const STOREFRONT_ORDER_QUERY = `#graphql
  query StorefrontCustomerOrder($orderId: ID!, $customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 250, reverse: true) {
        nodes {
          id
        }
      }
    }
    order: node(id: $orderId) {
      ... on Order {
        id
        name
        processedAt
        statusUrl
        fulfillmentStatus
        subtotalPrice {
          amount
          currencyCode
        }
        totalTax {
          amount
          currencyCode
        }
        totalPrice {
          amount
          currencyCode
        }
        shippingAddress {
          name
          formatted
          formattedArea
        }
        discountApplications(first: 10) {
          nodes {
            value {
              __typename
              ... on MoneyV2 {
                amount
                currencyCode
              }
              ... on PricingPercentageValue {
                percentage
              }
            }
          }
        }
        lineItems(first: 100) {
          nodes {
            title
            quantity
            originalTotalPrice {
              amount
              currencyCode
            }
            discountedTotalPrice {
              amount
              currencyCode
            }
            variant {
              id
              title
              price {
                amount
                currencyCode
              }
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  }
`;

/** "PARTIALLY_FULFILLED" -> "Partially fulfilled"; "N/A" / empty -> null */
function statusLabel(status) {
  if (!status || status === 'N/A') return null;
  const text = String(status).toLowerCase().replace(/_/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const STATUS_STYLES = {
  fulfilled: 'bg-green-50 text-green-700',
  success: 'bg-green-50 text-green-700',
  delivered: 'bg-green-50 text-green-700',
  'partially fulfilled': 'bg-amber-50 text-amber-700',
  'in progress': 'bg-amber-50 text-amber-700',
  cancelled: 'bg-red-50 text-red-700',
  failure: 'bg-red-50 text-red-700',
};

/** Shipping address lines – `formatted` is a list of lines in both APIs. */
function addressLines(address) {
  if (!address) return [];
  const lines = Array.isArray(address.formatted)
    ? address.formatted
    : address.formatted
      ? [address.formatted]
      : [];
  // formattedArea (city, region, country) is already part of `formatted`
  const all = [
    address.name,
    ...(lines.length ? lines : [address.formattedArea]),
  ].filter(Boolean);
  return all.filter((line, i) => all.indexOf(line) === i);
}

const money = (amount, currencyCode) => ({
  amount: String(amount),
  currencyCode,
});

export default function OrderRoute() {
  /** @type {LoaderReturnData} */
  const {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  } = useLoaderData();

  const status = statusLabel(fulfillmentStatus);
  const statusClass =
    STATUS_STYLES[status?.toLowerCase()] || 'bg-blue-50 text-blue-700';
  const address = addressLines(order?.shippingAddress);
  const hasDiscount =
    Boolean(discountPercentage) || parseFloat(discountValue?.amount) > 0;
  const placedOn = new Date(order.processedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="w-full max-w-[1100px] mx-auto">
      <Link
        to="/account/orders"
        className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors mb-4"
      >
        ← Back to orders
      </Link>

      {/* Order header */}
      <header className="border border-gray-200 bg-white p-4 sm:p-5 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 break-all">
              Order {order.name}
            </h1>
            {status && (
              <span
                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${statusClass}`}
              >
                {status}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Placed on {placedOn}</p>
          {order.confirmationNumber && (
            <p className="text-xs text-gray-500 mt-0.5">
              Confirmation: {order.confirmationNumber}
            </p>
          )}
        </div>
        {order.statusPageUrl && (
          <a
            target="_blank"
            href={order.statusPageUrl}
            rel="noreferrer"
            className="inline-flex items-center justify-center w-full sm:w-auto h-10 px-5 bg-gray-900 text-white text-xs font-semibold hover:bg-black transition-colors"
          >
            Track order →
          </a>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
        {/* Items */}
        <section className="border border-gray-200 bg-white min-w-0">
          <h2 className="text-sm font-semibold text-gray-900 px-4 sm:px-5 py-3 border-b border-gray-100">
            Items ({lineItems.length})
          </h2>
          <ul className="divide-y divide-gray-100">
            {lineItems.map((lineItem, lineItemIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <OrderLineItem key={lineItemIndex} lineItem={lineItem} />
            ))}
          </ul>
        </section>

        <aside className="flex flex-col gap-4 min-w-0">
          {/* Summary */}
          <section className="border border-gray-200 bg-white p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Order summary
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">Subtotal</dt>
                <dd className="text-gray-900">
                  {order.subtotal && <Money data={order.subtotal} />}
                </dd>
              </div>
              {hasDiscount && (
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-600">Discount</dt>
                  <dd className="text-green-700">
                    {discountPercentage ? (
                      `-${discountPercentage}%`
                    ) : (
                      <span className="inline-flex">
                        -<Money data={discountValue} as="span" />
                      </span>
                    )}
                  </dd>
                </div>
              )}
              {order.totalTax && (
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-600">Tax</dt>
                  <dd className="text-gray-900">
                    <Money data={order.totalTax} />
                  </dd>
                </div>
              )}
              <div className="flex justify-between gap-4 border-t border-gray-100 pt-3 mt-1">
                <dt className="font-semibold text-gray-900">Total</dt>
                <dd className="font-semibold text-gray-900">
                  <Money data={order.totalPrice} />
                </dd>
              </div>
            </dl>
          </section>

          {/* Shipping address */}
          <section className="border border-gray-200 bg-white p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Shipping address
            </h2>
            {address.length ? (
              <address className="not-italic text-sm text-gray-700 leading-relaxed break-words">
                {address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            ) : (
              <p className="text-sm text-gray-500">No shipping address</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

/**
 * One product line: image, name/variant, "qty × unit price", line total.
 * @param {{lineItem: OrderLineItemFullFragment}}
 */
function OrderLineItem({lineItem}) {
  const currency = lineItem.price?.currencyCode;
  const unit = parseFloat(lineItem.price?.amount) || 0;
  const discount = parseFloat(lineItem.totalDiscount?.amount) || 0;
  const lineTotal = Math.max(0, unit * (lineItem.quantity || 0) - discount);

  return (
    <li className="flex gap-3 sm:gap-4 px-4 sm:px-5 py-4">
      <div className="w-16 h-20 sm:w-20 sm:h-24 shrink-0 bg-gray-50 overflow-hidden">
        {lineItem?.image && (
          <Image
            data={lineItem.image}
            width={80}
            height={96}
            sizes="80px"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 line-clamp-2">
            {lineItem.title}
          </p>
          {lineItem.variantTitle &&
            lineItem.variantTitle !== 'Default Title' && (
              <p className="text-xs text-gray-500 mt-0.5">
                {lineItem.variantTitle}
              </p>
            )}
          <p className="text-xs text-gray-500 mt-1">
            Qty {lineItem.quantity} × <Money data={lineItem.price} as="span" />
          </p>
        </div>
        <div className="sm:text-right shrink-0">
          {currency && (
            <Money
              data={money(lineTotal, currency)}
              className="text-sm font-semibold text-gray-900"
            />
          )}
          {discount > 0 && currency && (
            <p className="text-[11px] text-green-700">
              Saved <Money data={money(discount, currency)} as="span" />
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

/** @typedef {import('./+types/account.orders.$id').Route} Route */
/** @typedef {import('customer-accountapi.generated').OrderLineItemFullFragment} OrderLineItemFullFragment */
/** @typedef {import('customer-accountapi.generated').OrderQuery} OrderQuery */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
