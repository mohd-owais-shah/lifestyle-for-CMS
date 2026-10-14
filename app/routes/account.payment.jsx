import {Link} from 'react-router';
import {AccountSection} from '~/components/Account/AccountSection';

export const meta = () => [{title: 'Payment'}];

export default function AccountPayment() {
  return (
    <AccountSection
      title="Payment"
      description="Payment options are securely managed during checkout."
      icon="payment"
    >
      <div className="account-feature-summary">
        <h2>Pay securely at checkout</h2>
        <p>
          This storefront does not manage or store saved payment methods. Enter
          your payment details in Shopify&apos;s secure checkout, where the
          available payment options for your order will be shown.
        </p>
        <Link className="account-feature-primary-button" to="/cart">
          Go to your basket
        </Link>
      </div>
    </AccountSection>
  );
}
