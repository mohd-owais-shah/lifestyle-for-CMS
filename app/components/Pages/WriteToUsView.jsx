import {useState} from 'react';
import {Link} from 'react-router';

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

export function WriteToUsView() {
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

  return (
    <div className="w-full bg-white text-[#202020] min-h-screen pb-20 font-sans">
      {/* 1. Breadcrumbs */}
      <div className="max-w-[1030px] mx-auto px-4 sm:px-0 pt-4 pb-2">
        <nav aria-label="Breadcrumb" className="text-[13px] text-[#5e636a] flex items-center gap-1.5 font-normal">
          <Link to="/pages/faq" className="hover:text-black transition-colors">
            Help
          </Link>
          <span className="text-gray-400">&lt;</span>
          <Link to="/pages/contact" className="hover:text-black transition-colors">
            Contact us
          </Link>
          <span className="text-gray-400">&lt;</span>
          <span className="text-[#3d464d] font-semibold">Write to us</span>
        </nav>
      </div>

      {/* 2. Page Header */}
      <div className="max-w-[1030px] mx-auto px-4 sm:px-0 pt-3 pb-4">
        <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#202020] mb-1">
          Write to us
        </h1>
        <p className="text-[14px] sm:text-[15px] text-[#5e636a]">
          We&apos;d love to hear suggestions and comments.
        </p>
        <hr className="border-t border-[#e2e4e7] mt-5 mb-8" />
      </div>

      {/* 3. Form Container */}
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
              className="mt-3 px-6 py-2.5 bg-[#faa619] hover:bg-[#e09415] text-white text-[14px] font-bold rounded-[3px] transition-colors cursor-pointer"
            >
              Submit Another Response
            </button>
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
            <div className="pt-2">
              <button
                type="submit"
                className="w-[210px] h-[42px] bg-[#faa619] hover:bg-[#e09415] text-white font-bold text-[16px] rounded-[3px] transition-colors cursor-pointer flex items-center justify-center"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
