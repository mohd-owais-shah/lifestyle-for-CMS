import {Link} from 'react-router';

export function EdgeMembershipView({page = null, data = null}) {
  // Extract banner if present in page.body or use live defaults
  let extractedBanner = null;
  if (page?.body) {
    const imgMatch = page.body.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1]) {
      extractedBanner = imgMatch[1];
    }
  }

  const bannerDesktop =
    data?.bannerDesktop ||
    extractedBanner ||
    'https://cms.landmarkshops.in/cdn-cgi/image/fit=cover/LS-Fest/Edge2-Desktop-20Mar24.jpg';
  const bannerMobile =
    data?.bannerMobile ||
    extractedBanner ||
    'https://cms.landmarkshops.in/cdn-cgi/image/fit=cover/LS-Fest/Edge2-Mobile-20Mar24.jpg';

  const benefits = [
    'Rs.300 gift voucher on enrolment (one time).',
    'Additional 10% discount coupon valid once after 30 days of enrolment , valid for next 60 days.',
    'Additional 10% discount voucher on purchase in Birthday month once a year.',
    'EXTRA Rs.500 Off on Sale Preview.',
    '10% Discount whenever you shop at Lifestyle stores website/ App.',
    'Rs.500 Home Centre discount coupon valid once.',
    'Priority billing',
    'Beauty Makeover & surprise offers',
    'Exciting deals from partner brands',
    'No limit for LMR points redemption',
  ];

  const homeCentreTerms = [
    'Coupons can be redeemed only once.',
    'Coupons are applicable only on Home Centre products. Not applicable on other brands.',
    'Coupons are not applicable on Gift Voucher purchases.',
    'Home Centre Online Coupons are applicable only on Mobile App and homecentre.com',
    'Coupon Offers cannot be combined with any other ongoing Coupon Offers.',
    'Offers are applicable on a single transaction only, and multiple invoices cannot be clubbed to redeem the Coupon Offers.',
    'Coupons are not applicable on following Furniture categories: Mattresses, re-furbished Furniture, Cash & Carry Items, and Clearance Sale Items.',
    'Once the Coupon Code is used, Home Centre will not entertain any request for cancellation. Any exchange by the bearer will be considered a valid discharge of Home Centre’s liability.',
    'No cash refund, in part or full is allowed against this Coupon Offer.',
    'Home Centre reserves the right to alter any/all the terms and conditions of this Coupon Code any time without any prior notice.',
  ];

  return (
    <div className="w-full bg-white text-[#5e636a] min-h-screen pb-20 font-sans">
      {/* 1. Breadcrumbs - Exact Live Layout */}
      <div className="max-w-[1030px] mx-auto px-4 sm:px-0 pt-4 pb-2">
        <nav aria-label="Breadcrumb" className="text-[13px] text-[#5e636a] flex items-center gap-1.5 font-normal">
          <Link to="/pages/faq" className="hover:text-black transition-colors">
            Help
          </Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-[#3d464d] font-semibold">Lifestyle Edge Program</span>
        </nav>
      </div>

      {/* 2. Responsive Hero Banner Image - Exact 1030px container width matching live site */}
      <div className="w-full max-w-[1030px] mx-auto mt-2 mb-6">
        <picture className="block w-full">
          <source media="(min-width: 768px)" srcSet={bannerDesktop} />
          <source media="(max-width: 767px)" srcSet={bannerMobile} />
          <img
            src={bannerDesktop}
            alt="Lifestyle Edge Program"
            referrerPolicy="no-referrer"
            className="w-full h-auto block max-w-[1030px] mx-auto"
          />
        </picture>
      </div>

      {/* 3. Text Section - Exactly matches live 1030px container and typography */}
      <div className="max-w-[1030px] mx-auto px-4 sm:px-0 pt-2 pb-16 text-[#5e636a] text-[13px] sm:text-[14px] leading-[22px]">
        {/* Main Heading */}
        <h2 className="text-[18px] sm:text-[20px] font-bold text-[#5e636a] underline mb-3">
          ABOUT THE PROGRAM:
        </h2>

        <p className="mb-4">
          Lifestyle Edge is a differential rewards program for the most valuable customers of Lifestyle. The program comes with a host of benefits:
        </p>

        {/* Benefits Ordered List */}
        <ol className="list-decimal list-outside ml-5 mb-5 space-y-1.5">
          {benefits.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ol>

        {/* Enrolment Information */}
        <p className="mb-5">
          Customers who are already a part of Landmark Rewards can become part of the program by paying an enrolment fee of Rs.899 at Lifestyle stores. The enrolment fee is non-refundable. Once enrolled into the program, customers can avail the benefits for a period of 12 months from the date of enrolment.
        </p>

        {/* Applicable Stores */}
        <p className="font-bold text-[#5e636a] mb-1">
          APPLICABLE STORES:
        </p>
        <p className="mb-5">
          Lifestyle Edge program is launched across all Lifestyle stores.
        </p>

        {/* Terms & Conditions Heading */}
        <p className="font-bold text-[#5e636a] mb-3">
          TERMS &amp; CONDITIONS:
        </p>

        {/* All 26 Full Terms matching Live Site */}
        <ol className="list-decimal list-outside ml-5 space-y-2.5">
          <li>
            Only Landmark Reward Program Member (&ldquo;member&rdquo;) can enrol into Lifestyle Edge Program (&ldquo;Lifestyle Edge &rdquo;).
          </li>
          <li>
            All Members are advised to read these &ldquo;Terms and Conditions&rdquo; before giving their consent for Enrolment. Enrolment in Lifestyle Edge shall imply that the Member/s have duly read and agreed to adhere to and bound by the &ldquo;Terms and Conditions&rdquo; stated herein.
          </li>
          <li>
            To enrol into the Lifestyle Edge Member should either request the cashier at POS to bill EDGE.
          </li>
          <li>
            Lifestyle Edge is a mobile number-based program and mobile number will be the sole identifier for Member to avail benefits.
          </li>
          <li>
            Lifestyle Edge is presently applicable only at Lifestyle stores.
          </li>
          <li>
            Membership into the Lifestyle Edge program is non-transferrable, non-assignable and non-refundable and the program benefits are valid for 12 months from the date of enrolment into the program.
          </li>
          <li>
            To enrol into the Lifestyle Edge program, customer needs to be a part of Landmark Rewards. A customer is required to share his/her name, email Id, phone number and DOB to enjoy benefits of the program.
          </li>
          <li>
            Lifestyle Edge benefits are applicable on purchases made at Lifestyle stores only, except for the Extra 10% OFF exclusive online offer and the Home Centre exclusive offer.
          </li>
          <li>
            Priority billing counters are set separately at select stores and managed basis customer inflow at the billing counter. Customer’s EDGE status may be verified, to get billed at Priority Counter.
          </li>
          <li>
            Rs.300 instant discount voucher will be issued at the time of enrolment. Valid across all brands. Offer will be applicable on discounted items as well. Offer can be used only in stores and not applicable for purchases made online. The voucher will remain valid for 30 days from the day of enrolment and can be used one time only. Unused amount cannot be carried forward.
          </li>
          <li>
            Additional 10% discount voucher will be given once. Valid on a minimum spend of Rs.2500 across all brands. Redemption eligibility will begin after 30 days from day of enrolment and Voucher will be valid for 60 days from issuance. Voucher can be used one time only. Maximum discount allowed is Rs.2500/-. Offer will be applicable on discounted items as well. Offer can be used only in stores and not applicable for purchases made online.
          </li>
          <li>
            Additional 10% birthday discount benefit will be available through M-coupon during the birthday month for customers as per the birthday information captured at the time of enrolment. In the absence of Date of Birth, coupon will not be sent. 10% discount is valid on minimum spend of Rs.2500 across all brands. Maximum discount allowed is Rs 2500. Offer will be applicable on discounted items as well. Offer can be used only in stores and not applicable for purchases made online. Coupon will be issued only once during the period of membership and no change in DOB will be allowed.
          </li>
          <li>
            By 28th of every month birthday coupons will be sent to all the customers whose birthday is in next month. For E.g., if a customer enrols into EDGE between 28th to 30th/31st and has birthday in the next month, he will receive the coupon only after 11 months. Also, if a customer’s birthday falls in the same month as that of his EDGE enrolment, he will receive B’ day coupon only after completion of 11 months.
          </li>
          <li>
            Customers can retrieve their coupons through WA chatbot in case they fail to receive a DVS print / SMS.
            <p className="mt-1.5 font-normal">
              Please note: In case no coupon is issued at the time of enrolment. Good will coupon will be given to the customers, one time usage only.
            </p>
          </li>
          <li>
            Lifestyle online shopping coupon would be shared with the customer within 7 days from enrolment, to avail additional 10% discount on purchases made on lifestylestores.com. The online coupon could be changed every month, which would be duly communicated over WhatsApp/ SMS/ Email with the customer.
          </li>
          <li>
            Lifestyle online shopping coupons are not valid on beauty products, watches, sunglasses, perfumes, facemasks, smart watches, smart bands, men’s grooming, Jockey, Manyavar and Fahrenheit. Only one coupon can be applied for one transaction online.
          </li>
          <li>
            Home Centre coupons would be issued to the customer at the time of enrolment. The coupons entitle the customer for a Rs. 500 OFF on a minimum spend of Rs.1999 valid only once, &amp; on Home Centre products not on brands, at any Home Centre store or homecentre.com/ App, subject to availability.
            <div className="mt-2 ml-2 pl-2 border-l border-gray-200 space-y-1.5 text-[12px] sm:text-[13px]">
              {homeCentreTerms.map((term, tIdx) => (
                <p key={tIdx}>- {term}</p>
              ))}
            </div>
          </li>
          <li>
            Assured offers on top brands will be available to customers at stores through scanning QR codes at respective locations where offers are available. The offer will be valid once, per customer.
          </li>
          <li>
            Assured offers on top brands will be an instant discount at the time of billing. Offers are subject to change without any prior notice.
          </li>
          <li>
            Two coupons cannot be applied in the same transaction, either in store or online.
          </li>
          <li>
            Customers who have an active membership of the EDGE program, subscribed at Rs.499, would not be migrated to the new EDGE program (Subscription fees – Rs.899). To migrate to the new EDGE program, customer would have to relinquish all old benefits by writing to feedback@landmarkrewards.in. A member can have only one valid Edge membership against one registered mobile number at given point in time.
          </li>
          <li>
            Customers with active membership of the old EDGE program can buy the new EDGE membership by paying Rs. 899 &amp; registering with another mobile number, should they choose to keep the old membership benefits active.
          </li>
          <li>
            Lifestyle International Pvt Ltd. may, at its sole discretion and without any prior intimation, either add or discontinue announced benefits, brands, stores from the program.
          </li>
          <li>
            The Lifestyle Edge membership will be issued solely at the discretion of the management and the final discretion on all matters relating to the membership shall rest with Lifestyle International Pvt Ltd.
          </li>
          <li>
            All customer related information can be updated through the landmark rewards program from time to time by logging into website www.landmarkrewards.in or by writing to feedback@landmarkrewards.in or calling the toll-free number 1800-208-2444.
          </li>
          <li>
            Lifestyle Edge terms and conditions will be governed by Laws of India. Any disputes relating to Lifestyle Edge will be subject to the exclusive jurisdiction of courts at Bengaluru only.
            <p className="mt-2 text-[#5e636a]">
              - Existing Edge Customer Please Refer to this link:{' '}
              <a
                href="https://www.lifestylestores.com/in/en/LIFESTYLE-EDGE"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-black transition-colors"
              >
                https://www.lifestylestores.com/in/en/LIFESTYLE-EDGE
              </a>
            </p>
          </li>
        </ol>
      </div>
    </div>
  );
}
