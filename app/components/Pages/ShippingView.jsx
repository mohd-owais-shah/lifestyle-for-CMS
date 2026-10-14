import {useState} from 'react';
import {Link} from 'react-router';

export function ShippingView({page = null}) {
  const [feedbackVote, setFeedbackVote] = useState(null);

  const title = page?.title || 'Shipping';

  return (
    <div className="w-full bg-white text-[#5e636a] min-h-screen pb-20 font-sans">
      {/* 1. Breadcrumbs - Exact Live Layout */}
      <div className="max-w-[1250px] mx-auto px-4 sm:px-[50px] pt-4 pb-2">
        <nav aria-label="Breadcrumb" className="text-[13px] text-[#5e636a] flex items-center gap-1.5 font-normal">
          <Link to="/pages/faq" className="hover:text-black transition-colors">
            Help
          </Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-[#3d464d] font-semibold">{title}</span>
        </nav>
      </div>

      {/* 2. Main Content Container */}
      <div className="max-w-[1250px] mx-auto px-4 sm:px-[50px] pt-4 pb-12">
        {/* Title & Subtitle */}
        <h1 className="text-[28px] sm:text-[33px] font-normal text-[#5e636a] mb-2">
          {title}
        </h1>
        <p className="text-[15px] sm:text-[16px] text-[#5e636a] mb-8">
          Get information on delivery schedules and shipping charges.
        </p>

        {/* Delivery Charges Section */}
        <div className="mb-8">
          <h2 className="text-[16px] font-bold text-[#5e636a] mb-2">
            Delivery Charges
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#5e636a] mb-4">
            Your delivery charges will be displayed during the checkout process.
          </p>

          {/* Charges Table */}
          <div className="overflow-x-auto max-w-[582px]">
            <table className="w-full border-collapse border border-[#d1d5db] text-[13px] text-left">
              <thead>
                <tr className="border-b border-[#d1d5db] font-bold text-[#5e636a]">
                  <th className="border-r border-[#d1d5db] p-2.5">Category</th>
                  <th className="border-r border-[#d1d5db] p-2.5">Order Value</th>
                  <th className="border-r border-[#d1d5db] p-2.5">Shipping Charge</th>
                  <th className="p-2.5">Cash on Delivery Charge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d1d5db] text-[#5e636a]">
                <tr>
                  <td className="border-r border-[#d1d5db] p-2.5" rowSpan={2}>
                    Fashion
                  </td>
                  <td className="border-r border-[#d1d5db] p-2.5">Below Rs.1000</td>
                  <td className="border-r border-[#d1d5db] p-2.5">Rs.0</td>
                  <td className="p-2.5">Rs.0</td>
                </tr>
                <tr>
                  <td className="border-r border-[#d1d5db] p-2.5">Rs.1000 and above</td>
                  <td className="border-r border-[#d1d5db] p-2.5">Rs.0</td>
                  <td className="p-2.5">Rs.0</td>
                </tr>
                <tr>
                  <td className="border-r border-[#d1d5db] p-2.5" rowSpan={2}>
                    Home &amp; living
                  </td>
                  <td className="border-r border-[#d1d5db] p-2.5">Below Rs.1299</td>
                  <td className="border-r border-[#d1d5db] p-2.5">Rs.0</td>
                  <td className="p-2.5">Rs.0</td>
                </tr>
                <tr>
                  <td className="border-r border-[#d1d5db] p-2.5">Rs.1300 and above</td>
                  <td className="border-r border-[#d1d5db] p-2.5">Free</td>
                  <td className="p-2.5">Rs.0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Questions Section */}
        <div className="mb-10">
          <h2 className="text-[18px] font-bold text-[#5e636a] mb-1">
            Popular Questions
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#5e636a] mb-6">
            Get answers to our most frequently asked questions.
          </p>

          <div className="space-y-6 max-w-3xl text-[13px] sm:text-[14px] text-[#5e636a] leading-[22px]">
            {/* Q1 */}
            <div>
              <p className="font-bold mb-1">
                I placed an order today. When can I expect my shipment?
              </p>
              <p>
                Your delivery schedule will depend on the product and the time that you placed your order. Go to the Orders section under My Account or click on the order number in your Order Confirmation email to check on the status of your delivery.
              </p>
            </div>

            {/* Q2 */}
            <div>
              <p className="font-bold mb-1">
                What if I miss a delivery?
              </p>
              <p>
                If you are unavailable when our courier partner arrives with your delivery, they will make two more delivery attempts. If you&apos;re still unavailable after the third attempt, your order will be returned to us. Call us on 080-65011555 within one working day of the third attempt and we&apos;ll schedule another delivery date and time that suits you better.
              </p>
            </div>

            {/* Q3 */}
            <div>
              <p className="font-bold mb-1">
                Why am I being charged a Platform Fee?
              </p>
              <p>
                This fee enables us to continuously improve our platform, and ensures that you get a seamless online shopping &amp; delivery experience every time.
              </p>
            </div>

            {/* Q4 */}
            <div>
              <p className="font-bold mb-1">
                How do I track my order via My Account?
              </p>
              <p className="mb-1.5">
                To track your order, just follow these simple steps:
              </p>
              <ol className="list-decimal list-outside ml-5 space-y-1">
                <li>Sign in to your LifestyleStores.com account.</li>
                <li>Click &apos;My Account&apos;.</li>
                <li>Select &apos;Order History&apos;.</li>
                <li>In the orders page, select &apos;View Details&apos; for the order number you wish to track.</li>
                <li>Click on &apos;Courier Tracking #&apos;.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Helpful Feedback Widget */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-[13px] text-[#5e636a]">
            <span>Was this article helpful?</span>
            {feedbackVote ? (
              <span className="text-[#2e7d32] font-semibold">
                Thank you for your feedback! (32% of people found this helpful)
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackVote('yes')}
                  className="px-4 py-1 border border-gray-300 rounded-[2px] hover:border-black hover:text-black transition-colors text-[13px] cursor-pointer"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackVote('no')}
                  className="px-4 py-1 border border-gray-300 rounded-[2px] hover:border-black hover:text-black transition-colors text-[13px] cursor-pointer"
                >
                  No
                </button>
                <span className="text-gray-400 text-xs ml-2">
                  32% of people found this helpful
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
