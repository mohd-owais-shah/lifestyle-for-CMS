import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router';

/**
 * 4. WatchStyleSlider (Responsive Header + 4 Watch Style Cards Carousel)
 */
export function WatchStyleSlider({
  desktopHeader = 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Watches-Slot-4-Header-Desk-03Apr25.jpg',
  mobileHeader = 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-Watches-Slot-4-Header-Mob-03Apr25.jpg',
  ariaLabel = 'Watch Style Slider',
  styles = [
    {
      id: 'style-1',
      title: 'Watch Style 1',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Watches-Slot-4-Banner1-Desktop-03Apr25.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-Watches-Slot-4-Banner1-Mobile-03Apr25.jpg',
      link: '/collections?q=watches-style-1',
    },
    {
      id: 'style-2',
      title: 'Watch Style 2',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Watches-Slot-4-Banner2-Desktop-03Apr25.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-Watches-Slot-4-Banner2-Mobile-03Apr25.jpg',
      link: '/collections?q=watches-style-2',
    },
    {
      id: 'style-3',
      title: 'Watch Style 3',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Watches-Slot-4-Banner3-Desktop-03Apr25.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-Watches-Slot-4-Banner3-Mobile-03Apr25.jpg',
      link: '/collections?q=watches-style-3',
    },
    {
      id: 'style-4',
      title: 'Watch Style 4',
      desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Watches-Slot-4-Banner4-Desktop-03Apr25.jpg',
      mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-Watches-Slot-4-Banner4-Mobile-03Apr25.jpg',
      link: '/collections?q=watches-style-4',
    },
  ],
}) {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const hasOverflow = scrollWidth > clientWidth + 5 || styles.length > 4;
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
  }, [styles.length]);

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
          {styles.map((style, i) => (
            <div
              key={style.id || i}
              className="relative w-[calc(50%-4px)] sm:w-[307px] flex-shrink-0 flex-none overflow-hidden shadow-sm"
            >
              <picture className="w-full block">
                <source media="(min-width: 768px)" srcSet={style.desktopImg} />
                <img
                  src={style.mobileImg || style.desktopImg}
                  alt={style.title}
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

export default WatchStyleSlider;
