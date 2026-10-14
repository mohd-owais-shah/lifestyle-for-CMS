import {useState} from 'react';
import {Link, useSearchParams} from 'react-router';

const ONLINE_OPTIONS = [
  'I want to cancel my order',
  'Delivery status',
  'Incomplete/Missing product',
  'Related to Delivery executive',
  'My product was Damaged/defective',
  'Delay in return Pick up',
  'I have received Wrong Product/Wrong size',
  'I want to return my product',
  'My Return was picked up but I haven\'t received my refund',
  'I want to cancel my return',
  'Return policy',
  'My Bank account details for refund',
  'Where is my refund',
  'My order is cancelled but I haven\'t received my refund',
  'I am unable to place order/Unable to Login to my account',
  'I am unable to redeem Gift card/Voucher',
  'My order didnt get placed but payment got debited',
  'Others',
];

const INSTORE_OPTIONS = [
  'Product complaint',
  'Product exchange or alteration',
  'Billing',
  'Payment',
  'Landmark Rewards',
  'Staff',
  'Offers or sales Enquiry',
  'Products or brands Enquiry',
  'Business Enquiry',
  'Marketing Association',
  'Gift vouchers / Gift cards / e-Gift cards Enquiry',
  'Career opportunities',
  'Media query',
  'Others',
];

export function ContactUsView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isFormView =
    searchParams.get('view') === 'write-to-us' ||
    searchParams.get('tab') === 'write-to-us';

  const [feedbackType, setFeedbackType] = useState('Online');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    rewardsNumber: '',
    queryReason: '',
    comments: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const options = feedbackType === 'Online' ? ONLINE_OPTIONS : INSTORE_OPTIONS;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const openFormView = () => {
    setSearchParams({view: 'write-to-us'});
  };

  const closeFormView = () => {
    setSearchParams({});
  };

  return (
    <div className="w-full bg-white text-[#1f2125] min-h-screen pb-24 font-['Figtree','Helvetica_Neue',Helvetica,Arial,sans-serif]">
      {/* 1. Breadcrumbs */}
      <div className="max-w-[1050px] mx-auto px-4 sm:px-[10px] pt-4 pb-2">
        <nav aria-label="Breadcrumb" className="text-[14px] text-[#1f2125] flex items-center gap-1.5 font-normal">
          <Link to="/pages/shipping" className="text-[#1f2125] hover:underline transition-colors">
            Help
          </Link>
          <span className="text-[#9ca3af] text-[13px]">&lt;</span>
          {isFormView ? (
            <>
              <button
                type="button"
                onClick={closeFormView}
                className="hover:underline transition-colors cursor-pointer text-[#1f2125]"
              >
                Contact us
              </button>
              <span className="text-[#9ca3af] text-[13px]">&lt;</span>
              <span className="text-[#1f2125] font-semibold">Write to us</span>
            </>
          ) : (
            <span className="text-[#1f2125]">Contact us</span>
          )}
        </nav>
      </div>

      {isFormView ? (
        /* ================== WRITE TO US FORM VIEW (INSIDE CONTACT US) ================== */
        <div>
          {/* Header */}
          <div className="max-w-[1050px] mx-auto px-4 sm:px-[10px] pt-2 pb-4">
            <h1 className="text-[36px] font-bold text-[#1f2125] leading-tight mb-1">
              Write to us
            </h1>
            <p className="text-[16px] text-[#5e636a] pb-5 border-b border-[#edeff1]">
              We’d love to hear suggestions and comments.
            </p>
          </div>

          {/* Form */}
          <div className="max-w-[1030px] mx-auto px-4 sm:px-0">
            {submitted ? (
              <div className="bg-[#f0f9f4] border border-[#a3e2bb] rounded-[4px] p-8 text-center max-w-xl mx-auto space-y-4 my-8">
                <div className="w-12 h-12 bg-[#2e7d32] text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-[20px] font-bold text-[#1e4620]">Thank You!</h3>
                <p className="text-[14px] text-[#2e5d32] leading-relaxed">
                  We&apos;ve received your feedback and comments. Our customer care team will get back to you shortly.
                </p>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        city: '',
                        rewardsNumber: '',
                        queryReason: '',
                        comments: '',
                      });
                    }}
                    className="px-5 py-2.5 bg-[#faa619] hover:bg-[#e09415] text-white text-[14px] font-bold rounded-[3px] transition-colors cursor-pointer"
                  >
                    Send Another Response
                  </button>
                  <button
                    type="button"
                    onClick={closeFormView}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 text-[14px] font-medium rounded-[3px] transition-colors cursor-pointer"
                  >
                    Back to Contact options
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 max-w-[860px]">
                {/* Feedback Scope Radio */}
                <div>
                  <span className="block text-[13px] font-semibold text-[#202020] mb-2.5">
                    Your feedback is about our:
                  </span>
                  <div className="flex items-center gap-8">
                    <label className="flex items-center gap-2 cursor-pointer text-[14px] text-[#5e636a]">
                      <input
                        type="radio"
                        name="feedbackType"
                        value="Online"
                        checked={feedbackType === 'Online'}
                        onChange={() => {
                          setFeedbackType('Online');
                          setFormData((prev) => ({...prev, queryReason: ''}));
                        }}
                        className="accent-[#faa619] w-4 h-4 cursor-pointer"
                      />
                      <span>Online experience</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[14px] text-[#5e636a]">
                      <input
                        type="radio"
                        name="feedbackType"
                        value="In-Store"
                        checked={feedbackType === 'In-Store'}
                        onChange={() => {
                          setFeedbackType('In-Store');
                          setFormData((prev) => ({...prev, queryReason: ''}));
                        }}
                        className="accent-[#faa619] w-4 h-4 cursor-pointer"
                      />
                      <span>In-store experience</span>
                    </label>
                  </div>
                </div>

                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] text-[#5e636a] font-medium mb-1.5">
                      Your name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-[#c8c9c6] rounded-[2px] px-3.5 py-2.5 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#faa619] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] text-[#5e636a] font-medium mb-1.5">
                      Your email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-[#c8c9c6] rounded-[2px] px-3.5 py-2.5 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#faa619] transition-colors"
                    />
                  </div>
                </div>

                {/* Row 2: Mobile Number & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] text-[#5e636a] font-medium mb-1.5">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="8123456789"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full border border-[#c8c9c6] rounded-[2px] px-3.5 py-2.5 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#faa619] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] text-[#5e636a] font-medium mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full border border-[#c8c9c6] rounded-[2px] px-3.5 py-2.5 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#faa619] transition-colors"
                    />
                  </div>
                </div>

                {/* Row 3: Landmark Rewards number (optional) */}
                <div>
                  <label className="block text-[13px] text-[#5e636a] font-medium mb-1.5">
                    Landmark Rewards number (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Your Landmark Rewards number"
                    value={formData.rewardsNumber}
                    onChange={(e) => setFormData({...formData, rewardsNumber: e.target.value})}
                    className="w-full border border-[#c8c9c6] rounded-[2px] px-3.5 py-2.5 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#faa619] transition-colors"
                  />
                </div>

                {/* Row 4: Your query relates to */}
                <div>
                  <label className="block text-[13px] text-[#5e636a] font-medium mb-1.5">
                    Your query relates to
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={formData.queryReason}
                      onChange={(e) => setFormData({...formData, queryReason: e.target.value})}
                      className="w-full border border-[#c8c9c6] rounded-[2px] px-3.5 py-2.5 text-[14px] text-gray-800 bg-white appearance-none focus:outline-none focus:border-[#faa619] transition-colors cursor-pointer"
                    >
                      <option value="" disabled>
                        Select your reason of query
                      </option>
                      {options.map((opt, idx) => (
                        <option key={idx} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#faa619]">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Row 5: Tell us what you think */}
                <div>
                  <label className="block text-[13px] text-[#5e636a] font-medium mb-1.5">
                    Tell us what you think
                  </label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Enter your comments here"
                    value={formData.comments}
                    onChange={(e) => setFormData({...formData, comments: e.target.value})}
                    className="w-full border border-[#c8c9c6] rounded-[2px] p-3.5 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#faa619] transition-colors min-h-[180px]"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex items-center gap-4">
                  <button
                    type="submit"
                    className="w-[210px] h-[42px] bg-[#faa619] hover:bg-[#e09415] text-white font-bold text-[16px] rounded-[3px] transition-colors cursor-pointer flex items-center justify-center"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={closeFormView}
                    className="text-[14px] text-[#5e636a] hover:text-black underline cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : (
        /* ================== MAIN 4 CARDS VIEW ================== */
        <div>
          {/* Header */}
          <div className="max-w-[1050px] mx-auto px-4 sm:px-[10px] pt-2 pb-4">
            <h1 className="text-[36px] font-bold text-[#1f2125] leading-tight mb-1">
              Contact us
            </h1>
            <p className="text-[16px] text-[#5e636a] pb-5 border-b border-[#edeff1]">
              We’re here to help you. Get in touch with us in any of these ways:
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="max-w-[1050px] mx-auto px-4 sm:px-[10px] pt-10 pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
              {/* Card 1: Write to us */}
              <button
                type="button"
                onClick={openFormView}
                className="group text-center flex flex-col items-center cursor-pointer bg-transparent border-0 p-0 focus:outline-none"
              >
                <div className="w-[58px] h-[58px] rounded-full border-[2.4px] border-[#8e44ad] text-[#8e44ad] flex items-center justify-center mb-[19px] mx-auto group-hover:scale-105 transition-transform">
                  <svg className="w-[28px] h-[28px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <rect x="2" y="4" width="20" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M22 6L12 13L2 6" />
                  </svg>
                </div>
                <h3 className="text-[22px] font-normal text-[#3d464d] leading-[24.2px] mb-[7px]">
                  Write to us
                </h3>
                <p className="text-[14px] font-normal text-[#72818d] leading-[18px] max-w-[200px] mx-auto">
                  Drop us a line and we'll get back to you as fast as we can.
                </p>
              </button>

              {/* Card 2: Facebook us */}
              <a
                href="https://www.facebook.com/lifestylestores"
                target="_blank"
                rel="noopener noreferrer"
                className="group text-center flex flex-col items-center cursor-pointer"
              >
                <div className="w-[58px] h-[58px] rounded-full border-[2.4px] border-[#3b5998] text-[#3b5998] flex items-center justify-center mb-[19px] mx-auto group-hover:scale-105 transition-transform">
                  <svg className="w-[28px] h-[28px] fill-current" viewBox="0 0 24 24">
                    <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0014.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.361H7.332v3.209h2.753v8.196h3.312z" />
                  </svg>
                </div>
                <h3 className="text-[22px] font-normal text-[#3d464d] leading-[24.2px] mb-[7px]">
                  Facebook us
                </h3>
                <p className="text-[14px] font-normal text-[#72818d] leading-[18px] max-w-[200px] mx-auto">
                  Connect with us on your favourite social network.
                </p>
              </a>

              {/* Card 3: Tweet us */}
              <a
                href="https://twitter.com/Lifestyle_Store"
                target="_blank"
                rel="noopener noreferrer"
                className="group text-center flex flex-col items-center cursor-pointer"
              >
                <div className="w-[58px] h-[58px] rounded-full border-[2.4px] border-[#000000] text-[#000000] flex items-center justify-center mb-[19px] mx-auto group-hover:scale-105 transition-transform">
                  <svg className="w-[24px] h-[24px] fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <h3 className="text-[22px] font-normal text-[#3d464d] leading-[24.2px] mb-[7px]">
                  Tweet us
                </h3>
                <p className="text-[14px] font-normal text-[#72818d] leading-[18px] max-w-[200px] mx-auto">
                  Reach out in 140 characters! We’re @Lifestyle_Store
                </p>
              </a>

              {/* Card 4: Talk to us */}
              <div className="text-center flex flex-col items-center">
                <a
                  href="tel:080-65011555"
                  className="w-[58px] h-[58px] rounded-full border-[2.4px] border-[#fa405a] text-[#fa405a] flex items-center justify-center mb-[19px] mx-auto hover:scale-105 transition-transform"
                  aria-label="Call Lifestyle Customer Support"
                >
                  <svg className="w-[26px] h-[26px] fill-current" viewBox="0 0 24 24">
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.57 3.93c.07-.54-.4-1-1-.1H4.03c-.56 0-1.03.47-1 1.03C3.65 13.9 11.1 21.35 20.04 22c.56.03 1.03-.44 1.03-1v-3.62c0-.55-.45-1-1.06-1z" />
                  </svg>
                </a>
                <h3 className="text-[22px] font-normal text-[#3d464d] leading-[24.2px] mb-[7px]">
                  Talk to us
                </h3>
                <p className="text-[14px] font-normal text-[#72818d] leading-[18px] max-w-[210px] mx-auto mb-[3px]">
                  Monday to Sunday, 10:00AM to 10:00PM
                </p>
                <a
                  href="tel:080-65011555"
                  className="text-[14px] font-normal text-[#72818d] leading-[18px] hover:underline hover:text-[#fa405a] transition-colors"
                >
                  Call us on 080-65011555
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
