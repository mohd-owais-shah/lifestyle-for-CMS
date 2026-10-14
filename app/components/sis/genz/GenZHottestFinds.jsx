import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router';

/**
 * Section 2: HOTTEST FINDS (Banner Carousel 3)
 */
export function GenZHottestFinds({
  headerImage = 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Genz-Slot-4-Header-Desk-17Jun26.jpg',
  cards = [
    {
      id: 'hf-1',
      title: 'Spot–On Tops',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=350,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Genz-4-Banner1-Desktop-17JUn26.jpg',
      link: '/collections?q=tops',
    },
    {
      id: 'hf-2',
      title: 'Drip Shirts',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=350,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Genz-4-Banner2-Desktop-17JUn26.jpg',
      link: '/collections?q=shirts',
    },
    {
      id: 'hf-3',
      title: 'Easy Tees',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=350,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Genz-4-Banner3-Desktop-17JUn26.jpg',
      link: '/collections?q=tees',
    },
    {
      id: 'hf-4',
      title: 'Cool Cargos',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=350,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Genz-4-Banner4-Desktop-17JUn26.jpg',
      link: '/collections?q=cargos',
    },
    {
      id: 'hf-5',
      title: 'Slay Ready Co-ords',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=350,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Genz-4-Banner5-Desktop-17JUn26.jpg',
      link: '/collections?q=co-ords',
    },
  ],
}) {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const hasOverflow = scrollWidth > clientWidth + 5 || cards.length > 4;
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
  }, [cards.length]);

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
    <section className="w-full max-w-[1276px] mx-auto p-0 mt-0" aria-label="Hottest Finds">
      {/* Header Banner */}
      <div className="w-full relative overflow-hidden rounded-none md:rounded-[4px] shadow-sm">
        <img
          src={headerImage}
          alt="Hottest Finds"
          className="w-full h-auto block object-cover"
          loading="lazy"
        />
      </div>

      {/* Cards Container with Interactive Slider */}
      <div className="bg-[#F6F5F3] pt-0 pb-3 sm:pb-4 px-3 sm:px-4 rounded-b-none md:rounded-b-[4px] relative group/slider">
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

        {/* Scrollable Cards Track */}
        <div
          ref={sliderRef}
          onScroll={checkScroll}
          className="flex items-center gap-3 sm:gap-4 overflow-x-auto scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cards.map((cat, i) => (
            <div
              key={cat.id || i}
              className="relative flex-none w-[calc(50%-6px)] sm:w-[calc(33.33%-11px)] lg:w-[calc(25%-12px)] rounded-[4px] overflow-hidden aspect-[291/185] bg-neutral-900 shadow-sm"
            >
              <img
                src={cat.img}
                alt={cat.title}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
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
