import {useState, useEffect, useCallback} from 'react';
import {BLANK_IMAGE, cdnImageLoader} from '~/lib/shopifyImage';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';

/**
 * @param {{
 *   slider?: { show: boolean, slides: Array<any> },
 *   banners?: { show: boolean, items: Array<any> },
 *   collections?: { show: boolean, items: Array<any> }
 * }} props
 */
export function DepartmentHero({slider, banners, collections}) {
  return (
    <div className="department-hero w-full">
      {/* 1. Slider Section */}
      {slider?.show && slider.slides?.length > 0 && (
        <>
          <HeroSliderView slides={slider.slides} />
          <hr className="w-full h-[8px] bg-[#ECEDEB] border-none m-0 flex-shrink-0 block sm:hidden" />
        </>
      )}

      {/* 2. Banners Section */}
      {banners?.show && banners.items?.length > 0 && (
        <>
          <div className="page-width mx-auto py-4 sm:py-8">
            <div className="flex flex-col gap-4 sm:gap-6">
              {banners.items.map((banner, index) => {
                const bannerKey = banner.id || `banner-${index}`;
                return (
                  <div key={bannerKey} className="w-full">
                    {banner.link ? (
                      <Link to={banner.link} className="block w-full">
                        <Image
                          loader={cdnImageLoader}
                          data={banner.image}
                          alt={banner.altText || 'Banner'}
                          className={`${banner.mobileImage && banner.mobileImage.url !== banner.image.url ? 'hidden sm:block' : ''} w-full h-auto object-cover`}
                          sizes="(min-width: 1200px) 1200px, 100vw"
                        />
                        {banner.mobileImage && banner.mobileImage.url !== banner.image.url && (
                          <Image
                            loader={cdnImageLoader}
                            data={banner.mobileImage}
                            alt={banner.altText || 'Banner'}
                            className="sm:hidden w-full h-auto object-cover"
                            sizes="100vw"
                          />
                        )}
                      </Link>
                    ) : (
                      <div className="w-full">
                        <Image
                          loader={cdnImageLoader}
                          data={banner.image}
                          alt={banner.altText || 'Banner'}
                          className={`${banner.mobileImage && banner.mobileImage.url !== banner.image.url ? 'hidden sm:block' : ''} w-full h-auto object-cover`}
                          sizes="(min-width: 1200px) 1200px, 100vw"
                        />
                        {banner.mobileImage && banner.mobileImage.url !== banner.image.url && (
                          <Image
                            loader={cdnImageLoader}
                            data={banner.mobileImage}
                            alt={banner.altText || 'Banner'}
                            className="sm:hidden w-full h-auto object-cover"
                            sizes="100vw"
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <hr className="w-full h-[8px] bg-[#ECEDEB] border-none m-0 flex-shrink-0 block sm:hidden" />
        </>
      )}

      {/* 3. Collections Section */}
      {collections?.show && collections.items?.length > 0 && (
        <>
          <div className="page-width mx-auto py-4 sm:py-8 overflow-hidden">
            <div 
              className="flex overflow-x-auto snap-x snap-mandatory gap-2 pb-4 sm:grid sm:gap-4 md:gap-6 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              style={{ gridTemplateColumns: `repeat(${collections.items.length}, minmax(0, 1fr))` }}
            >
              {[...collections.items]
                .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                .map((collection, index) => {
                  const collectionKey = collection.id || `collection-${index}`;
                  return (
                    <div
                      key={collectionKey}
                      className="snap-start shrink-0 w-[45%] sm:w-full flex flex-col items-center"
                    >
                      {collection.link ? (
                        <Link
                          to={collection.link}
                          className="group block w-full text-center"
                        >
                          <Image
                            loader={cdnImageLoader}
                            data={collection.image}
                            alt={collection.title || 'Collection'}
                            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                            sizes="(min-width: 768px) 20vw, 50vw"
                          />
                        </Link>
                      ) : (
                        <div className="w-full block text-center">
                          <Image
                            loader={cdnImageLoader}
                            data={collection.image}
                            alt={collection.title || 'Collection'}
                            className="w-full h-auto object-cover"
                            sizes="(min-width: 768px) 20vw, 50vw"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
          <hr className="w-full h-[8px] bg-[#ECEDEB] border-none m-0 flex-shrink-0 block sm:hidden" />
        </>
      )}
    </div>
  );
}

/**
 * Hero slider view component
 * @param {{slides: Array<any>}} props
 */
function HeroSliderView({slides}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  // Next slide
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  // Previous slide
  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-play with pause on hover
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide, slides.length]);

  // Touch swipe handlers
  const handleTouchStart = (e) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
      prevSlide();
    }
  };

  return (
    <div
      id="hero_banner_wrapper"
      className="w-full bg-white pt-2 sm:pt-4 lg:pt-[20px] pb-2 sm:pb-0 overflow-hidden 2xl:overflow-visible max-w-[var(--page-width)] mx-auto px-0 sm:px-6"
    >
      <section
        className="relative w-full px-0"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-label="Hero Slider"
      >
        {/* Responsive slide track */}
        <div className="relative w-full overflow-hidden rounded-none bg-neutral-100">
          <div
            className="flex w-full transition-transform duration-500 ease-in-out items-center"
            style={{transform: `translateX(-${currentSlide * 100}%)`}}
          >
            {slides.map((slide, index) => {
              const slideKey = slide.id || `hero-slide-${index}`;
              const slideLink = slide.buttonLink || slide.link;
              const slideContent = (
                <div className="relative w-full">
                  {/* Responsive images */}
                  {slide.mobileImage ? (
                    <>
                      {/* Mobile image (blank source ≥640px, where it's hidden,
                          so desktop doesn't download it) */}
                      <picture className="contents">
                        <source media="(min-width: 640px)" srcSet={BLANK_IMAGE} />
                        <Image
                          loader={cdnImageLoader}
                          data={slide.mobileImage}
                          alt={slide.altText}
                          sizes="100vw"
                          className="w-full h-auto block sm:hidden pointer-events-none"
                          loading={index === 0 ? 'eager' : 'lazy'}
                          fetchpriority={index === 0 ? 'high' : undefined}
                        />
                      </picture>
                      {/* Desktop image (blank source <640px, where it's hidden) */}
                      <picture className="contents">
                        <source media="(max-width: 639.98px)" srcSet={BLANK_IMAGE} />
                        <Image
                          loader={cdnImageLoader}
                          data={slide.desktopImage || slide.image}
                          alt={slide.altText}
                          sizes="(min-width: 1232px) 1232px, 100vw"
                          className="w-full h-auto hidden sm:block pointer-events-none"
                          loading={index === 0 ? 'eager' : 'lazy'}
                          fetchpriority={index === 0 ? 'high' : undefined}
                        />
                      </picture>
                    </>
                  ) : (
                    slide.image && (
                      <Image
                        loader={cdnImageLoader}
                        data={slide.image}
                        alt={slide.altText}
                        sizes="(min-width: 1232px) 1232px, 100vw"
                        className="w-full h-auto block pointer-events-none"
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    )
                  )}
                </div>
              );

              return (
                <div
                  key={slideKey}
                  className="w-full shrink-0 grow-0 basis-full relative"
                  aria-hidden={index !== currentSlide}
                >
                  {slideLink ? (
                    <Link
                      to={slideLink}
                      className="block w-full"
                    >
                      {slideContent}
                    </Link>
                  ) : (
                    slideContent
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation arrows */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="hidden sm:flex absolute left-2 sm:left-3 2xl:-left-6 top-[48%] -translate-y-1/2 z-20 items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-[#212121] shadow-[0px_1px_1px_rgba(0,0,0,0.15),0px_2px_10px_rgba(0,0,0,0.08)] cursor-pointer"
            >
              <svg
                className="w-5 h-5 text-[#212121]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.4}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="hidden sm:flex absolute right-2 sm:right-3 2xl:-right-6 top-[48%] -translate-y-1/2 z-20 items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-[#212121] shadow-[0px_1px_1px_rgba(0,0,0,0.15),0px_2px_10px_rgba(0,0,0,0.08)] cursor-pointer"
            >
              <svg
                className="w-5 h-5 text-[#212121]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.4}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Pagination dots */}
            <div className="pt-2 sm:pt-3 pb-[20px] flex justify-center items-center gap-1">
              {slides.map((slide, index) => {
                const dotKey = slide.id ? `dot-${slide.id}` : `dot-slide-${index}`;
                const isActive = index === currentSlide;
                return (
                  <button
                    key={dotKey}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`transition-all duration-500 ease-in-out rounded-[30px] ${
                      isActive
                        ? 'w-4 h-1 bg-[#FAA619]'
                        : 'w-1 h-1 bg-[#C8C9C6] hover:bg-neutral-500'
                    }`}
                  />
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
