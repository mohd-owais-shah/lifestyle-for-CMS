import { useState, useId, useRef } from 'react';

export function ProductOffers({ idPrefix = 'offer' }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef(null);
  const isProgrammaticScroll = useRef(false);
  const scrollTimeout = useRef(null);
  const reactId = useId();
  const safeId = `${idPrefix}_${reactId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const goldGradId = `goldGrad_${safeId}`;
  const innerGoldId = `innerGold_${safeId}`;

  const offers = [
    {
      id: 'coupon-1',
      title: 'Coupon Discount',
      desc: 'Flat ₹501 Off above ₹2499. Use Code – SAVE501',
      code: 'SAVE501',
    },
    {
      id: 'bogo-1',
      title: 'Buy 1 Get 1 Free',
      desc: 'Add 2 products to bag to avail Buy 1 Get 1 Free automatically',
      code: 'BOGO',
    },
    {
      id: 'bank-1',
      title: 'Bank Offer',
      desc: '10% Instant Discount on Federal & SBI Credit Cards on min. spend ₹2,500',
      code: 'BANK10',
    },
    {
      id: 'app-1',
      title: 'First Order Discount',
      desc: 'Get flat 15% off on your first order. Use Code – NEW15',
      code: 'NEW15',
    },
  ];

  const scrollToSlide = (index) => {
    setActiveSlide(index);
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const card = container.children[index];
    if (card) {
      isProgrammaticScroll.current = true;
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

      container.scrollTo({
        left: card.offsetLeft - container.offsetLeft,
        behavior: 'smooth',
      });

      scrollTimeout.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 500);
    }
  };

  const nextSlide = () => {
    const next = (activeSlide + 1) % offers.length;
    scrollToSlide(next);
  };

  const prevSlide = () => {
    const prev = (activeSlide - 1 + offers.length) % offers.length;
    scrollToSlide(prev);
  };

  const handleScroll = () => {
    if (isProgrammaticScroll.current || !carouselRef.current) return;
    const container = carouselRef.current;
    const scrollLeft = container.scrollLeft;
    const firstCard = container.children[0];
    if (!firstCard) return;
    const cardWidth = firstCard.offsetWidth;
    const newIndex = Math.round(scrollLeft / (cardWidth + 8));
    if (newIndex >= 0 && newIndex < offers.length && newIndex !== activeSlide) {
      setActiveSlide(newIndex);
    }
  };

  return (
    <section className="w-full min-w-0 border-b border-[#ECEDEB] py-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <defs>
              <linearGradient id={goldGradId} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F5DC7C" />
                <stop offset="50%" stopColor="#D4A738" />
                <stop offset="100%" stopColor="#9C731A" />
              </linearGradient>
              <linearGradient id={innerGoldId} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4D380B" />
                <stop offset="100%" stopColor="#2C1F03" />
              </linearGradient>
            </defs>
            {/* Scalloped Rosette Outer Base */}
            <path
              d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944z"
              fill={`url(#${goldGradId})`}
              stroke="#8C6713"
              strokeWidth="0.5"
            />
            {/* Inner Ring Background */}
            <circle cx="12" cy="12" r="7.4" fill={`url(#${innerGoldId})`} stroke="#ECCB6A" strokeWidth="0.8" />
            {/* Percent Symbol */}
            <path d="M9 15L15 9" stroke="#F5D77F" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="9.6" cy="9.6" r="1.3" fill="#F5D77F" />
            <circle cx="14.4" cy="14.4" r="1.3" fill="#F5D77F" />
          </svg>

          <h3 className="text-base font-semibold leading-5 text-[#141414]">
            Offers &amp; Discounts
          </h3>
        </div>

        <span className="shrink-0 text-sm font-semibold text-[#FAA619] cursor-default select-none">
          View all
        </span>
      </div>

      {/* Offers carousel - all screen sizes */}
      <div className="w-full min-w-0 overflow-hidden">
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex w-full items-stretch gap-2 overflow-x-auto overflow-y-hidden pb-1 scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {offers.map((offer) => (
            <article
              key={offer.id}
              className="relative box-border shrink-0 snap-start border border-dashed border-[#CCCCCC] bg-white"
              style={{
                flex: '0 0 85%',
                minHeight: '120px',
                marginBottom: '8px',
              }}
            >
              {/* Original inner padding preserved */}
              <h4 className="p-4 pb-0 text-sm font-semibold leading-5 text-[#141414]">
                {offer.title}
              </h4>

              <p className="px-4 pb-4 pt-2 text-sm font-normal leading-6 text-[#141414]">
                {offer.desc}
              </p>

              <div
                className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center bg-[#FAA619] text-base font-medium leading-none text-white select-none"
                aria-hidden="true"
              >
                +
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Pagination and navigation — visible on all screen sizes */}
      <div className="mt-3 flex items-center justify-end gap-3">
        <span className="text-[18px] font-normal text-[#141414]">
          {activeSlide + 1}/{offers.length}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevSlide}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#EEEEEE] bg-white text-[#141414] shadow-sm transition hover:bg-gray-50 cursor-pointer"
            aria-label="Previous offer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#EEEEEE] bg-white text-[#141414] shadow-sm transition hover:bg-gray-50 cursor-pointer"
            aria-label="Next offer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
export default ProductOffers;
