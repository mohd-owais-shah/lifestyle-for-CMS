import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router';

/**
 * StarWatchSlider (Section 2: Responsive Header 5 + 4 Star Brands Carousel)
 */
export function StarWatchSlider({
  desktopHeader = 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Header5-Banner1-Desk-22Oct24.jpg',
  mobileHeader = 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Header5-Banner1-Mob-22Oct24.jpg',
  ariaLabel = 'Star Watch Slider',
  brands = [
    {
      id: 'star-1',
      title: 'G-Shock',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot-7-Banner1-Desk-08Oct26.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot-7-Banner1-Mob-08Oct26.jpg',
      link: '/collections?q=g-shock',
    },
    {
      id: 'star-2',
      title: 'Fossil',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot-7-Banner2-Desk-17Oct25.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot-7-Banner2-Mob-17Oct25.jpg',
      link: '/collections?q=fossil',
    },
    {
      id: 'star-3',
      title: 'Titan',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot-7-Banner3-Desk-07JUl26.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot-7-Banner3-Mob-07JUl26.jpg',
      link: '/collections?q=titan',
    },
    {
      id: 'star-4',
      title: 'Armani Exchange',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot-7-Banner5-Desk-21Apr26.jpg',
      mobileImg: null,
      desktopOnly: true,
      link: '/collections?q=armani-exchange',
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
    <section className="w-full max-w-[1232px] mx-auto p-0 m-0" aria-label={ariaLabel}>
      {/* Responsive Header Banner */}
      <div className="w-full relative overflow-hidden shadow-sm">
        <picture className="w-full block">
          <source media="(min-width: 768px)" srcSet={desktopHeader} />
          <img
            src={mobileHeader || desktopHeader}
            alt={ariaLabel}
            className="w-full h-auto block"
            loading="lazy"
          />
        </picture>
      </div>

      {/* Slider Row */}
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
          className="flex items-start overflow-x-auto scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {brands.map((brand, i) => (
            <div
              key={brand.id || i}
              className={`relative w-[calc(50%-4px)] sm:w-[307px] flex-shrink-0 flex-none overflow-hidden shadow-sm ${
                brand.desktopOnly ? 'hidden md:block' : ''
              }`}
            >
              <picture className="w-full block">
                {brand.desktopImg && <source media="(min-width: 768px)" srcSet={brand.desktopImg} />}
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

export default StarWatchSlider;
