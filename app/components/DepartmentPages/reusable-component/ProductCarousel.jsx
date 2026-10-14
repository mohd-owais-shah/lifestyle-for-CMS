import {useRef, useCallback, useState, useEffect} from 'react';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {SectionHeading} from '~/components/small-uis/SectionHeading';

export function ProductCarousel({
  heading,
  products = [],
  desktopCardsPerRow = 5,
  mobileCardsPerRow = 2.3,
  className = '',
}) {
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = useCallback(() => {
    if (sliderRef.current) {
      const {scrollLeft, scrollWidth, clientWidth} = sliderRef.current;
      setShowLeftArrow(scrollLeft > 5);

      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 0) {
        setShowRightArrow(true);
      } else {
        setShowRightArrow(Math.ceil(scrollLeft) < maxScroll - 5);
      }
    }
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [handleScroll]);

  const scrollLeft = useCallback(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({left: -300, behavior: 'smooth'});
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({left: 300, behavior: 'smooth'});
    }
  }, []);

  const desktopSlideWidthClass = {
    4: 'lg:w-[calc((100%-48px)/4)]',
    5: 'lg:w-[calc((100%-64px)/5)]',
    6: 'lg:w-[calc((100%-80px)/6)]',
  }[desktopCardsPerRow] || 'lg:w-[calc((100%-64px)/5)]';

  const containerClass = `flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-3 sm:gap-4 lg:gap-4 py-2 px-2 lg:px-0 no-scrollbar`;
  const cardContainerClass = `shrink-0 w-[calc((100%-12px)/2.3)] sm:w-[calc((100%-32px)/3)] snap-start lg:shrink-0 ${desktopSlideWidthClass} lg:snap-start transition-transform duration-300`;

  if (!products || products.length === 0) return null;

  return (
    <div className={`w-full bg-white overflow-hidden pb-0 sm:pb-10 ${className}`}>
      {heading && (
        <section className="relative max-w-[1244px] mx-auto px-4 sm:px-6 lg:px-0">
          <SectionHeading heading={heading} />
        </section>
      )}

      <section className={`relative max-w-[1244px] mx-auto px-4 sm:px-6 lg:px-0 ${heading ? 'mt-4' : ''}`}>
        <div className="relative pb-1">
          {products.length > desktopCardsPerRow && (
            <>
              {showLeftArrow && (
                <button
                  type="button"
                  onClick={scrollLeft}
                  aria-label="Previous slide"
                  className="hidden lg:flex absolute left-2 lg:-left-4 top-[40%] -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full bg-white text-[#212121] shadow-[0px_1px_1px_rgba(0,0,0,0.15),0px_2px_10px_rgba(0,0,0,0.08)] cursor-pointer transition-opacity duration-300"
                >
                  <svg className="w-5 h-5 text-[#212121]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              {showRightArrow && (
                <button
                  type="button"
                  onClick={scrollRight}
                  aria-label="Next slide"
                  className="hidden lg:flex absolute right-2 lg:-right-4 top-[40%] -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full bg-white text-[#212121] shadow-[0px_1px_1px_rgba(0,0,0,0.15),0px_2px_10px_rgba(0,0,0,0.08)] cursor-pointer transition-opacity duration-300"
                >
                  <svg className="w-5 h-5 text-[#212121]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </>
          )}

          <div ref={sliderRef} onScroll={handleScroll} className={containerClass} style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            {products.map((product, index) => {
              const cardKey = product.id || `prod-card-${index}`;
              const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price);
              const formattedOriginalPrice = product.original_price ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.original_price) : null;
              
              const cardContent = (
                <div className="flex flex-col group h-full">
                  <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      data={product.image}
                      alt={product.title}
                      sizes="(min-width: 1024px) 293px, (min-width: 640px) 31vw, 42vw"
                      className="w-full h-full object-cover pointer-events-none transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {product.discount_badge && (
                      <div className="absolute top-2 left-2 bg-[#d9232d] text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm z-10">
                        {product.discount_badge}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex flex-col flex-grow">
                    <h3 className="text-[#212121] text-sm font-medium line-clamp-2 leading-snug flex-grow">
                      {product.title}
                    </h3>
                    <div className="mt-2 flex items-center flex-wrap gap-2">
                      <span className="text-[#212121] font-bold text-sm sm:text-base">{formattedPrice}</span>
                      {formattedOriginalPrice && (
                        <span className="text-[#878787] text-xs sm:text-sm line-through">{formattedOriginalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              );

              return (
                <div key={cardKey} className={cardContainerClass}>
                  {product.link ? (
                    <Link to={product.link} className="block w-full h-full">
                      {cardContent}
                    </Link>
                  ) : (
                    cardContent
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
