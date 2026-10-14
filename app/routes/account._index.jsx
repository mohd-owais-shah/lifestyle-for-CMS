import {NavLink} from 'react-router';

const accountSections = [
  {
    title: 'Profile',
    description: 'Manage your personal details.',
    icon: 'profile',
    to: '/account/profile',
  },
  {
    title: 'Favourites',
    description: 'View products saved on this device.',
    icon: 'heart',
    to: '/account/favourites',
  },
  {
    title: 'My Addresses',
    description: 'Manage your shipping and billing addresses.',
    icon: 'address',
    to: '/account/addresses',
  },
  {
    title: 'Payment',
    description: 'Pay securely at checkout.',
    icon: 'payment',
    to: '/account/payment',
    hidden: true,
  },
  {
    title: 'My Credit',
    description: 'View your available credit balance.',
    icon: 'credit',
    to: '/account/credit',
    hidden: true,
  },
  {
    title: 'Click & Collect',
    description: 'Manage your collection stores.',
    icon: 'store',
    to: '/account/click-collect',
    hidden: true,
  },
  {
    title: 'Reviews',
    description: 'View your product reviews.',
    icon: 'review',
    to: '/account/reviews',
  },
  {
    title: 'Orders',
    description: 'View and track your orders.',
    icon: 'orders',
    to: '/account/orders',
  },
  {
    title: 'Landmark Rewards',
    description: 'Earn and spend loyalty points for instant savings.',
    icon: 'rewards',
    to: '/account/rewards',
    hidden: true,
  },
  {
    title: 'Email Preferences',
    description: 'Manage your newsletter and email preferences.',
    icon: 'email',
    to: '/account/preferences',
  },
];

const iconPaths = {
  profile: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.4-3.2 2.3-5 5.5-5s5.1 1.8 5.5 5M15 5.4a3 3 0 0 1 0 5.7M16 14c2.6.5 4 2.1 4.5 5" />
    </>
  ),
  heart: (
    <path d="M20.8 8.8c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />
  ),
  address: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M3 7h4M3 11h4M3 15h4M3 19h4M11 8h5M11 12h5M11 16h3" />
    </>
  ),
  payment: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18M7 15h4M16 14v3" />
    </>
  ),
  credit: (
    <>
      <path d="M4 6h16v12H4zM7 9h10M7 13h5" />
      <path d="M2 9v11h16" />
    </>
  ),
  store: (
    <>
      <path d="M4 10h16v10H4zM3 10l2-6h14l2 6M8 20v-6h5v6M4 10a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" />
    </>
  ),
  review: (
    <>
      <path d="M4 5h16v11H9l-5 4zM7 9h10M7 12h7" />
    </>
  ),
  orders: (
    <>
      <path d="m12 3 9 5v8l-9 5-9-5V8zM3.5 8.5 12 13l8.5-4.5M12 13v8M7.5 5.5 16 10" />
    </>
  ),
  rewards: (
    <>
      <path d="M4 9h16v11H4zM2 6h20v3H2zM12 6v14M12 6H8.5a2 2 0 1 1 2-2c0 1.1 1.5 2 1.5 2Zm0 0h3.5a2 2 0 1 0-2-2c0 1.1-1.5 2-1.5 2Z" />
    </>
  ),
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m4 7 8 6 8-6M8 16h8" />
    </>
  ),
};

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => [{title: 'My Account'}];

export default function AccountOverview() {
  return (
    <div className="account-overview">
      <header className="account-overview-heading">
        <h1>One account to rule them all</h1>
        <p>
          Manage your account across all participating brands from one place.
        </p>
        <div className="account-brands" aria-label="Participating brands">
          <span className="account-brand-lifestyle">LIFESTYLE</span>
          <span className="account-brand-max">max</span>
          <span className="account-brand-homecentre">homecentre</span>
          <span className="account-brand-babyshop">babyshop</span>
        </div>
      </header>

      <section className="account-card-grid" aria-label="Account options">
        {accountSections.filter((section) => !section.hidden).map((section) =>
          section.to ? (
            <NavLink
              className="account-card"
              key={section.title}
              to={section.to}
              prefetch="intent"
            >
              <AccountIcon name={section.icon} />
              <span className="account-card-copy">
                <span className="account-card-title">{section.title}</span>
                <span className="account-card-description">
                  {section.description}
                </span>
              </span>
            </NavLink>
          ) : (
            <article
              className="account-card account-card-unavailable"
              key={section.title}
              aria-label={`${section.title}. Not connected yet.`}
            >
              <AccountIcon name={section.icon} />
              <span className="account-card-copy">
                <span className="account-card-title">{section.title}</span>
                <span className="account-card-description">
                  {section.description}
                </span>
                <span className="account-card-status">Not connected yet</span>
              </span>
            </article>
          ),
        )}
      </section>
    </div>
  );
}

function AccountIcon({name}) {
  return (
    <svg
      className="account-card-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}

/** @typedef {import('./+types/account._index').Route} Route */
