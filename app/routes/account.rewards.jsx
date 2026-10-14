import {AccountSection} from '~/components/Account/AccountSection';

export const meta = () => [{title: 'Landmark Rewards'}];

export default function AccountRewards() {
  return (
    <AccountSection
      title="Landmark Rewards"
      description="Rewards membership and points."
      icon="rewards"
    >
      <div className="account-feature-empty">
        <p>
          Landmark Rewards balances and transactions are managed by a loyalty
          service that is not connected to this storefront.
        </p>
      </div>
    </AccountSection>
  );
}
