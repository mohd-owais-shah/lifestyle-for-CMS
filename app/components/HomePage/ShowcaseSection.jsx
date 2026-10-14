import {useRef, useCallback, useState, useEffect} from 'react';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {SectionHeading} from '../small-uis/SectionHeading';
import {resolveTargetUrl} from '~/lib/urlUtils';

/**
 * Lean, high-performance GraphQL fragments for showcase section metaobjects
 */
export const SHOWCASE_FRAGMENT = `#graphql
  fragment ShowcaseMediaImage on MediaImage {
    id
    image {
      url
      altText
      width
      height
    }
  }

  fragment ShowcaseBannerItem on Metaobject {
    id
    handle
    fields {
      key
      value
      reference {
        ...ShowcaseMediaImage
        ... on Collection {
          id
          handle
          title
        }
      }
      references(first: 10) {
        nodes {
          ... on Collection {
            id
            handle
            title
          }
        }
      }
    }
  }

  fragment ShowcaseCardItem on Metaobject {
    id
    handle
    fields {
      key
      value
      reference {
        ...ShowcaseMediaImage
        ... on Collection {
          id
          handle
          title
        }
      }
      references(first: 10) {
        nodes {
          ... on Collection {
            id
            handle
            title
          }
        }
      }
    }
  }

  fragment ShowcaseDataNode on Metaobject {
    id
    handle
    type
    fields {
      key
      value
      reference {
        ...ShowcaseBannerItem
        ...ShowcaseMediaImage
        ... on Collection {
          id
          handle
          title
        }
      }
      references(first: 100) {
        nodes {
          ... on Metaobject {
            ...ShowcaseCardItem
          }
          ... on Collection {
            id
            handle
            title
          }
        }
      }
    }
  }

  fragment ShowcaseSectionMetaobject on Metaobject {
    id
    handle
    type
    fields {
      key
      value
      reference {
        ... on Metaobject {
          id
          handle
          type
          fields {
            key
            value
            reference {
              ...ShowcaseBannerItem
              ...ShowcaseMediaImage
              ... on Collection {
                id
                handle
                title
              }
            }
            references(first: 100) {
              nodes {
                ... on Metaobject {
                  ...ShowcaseCardItem
                }
                ... on Collection {
                  id
                  handle
                  title
                }
              }
            }
          }
        }
        ... on Collection {
          id
          handle
          title
        }
      }
      references(first: 10) {
        nodes {
          ... on Metaobject {
            ...ShowcaseDataNode
          }
          ... on Collection {
            id
            handle
            title
          }
        }
      }
    }
  }
`;

/**
 * Single unified query calling home_page metaobject once for all sections
 */
export const HOME_PAGE_SECTIONS_QUERY = `#graphql
  ${SHOWCASE_FRAGMENT}
  query HomePageSections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    homePageSections: metaobjects(type: "home_page", first: 50) {
      nodes {
        ...ShowcaseSectionMetaobject
      }
    }
  }
`;

/**
 * Multi-section query for all homepage showcase sections
 */
export const SHOWCASE_SECTIONS_QUERY = `#graphql
  ${SHOWCASE_FRAGMENT}
  query HomePageShowcaseSections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    bestsellers: metaobject(handle: {handle: "bestseller", type: "home_page"}) {
      ...ShowcaseSectionMetaobject
    }
    topBrands: metaobject(handle: {handle: "top-brands-on-lifestyle-collections", type: "home_page"}) {
      ...ShowcaseSectionMetaobject
    }
    festiveEdit: metaobject(handle: {handle: "festive-edit", type: "home_page"}) {
      ...ShowcaseSectionMetaobject
    }
    homeLiving: metaobject(handle: {handle: "all-new-home-living-store", type: "home_page"}) {
      ...ShowcaseSectionMetaobject
    }
    babyShop: metaobject(handle: {handle: "babyshop", type: "home_page"}) {
      ...ShowcaseSectionMetaobject
    }
  }
`;

/**
 * Helper to map metaobject fields array into a key-value object
 * @param {Array<{key: string, value: string, reference?: any, references?: any}>} fields
 */
function mapMetaobjectFields(fields = []) {
  const mapped = {};
  for (const field of fields) {
    mapped[field.key] = field;
  }
  return mapped;
}

/**
 * Helper to safely extract image object from various reference structures
 * @param {any} ref
 */
function extractImageFromReference(ref) {
  if (!ref) return null;
  if (ref.image && ref.image.url) return ref.image;
  if (ref.fields) {
    const fields = mapMetaobjectFields(ref.fields);
    const fileField =
      fields.file ||
      fields.image ||
      Object.values(fields).find((f) => f?.reference?.image?.url);
    if (fileField?.reference?.image?.url) {
      return fileField.reference.image;
    }
  }
  return null;
}

/**
 * Parse showcase section data from metaobject query response
 * @param {any} sectionNode
 * @param {string} [defaultHeading]
 */
export function parseShowcaseData(sectionNode, defaultHeading = '') {
  if (!sectionNode) return null;

  let heading = defaultHeading;
  let sectionDataNode = null;

  // 1. Direct pass of data node (e.g. bestsellers_data, babyshop_data)
  if (sectionNode.type && sectionNode.type.endsWith('_data')) {
    sectionDataNode = sectionNode;
  }

  // 2. Nested inside home_page metaobject
  if (sectionNode.fields) {
    const hpFields = mapMetaobjectFields(sectionNode.fields);

    // Extract Heading
    const headingField = hpFields.heading?.reference?.fields
      ? mapMetaobjectFields(hpFields.heading.reference.fields).heading?.value
      : hpFields.heading?.value;

    if (headingField && headingField.toLowerCase() !== 'lifestyle exclusives') {
      heading = headingField;
    }

    // Extract Section Data node
    if (hpFields.section_data?.references?.nodes?.length > 0) {
      sectionDataNode = hpFields.section_data.references.nodes[0];
    }
  }

  if (!sectionDataNode || !sectionDataNode.fields) {
    return null;
  }

  const dFields = mapMetaobjectFields(sectionDataNode.fields);

  let desktopImage = null;
  let desktopAlt = heading;
  let mobileImage = null;
  let mobileAlt = heading;
  let bannerLink = resolveTargetUrl(dFields);
  let cards = [];

  for (const [key, field] of Object.entries(dFields)) {
    // Banner detection
    if (key.includes('banner')) {
      if (key.includes('mobile')) {
        mobileImage = extractImageFromReference(field.reference) || mobileImage;
        if (field.reference?.fields) {
          const rf = mapMetaobjectFields(field.reference.fields);
          if (rf.alt?.value) mobileAlt = rf.alt.value;
          const mobLink = resolveTargetUrl(rf);
          if (mobLink) bannerLink = mobLink;
        }
      } else {
        desktopImage = extractImageFromReference(field.reference) || desktopImage;
        if (field.reference?.fields) {
          const rf = mapMetaobjectFields(field.reference.fields);
          if (rf.alt?.value) desktopAlt = rf.alt.value;
          const deskLink = resolveTargetUrl(rf);
          if (deskLink) bannerLink = deskLink;
        }
      }
    }

    // Cards collection detection
    if (
      (key.includes('collection') || key.includes('card') || key.includes('section')) &&
      field.references?.nodes?.length > 0
    ) {
      cards = field.references.nodes
        .map((cardNode) => {
          if (!cardNode?.fields) return null;
          const cFields = mapMetaobjectFields(cardNode.fields);
          const image =
            extractImageFromReference(cFields.image?.reference) ||
            cFields.image?.reference?.image;

          if (!image) return null;

          const sortOrderVal = cFields.sort_order?.value;
          const sortOrder =
            sortOrderVal !== undefined && sortOrderVal !== null
              ? parseInt(sortOrderVal, 10)
              : 0;

          const link = resolveTargetUrl(cFields);

          return {
            id: cardNode.id,
            handle: cardNode.handle,
            image,
            title: cFields.title?.value || cardNode.handle || '',
            link,
            sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    }
  }

  if (!desktopImage && !mobileImage && cards.length === 0) {
    return null;
  }

  return {
    handle: sectionNode.handle || sectionDataNode.handle || '',
    heading,
    banner:
      desktopImage || mobileImage
        ? {
            desktopImage,
            mobileImage: mobileImage || desktopImage,
            desktopAlt,
            mobileAlt: mobileAlt || desktopAlt,
            link: bannerLink,
          }
        : null,
    cards,
  };
}

/**
 * Reusable Showcase Section Component
 * Powers Babyshop, Bestsellers, Top Brands on LIFESTYLE, Festive Edit, and Home & Living Store
 * Supports both 'top' and 'bottom' banner placements with identical live theme styling
 * @param {{
 *   data: any,
 *   bannerPosition?: 'top' | 'bottom',
 *   defaultHeading?: string,
 *   className?: string,
 *   isGallery?: boolean
 * }} props
 */
export function ShowcaseSection({
  data,
  bannerPosition,
  defaultHeading = '',
  className = '',
  isGallery = false,
}) {
  const sectionData = parseShowcaseData(data, defaultHeading);

  if (!sectionData) {
    return null;
  }

  // Auto-detect banner position if not explicitly supplied
  let effectivePosition = bannerPosition;
  if (!effectivePosition) {
    const handle = sectionData.handle.toLowerCase();
    const bannerUrl = sectionData.banner?.desktopImage?.url?.toLowerCase() || '';
    if (
      handle.includes('bestseller') ||
      handle.includes('top-brand') ||
      handle.includes('festive') ||
      bannerUrl.includes('promostrip')
    ) {
      effectivePosition = 'bottom';
    } else {
      effectivePosition = 'top';
    }
  }

  return (
    <ShowcaseSectionView
      sectionData={sectionData}
      bannerPosition={effectivePosition}
      className={className}
      isGallery={isGallery}
    />
  );
}

/**
 * View presentation for ShowcaseSection
 */
function ShowcaseSectionView({sectionData, bannerPosition, className, isGallery = false}) {
  const {heading, banner, cards} = sectionData;
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = useCallback(() => {
    if (sliderRef.current) {
      const {scrollLeft, scrollWidth, clientWidth} = sliderRef.current;
      setShowLeftArrow(scrollLeft > 5);
      
      const maxScroll = scrollWidth - clientWidth;
      // If layout hasn't settled (maxScroll <= 0), default to true since we know there are > 4 items
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

  // Banner component
  const bannerElement = banner && (banner.desktopImage || banner.mobileImage) && (
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

  // Cards carousel component
  const cardsElement = cards && cards.length > 0 && (
    <div className={`relative pb-1 ${isGallery ? 'px-0 lg:px-0' : ''}`}>
      {cards.length > 4 && (
        <>
          {showLeftArrow && (
            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Previous slide"
              className={`hidden lg:flex absolute left-2 lg:-left-4 top-[45%] -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full bg-white text-[#212121] shadow-[0px_1px_1px_rgba(0,0,0,0.15),0px_2px_10px_rgba(0,0,0,0.08)] cursor-pointer transition-opacity duration-300`}
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
              className={`hidden lg:flex absolute right-2 lg:-right-4 top-[45%] -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full bg-white text-[#212121] shadow-[0px_1px_1px_rgba(0,0,0,0.15),0px_2px_10px_rgba(0,0,0,0.08)] cursor-pointer transition-opacity duration-300`}
            >
              <svg className="w-5 h-5 text-[#212121]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </>
      )}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className={
          isGallery
            ? 'grid grid-cols-2 sm:grid-cols-3 lg:flex gap-3 sm:gap-4 lg:gap-4 py-2 px-0.5 lg:px-4 lg:overflow-x-auto lg:scroll-smooth lg:snap-x lg:snap-mandatory no-scrollbar'
            : 'flex gap-3 sm:gap-4 lg:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 px-2 lg:px-4 no-scrollbar'
        }
        style={!isGallery ? {scrollbarWidth: 'none', msOverflowStyle: 'none'} : {}}
      >
        {cards.map((card, index) => {
          const cardKey = card.id || `showcase-card-${index}`;
          const cardAspectRatio =
            card.image.width && card.image.height
              ? `${card.image.width} / ${card.image.height}`
              : '450 / 600';

          const cardContent = (
            <div
              className="relative w-full transition-transform duration-300 rounded-2xl overflow-hidden"
              style={{aspectRatio: cardAspectRatio}}
            >
              <Image
                data={card.image}
                alt={card.title || `${heading} card ${index + 1}`}
                sizes="(min-width: 1024px) 293px, (min-width: 640px) 31vw, 42vw"
                className="w-full h-full object-contain pointer-events-none"
                loading="lazy"
              />
            </div>
          );

          return (
            <div
              key={cardKey}
              className={
                isGallery
                  ? 'w-full group lg:w-[calc((100%-48px)/4)] lg:shrink-0 lg:snap-start'
                  : 'shrink-0 w-[calc((100%-12px)/2.3)] sm:w-[calc((100%-32px)/3)] lg:w-[calc((100%-48px)/4)] snap-start group'
              }
            >
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

  const headingLower = (heading || '').toLowerCase();
  const hasTopDivider = 
    headingLower.includes('best sellers') || 
    headingLower.includes('top brands') || 
    headingLower.includes('home & living');
  const hasBottomDivider = 
    hasTopDivider || headingLower.includes('in trend');
  const bottomDividerPadding = 
    headingLower.includes('in trend') ? 'mt-4 mb-0' : 'm-0';

  return (
    <div className={`w-full bg-white overflow-hidden pb-0 sm:pb-10 ${className}`}>
      {hasTopDivider && (
        <hr className="w-full h-[8px] bg-[#ECEDEB] border-none m-0 flex-shrink-0 block sm:hidden" />
      )}
      {/* 1. Universal Heading with amber accent line (.jss80 / .jss81) */}
      <section className="relative max-w-[1244px] mx-auto">
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading heading={heading} />
        </div>

        {/* Top Banner (when bannerPosition is 'top') */}
        <div className="px-0 sm:px-6 lg:px-0">
          {bannerPosition === 'top' && bannerElement}
        </div>
      </section>

      {/* Divider 1: mobile only, shown between top banner and cards */}
      {bannerPosition === 'top' && bannerElement && (
        <div className="w-full h-2 bg-[#ECEDEB] my-4 block sm:hidden" />
      )}

      {/* 2. Category / Brand Cards Carousel */}
      <section
        className={`relative max-w-[1244px] mx-auto px-4 sm:px-6 lg:px-0 ${
          bannerPosition === 'top' && bannerElement ? 'sm:mt-6 lg:mt-8' : ''
        }`}
      >
        {cardsElement}
      </section>

      {/* Divider 2: mobile only, shown between cards and bottom banner */}
      {bannerPosition === 'bottom' && bannerElement && (
        <div className="w-full h-2 bg-[#ECEDEB] my-4 block sm:hidden" />
      )}

      {/* Bottom Banner (when bannerPosition is 'bottom') */}
      {bannerPosition === 'bottom' && bannerElement && (
        <section className="relative max-w-[1244px] mx-auto px-0 sm:px-6 lg:px-0 sm:mt-6 lg:mt-8">
          {bannerElement}
        </section>
      )}

      {/* Section Bottom Divider: mobile view only */}
      {hasBottomDivider && (
        <hr className={`w-full h-[8px] bg-[#ECEDEB] border-none flex-shrink-0 block sm:hidden ${bottomDividerPadding}`} />
      )}
    </div>
  );
}

/**
 * Responsive banner image rendering for desktop and mobile
 */
function BannerImages({banner}) {
  const deskRatio =
    banner.desktopImage?.width && banner.desktopImage?.height
      ? `${banner.desktopImage.width} / ${banner.desktopImage.height}`
      : '1244 / 439';

  const mobRatio =
    banner.mobileImage?.width && banner.mobileImage?.height
      ? `${banner.mobileImage.width} / ${banner.mobileImage.height}`
      : '500 / 320';

  return (
    <div className="relative w-full overflow-hidden rounded-none sm:rounded-2xl leading-none">
      {banner.mobileImage && (
        <div
          className="w-full block sm:hidden overflow-hidden rounded-none sm:rounded-2xl"
          style={{aspectRatio: mobRatio}}
        >
          <Image
            data={banner.mobileImage}
            alt={banner.mobileAlt || banner.desktopAlt || 'Banner'}
            sizes="100vw"
            className="w-full h-full object-cover rounded-none sm:rounded-2xl pointer-events-none"
            loading="lazy"
          />
        </div>
      )}
      {banner.desktopImage && (
        <div
          className={`w-full ${
            banner.mobileImage ? 'hidden sm:block' : 'block'
          } overflow-hidden rounded-none sm:rounded-2xl`}
          style={{aspectRatio: deskRatio}}
        >
          <Image
            data={banner.desktopImage}
            alt={banner.desktopAlt || 'Banner'}
            sizes="(min-width: 1244px) 1244px, 100vw"
            className="w-full h-full object-cover rounded-none sm:rounded-2xl pointer-events-none"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}

export default ShowcaseSection;
