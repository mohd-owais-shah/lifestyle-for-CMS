import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {SectionHeading} from '../small-uis/SectionHeading';
import {resolveTargetUrl} from '~/lib/urlUtils';

/**
 * Utility to map an array of metaobject fields { key, value, reference, references } into an object
 * @param {Array<{key: string, value: string, reference?: any, references?: any}>} fields
 */
function mapMetaobjectFields(fields = []) {
  const mapped = {};
  for (const field of fields) {
    if (field?.key) {
      mapped[field.key] = field;
    }
  }
  return mapped;
}

/**
 * Safely extract an image object from various reference structures
 * @param {any} ref
 */
function extractImage(ref) {
  if (!ref) return null;
  if (ref.image?.url) return ref.image;
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
 * Parse Chartbusters section data from a home_page metaobject node
 * @param {any} sectionNode - The home_page metaobject node for Chartbusters
 * @returns {{ handle: string, heading: string, cards: Array<object> } | null}
 */
export function parseChartbustersData(sectionNode) {
  if (!sectionNode?.fields) return null;

  const hpFields = mapMetaobjectFields(sectionNode.fields);

  // 1. Extract heading from heading reference or fallback string
  let heading = 'Chartbusters';
  if (hpFields.heading?.reference?.fields) {
    const headingFields = mapMetaobjectFields(hpFields.heading.reference.fields);
    if (headingFields.heading?.value) {
      heading = headingFields.heading.value;
    }
  } else if (hpFields.heading?.value && !hpFields.heading.value.startsWith('gid://')) {
    heading = hpFields.heading.value;
  }

  // 2. Extract section_data node (supports both list references and single reference)
  let sectionDataNode = null;
  if (hpFields.section_data?.references?.nodes?.length > 0) {
    sectionDataNode = hpFields.section_data.references.nodes[0];
  } else if (hpFields.section_data?.reference?.fields) {
    sectionDataNode = hpFields.section_data.reference;
  }

  if (!sectionDataNode?.fields) return null;

  const dFields = mapMetaobjectFields(sectionDataNode.fields);

  // 3. Extract cards from chartbusters_collection_section (or any card/collection list field)
  let cards = [];

  for (const [key, field] of Object.entries(dFields)) {
    if (
      (key.includes('collection') || key.includes('card') || key.includes('section')) &&
      field.references?.nodes?.length > 0
    ) {
      cards = field.references.nodes
        .map((cardNode) => {
          if (!cardNode?.fields) return null;
          const cFields = mapMetaobjectFields(cardNode.fields);

          const image =
            extractImage(cFields.image?.reference) ||
            cFields.image?.reference?.image;

          if (!image?.url) return null;

          const sortOrderVal = cFields.sort_order?.value;
          const sortOrder =
            sortOrderVal !== undefined && sortOrderVal !== null
              ? parseInt(sortOrderVal, 10)
              : 0;

          const fromPrice =
            cFields.from_price?.value ||
            cFields.price?.value ||
            '';

          const link = resolveTargetUrl(cFields);

          const alt =
            cFields.alt?.value ||
            cardNode.handle ||
            '';

          return {
            id: cardNode.id,
            handle: cardNode.handle,
            image,
            alt,
            fromPrice,
            link,
            sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      if (cards.length > 0) break;
    }
  }

  if (cards.length === 0) return null;

  // 4. Extract Banners iteratively (preserving raw URL for third-party platform links)
  let bannerDesktop = null;
  let bannerMobile = null;
  let bannerLinkDesktop = '';
  let bannerLinkMobile = '';
  let genericBannerLink = '';

  const extractRawBannerUrl = (fields = {}) => {
    const candidateKeys = ['url', 'link', 'banner_link', 'target_url', 'target', 'button_link'];
    for (const k of candidateKeys) {
      const val = fields[k]?.value;
      if (typeof val === 'string' && val.trim() && val.trim() !== '#') {
        return val.trim();
      }
    }
    return '';
  };

  for (const [key, field] of Object.entries(dFields)) {
    if (key.includes('mobile') && key.includes('banner')) {
      bannerMobile = extractImage(field.reference) || bannerMobile;
      if (field.reference?.fields) {
        const bFields = mapMetaobjectFields(field.reference.fields);
        const raw = extractRawBannerUrl(bFields);
        if (raw) {
          bannerLinkMobile = raw;
        } else {
          const resolved = resolveTargetUrl(bFields);
          if (resolved) bannerLinkMobile = resolved;
        }
      }
    } else if (key.includes('banner')) {
      bannerDesktop = extractImage(field.reference) || bannerDesktop;
      if (field.reference?.fields) {
        const bFields = mapMetaobjectFields(field.reference.fields);
        const raw = extractRawBannerUrl(bFields);
        if (raw) {
          bannerLinkDesktop = raw;
        } else {
          const resolved = resolveTargetUrl(bFields);
          if (resolved) bannerLinkDesktop = resolved;
        }
      }
    } else if (!genericBannerLink && typeof field.value === 'string' && (key === 'url' || key === 'link' || key === 'banner_link')) {
      genericBannerLink = field.value.trim();
    }
  }

  const rawGeneric = extractRawBannerUrl(dFields);
  bannerLinkDesktop = bannerLinkDesktop || genericBannerLink || rawGeneric || resolveTargetUrl(dFields);
  bannerLinkMobile = bannerLinkMobile || genericBannerLink || rawGeneric || resolveTargetUrl(dFields);

  return {
    handle: sectionNode.handle || sectionDataNode.handle || 'chartbusters',
    heading,
    cards,
    bannerDesktop,
    bannerMobile,
    bannerLinkDesktop,
    bannerLinkMobile,
  };
}

/**
 * Chartbusters component
 *
 * Requirements:
 * - Dynamic data from Shopify metaobject (handle: "chartbusters")
 * - Heading rendered via SectionHeading component
 * - 4 columns on mobile, 6 columns on desktop (grid layout)
 * - Offer text below the image
 * - Renders desktop and mobile banners below the grid
 */
export function Chartbusters({data, className = ''}) {
  const parsed = parseChartbustersData(data);

  if (!parsed) return null;

  const {heading, cards, bannerDesktop, bannerMobile, bannerLinkDesktop, bannerLinkMobile} = parsed;

  return (
    <div className={`w-full bg-white overflow-hidden pb-0 sm:pb-10 ${className}`}>
      <hr className="w-full h-[8px] bg-[#ECEDEB] border-none m-0 flex-shrink-0 block sm:hidden" />
      <div className="page-width">
        {/* Section Heading */}
        <SectionHeading heading={heading} />

        {/* Cards container - Static Grid */}
        <div className="grid grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 py-2 mt-2">
          {cards.map((card, index) => (
            <ChartbustersCard
              key={card.id || `chartbusters-${index}`}
              card={card}
              heading={heading}
              index={index}
            />
          ))}
        </div>

        {/* Desktop Banner (inside page-width) */}
        {bannerDesktop && (
          <div className="hidden sm:block w-full mt-6 sm:mt-8">
            <ChartbustersBannerLink link={bannerLinkDesktop}>
              <Image data={bannerDesktop} sizes="(min-width: 1024px) 1200px, 100vw" className="w-full h-auto object-cover" loading="lazy" />
            </ChartbustersBannerLink>
          </div>
        )}
      </div>

      {/* Mobile Banner (outside page-width, full width) */}
      {bannerMobile && (
        <div className="block sm:hidden w-full mt-6">
          <ChartbustersBannerLink link={bannerLinkMobile}>
            <Image data={bannerMobile} sizes="100vw" className="w-full h-auto object-cover" loading="lazy" />
          </ChartbustersBannerLink>
        </div>
      )}

      {/* Mobile section divider */}
      <hr className="w-full h-[8px] bg-[#ECEDEB] border-none m-0 flex-shrink-0 block sm:hidden" />
    </div>
  );
}

/**
 * Individual Collection Card
 * - Rounded corners
 * - 3:4 aspect ratio image
 * - Price/Offer text below the image
 * - Hover scale animation
 */
function ChartbustersCard({card, heading, index}) {
  const cardContent = (
    <div className="flex flex-col w-full cursor-pointer items-center">
      <div className="relative w-full overflow-hidden rounded-lg sm:rounded-xl bg-[#f6f6f6]">
        <Image
          data={card.image}
          alt={card.alt || `${heading} card ${index + 1}`}
          sizes="(min-width: 1024px) 16vw, 25vw"
          className="w-full h-auto object-contain rounded-lg sm:rounded-xl block"
          loading="lazy"
        />
      </div>

      {/* Offer text below the image */}
      {card.fromPrice ? (
        <div className="mt-2 text-center w-full px-1">
          <span className="text-[#212121] text-[13px] sm:text-[14px] lg:text-[18px] font-semibold tracking-tight">
            {card.fromPrice}
          </span>
        </div>
      ) : null}
    </div>
  );

  if (card.link) {
    return (
      <Link to={card.link} className="block w-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

/**
 * Banner Link Component for Chartbusters
 * Handles external third-party platform links with real raw URL redirection
 * and internal paths with Link
 */
function ChartbustersBannerLink({link, children}) {
  if (!link) return children;

  const isExternal =
    typeof link === 'string' &&
    (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('//'));

  if (isExternal) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full transition-opacity hover:opacity-95"
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={link} className="block w-full transition-opacity hover:opacity-95">
      {children}
    </Link>
  );
}

export default Chartbusters;

