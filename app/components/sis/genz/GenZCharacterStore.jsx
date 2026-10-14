import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router';

/**
 * Section 4: CHARACTER STORE (Banner Carousel 4)
 */
export function GenZCharacterStore({
  headerImage = 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Genz-Slot-3-Header-Desk-17Jun26.jpg',
  modBlockImage = 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Genz-HP-Desk-ModBlock3-13Mar26.jpg',
  cards = [
    {
      id: 'char-1',
      title: 'Look 5',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Genz-3-Banner1-Desk-13Mar26.jpg',
      link: '/collections?q=look-5',
    },
    {
      id: 'char-2',
      title: 'Look 4',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Genz-3-Banner2-Desk-13Mar26.jpg',
      link: '/collections?q=look-4',
    },
    {
      id: 'char-3',
      title: 'Look 3',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Genz-3-Banner3-Desk-13Mar26.jpg',
      link: '/collections?q=look-3',
    },
    {
      id: 'char-4',
      title: 'Look 2',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Genz-3-Banner4-Desk-13Mar26.jpg',
      link: '/collections?q=look-2',
    },
    {
      id: 'char-5',
      title: 'Look 1',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Genz-3-Banner5-Desk-13Mar26.jpg',
      link: '/collections?q=look-1',
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
    <section className="w-full max-w-[1276px] mx-auto p-0 mt-0" aria-label="Character Store">
      {/* Header Banner */}
      <div className="w-full relative overflow-hidden rounded-none md:rounded-[4px] shadow-sm">
        <img
          src={headerImage}
          alt="Character Store"
          className="w-full h-auto block object-cover"
          loading="lazy"
        />
      </div>

      {/* Cards Container */}
      <div className="bg-[#F6F5F3] pt-0 pb-3 sm:pb-4 px-3 sm:px-4 rounded-b-none md:rounded-b-[4px] space-y-3 sm:space-y-4">
        {/* Modular Feature Campaign Block */}
        {modBlockImage && (
          <div className="block w-full rounded-[4px] overflow-hidden shadow-sm">
            <img
              src={modBlockImage}
              alt="Character Store Campaign"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Carousel Slider Row with Perfectly Centered Navigation Buttons */}
        <div className="relative group/slider">
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

          {/* Cards Track */}
          <div
            ref={sliderRef}
            onScroll={checkScroll}
            className="flex items-center gap-3 sm:gap-4 overflow-x-auto scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {cards.map((char, i) => (
              <div
                key={char.id || i}
                className="relative flex-none w-[calc(50%-6px)] sm:w-[calc(33.33%-11px)] lg:w-[calc(25%-12px)] rounded-[4px] overflow-hidden aspect-[291/152.25] bg-neutral-900 shadow-sm"
              >
                <img
                  src={char.img}
                  alt={char.title}
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
      </div>
    </section>
  );
}
