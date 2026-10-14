import '@shopify/ui-extensions/preact';
import {render} from 'preact';

export default function extension() {
  render(<Extension />, document.body);
}

function Extension() {
  const storefrontUrl = String(
    shopify.settings.value.storefront_url || '',
  ).replace(/\/+$/, '');
  const orderId = shopify.orderConfirmation.value?.order?.id;

  if (!storefrontUrl || !orderId) return null;

  // gid://shopify/OrderIdentity/123 -> 123 (Hydrogen rebuilds the Order GID)
  const numericId = String(orderId).split('/').pop();
  const orderUrl = `${storefrontUrl}/order-confirmed?order_id=${encodeURIComponent(numericId)}`;

  return (
    <s-banner heading="Your order is placed" tone="success">
      <s-stack gap="base">
        <s-text>
          Track your order, see delivery updates and manage returns in your
          account.
        </s-text>
        <s-button href={orderUrl} variant="primary">
          View my order
        </s-button>
      </s-stack>
    </s-banner>
  );
}
