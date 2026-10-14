import {useState, useMemo} from 'react';
import {Link} from 'react-router';

const FAQ_ITEMS = [
  {
    category: 'Orders',
    q: 'How do I track my order?',
    a: 'Sign in and go to My Account → Orders. Select "Track Order" on your active purchase to view real-time courier updates. We also send SMS and email notifications at each milestone.',
  },
  {
    category: 'Orders',
    q: 'Can I cancel an order after placing it?',
    a: 'You can cancel an order directly from My Account before it has been dispatched by our warehouse. If already dispatched, you can reject the delivery upon arrival.',
  },
  {
    category: 'Orders',
    q: 'What should I do if an item is missing from my package?',
    a: 'Sometimes multi-item orders are shipped in split packages from different regional fulfillment hubs. Please check your tracking link for split parcels or contact customer care at 080-65011555.',
  },
  {
    category: 'Payments',
    q: 'What payment methods do you accept?',
    a: 'We accept Credit/Debit Cards (Visa, MasterCard, RuPay, Amex), UPI (Google Pay, PhonePe, Paytm), Net Banking across 50+ banks, Landmark Rewards Edge points, and Cash on Delivery (COD).',
  },
  {
    category: 'Payments',
    q: 'Is Cash on Delivery (COD) safe and free?',
    a: 'Yes, COD is completely free with zero additional convenience fees up to ₹10,000 across India.',
  },
  {
    category: 'Returns',
    q: 'What is your return policy?',
    a: 'We offer a 10-day return policy on apparel, footwear, and accessories from the date of delivery. You can return via free doorstep courier pickup or walk into any Lifestyle store.',
  },
  {
    category: 'Returns',
    q: 'How will I receive my refund for a COD order?',
    a: 'For COD returns, our system will prompt you to enter your Bank Account details or UPI ID. The refund is transferred within 3–5 working days post quality inspection.',
  },
  {
    category: 'Edge Loyalty',
    q: 'What is Lifestyle Edge Membership?',
    a: 'Edge is the Landmark Group loyalty program. You earn points on every purchase across Lifestyle, Max, and Home Centre that can be used directly as cash to pay for subsequent orders.',
  },
  {
    category: 'Edge Loyalty',
    q: 'How much is 1 Edge point worth?',
    a: '1 Edge Point = ₹1. You can redeem your points anytime at checkout with no minimum order threshold.',
  },
  {
    category: 'Account',
    q: 'How do I update my delivery address or phone number?',
    a: 'Navigate to My Account → Addresses to add, edit, or set default delivery addresses. To update your profile phone number or name, go to My Account → Profile.',
  },
];

const CATEGORIES = ['All', 'Orders', 'Payments', 'Returns', 'Edge Loyalty', 'Account'];

export function FaqView() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCat;
      const matchesQuery = item.q.toLowerCase().includes(query) || item.a.toLowerCase().includes(query);
      return matchesCat && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="w-full bg-white text-gray-900 min-h-screen pb-20">
      {/* 1. Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <nav aria-label="Breadcrumb" className="text-xs text-gray-500 flex items-center gap-1.5">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-900 font-medium">FAQs</span>
        </nav>
      </div>

      {/* 2. Header */}
      <div className="bg-[#FAF9F6] border-b border-gray-200 py-10 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold font-sans text-gray-950 mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mb-6">
            Find quick answers to common questions about orders, payments, returns, and rewards.
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. tracking, refund, points)..."
              className="w-full pl-4 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-gray-300 rounded-xs focus:outline-none focus:border-black"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Category Filter Pills */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setOpenIndex(null);
              }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-xs transition-colors shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 4. Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            No matching questions found. Try a different keyword or contact our support team.
          </div>
        ) : (
          <div className="space-y-3 mb-14">
            {filteredFaqs.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={item.q} className="border border-gray-200 rounded-xs bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <span>{item.q}</span>
                    <span className="text-gray-400 text-base shrink-0">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 5. Contact CTA */}
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-6 sm:p-8 text-center">
          <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-1">Still have questions?</h3>
          <p className="text-xs text-gray-600 mb-4">Can&apos;t find what you&apos;re looking for? Our friendly support team is always ready to assist.</p>
          <Link
            to="/pages/contact"
            className="inline-block px-6 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-gray-800 transition-colors"
          >
            Contact Customer Support
          </Link>
        </div>
      </div>
    </div>
  );
}
