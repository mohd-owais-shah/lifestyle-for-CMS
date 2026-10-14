export function CartPromoBanner({
  bannerImageUrl,
  bannerMobileImageUrl,
  onOpenOffers,
}) {
  const hasDesktop = Boolean(bannerImageUrl);
  const hasMobile = Boolean(bannerMobileImageUrl);

  if (!hasDesktop && !hasMobile) return null;

  return (
    <div className="relative overflow-hidden bg-[#EFE8DE] -mx-4 sm:-mx-6 lg:mx-0 lg:w-full lg:rounded-2xl lg:mb-5 lg:border lg:border-[#EBE1D5] lg:shadow-xs">
      {/* Banner Graphic loaded from Shopify metaobject: responsive for mobile and desktop */}
      <picture>
        {hasMobile && (
          <source
            media="(max-width: 767px)"
            srcSet={bannerMobileImageUrl}
          />
        )}
        {hasDesktop && (
          <source
            media="(min-width: 768px)"
            srcSet={bannerImageUrl}
          />
        )}
        <img
          src={bannerImageUrl || bannerMobileImageUrl}
          alt="Limited Time Offer Banner"
          className="w-full h-auto block object-cover"
          loading="eager"
        />
      </picture>

      {/* Desktop Buttons (stacked vertically on the right side) */}
      <div className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-1 sm:gap-1.5 z-10">
        <button
          type="button"
          onClick={onOpenOffers}
          className="px-4 lg:px-5 py-2 lg:py-2.5 bg-[#C49B76] hover:bg-[#B38A65] active:bg-[#A37B56] text-white text-xs lg:text-sm font-bold rounded sm:rounded-md transition-colors cursor-pointer whitespace-nowrap shadow-xs"
        >
          Unlock Now
        </button>
        <button
          type="button"
          onClick={onOpenOffers}
          className="text-xs lg:text-sm text-[#8C7355] hover:text-[#5c4731] font-medium cursor-pointer"
        >
          Details
        </button>
      </div>

      {/* Mobile Buttons: placed cleanly below the coupon cards without overlapping */}
      <div className="flex md:hidden items-center justify-center gap-6 py-2.5 sm:py-3 bg-[#EFE8DE] -mt-1 relative z-10">
        <button
          type="button"
          onClick={onOpenOffers}
          className="px-4 py-1.5 bg-[#BE9873] hover:bg-[#AD8864] active:bg-[#9C7754] text-white text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
        >
          Unlock Now
        </button>
        <button
          type="button"
          onClick={onOpenOffers}
          className="text-xs text-[#BE9873] hover:text-[#8C6B49] font-semibold cursor-pointer"
        >
          Details
        </button>
      </div>
    </div>
  );
}
