import {useState, useMemo, useEffect, useRef} from 'react';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {useAccountWishlist} from '~/hooks/useAccountWishlist';
import {WishlistHeartIcon} from '~/components/WishlistHeartIcon';

// Cap the number of images rendered per card. Hover-cycling does not need the
// full media set (which can include one image per variant and reach 100+),
// and rendering every image inflates the DOM and hydration cost of the grid.
const MAX_HOVER_IMAGES = 8;

/**
 * Format currency amount cleanly with Indian rupee symbol
 */
function formatRupee(amount) {
  if (amount == null) return '';
  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(num)) return `₹${amount}`;
  return `₹${Math.round(num).toLocaleString('en-IN')}`;
}

export function PlpProductCard({product, loading = 'lazy'}) {
  const [isHovered, setIsHovered] = useState(false);
  // Hidden hover-slideshow images are rendered on first hover (stays true)
  const [slidesActivated, setSlidesActivated] = useState(false);
  const timerRef = useRef(null);
  const isTransitioningRef = useRef(false);
  const {
    isSaved: isWishlisted,
    toggle: toggleWishlist,
    error: wishlistError,
  } = useAccountWishlist(product);

  // Extract all distinct images for hover cycling
  const allImages = useMemo(() => {
    if (!product) return [];
    const list = [];
    const seenUrls = new Set();

    if (product.featuredImage?.url) {
      list.push(product.featuredImage);
      seenUrls.add(product.featuredImage.url);
    }

    if (product.images?.nodes?.length) {
      for (const img of product.images.nodes) {
        if (img?.url && !seenUrls.has(img.url)) {
          list.push(img);
          seenUrls.add(img.url);
        }
      }
    }

    if (product.variants?.nodes?.length) {
      for (const v of product.variants.nodes) {
        if (v?.image?.url && !seenUrls.has(v.image.url)) {
          list.push(v.image);
          seenUrls.add(v.image.url);
        }
      }
    }

    return list.slice(0, MAX_HOVER_IMAGES);
  }, [product]);

  const hasMultipleImages = allImages.length > 1;

  // Prepare slides with clones for infinite smooth loop:
  // [Last Image, Image 0, Image 1, ..., Image N-1, Image 0]
  const slides = useMemo(() => {
    if (allImages.length <= 1) {
      return allImages.map((img) => ({
        ...img,
        slideKey: img.id || img.url,
      }));
    }
    const first = allImages[0];
    const last = allImages[allImages.length - 1];
    return [
      {...last, slideKey: `clone-start-${last.id || last.url}`},
      ...allImages.map((img, i) => ({
        ...img,
        slideKey: `slide-${i}-${img.id || img.url}`,
      })),
      {...first, slideKey: `clone-end-${first.id || first.url}`},
    ];
  }, [allImages]);

  // Initial index is 1 (the first real image) when multiple images exist, else 0
  const [slideIndex, setSlideIndex] = useState(() =>
    allImages.length > 1 ? 1 : 0,
  );
  const [isAnimating, setIsAnimating] = useState(true);

  // Restore animation after an instant clone jump
  useEffect(() => {
    if (!isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (isHovered && hasMultipleImages) {
      timerRef.current = setInterval(() => {
        if (!isTransitioningRef.current) {
          isTransitioningRef.current = true;
          setIsAnimating(true);
          setSlideIndex((prev) => prev + 1);
        }
      }, 1600);
    }
  };

  // Auto-scroll next image continuously on hover
  useEffect(() => {
    if (!isHovered || !hasMultipleImages) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      if (!isTransitioningRef.current) {
        isTransitioningRef.current = true;
        setIsAnimating(true);
        setSlideIndex((prev) => prev + 1);
      }
    }, 1600);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isHovered, hasMultipleImages]);

  if (!product) return null;

  const productUrl = `/products/${product.handle}`;

  // Pricing calculations
  const minPrice =
    product.priceRange?.minVariantPrice?.amount ||
    product.selectedOrFirstAvailableVariant?.price?.amount;
  const compareAtPrice =
    product.compareAtPriceRange?.minVariantPrice?.amount ||
    product.variants?.nodes?.[0]?.compareAtPrice?.amount ||
    product.selectedOrFirstAvailableVariant?.compareAtPrice?.amount;

  const parsedMinPrice = minPrice ? parseFloat(minPrice) : 0;
  const parsedCompareAt = compareAtPrice ? parseFloat(compareAtPrice) : 0;
  const hasDiscount = parsedCompareAt > parsedMinPrice;
  const discountPercent = hasDiscount
    ? Math.round(((parsedCompareAt - parsedMinPrice) / parsedCompareAt) * 100)
    : 0;

  // Brand Name
  const brandName = product.vendor || 'LIFESTYLE';

  // Promo badge (from tags, metafields, or discount)
  let promoBadge = null;
  if (product.tags) {
    const promoTag = product.tags.find(
      (t) =>
        t.toLowerCase().includes('buy') ||
        t.toLowerCase().includes('off') ||
        t.toLowerCase().includes('special') ||
        t.toLowerCase().includes('bestseller'),
    );
    if (promoTag) {
      promoBadge = promoTag.toUpperCase();
    }
  }
  if (!promoBadge && discountPercent >= 15) {
    promoBadge = `${discountPercent}% OFF`;
  }
  if (!promoBadge) {
    promoBadge = 'BUY 1 GET 1';
  }

  const handleMouseEnter = () => {
    setSlidesActivated(true);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    isTransitioningRef.current = false;
    setIsAnimating(false);
    setSlideIndex(hasMultipleImages ? 1 : 0);
    setTimeout(() => {
      setIsAnimating(true);
    }, 20);
  };

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasMultipleImages || isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsAnimating(true);
    setSlideIndex((prev) => prev - 1);
    resetTimer();
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasMultipleImages || isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsAnimating(true);
    setSlideIndex((prev) => prev + 1);
    resetTimer();
  };

  const handleTransitionEnd = () => {
    isTransitioningRef.current = false;
    if (slideIndex >= slides.length - 1) {
      setIsAnimating(false);
      setSlideIndex(1);
    } else if (slideIndex <= 0) {
      setIsAnimating(false);
      setSlideIndex(allImages.length);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist();
  };

  const cleanTitle = product.title
    .toLowerCase()
    .startsWith(brandName.toLowerCase())
    ? product.title.slice(brandName.length).trim()
    : product.title;

  return (
    <div
      className="group relative flex flex-col bg-white"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. Image Container (3:4 Portrait Ratio) */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#F4F4F4] rounded-none sm:rounded-xs select-none">
        <Link
          to={productUrl}
          prefetch="intent"
          className="block w-full h-full relative overflow-hidden"
        >
          {slides.length > 0 && (
            <div
              className={`flex w-full h-full ${
                isAnimating
                  ? 'transition-transform duration-500 ease-in-out'
                  : ''
              }`}
              style={{
                transform: `translateX(-${slideIndex * 100}%)`,
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {slides.map((img, idx) => {
                // Only the visible slide is needed until the shopper hovers
                // the card (the hover slideshow/arrows are the only way to see
                // the others); this avoids downloading hidden slides on every
                // card, especially on touch devices where they never show.
                const isInitialSlide = idx === (hasMultipleImages ? 1 : 0);
                return (
                  <div
                    key={img.slideKey}
                    className="w-full h-full shrink-0 flex-shrink-0 relative overflow-hidden"
                  >
                    {(isInitialSlide || slidesActivated) && (
                      <Image
                        data={img}
                        alt={img.altText || product.title}
                        loading={isInitialSlide ? loading : 'eager'}
                        sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
                        className="w-full h-full object-cover pointer-events-none"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Link>

        {/* Previous Image Arrow Button (Matching Live Site Screenshot) */}
        {hasMultipleImages && (
          <button
            type="button"
            onClick={handlePrevImage}
            aria-label="Previous image"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#7e848e]/85 hover:bg-[#626772] active:scale-90 text-white flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer pointer-events-auto"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Next Image Arrow Button (Matching Live Site Screenshot) */}
        {hasMultipleImages && (
          <button
            type="button"
            onClick={handleNextImage}
            aria-label="Next image"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#7e848e]/85 hover:bg-[#626772] active:scale-90 text-white flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer pointer-events-auto"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {/* Wishlist Floating Button (Top Right matching Live Site Heart+Plus) */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={
            isWishlisted ? 'Remove from favorites' : 'Add to favorites'
          }
          aria-pressed={isWishlisted}
          className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white border border-gray-200/90 shadow-2xs flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
        >
          <WishlistHeartIcon saved={isWishlisted} width={18} height={19} />
        </button>
        {wishlistError && (
          <span className="sr-only" role="status">
            {wishlistError}
          </span>
        )}

        {/* Promo Badge Capsule at Bottom Center (Matching Live Site Screenshot) */}
        <div className="absolute bottom-2.5 inset-x-0 z-10 flex justify-center pointer-events-none">
          <span className="bg-white text-gray-950 text-[10px] sm:text-[11px] font-bold tracking-wider px-3 py-0.5 sm:py-1 rounded-[2px] shadow-sm uppercase">
            {promoBadge || 'NEW'}
          </span>
        </div>
      </div>

      {/* 2. Product Details */}
      <div className="pt-2.5 pb-2 px-2 sm:px-0 flex flex-col">
        {/* Price Row: Offer Price, Strikethrough MRP, Discount */}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-base sm:text-[17px] font-bold text-gray-950 tracking-tight">
            {formatRupee(parsedMinPrice)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-xs sm:text-[13px] text-gray-400 line-through font-normal">
                {formatRupee(parsedCompareAt)}
              </span>
              <span className="text-xs sm:text-[13px] font-bold text-[#038847]">
                ({discountPercent}% OFF)
              </span>
            </>
          )}
        </div>

        {/* Brand Name + Product Title (Matching Lifestyle Stores) */}
        <Link
          to={productUrl}
          prefetch="intent"
          className="mt-1 group-hover:text-black"
        >
          <h3 className="text-xs sm:text-[13px] text-gray-800 line-clamp-2 leading-snug">
            <span className="font-bold text-black uppercase mr-1">
              {brandName}
            </span>
            <span className="font-normal text-gray-700">{cleanTitle}</span>
          </h3>
        </Link>
      </div>
    </div>
  );
}
