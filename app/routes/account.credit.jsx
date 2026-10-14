import {AccountSection} from '~/components/Account/AccountSection';

export const meta = () => [{title: 'My Credit'}];

export default function AccountCredit() {
  return (
    <AccountSection
      title="My Credit"
      description="View account credit issued to you."
      icon="credit"
    >
      <div className="account-feature-empty">
        <p>
          Account credit balances are not available through this storefront
          account. No balance or credit activity can be displayed here.
        </p>
      </div>
    </AccountSection>
  );
}
