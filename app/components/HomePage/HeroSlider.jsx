import {useState, useEffect, useCallback} from 'react';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {
  parseBooleanSetting,
  parseIntegerSetting,
  parseItemVisibility,
  parseSectionSettings,
} from '~/lib/homeSectionSettings';

/**
 * GraphQL fragment for hero slider metaobject
 */
export const HERO_SLIDER_FRAGMENT = `#graphql
  fragment HeroSliderSlideFields on Metaobject {
    id
    handle
    type
    fields {
      key
      value
      reference {
        ... on MediaImage {
          id
          image {
            url
            altText
            width
            height
          }
        }
        ... on Collection {
          id
          handle
          title
        }
        ... on Metaobject {
          id
          handle
          type
          fields {
            key
            value
            reference {
              ... on MediaImage {
                id
                image {
                  url
                  altText
                  width
                  height
                }
              }
              ... on Metaobject {
                id
                handle
                type
                fields {
                  key
                  value
                  reference {
                    ... on MediaImage {
                      id
                      image {
                        url
                        altText
                        width
                        height
                      }
                    }
                  }
                }
              }
            }
            references(first: 20) {
              nodes {
                ... on Metaobject {
                  id
                  handle
                  type
                  fields {
                    key
                    value
                    reference {
                      ... on MediaImage {
                        id
                        image {
                          url
                          altText
                          width
                          height
                        }
                      }
                    }
                  }
                }
                ... on MediaImage {
                  id
                  image {
                    url
                    altText
                    width
                    height
                  }
                }
              }
            }
          }
        }
      }
      references(first: 50) {
        nodes {
          ... on Metaobject {
            id
            handle
            type
            fields {
              key
              value
              reference {
                ... on MediaImage {
                  id
                  image {
                    url
                    altText
                    width
                    height
                  }
                }
                ... on Metaobject {
                  id
                  handle
                  type
                  fields {
                    key
                    value
                    reference {
                      ... on MediaImage {
                        id
                        image {
                          url
                          altText
                          width
                          height
                        }
                      }
                    }
                    references(first: 20) {
                      nodes {
                        ... on Metaobject {
                          id
                          handle
                          type
                          fields {
                            key
                            value
                            reference {
                              ... on MediaImage {
                                id
                                image {
                                  url
                                  altText
                                  width
                                  height
                                }
                              }
                            }
                          }
                        }
                        ... on MediaImage {
                          id
                          image {
                            url
                            altText
                            width
                            height
                          }
                        }
                      }
                    }
                  }
                }
              }
              references(first: 50) {
                nodes {
                  ... on Metaobject {
                    id
                    handle
                    type
                    fields {
                      key
                      value
                      reference {
                        ... on MediaImage {
                          id
                          image {
                            url
                            altText
                            width
                            height
                          }
                        }
                      }
                    }
                  }
                  ... on MediaImage {
                    id
                    image {
                      url
                      altText
                      width
                      height
                    }
                  }
                }
              }
            }
          }
          ... on MediaImage {
            id
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }

  fragment HeroSliderMetaobject on Metaobject {
    id
    handle
    type
    fields {
      key
      value
      reference {
        ... on MediaImage {
          id
          image {
            url
            altText
            width
            height
          }
        }
        ... on Collection {
          id
          handle
          title
        }
        ... on Metaobject {
          id
          handle
          type
          fields {
            key
            value
            reference {
              ... on MediaImage {
                id
                image {
                  url
                  altText
                  width
                  height
                }
              }
              ... on Metaobject {
                id
                handle
                type
                fields {
                  key
                  value
                  reference {
                    ... on MediaImage {
                      id
                      image {
                        url
                        altText
                        width
                        height
                      }
                    }
                    ... on Metaobject {
                      id
                      handle
                      type
                      fields {
                        key
                        value
                        reference {
                          ... on MediaImage {
                            id
                            image {
                              url
                              altText
                              width
                              height
                            }
                          }
                        }
                      }
                    }
                  }
                  references(first: 50) {
                    nodes {
                      ... on Metaobject {
                        id
                        handle
                        type
                        fields {
                          key
                          value
                          reference {
                            ... on MediaImage {
                              id
                              image {
                                url
                                altText
                                width
                                height
                              }
                            }
                          }
                        }
                      }
                      ... on MediaImage {
                        id
                        image {
                          url
                          altText
                          width
                          height
                        }
                      }
                    }
                  }
                }
              }
            }
            references(first: 50) {
              nodes {
                ... on Metaobject {
                  id
                  handle
                  type
                  fields {
                    key
                    value
                    reference {
                      ... on MediaImage {
                        id
                        image {
                          url
                          altText
                          width
                          height
                        }
                      }
                    }
                  }
                }
                ... on MediaImage {
                  id
                  image {
                    url
                    altText
                    width
                    height
                  }
                }
              }
            }
          }
        }
        ... on Collection {
          id
          handle
          title
          image {
            url
            altText
            width
            height
          }
        }
        ... on Product {
          id
          handle
          title
          featuredImage {
            url
            altText
            width
            height
          }
        }
      }
      references(first: 50) {
        nodes {
          ...HeroSliderSlideFields
          ... on MediaImage {
            id
            image {
              url
              altText
              width
              height
            }
          }
          ... on Collection {
            id
            handle
            title
            image {
              url
              altText
              width
              height
            }
          }
          ... on Product {
            id
            handle
            title
            featuredImage {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

/**
 * Map metaobject fields into key-value object
 * @param {Array<{key: string, value: string, reference?: any, references?: any}>} fields
 */
/** Responsive srcset for a Shopify CDN image (CDN resizes via `width`). */
function shopifySrcSet(url) {
  const separator = url.includes('?') ? '&' : '?';
  return [640, 960, 1280, 1600, 2000, 2400]
    .map((width) => `${url}${separator}width=${width} ${width}w`)
    .join(', ');
}

function mapMetaobjectFields(fields = []) {
  const mapped = {};
  for (const field of fields) {
    mapped[field.key] = field;
  }
  return mapped;
}

/** Default autoplay interval (ms) when no timer field is set */
const DEFAULT_SLIDER_INTERVAL_MS = 3500;

const TIMER_KEYS = [
  'slider_time',
  'slider_timer',
  'slide_timer',
  'timer',
  'autoplay_speed',
  'autoplay_interval',
];
const AUTOPLAY_KEYS = ['auto_slide', 'autoplay'];

/** First field among `keys` that has a value, from any of the field maps. */
function firstFieldValue(fieldMaps, keys) {
  for (const map of fieldMaps) {
    for (const key of keys) {
      const value = map?.[key]?.value;
      if (value !== undefined && value !== null && value !== '') return value;
    }
  }
  return undefined;
}

/**
 * Read section-level settings from the hero-slider metaobject.
 * Unset fields fall back to the previous hard-coded behaviour.
 * Timer / autoplay can be set on the section or, as in the admin today, on
 * the slides (`slider_time`, `auto_slide`); the section wins, then the first
 * slide that sets one.
 * @param {Record<string, any>} fields
 * @param {Array<Record<string, any>>} [slideFieldMaps]
 */
function parseHeroSliderSettings(fields, slideFieldMaps = []) {
  const sources = [fields, ...slideFieldMaps];

  // Timer: values up to 60 are treated as seconds, larger values as ms.
  // 0 disables autoplay.
  const timerValue = parseIntegerSetting(firstFieldValue(sources, TIMER_KEYS));
  let intervalMs = DEFAULT_SLIDER_INTERVAL_MS;
  if (timerValue !== null && timerValue >= 0) {
    intervalMs = timerValue <= 60 ? timerValue * 1000 : timerValue;
  }
  const autoplay =
    parseBooleanSetting(firstFieldValue(sources, AUTOPLAY_KEYS), true) &&
    intervalMs > 0;

  return {
    ...parseSectionSettings(fields),
    autoplay,
    intervalMs,
  };
}

/**
 * Extract slide data from metaobject node
 * @param {any} node
 */
function extractSlideData(node) {
  if (!node) return null;

  // Image node reference
  if (node.image && node.image.url) {
    return {
      id: node.id,
      image: node.image,
      desktopImage: node.image,
      mobileImage: node.image,
      title: node.image.altText || '',
      subtitle: '',
      buttonText: '',
      buttonLink: '',
      sortOrder: 0,
    };
  }

  // Nested metaobject fields
  if (node.fields) {
    const fieldMap = mapMetaobjectFields(node.fields);

    // Field lookup helper
    const getField = (...keys) => {
      for (const k of keys) {
        if (fieldMap[k]) return fieldMap[k];
        const lower = k.toLowerCase().replace(/[-_\s]/g, '');
        const match = Object.keys(fieldMap).find(
          (fk) => fk.toLowerCase().replace(/[-_\s]/g, '') === lower,
        );
        if (match) return fieldMap[match];
      }
      return null;
    };

    // Desktop and mobile image fields
    const desktopImageField =
      getField('desktop_image', 'desktopImage', 'desktop_banner', 'banner', 'image', 'slide_image') ||
      Object.values(fieldMap).find(
        (f) => f.reference && (f.reference.image || f.reference.__typename === 'MediaImage'),
      );

    const mobileImageField =
      getField('mobile_image', 'mobileImage', 'image_mobile', 'mobile_banner', 'mobile');

    const desktopImage = desktopImageField?.reference?.image || null;
    const mobileImage = mobileImageField?.reference?.image || null;
    const image = desktopImage || mobileImage;

    // Alt text, link, and sort order
    const altTextField = getField('alt_text', 'altText');
    const altText =
      altTextField?.value ||
      desktopImage?.altText ||
      mobileImage?.altText ||
      '';

    let buttonLink =
      getField('url', 'link', 'button_link')?.value || '';

    if (buttonLink) {
      try {
        if (buttonLink.startsWith('http')) {
          const pUrl = new URL(buttonLink);
          buttonLink = pUrl.pathname + pUrl.search + pUrl.hash;
        }
      } catch (e) {}
      buttonLink = buttonLink.replace(/(^\/?collection\/)/, '/collections/');
    }

    const sortOrderVal = getField('sort_order', 'sortOrder', 'order')?.value;
    const sortOrder =
      sortOrderVal !== undefined && sortOrderVal !== null
        ? parseInt(sortOrderVal, 10)
        : 0;

    // Per-slide toggles: only an explicit "false" hides the slide
    const {enabled, desktopEnable, mobileEnable} =
      parseItemVisibility(fieldMap);

    return {
      id: node.id,
      image,
      desktopImage,
      mobileImage,
      altText,
      buttonLink,
      enabled,
      desktopEnable,
      mobileEnable,
      sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
    };
  }

  return null;
}

/**
 * Parse hero slider metaobject data
 * @param {any} metaobjectData
 */
export function parseHeroSliderData(metaobjectData) {
  if (!metaobjectData) return null;

  let heroSliderEntry = null;

  // Direct node pass
  if (metaobjectData.handle === 'hero-slider' || (metaobjectData.fields && !metaobjectData.heroSliderMetaobject && !metaobjectData.homePageMetaobjects && !metaobjectData.homePageSections)) {
    heroSliderEntry = metaobjectData;
  }

  // Lookup by handle
  if (!heroSliderEntry && metaobjectData.heroSliderMetaobject) {
    heroSliderEntry = metaobjectData.heroSliderMetaobject;
  }

  // Lookup by list query (homePageSections or homePageMetaobjects)
  const listNodes = metaobjectData.homePageSections?.nodes || metaobjectData.homePageMetaobjects?.nodes;
  if (!heroSliderEntry && listNodes) {
    heroSliderEntry =
      listNodes.find(
        (node) =>
          node.handle === 'hero-slider' ||
          node.handle === 'hero_slider' ||
          node.fields?.some(
            (f) =>
              (f.key === 'display_name' || f.key === 'name' || f.key === 'title') &&
              f.value?.toLowerCase() === 'hero slider',
          ) ||
          node.fields?.some(
            (f) => f.value && f.value.toLowerCase() === 'hero slider',
          ),
      ) || null;
  }

  if (!heroSliderEntry || !heroSliderEntry.fields) {
    return null;
  }

  const fields = mapMetaobjectFields(heroSliderEntry.fields);
  const sectionHeading = fields.heading?.value || fields.title_name?.value || '';

  // Extract slide references
  const sectionDataField =
    fields.section_data ||
    fields.sectionData ||
    Object.values(fields).find((f) => f.references?.nodes?.length > 0);

  const rawSlides = sectionDataField?.references?.nodes || [];
  const settings = parseHeroSliderSettings(
    fields,
    rawSlides.map((node) => mapMetaobjectFields(node?.fields)),
  );

  // Hidden on both breakpoints: render nothing
  if (!settings.desktopEnable && !settings.mobileEnable) {
    return null;
  }

  const slides = rawSlides
    .map(extractSlideData)
    .filter(
      (slide) =>
        slide &&
        slide.enabled !== false &&
        (slide.desktopImage || slide.mobileImage || slide.image),
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Return null if no dynamic slides exist
  if (slides.length === 0) {
    return null;
  }

  return {
    heading: sectionHeading,
    settings,
    slides,
  };
}

/**
 * Hero slider section component
 * @param {{data: any}} props
 */
export function HeroSlider({data}) {
  const sliderData = parseHeroSliderData(data);

  // Return null if no dynamic slides
  if (!sliderData || !sliderData.slides || sliderData.slides.length === 0) {
    return null;
  }

  // Slides can be turned off per breakpoint (desktop_enable / mobile_enable
  // on the slide). Same slides on both -> one slider; otherwise one slider
  // per breakpoint, each showing only its own slides.
  const {slides, settings} = sliderData;
  const desktopSlides = slides.filter((slide) => slide.desktopEnable !== false);
  const mobileSlides = slides.filter((slide) => slide.mobileEnable !== false);
  if (
    desktopSlides.length === slides.length &&
    mobileSlides.length === slides.length
  ) {
    return <HeroSliderView sliderData={sliderData} />;
  }

  return (
    <>
      {settings.mobileEnable && mobileSlides.length > 0 && (
        <HeroSliderView
          sliderData={{
            ...sliderData,
            slides: mobileSlides,
            settings: {...settings, desktopEnable: false},
          }}
        />
      )}
      {settings.desktopEnable && desktopSlides.length > 0 && (
        <HeroSliderView
          sliderData={{
            ...sliderData,
            slides: desktopSlides,
            settings: {...settings, mobileEnable: false},
          }}
        />
      )}
    </>
  );
}

/**
 * Hero slider view component
 * @param {{sliderData: {heading: string, slides: Array<any>}}} props
 */
function HeroSliderView({sliderData}) {
  const {slides} = sliderData;
  const settings = sliderData.settings || parseHeroSliderSettings({});
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

  // Auto-play with pause on hover (interval from metaobject timer setting)
  useEffect(() => {
    if (!settings.autoplay || isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, settings.intervalMs);

    return () => clearInterval(timer);
  }, [settings.autoplay, settings.intervalMs, isPaused, nextSlide, slides.length]);

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

  // Breakpoint visibility (sm = 640px, same breakpoint as mobile/desktop images)
  let visibilityClass = '';
  if (!settings.desktopEnable) visibilityClass = 'sm:hidden';
  else if (!settings.mobileEnable) visibilityClass = 'hidden sm:block';

  // Padding: metaobject values (px) when set, otherwise the original defaults
  const paddingClasses = [
    settings.mobileTopPadding !== null ? 'pt-[var(--hero-pt-mobile)]' : 'pt-0',
    settings.desktopTopPadding !== null
      ? 'sm:pt-[var(--hero-pt-desktop)]'
      : 'sm:pt-4 lg:pt-[20px]',
    settings.mobileBottomPadding !== null ? 'pb-[var(--hero-pb-mobile)]' : 'pb-0',
    settings.desktopBottomPadding !== null ? 'sm:pb-[var(--hero-pb-desktop)]' : '',
  ].join(' ');

  const wrapperStyle = {
    ...(settings.bgColor ? {backgroundColor: settings.bgColor} : {}),
    ...(settings.mobileTopPadding !== null
      ? {'--hero-pt-mobile': `${settings.mobileTopPadding}px`}
      : {}),
    ...(settings.desktopTopPadding !== null
      ? {'--hero-pt-desktop': `${settings.desktopTopPadding}px`}
      : {}),
    ...(settings.mobileBottomPadding !== null
      ? {'--hero-pb-mobile': `${settings.mobileBottomPadding}px`}
      : {}),
    ...(settings.desktopBottomPadding !== null
      ? {'--hero-pb-desktop': `${settings.desktopBottomPadding}px`}
      : {}),
  };

  return (
    <div
      id={
        settings.desktopEnable
          ? 'hero_banner_wrapper'
          : 'hero_banner_wrapper_mobile'
      }
      className={`w-full bg-white ${paddingClasses} overflow-hidden 2xl:overflow-visible ${visibilityClass}`}
      style={wrapperStyle}
    >
      <section
        className="relative max-w-[1232px] mx-auto px-0"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-label="Hero Slider"
      >
        {/* Responsive slide track */}
        <div className="relative w-full overflow-hidden rounded-none aspect-[4/5] sm:aspect-[1232/585] bg-neutral-100">
          <div
            className="flex w-full h-full transition-transform duration-500 ease-in-out"
            style={{transform: `translateX(-${currentSlide * 100}%)`}}
          >
            {slides.map((slide, index) => {
              const slideKey = slide.id || `hero-slide-${index}`;
              // Skip image sources for a breakpoint that is disabled
              const mobileImage = settings.mobileEnable ? slide.mobileImage : null;
              const showDesktopSource = settings.desktopEnable;
              const slideContent = (
                <div className="relative w-full h-full">
                  {/* Responsive images */}
                  {mobileImage ? (
                    // One <picture> instead of two always-loaded <img>s: the
                    // browser downloads only the mobile OR the desktop banner.
                    <picture>
                      {showDesktopSource && (slide.desktopImage || slide.image)?.url && (
                        <source
                          media="(min-width: 640px)"
                          srcSet={shopifySrcSet(
                            (slide.desktopImage || slide.image).url,
                          )}
                          sizes="(min-width: 1232px) 1232px, 100vw"
                        />
                      )}
                      <Image
                        data={mobileImage}
                        alt={slide.altText}
                        sizes="100vw"
                        className="w-full h-full object-cover object-top sm:object-center block pointer-events-none"
                        loading={index === 0 ? 'eager' : 'lazy'}
                        fetchpriority={index === 0 ? 'high' : undefined}
                      />
                    </picture>
                  ) : (
                    slide.image && (
                      <Image
                        data={slide.image}
                        alt={slide.altText}
                        sizes="(min-width: 1232px) 1232px, 100vw"
                        className="w-full h-full object-cover object-center pointer-events-none"
                        loading={index === 0 ? 'eager' : 'lazy'}
                        fetchpriority={index === 0 ? 'high' : undefined}
                      />
                    )
                  )}
                </div>
              );

              return (
                <div
                  key={slideKey}
                  className="w-full h-full shrink-0 grow-0 basis-full relative"
                  aria-hidden={index !== currentSlide}
                >
                  {slide.buttonLink ? (
                    <Link
                      to={slide.buttonLink}
                      className="block w-full h-full"
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
