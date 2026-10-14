import {useRef, useCallback, useState, useEffect} from 'react';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {cdnImageLoader} from '~/lib/shopifyImage';
import {SectionHeading} from '~/components/small-uis/SectionHeading';

/**
 * Reusable component for displaying a department section (banner + collections)
 * with highly configurable layouts for desktop and mobile.
 *
 * @param {{
 *   heading?: string,
 *   banner?: {
 *     desktopImage?: any,
 *     mobileImage?: any,
 *     desktopAlt?: string,
 *     mobileAlt?: string,
 *     link?: string
 *   },
 *   bannerPosition?: 'top' | 'bottom' | 'none',
 *   collections?: Array<{
 *     id: string,
 *     image: any,
 *     title?: string,
 *     link?: string
 *   }>,
 *   desktopCardsPerRow?: 2 | 3 | 4 | 5 | 6,
 *   desktopView?: 'slider' | 'gallery',
 *   mobileView?: 'slider' | 'gallery',
 *   mobileCardsPerRow?: 1 | 2 | 3 | 4,
 *   className?: string
 * }} props
 */
export function DepartmentShowcase({
  heading,
  banner,
  bottomBanner,
  bannerPosition = 'none',
  collections = [],
  desktopCardsPerRow = 4,
  desktopView = 'slider',
  mobileView = 'slider',
  mobileCardsPerRow = 2,
  cardShape = 'rectangle', // 'rectangle' or 'circle'
  titlePosition = 'bottom', // 'bottom' or 'overlay'
  className = '',
}) {
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // --- Scroll Logic for Sliders ---
  const handleScroll = useCallback(() => {
    if (sliderRef.current && (desktopView === 'slider' || mobileView === 'slider')) {
      const {scrollLeft, scrollWidth, clientWidth} = sliderRef.current;
      setShowLeftArrow(scrollLeft > 5);

      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 0) {
        setShowRightArrow(true);
      } else {
        setShowRightArrow(Math.ceil(scrollLeft) < maxScroll - 5);
      }
    }
  }, [desktopView, mobileView]);

  useEffect(() => {
    if (desktopView === 'slider' || mobileView === 'slider') {
      handleScroll();
      window.addEventListener('resize', handleScroll);
      return () => window.removeEventListener('resize', handleScroll);
    }
  }, [handleScroll, desktopView, mobileView]);

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

  // --- Layout Classes ---
  // Compute Tailwind classes depending on view configuration
  const desktopGridColsClass = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
  }[desktopCardsPerRow] || 'lg:grid-cols-4';

  const desktopSlideWidthClass = {
    2: 'lg:w-[calc((100%-16px)/2)]',
    3: 'lg:w-[calc((100%-32px)/3)]',
    4: 'lg:w-[calc((100%-48px)/4)]',
    5: 'lg:w-[calc((100%-64px)/5)]',
    6: 'lg:w-[calc((100%-80px)/6)]',
  }[desktopCardsPerRow] || 'lg:w-[calc((100%-48px)/4)]';

  let layoutClasses = [];
  
  const mobileGridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[mobileCardsPerRow] || 'grid-cols-2';

  // Mobile layout
  if (mobileView === 'slider') {
    layoutClasses.push('flex', 'overflow-x-auto', 'scroll-smooth', 'snap-x', 'snap-mandatory');
  } else {
    layoutClasses.push('grid', mobileGridColsClass);
  }

  // Desktop layout
  if (desktopView === 'slider') {
    layoutClasses.push('lg:flex', 'lg:overflow-x-auto', 'lg:scroll-smooth', 'lg:snap-x', 'lg:snap-mandatory');
  } else {
    layoutClasses.push('lg:grid', desktopGridColsClass);
    // Reset flex styles if mobile was slider
    if (mobileView === 'slider') {
      layoutClasses.push('lg:overflow-visible', 'lg:snap-none');
    }
  }

  const containerClass = `gap-3 sm:gap-4 lg:gap-4 py-2 px-2 lg:px-0 no-scrollbar ${layoutClasses.join(' ')}`;

  let itemClasses = ['transition-transform', 'duration-300'];
  
  // Mobile sizing
  if (mobileView === 'slider') {
    itemClasses.push('shrink-0', 'w-[calc((100%-12px)/2.3)]', 'sm:w-[calc((100%-32px)/3)]', 'snap-start');
  } else {
    itemClasses.push('w-full');
  }

  // Desktop sizing
  if (desktopView === 'slider') {
    itemClasses.push('lg:shrink-0', desktopSlideWidthClass, 'lg:snap-start');
  } else {
    itemClasses.push('lg:w-full', 'lg:shrink');
  }

  const cardContainerClass = itemClasses.join(' ');

  // --- Render Sub-Elements ---
  const bannerElement = hasBannerImage(banner) && bannerPosition !== 'none' && (
    <div className="relative w-full overflow-hidden rounded-2xl leading-none">
      {banner.link ? (
        <Link to={banner.link} className="block w-full h-full">
          <BannerImages banner={banner} />
        </Link>
      ) : (
        <BannerImages banner={banner} />
      )}
    </div>
  );

  const bottomBannerElement = hasBannerImage(bottomBanner) && (
    <div className="relative w-full overflow-hidden rounded-2xl leading-none">
      {bottomBanner.link ? (
        <Link to={bottomBanner.link} className="block w-full h-full">
          <BannerImages banner={bottomBanner} />
        </Link>
      ) : (
        <BannerImages banner={bottomBanner} />
      )}
    </div>
  );

  const cardsElement = collections && collections.length > 0 && (
    <div className="relative pb-1">
      {/* Navigation Arrows for Desktop Slider */}
      {desktopView === 'slider' && collections.length > desktopCardsPerRow && (
        <>
          {showLeftArrow && (
            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Previous slide"
              className="hidden lg:flex absolute left-2 lg:-left-4 top-[45%] -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full bg-white text-[#212121] shadow-[0px_1px_1px_rgba(0,0,0,0.15),0px_2px_10px_rgba(0,0,0,0.08)] cursor-pointer transition-opacity duration-300"
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
              className="hidden lg:flex absolute right-2 lg:-right-4 top-[45%] -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full bg-white text-[#212121] shadow-[0px_1px_1px_rgba(0,0,0,0.15),0px_2px_10px_rgba(0,0,0,0.08)] cursor-pointer transition-opacity duration-300"
            >
              <svg className="w-5 h-5 text-[#212121]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </>
      )}

      {/* Cards Container */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className={containerClass}
        style={desktopView === 'slider' || mobileView === 'slider' ? {scrollbarWidth: 'none', msOverflowStyle: 'none'} : {}}
      >
        {collections.map((card, index) => {
          const cardKey = card.id || `dept-card-${index}`;
          const hasDimensions = card.image?.width && card.image?.height;
          const containerStyle = hasDimensions
            ? { aspectRatio: `${card.image.width} / ${card.image.height}` }
            : (cardShape === 'circle' ? { aspectRatio: '1 / 1' } : {});

          const cardContent = (
            <div className="flex flex-col items-center">
              <div
                className={`relative w-full transition-transform duration-300 overflow-hidden group ${
                  cardShape === 'circle' ? 'bg-transparent rounded-full' : 'rounded-lg'
                }`}
                style={containerStyle}
              >
                <Image
                  loader={cdnImageLoader}
                  data={card.image}
                  alt={card.altText || card.title || `${heading || 'Collection'} card ${index + 1}`}
                  sizes="(min-width: 1024px) 293px, (min-width: 640px) 31vw, 42vw"
                  className={`w-full pointer-events-none ${hasDimensions ? 'h-full' : 'h-auto'} ${
                    cardShape === 'circle' ? 'object-contain' : (hasDimensions ? 'object-cover' : 'object-contain')
                  }`}
                  loading="lazy"
                />
                {card.badge && (
                  <div className="absolute top-2 left-2 bg-[#ffcc00] text-black text-[10px] font-bold px-2 py-1 uppercase rounded-sm z-10">
                    {card.badge}
                  </div>
                )}
                {titlePosition === 'overlay' && card.title && (
                  <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent pt-8 pb-3">
                    <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-bold sm:font-extrabold uppercase truncate text-center tracking-wide">
                      {card.title}
                    </h3>
                  </div>
                )}
              </div>
              {((titlePosition !== 'overlay' && card.title) || card.priceText) && (
                <div className="mt-3 text-center">
                  {titlePosition !== 'overlay' && card.title && (
                    <h3 className="text-[#212121] text-sm sm:text-base font-semibold truncate max-w-full px-2">
                      {card.title}
                    </h3>
                  )}
                  {card.priceText && (
                    <p className="text-[#4b4b4b] text-xs sm:text-sm mt-1">
                      {card.priceText}
                    </p>
                  )}
                </div>
              )}
            </div>
          );

          return (
            <div key={cardKey} className={cardContainerClass}>
              {card.link ? (
                <Link to={card.link} className="block w-full h-full">
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
  );

  return (
    <div className={`w-full bg-white overflow-hidden pb-0 sm:pb-10 ${className}`}>
      {heading && (
        <section className="relative max-w-[1244px] mx-auto px-4 sm:px-6 lg:px-0">
          <SectionHeading heading={heading} />
        </section>
      )}

      {/* Top Banner */}
      {bannerPosition === 'top' && bannerElement && (
        <section className={`relative max-w-[1244px] mx-auto px-0 sm:px-6 lg:px-0 ${heading ? 'mt-4' : ''}`}>
          {bannerElement}
        </section>
      )}

      {/* Collections Grid/Slider */}
      {cardsElement && (
        <section className={`relative max-w-[1244px] mx-auto px-4 sm:px-6 lg:px-0 ${bannerPosition === 'top' && bannerElement ? 'mt-4 sm:mt-6 lg:mt-8' : (heading ? 'mt-4' : '')}`}>
          {cardsElement}
        </section>
      )}

      {/* Bottom Banner(s) */}
      {bannerPosition === 'bottom' && bannerElement && (
        <section className={`relative max-w-[1244px] mx-auto px-0 sm:px-6 lg:px-0 ${cardsElement ? 'mt-4 sm:mt-6 lg:mt-8' : (heading ? 'mt-4' : '')}`}>
          {bannerElement}
        </section>
      )}
      {bottomBannerElement && (
        <section className={`relative max-w-[1244px] mx-auto px-0 sm:px-6 lg:px-0 ${(cardsElement || bannerElement) ? 'mt-4 sm:mt-6 lg:mt-8' : (heading ? 'mt-4' : '')}`}>
          {bottomBannerElement}
        </section>
      )}
    </div>
  );
}

/** Callers pass `{url: undefined}` when the source data has no image. */
function hasBannerImage(banner) {
  return Boolean(banner?.desktopImage?.url || banner?.mobileImage?.url);
}

function BannerImages({banner}) {
  if (!banner) return null;
  const desktopImage = banner.desktopImage?.url ? banner.desktopImage : null;
  const mobileImage = banner.mobileImage?.url ? banner.mobileImage : null;

  const hasDeskDims = desktopImage?.width && desktopImage?.height;
  const deskStyle = hasDeskDims ? { aspectRatio: `${desktopImage.width} / ${desktopImage.height}` } : {};

  const hasMobDims = mobileImage?.width && mobileImage?.height;
  const mobStyle = hasMobDims ? { aspectRatio: `${mobileImage.width} / ${mobileImage.height}` } : {};

  return (
    <div className="relative w-full overflow-hidden rounded-none sm:rounded-2xl leading-none">
      {mobileImage && (
        <div
          className="w-full block sm:hidden overflow-hidden rounded-none sm:rounded-2xl"
          style={mobStyle}
        >
          <Image
            loader={cdnImageLoader}
            data={mobileImage}
            alt={banner.mobileAlt || banner.desktopAlt || 'Banner'}
            sizes="100vw"
            className="w-full h-auto object-cover rounded-none sm:rounded-2xl pointer-events-none block"
            loading="lazy"
          />
        </div>
      )}
      {desktopImage && (
        <div
          className={`w-full ${
            mobileImage ? 'hidden sm:block' : 'block'
          } overflow-hidden rounded-none sm:rounded-2xl`}
          style={deskStyle}
        >
          <Image
            loader={cdnImageLoader}
            data={desktopImage}
            alt={banner.desktopAlt || 'Banner'}
            sizes="(min-width: 1244px) 1244px, 100vw"
            className="w-full h-auto object-cover rounded-none sm:rounded-2xl pointer-events-none block"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}

export default DepartmentShowcase;
