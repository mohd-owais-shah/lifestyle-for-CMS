import {useState, useRef} from 'react';
import {Image} from '@shopify/hydrogen';
import {useAccountWishlist} from '~/hooks/useAccountWishlist';
import {BLANK_IMAGE} from '~/lib/shopifyImage';
import {WishlistHeartIcon} from '~/components/WishlistHeartIcon';

/**
 * Product Image Gallery matching Lifestyle Store layout:
 * - Desktop: 2-column image grid with promo badges
 * - Mobile: Swipeable image slider with counter (e.g. 1/4)
 * - Click to open full-screen lightbox modal
 */
export function ProductGallery({
  images = [],
  product,
  selectedVariantImage,
  tags = [],
  isOnSale,
}) {
  const [activeModalIndex, setActiveModalIndex] = useState(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const {
    isSaved: isFavourite,
    toggle: toggleFavourite,
    error: wishlistError,
  } = useAccountWishlist(product);
  const mobileSliderRef = useRef(null);

  // Collect all unique images
  const allImages = [...images];
  if (
    selectedVariantImage &&
    !allImages.some((img) => img.url === selectedVariantImage.url)
  ) {
    allImages.unshift(selectedVariantImage);
  }

  if (allImages.length === 0) {
    return (
      <div className="w-full aspect-[3/4] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
        No images available
      </div>
    );
  }

  // Check for dynamic badges from tags or sale status
  const hasBogoTag = tags?.some(
    (t) =>
      t.toLowerCase().includes('bogo') ||
      t.toLowerCase().includes('buy 1 get 1'),
  );
  const hasNewTag = tags?.some(
    (t) => t.toLowerCase() === 'new' || t.toLowerCase().includes('fresh'),
  );

  const handleMobileScroll = () => {
    if (!mobileSliderRef.current) return;
    const { scrollLeft, clientWidth } = mobileSliderRef.current;
    const index = Math.round(scrollLeft / clientWidth);
    setMobileActiveIndex(index);
  };

  return (
    <div className="w-full relative">
      {/* MOBILE GALLERY: Horizontal Scroll with dots & wishlist (matching Live Lifestyle Store mobile PDP) */}
      <div className="block lg:hidden relative -mx-4 lg:mx-0">
        <div
          ref={mobileSliderRef}
          onScroll={handleMobileScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none aspect-[3/4] w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allImages.map((image, index) => (
            <button
              type="button"
              key={image.id || image.url || `mobile-slide-${index}`}
              className="snap-center shrink-0 w-full h-full relative cursor-pointer p-0 border-none bg-transparent text-left"
              onClick={() => setActiveModalIndex(index)}
              aria-label={`View image ${index + 1}`}
            >
              {/* Mobile carousel is hidden ≥1024px: give the browser a blank
                  source there so desktop never downloads these photos */}
              <picture className="contents">
                <source media="(min-width: 1024px)" srcSet={BLANK_IMAGE} />
                <Image
                  data={image}
                  aspectRatio="3/4"
                  className="w-full h-full object-cover rounded-none"
                  sizes="100vw"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchpriority={index === 0 ? 'high' : undefined}
                />
              </picture>
              {/* Badges on first image */}
              {index === 0 && (
                <>
                  {(hasBogoTag || isOnSale) && (
                    <div className="absolute top-3 left-3 bg-[#141414] text-white text-[10px] tracking-wider font-semibold uppercase px-2.5 py-1 z-10">
                      {hasBogoTag ? 'BUY 1 GET 1' : 'SALE'}
                    </div>
                  )}
                  {hasNewTag && (
                    <div className="absolute top-3 right-3 bg-white text-[#141414] text-[10px] tracking-wider font-semibold uppercase px-2.5 py-1 border border-gray-200 z-10 shadow-sm">
                      NEW
                    </div>
                  )}
                </>
              )}
            </button>
          ))}
        </div>

        {/* Floating favourite button on mobile — custom heart + badge icon */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavourite();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.15)] z-20 cursor-pointer p-0 border-none flex items-center justify-center"
          aria-label={
            isFavourite ? 'Remove from favourites' : 'Add to favourites'
          }
          aria-pressed={isFavourite}
        >
          <svg width={22} height={21} viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Heart */}
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              fill={isFavourite ? '#E53935' : 'none'}
              stroke={isFavourite ? '#E53935' : '#1A1A1A'}
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Circle Badge */}
            <circle
              cx="17"
              cy="18"
              r="5.4"
              fill={isFavourite ? '#E53935' : '#FFFFFF'}
              stroke={isFavourite ? '#FFFFFF' : '#1A1A1A'}
              strokeWidth={1.5}
            />
            {/* Plus (unfaved) or Checkmark (faved) */}
            {isFavourite ? (
              <path
                d="M14.7 17.9L16.4 19.6L19.3 16.3"
                stroke="#FFFFFF"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M14.7 18H19.3M17 15.7V20.3"
                stroke="#1A1A1A"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </button>
        {wishlistError && (
          <span className="sr-only" role="status">
            {wishlistError}
          </span>
        )}

        {/* Mobile Dots Bar — #212121 background, 28px tall, phone-only */}
        {allImages.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-7 bg-[#212121]/70 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
            {allImages.map((image, index) => (
              <div
                key={image.id || image.url || `dot-${index}`}
                className={`rounded-full transition-all duration-200 ${mobileActiveIndex === index
                    ? 'w-2 h-2 bg-[#FAA619]'
                    : 'w-1.5 h-1.5 bg-white/60'
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* DESKTOP GALLERY: 2-Column Grid (exact Lifestyle Store layout, completely untouched) */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-3 w-full">
        {allImages.map((image, index) => {
          return (
            <button
              type="button"
              key={image.id || image.url || `desktop-tile-${index}`}
              className="relative overflow-hidden bg-gray-50 cursor-zoom-in group p-0 border-none text-left w-full"
              onClick={() => setActiveModalIndex(index)}
              aria-label={`Zoom image ${index + 1}`}
            >
              <div className="aspect-[3/4] w-full relative overflow-hidden rounded-none">
                {/* Desktop grid is hidden <1024px: blank source there so
                    phones don't download these photos twice */}
                <picture className="contents">
                  <source media="(max-width: 1023.98px)" srcSet={BLANK_IMAGE} />
                  <Image
                    data={image}
                    aspectRatio="3/4"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-none"
                    sizes="(min-width: 1024px) 30vw, 50vw"
                    loading={index < 2 ? 'eager' : 'lazy'}
                    fetchpriority={index === 0 ? 'high' : undefined}
                  />
                </picture>
              </div>

              {/* Badges on the first image */}
              {index === 0 && (
                <>
                  {(hasBogoTag || isOnSale) && (
                    <div className="absolute top-4 left-4 bg-[#141414] text-white text-[11px] tracking-wider font-semibold uppercase px-3 py-1 z-10 shadow-sm">
                      {hasBogoTag ? 'BUY 1 GET 1' : 'SALE'}
                    </div>
                  )}
                  {hasNewTag && (
                    <div className="absolute top-4 right-4 bg-white text-[#141414] text-[11px] tracking-wider font-semibold uppercase px-3 py-1 border border-gray-200 z-10 shadow-sm">
                      NEW
                    </div>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {activeModalIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery fullscreen view"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop button */}
          <button
            type="button"
            aria-label="Close modal overlay"
            className="fixed inset-0 bg-black/90 backdrop-blur-sm cursor-default w-full h-full border-none outline-none"
            onClick={() => setActiveModalIndex(null)}
          />

          <button
            type="button"
            className="absolute top-4 right-4 text-white text-3xl font-light hover:opacity-80 p-2 z-50 cursor-pointer"
            onClick={() => setActiveModalIndex(null)}
            aria-label="Close modal"
          >
            ✕
          </button>

          {/* Prev Button */}
          {allImages.length > 1 && (
            <button
              type="button"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl z-50 transition cursor-pointer"
              onClick={() => {
                setActiveModalIndex((prev) =>
                  prev > 0 ? prev - 1 : allImages.length - 1,
                );
              }}
              aria-label="Previous image"
            >
              ‹
            </button>
          )}

          <div className="max-h-[90vh] max-w-[85vw] flex items-center justify-center relative z-20 pointer-events-none">
            <Image
              data={allImages[activeModalIndex]}
              className="max-h-[90vh] max-w-[85vw] object-contain rounded-none pointer-events-auto"
              sizes="90vw"
            />
          </div>

          {/* Next Button */}
          {allImages.length > 1 && (
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl z-50 transition cursor-pointer"
              onClick={() => {
                setActiveModalIndex((prev) =>
                  prev < allImages.length - 1 ? prev + 1 : 0,
                );
              }}
              aria-label="Next image"
            >
              ›
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm z-20 pointer-events-none">
            {activeModalIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
