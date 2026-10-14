import {useRef, useState, useEffect} from 'react';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';

export function CartFrequentlyBoughtTogether({products = []}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  const scroll = (direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="mt-6 lg:mt-10 mb-6 lg:mb-8 lg:border-t border-gray-200 lg:pt-8 relative">
      {/* Section Title matching Screenshot 4 */}
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
        Frequently Bought Together
      </h3>

      <div className="relative group">
        {/* Scroll Left Button */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="absolute -left-3 top-1/3 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 cursor-pointer transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Carousel Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-3 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
        >
          {products.map((product) => {
            const image = product.featuredImage;
            const minPrice = parseFloat(product.priceRange?.minVariantPrice?.amount || '0');

            return (
              <div
                key={product.id}
                className="w-[145px] sm:w-[165px] md:w-[180px] shrink-0 flex flex-col bg-white"
              >
                {/* Product Image */}
                <Link
                  to={`/products/${product.handle}`}
                  className="block relative aspect-3/4 overflow-hidden rounded-xs bg-gray-50"
                >
                  {image ? (
                    <Image
                      data={image}
                      alt={image.altText || product.title}
                      className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                      No image
                    </div>
                  )}
                </Link>

                {/* Price & Title matching Screenshot 4 */}
                <div className="mt-2.5">
                  <span className="text-sm font-bold text-gray-900">
                    ₹{Math.round(minPrice).toLocaleString('en-IN')}
                  </span>
                  <Link to={`/products/${product.handle}`} className="block mt-1">
                    <h4 className="text-xs text-gray-800 font-normal line-clamp-2 leading-snug hover:text-gray-600 uppercase tracking-tight">
                      {product.vendor ? `${product.vendor} ` : ''}{product.title}
                    </h4>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll Right Button matching Screenshot 4 circle arrow */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="absolute -right-3 top-1/3 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 cursor-pointer transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
