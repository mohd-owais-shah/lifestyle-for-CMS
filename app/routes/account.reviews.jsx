import {Link} from 'react-router';
import {AccountSection} from '~/components/Account/AccountSection';

export const meta = () => [{title: 'Reviews'}];

export default function AccountReviews() {
  return (
    <AccountSection
      title="Reviews"
      description="Reviews you've submitted for products."
      icon="review"
    >
      <div className="account-feature-empty">
        <p>
          This storefront is not connected to a customer review provider, so
          submitted reviews and review history cannot be retrieved here.
        </p>
        <Link to="/collections/all">Browse products</Link>
      </div>
    </AccountSection>
  );
}
