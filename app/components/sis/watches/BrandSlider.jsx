import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router';

/**
 * 5. BrandSlider (Responsive 9 Watch Brand Cards Carousel)
 */
export function BrandSlider({
  desktopHeader = 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Header6-Banner1-Desk-23Oct24A.jpg',
  mobileHeader = 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Header6-Banner1-Mob-23Oct24A.jpg',
  ariaLabel = 'Watch Brands Slider',
  bgColor = '#000000',
  brands = [
    {
      id: 'brand-1',
      title: 'Brand 1',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot8-Banner1-Desk-16Mar26.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot8-Banner1-Mob-16Mar26.jpg',
      link: '/collections?q=watches-brand-1',
    },
    {
      id: 'brand-2',
      title: 'Brand 2',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot8-Banner2-Desk-16Mar26.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot8-Banner2-Mob-16Mar26.jpg',
      link: '/collections?q=watches-brand-2',
    },
    {
      id: 'brand-3',
      title: 'Brand 3',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot8-Banner3-Desk-16Mar26.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot8-Banner3-Mob-16Mar26.jpg',
      link: '/collections?q=watches-brand-3',
    },
    {
      id: 'brand-4',
      title: 'Brand 4',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot8-Banner4-Desk-22Jul26.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot8-Banner4-Mob-22Jul26.jpg',
      link: '/collections?q=watches-brand-4',
    },
    {
      id: 'brand-5',
      title: 'Brand 5',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot8-Banner5-Desk-16Mar26.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot8-Banner5-Mob-16Mar26.jpg',
      link: '/collections?q=watches-brand-5',
    },
    {
      id: 'brand-6',
      title: 'Brand 6',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot8-Banner6-Desk-16Mar26.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot8-Banner6-Mob-16Mar26.jpg',
      link: '/collections?q=watches-brand-6',
    },
    {
      id: 'brand-7',
      title: 'Brand 7',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot8-Banner7-Desk-16Mar26.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot8-Banner7-Mob-16Mar26.jpg',
      link: '/collections?q=watches-brand-7',
    },
    {
      id: 'brand-8',
      title: 'Brand 8',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot8-Banner8-Desk-16Mar26.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot8-Banner8-Mob-16Mar26.jpg',
      link: '/collections?q=watches-brand-8',
    },
    {
      id: 'brand-9',
      title: 'Brand 9',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot8-Banner9-Desk-16Mar26.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot8-Banner9-Mob-16Mar26.jpg',
      link: '/collections?q=watches-brand-9',
    },
  ],
}) {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const hasOverflow = scrollWidth > clientWidth + 5 || brands.length > 4;
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
  }, [brands.length]);

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
    <section
      className="w-full max-w-[1232px] mx-auto p-0 m-0 flex flex-col"
      style={{ backgroundColor: bgColor }}
      aria-label={ariaLabel}
    >
      {/* Responsive Header Banner */}
      <div className="w-full relative overflow-hidden shadow-sm">
        <picture className="w-full block">
          <source media="(min-width: 768px)" srcSet={desktopHeader} />
          <img
            src={mobileHeader || desktopHeader}
            alt={ariaLabel}
            className="w-full h-auto block object-cover"
            loading="lazy"
          />
        </picture>
      </div>

      {/* Slider Row */}
      <div className="relative group/slider p-0 m-0" style={{ backgroundColor: bgColor }}>
        {/* Previous Button */}
        {canScrollLeft && (
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => {
              if (sliderRef.current) {
                sliderRef.current.scrollBy({ left: -310, behavior: 'smooth' });
              }
            }}
            className="hidden md:flex absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-md items-center justify-center text-gray-700 hover:text-black hover:bg-gray-50 border border-gray-100 transition-all cursor-pointer p-[2px]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Brands Track with Live gap and sizing */}
        <div
          ref={sliderRef}
          onScroll={checkScroll}
          className="flex items-center gap-2 sm:gap-3 overflow-x-auto scroll-smooth no-scrollbar p-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {brands.map((brand, i) => (
            <div
              key={brand.id || i}
              className="relative w-[calc(50%-4px)] sm:w-[calc(25%-9px)] sm:min-w-[295px] flex-shrink-0 flex-none overflow-hidden shadow-sm"
            >
              <picture className="w-full block">
                <source media="(min-width: 768px)" srcSet={brand.desktopImg} />
                <img
                  src={brand.mobileImg || brand.desktopImg}
                  alt={brand.title}
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
                sliderRef.current.scrollBy({ left: 310, behavior: 'smooth' });
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

export default BrandSlider;
