export function AboutUsView({page = null, data = null}) {
  const title = page?.title || data?.title || 'About Us';
  const subtitle =
    data?.subtitle || 'Lifesytle India’s home for trends and style.';

  // Support banner image from Shopify Admin page upload or metafield or live CDN fallback
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
    'https://cms.landmarkshops.in/LS-Fest/LS-new/Desktop-Lifestyle-Aboutus-09July26.jpg';

  const bannerMobile =
    data?.bannerMobile ||
    extractedBanner ||
    'https://cms.landmarkshops.in/LS-Fest/LS-new/Mobile-Lifestyle-Aboutus-09July26.jpg';

  const defaultParagraphs = [
    "Lifestyle is one of India's leading fashion destinations and a part of the Dubai-based Landmark Group, offering the latest trends and curated styles across fashion and beauty through its strong pan-India presence.",
    "With over 300 international brands, Lifestyle offers an extensive range of women's, men's and kids' apparel, footwear, handbags, accessories, beauty and more under one roof, while delivering a seamless omnichannel shopping experience across its stores and online platform.",
    "Every season, Lifestyle curates trend-led collections inspired by global fashion, helping customers discover the latest styles, express their individuality, and stay ahead of the trends.",
  ];

  const paragraphs = data?.paragraphs || defaultParagraphs;

  return (
    <div className="w-full bg-white text-gray-900 min-h-screen pb-20 font-sans">
      {/* 1. Top Title & Subtitle Section - Exactly matches live Lifestyle Stores */}
      <div className="max-w-[1256px] mx-auto px-4 sm:px-[15px] pt-4 sm:pt-6 pb-2">
        <h1 className="text-[28px] sm:text-[33px] font-bold text-[#3d464d] leading-[36.3px] mt-4 mb-2">
          {title}
        </h1>
        <p className="text-[15px] sm:text-[16px] text-[#5e636a] leading-6 mb-2">
          {subtitle}
        </p>
      </div>

      {/* 2. Banner Image - Exactly matches live 1366px container width & unrounded aspect ratio */}
      <div className="w-full max-w-[1366px] mx-auto mt-4 sm:mt-6 mb-6 sm:mb-8">
        <picture className="block w-full">
          <source media="(min-width: 768px)" srcSet={bannerDesktop} />
          <source media="(max-width: 767px)" srcSet={bannerMobile} />
          <img
            src={bannerDesktop}
            alt="About Lifestyle"
            referrerPolicy="no-referrer"
            className="w-full h-auto block max-w-[1366px] mx-auto"
          />
        </picture>
      </div>

      {/* 3. Description Section - Matches live container (8% horizontal padding) & typography */}
      <div className="max-w-[1256px] mx-auto px-4 sm:px-[8%] my-6 sm:my-8 space-y-6 text-[#5e636a] text-[15px] sm:text-[16px] leading-[24px]">
        {paragraphs.map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>
    </div>
  );
}

