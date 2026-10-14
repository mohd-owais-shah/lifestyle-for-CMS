import {useEffect} from 'react';
import {ProductReviewSection} from '~/components/pdp/ProductReviewSection';

export {StarIcon, StarRatingRow} from '~/components/pdp/ProductReviewStars';

/**
 * Full-screen mobile reviews modal — matches React Native ReviewsModal layout.
 */
export function ProductReviewsModal({
  isOpen,
  visible,
  onClose,
  reviews = [],
  review = [],
  data,
  disableWriteReview = false,
}) {
  const isShown = visible !== undefined ? visible : isOpen;

  useEffect(() => {
    if (!isShown || typeof document === 'undefined') return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow || 'unset';
    };
  }, [isShown]);

  if (!isShown) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-white lg:hidden animate-in slide-in-from-right duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-reviews-modal-title"
    >
      {/* Full-screen header (back | title | close) */}
      <div
        className="grid shrink-0 grid-cols-[44px_1fr_44px] items-center border-b border-[#EEEEEE] bg-white px-[15px]"
        style={{
          height: 'calc(54px + env(safe-area-inset-top, 0px))',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="flex h-[44px] w-[44px] items-center justify-start border-0 bg-transparent p-1 cursor-pointer"
          aria-label="Go back"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#111"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <h2
          id="pdp-reviews-modal-title"
          className="truncate text-center text-[16px] font-bold leading-tight text-[#111111]"
        >
          Ratings &amp; Reviews
        </h2>

        <button
          type="button"
          onClick={onClose}
          className="flex h-[44px] w-[44px] items-center justify-end border-0 bg-transparent p-1.5 cursor-pointer"
          aria-label="Close reviews"
        >
          <span className="text-[18px] font-bold leading-none text-[#444444]">✕</span>
        </button>
      </div>

      <div
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{paddingBottom: 'calc(40px + env(safe-area-inset-bottom, 0px))'}}
      >
        <ProductReviewSection
          reviews={reviews}
          data={data}
          disableWriteReview={disableWriteReview}
        />
      </div>
    </div>
  );
}
