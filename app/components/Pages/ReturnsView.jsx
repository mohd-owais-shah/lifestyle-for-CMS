import {Link} from 'react-router';

export function ReturnsView() {
  return (
    <div className="w-full bg-white text-gray-900 min-h-screen pb-20">
      {/* 1. Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3">
        <nav aria-label="Breadcrumb" className="text-xs text-gray-500 flex items-center gap-2">
          <Link to="/pages/faq" className="hover:text-black transition-colors font-medium">
            Help
          </Link>
          <span className="text-gray-400 font-normal">&lt;</span>
          <span className="text-gray-900 font-medium">Returns</span>
        </nav>
      </div>

      {/* 2. Top Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold font-sans text-gray-900 tracking-tight mb-2">
          Returns
        </h1>
        <p className="text-sm sm:text-base text-gray-600 font-normal">
          Here&apos;s how the returns process works.
        </p>
      </div>

      {/* 3. Hero Intro Card with Image */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="border border-gray-200 rounded-sm p-6 sm:p-8 bg-[#FAF9F8] mb-12 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-950 mb-3 leading-snug">
                Returns should be easy.<br />We couldn&apos;t agree more.
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                Let&apos;s show you how to return your products in three easy ways.
              </p>
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xs text-xs text-amber-900">
                <span className="font-bold">Important Note:</span> There are some products we don&apos;t take back (like innerwear and beauty). Check out our{' '}
                <Link to="/policies/refund-policy" className="underline font-semibold hover:text-amber-950">
                  Returns Policy
                </Link>{' '}
                for full details.
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src="https://i1.lmsin.net/website_images/in/static-pages/lifestyle/returnspage-lifestyle.jpg"
                alt="Lifestyle Easy Returns"
                referrerPolicy="no-referrer"
                className="max-h-60 w-auto object-contain rounded-xs"
              />
            </div>
          </div>
        </div>

        {/* 4. Method 1: Request a return online */}
        <section className="mb-14">
          <div className="border-b border-gray-200 pb-3 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-950">
              1. Request a return online
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="border border-gray-200 rounded-sm p-5 bg-white shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 mb-4 flex items-center justify-center">
                  <img
                    src="https://i1.lmsin.net/website_images/ae/static-pages/returns/request-return.svg"
                    alt="Request your return"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h3 className="font-bold text-sm text-gray-950 mb-2">1. Request your return</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Go to Order History in My Account, select the products you want to return and place a return request.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="border border-gray-200 rounded-sm p-5 bg-white shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 mb-4 flex items-center justify-center text-gray-700">
                  <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm text-gray-950 mb-2">2. Box up your products</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Wrap and seal your products in their original packaging and ensure that all tags are intact.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="border border-gray-200 rounded-sm p-5 bg-white shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 mb-4 flex items-center justify-center">
                  <img
                    src="https://i1.lmsin.net/website_images/ae/static-pages/returns/handover.svg"
                    alt="Hand over your return"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h3 className="font-bold text-sm text-gray-950 mb-2">3. Hand over your return</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Our courier partner may take 1-3 business days to pick it up. They&apos;ll give you an acknowledgement receipt when they do.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="border border-gray-200 rounded-sm p-5 bg-white shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 mb-4 flex items-center justify-center">
                  <img
                    src="https://i1.lmsin.net/website_images/ae/static-pages/returns/receive-refund.svg"
                    alt="Receive your refund"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h3 className="font-bold text-sm text-gray-950 mb-2">4. Receive your refund</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We&apos;ll check your returns, and credit your refund to your card, bank account, wallet or UPI. If paid by cash, choose bank transfer or store credit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Method 2: Return to store */}
        <section className="mb-14">
          <div className="border-b border-gray-200 pb-3 mb-6 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-950">
                2. Return to store
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-2xs">
                NEW
              </span>
            </div>
            <p className="text-xs text-gray-500 italic">
              Please note, you will not be able to return Home Centre furniture to a Home Centre store.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="border border-gray-200 rounded-sm p-5 bg-white shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 mb-4 flex items-center justify-center text-gray-700">
                  <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm text-gray-950 mb-2">1. Fill out your return slip</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  This will be emailed to you after your products are delivered, or available in your order receipt.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="border border-gray-200 rounded-sm p-5 bg-white shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 mb-4 flex items-center justify-center text-gray-700">
                  <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm text-gray-950 mb-2">2. Visit your nearest store</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Wrap your products in original packaging and bring them over with your return slip and invoice to any Lifestyle store.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="border border-gray-200 rounded-sm p-5 bg-white shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 mb-4 flex items-center justify-center text-gray-700">
                  <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm text-gray-950 mb-2">3. Hand over your return</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  An authorised staff member will take your package and hand you an official acknowledgement receipt.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="border border-gray-200 rounded-sm p-5 bg-white shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 mb-4 flex items-center justify-center">
                  <img
                    src="https://i1.lmsin.net/website_images/ae/static-pages/returns/receive-refund.svg"
                    alt="Receive your refund"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h3 className="font-bold text-sm text-gray-950 mb-2">4. Receive your refund</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Receive an instant store credit voucher or refund to your payment method/bank account.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Method 3: Call us to schedule a pick-up */}
        <section className="mb-14">
          <div className="border-b border-gray-200 pb-3 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-950">
              3. Call us to schedule a pick-up
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="border border-gray-200 rounded-sm p-5 bg-white shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 mb-4 flex items-center justify-center text-gray-700">
                  <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm text-gray-950 mb-2">1. Call for a pick-up</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Speak to us at <a href="tel:080-65011555" className="font-semibold text-black underline">080-65011555</a> to schedule a pick-up time.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="border border-gray-200 rounded-sm p-5 bg-white shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 mb-4 flex items-center justify-center text-gray-700">
                  <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm text-gray-950 mb-2">2. Box up your products</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Wrap and seal your products in their original packaging and ensure that all tags are intact.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="border border-gray-200 rounded-sm p-5 bg-white shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 mb-4 flex items-center justify-center">
                  <img
                    src="https://i1.lmsin.net/website_images/ae/static-pages/returns/handover.svg"
                    alt="Hand over your return"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h3 className="font-bold text-sm text-gray-950 mb-2">3. Hand over your return</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Our courier partner may take 1-3 business days to pick it up and give you an acknowledgement receipt.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="border border-gray-200 rounded-sm p-5 bg-white shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 mb-4 flex items-center justify-center">
                  <img
                    src="https://i1.lmsin.net/website_images/ae/static-pages/returns/receive-refund.svg"
                    alt="Receive your refund"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h3 className="font-bold text-sm text-gray-950 mb-2">4. Receive your refund</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We&apos;ll check your returns and credit your refund in 2-7 days to your account or payment method.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
