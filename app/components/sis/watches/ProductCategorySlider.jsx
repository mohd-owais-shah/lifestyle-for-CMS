import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router';

/**
 * 3. ProductCategorySlider (Header + ModBlock Banner + 5 Category Cards Carousel)
 */
export function ProductCategorySlider({
  desktopHeader = 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Header3-Desk-11Dec24A.jpg',
  mobileHeader = 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Header3-Mob-11Dec24A.jpg',
  desktopModBlock = 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Desk-ModBlock3-17Nov25.jpg',
  mobileModBlock = 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Mob-ModBlock3-17Nov25.jpg',
  categories = [
    {
      id: 'cat-1',
      title: 'Men Watches',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Watches-3-Banner1-Desk-21Oct24.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-Watches-3-Banner1-Mob-16Oct24.jpg',
      link: '/collections?q=watches-men',
    },
    {
      id: 'cat-2',
      title: 'Women Watches',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Watches-3-Banner2-Desk-21Oct24.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-Watches-3-Banner2-Mob-16Oct24.jpg',
      link: '/collections?q=watches-women',
    },
    {
      id: 'cat-3',
      title: 'Smartwatches',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Watches-3-Banner3-Desk-21Oct24.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-Watches-3-Banner3-Mob-16Oct24.jpg',
      link: '/collections?q=smartwatches',
    },
    {
      id: 'cat-4',
      title: 'Analog Watches',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Watches-3-Banner4-Desk-21Oct24.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-Watches-3-Banner4-Mob-16Oct24.jpg',
      link: '/collections?q=analog-watches',
    },
    {
      id: 'cat-5',
      title: 'Premium Watches',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Watches-3-Banner5-Desk-21Oct24.jpg',
      mobileImg: null, // Desktop only (5th card placeholder on mobile)
      link: '/collections?q=premium-watches',
    },
  ],
}) {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const hasOverflow = scrollWidth > clientWidth + 5 || categories.length > 4;
      const atStart = scrollLeft <= 10;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 15;

      if (!hasOverflow) {
        setCanScrollLeft(false);
        setCanScrollRight(false);
      } else {
        setCanScrollLeft(!atStart);
        setCanScrollRight(!atEnd || atStart);
      }
    }
  }, [categories.length]);

  useEffect(() => {
    checkScroll();
    const t1 = setTimeout(checkScroll, 100);
    const t2 = setTimeout(checkScroll, 400);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  return (
    <section className="w-full max-w-[1232px] mx-auto p-0 m-0 flex flex-col" aria-label="Product Category Section">
      {/* 1. Header Banner (Responsive) */}
      <div className="w-full relative overflow-hidden shadow-sm">
        <picture className="w-full block">
          <source media="(min-width: 768px)" srcSet={desktopHeader} />
          <img
            src={mobileHeader || desktopHeader}
            alt="Watches Categories Header"
            className="w-full h-auto block object-cover"
            loading="lazy"
          />
        </picture>
      </div>

      {/* 2. Modular Campaign Banner (Responsive) */}
      <div className="block w-full overflow-hidden shadow-sm">
        <picture className="w-full block">
          <source media="(min-width: 768px)" srcSet={desktopModBlock} />
          <img
            src={mobileModBlock || desktopModBlock}
            alt="Watches Campaign"
            className="w-full h-auto block object-cover hover:opacity-95 transition-opacity duration-300"
            loading="lazy"
          />
        </picture>
      </div>

      {/* 3. Carousel Cards Slider Row */}
      <div className="relative group/slider p-0 m-0">
        {/* Previous Button */}
        {canScrollLeft && (
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => {
              if (sliderRef.current) {
                sliderRef.current.scrollBy({ left: -307, behavior: 'smooth' });
              }
            }}
            className="hidden md:flex absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-md items-center justify-center text-gray-700 hover:text-black hover:bg-gray-50 border border-gray-100 transition-all cursor-pointer p-[2px]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Cards Track */}
        <div
          ref={sliderRef}
          onScroll={checkScroll}
          className="flex items-center overflow-x-auto scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat, i) => (
            <div
              key={cat.id || i}
              className={`relative w-[calc(50%-4px)] sm:w-[307px] flex-shrink-0 flex-none overflow-hidden shadow-sm ${
                !cat.mobileImg ? 'hidden md:block' : ''
              }`}
            >
              <picture className="w-full block">
                <source media="(min-width: 768px)" srcSet={cat.desktopImg} />
                <img
                  src={cat.mobileImg || cat.desktopImg}
                  alt={cat.title}
                  className="w-full h-auto block"
                  loading="lazy"
                />
              </picture>
            </div>
          ))}
        </div>

        {/* Next Button */}
        {canScrollRight && (
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => {
              if (sliderRef.current) {
                sliderRef.current.scrollBy({ left: 307, behavior: 'smooth' });
              }
            }}
            className="hidden md:flex absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-md items-center justify-center text-gray-700 hover:text-black hover:bg-gray-50 border border-gray-100 transition-all cursor-pointer p-[2px]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}

export default ProductCategorySlider;
