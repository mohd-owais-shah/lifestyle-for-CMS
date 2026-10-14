import {useRef, useState, useEffect} from 'react';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {useAccountWishlist} from '~/hooks/useAccountWishlist';
import {WishlistHeartIcon} from '~/components/WishlistHeartIcon';

function RecommendationCard({product, formatPrice}) {
  const featuredImg = product.featuredImage || product.images?.nodes?.[0];
  const price = product.priceRange?.minVariantPrice?.amount;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice?.amount;
  const hasDiscount =
    compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price);

  const hasVendorInTitle =
    product.vendor &&
    product.title.toLowerCase().startsWith(product.vendor.toLowerCase());

  const {
    isSaved,
    toggle: toggleWishlist,
    error: wishlistError,
  } = useAccountWishlist(product);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist();
  };

  return (
    <div className="shrink-0 w-[155px] sm:w-[210px] md:w-[230px] lg:w-[calc(20%-13px)] snap-start">
      {/* Image container with live Wishlist heart button */}
      <div className="relative aspect-[3/4] bg-[#F5F5F5] overflow-hidden mb-2 rounded-none">
        <Link to={`/products/${product.handle}`} className="block w-full h-full">
          {featuredImg ? (
            <Image
              data={featuredImg}
              aspectRatio="3/4"
              className="w-full h-full object-cover"
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 30vw, 45vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-xs text-gray-400">
              No Image
            </div>
          )}
        </Link>

        {/* Wishlist Button (matching Live PDP heart button) */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 hover:bg-white flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.12)] text-[#141414] transition cursor-pointer z-10 border-0 p-0"
          aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={isSaved}
        >
          <WishlistHeartIcon saved={isSaved} width={18} height={19} />
        </button>
        {wishlistError && (
          <span className="sr-only" role="status">
            {wishlistError}
          </span>
        )}
      </div>

      {/* Info matching Live: ₹Price first, then Title/Brand */}
      <div>
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="text-[14px] sm:text-[15px] font-bold text-[#000000]">
            ₹{formatPrice(price)}
          </span>
          {hasDiscount && (
            <span className="text-[12px] sm:text-[13px] text-[#929391] line-through font-normal">
              ₹{formatPrice(compareAtPrice)}
            </span>
          )}
        </div>

        <Link
          to={`/products/${product.handle}`}
          className="block text-[12px] sm:text-[13px] text-[#000000] font-normal leading-[1.3] line-clamp-2 hover:underline"
          title={product.title}
        >
          {product.vendor && !hasVendorInTitle ? (
            <>
              <span className="uppercase font-semibold mr-1">
                {product.vendor}
              </span>
              {product.title}
            </>
          ) : (
            product.title
          )}
        </Link>
      </div>
    </div>
  );
}

/**
 * Product Recommendations / Carousel matching LIVE Lifestyle Store PDP
 * - 5 items per row on desktop
 * - Floating side carousel buttons (left/right on edges)
 * - Wishlist heart+plus circular button
 * - Price bold on top + Title line-clamp-2
 * STRICT RULE: Only renders when dynamic items exist. If empty, returns null!
 */
export function ProductRecommendations({
  title = 'You may also like',
  products = [],
  recommendations,
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const items = (products && products.length > 0) ? products : (recommendations || []);

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    const {scrollLeft, scrollWidth, clientWidth} = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollButtons, {passive: true});
      window.addEventListener('resize', updateScrollButtons);
    }
    return () => {
      if (el) el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [items]);

  // STRICT: Do not show statically if not available
  if (!items || !Array.isArray(items) || items.length === 0) {
    return null;
  }

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const clientWidth = scrollContainerRef.current.clientWidth;
    const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  const formatPrice = (amount) => {
    return Math.round(parseFloat(amount || '0')).toLocaleString('en-IN');
  };

  return (
    <section className="pt-6 sm:pt-[36px] mb-2 sm:mb-4">
      {/* Heading matching Live */}
      <h2 className="text-[20px] sm:text-[30px] font-normal text-[#000000] font-['Figtree-Regular',sans-serif] mb-3 sm:mb-4 tracking-normal leading-tight">
        {title}
      </h2>

      {/* Carousel container with floating side arrow buttons */}
      <div className="relative group">
        {/* Floating Left Arrow */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute left-1 sm:-left-5 top-[38%] -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.18)] flex items-center justify-center text-[#000000] hover:bg-gray-50 transition z-20 cursor-pointer border-0"
            aria-label="Previous"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-[#141414]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Floating Right Arrow */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute right-1 sm:-right-5 top-[38%] -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.18)] flex items-center justify-center text-[#000000] hover:bg-gray-50 transition z-20 cursor-pointer border-0"
            aria-label="Next"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-[#141414]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Horizontal Scroll list: 2 + peeking on mobile, 5 per row on desktop */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-1 scrollbar-none snap-x"
          style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
        >
          {items.map((product) => (
            <RecommendationCard
              key={product.id}
              product={product}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
