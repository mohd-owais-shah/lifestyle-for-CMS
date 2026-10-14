import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {resolveTargetUrl} from '~/lib/urlUtils';
import {SectionHeading} from '~/components/small-uis/SectionHeading';

/**
 * Extract an image object from a field reference node
 * @param {any} ref
 */
function extractImageFromRef(ref) {
  if (!ref) return null;

  // Direct MediaImage reference
  if (ref.image && ref.image.url) {
    return ref.image;
  }

  // Direct reference containing image
  if (ref.reference?.image && ref.reference.image.url) {
    return ref.reference.image;
  }

  // Nested metaobject reference (e.g. Banners)
  if (ref.fields && Array.isArray(ref.fields)) {
    const imgField = ref.fields.find(
      (f) =>
        (f.key === 'image' ||
          f.key === 'desktop_image' ||
          f.key === 'mobile_image' ||
          f.key === 'banner' ||
          f.key === 'file') &&
        f.reference?.image?.url,
    );
    if (imgField?.reference?.image) {
      return imgField.reference.image;
    }

    // Fallback to any MediaImage reference field
    const anyImgField = ref.fields.find(
      (f) => f.reference && (f.reference.image || f.reference.__typename === 'MediaImage'),
    );
    if (anyImgField?.reference?.image) {
      return anyImgField.reference.image;
    }
  }

  return null;
}


/**
 * Banner entries are `home_page` entries whose handle is `hero-banner`,
 * `hero-banner-1`, `hero-banner-2`, ... (or the older `home-page-banner`).
 * Each one is its own section, placed by its own sort_order.
 * @param {string | undefined} handle
 */
export function isHeroBannerHandle(handle) {
  return /^(hero-banner|home-page-banner)(-\d+)?$/.test(handle || '');
}

/**
 * Parse dynamic hero banner data from home_page metaobjects
 * @param {any} metaobjectData a banner entry node, or the home page query
 *   result (then the first banner entry is used)
 */
export function parseHeroBannerData(metaobjectData) {
  if (!metaobjectData) return null;

  let bannerEntry = null;

  // A banner entry passed directly
  if (metaobjectData.fields && isHeroBannerHandle(metaobjectData.handle)) {
    bannerEntry = metaobjectData;
  }

  // Lookup by direct handle
  if (!bannerEntry && metaobjectData.homePageBannerMetaobject) {
    bannerEntry = metaobjectData.homePageBannerMetaobject;
  }

  // Lookup in homePageMetaobjects nodes list
  if (!bannerEntry && metaobjectData.homePageMetaobjects?.nodes) {
    const nodes = metaobjectData.homePageMetaobjects.nodes;
    bannerEntry =
      nodes.find(
        (node) =>
          node.handle === 'home-page-banner' ||
          node.handle === 'home_page_banner' ||
          node.handle === 'hero-banner' ||
          node.fields?.some(
            (f) =>
              (f.key === 'display_name' || f.key === 'name' || f.key === 'title') &&
              f.value?.toLowerCase() === 'home page banner',
          ) ||
          node.fields?.some((f) => f.key === 'mobile_banner'),
      ) || null;
  }

  if (!bannerEntry || !bannerEntry.fields) {
    return null;
  }

  const fields = bannerEntry.fields;

  // Extract heading
  const headingField = fields.find((f) => f.key === 'heading');
  // A heading reference stores its id as the value, so follow the reference
  let heading = '';
  if (headingField?.reference?.fields) {
    const nestedHeading = headingField.reference.fields.find(
      (f) => f.key === 'text' || f.key === 'title' || f.key === 'heading',
    );
    if (nestedHeading?.value) heading = nestedHeading.value;
  } else if (headingField?.value && !headingField.value.startsWith('gid://')) {
    heading = headingField.value;
  }
  // No Heading set: fall back to the entry's Title Name
  if (!heading) {
    heading = fields.find((f) => f.key === 'title_name')?.value?.trim() || '';
  }

  // Extract desktop banner from section_data
  const sectionDataField = fields.find(
    (f) => f.key === 'section_data' || f.key === 'sectionData' || f.key === 'banner',
  );
  const desktopRef =
    sectionDataField?.reference || sectionDataField?.references?.nodes?.[0];
  const desktopImage = extractImageFromRef(desktopRef);

  // Extract mobile banner: the entry's own mobile_banner, else the
  // mobile_banner set on the banner item itself
  const isMobileKey = (f) => f.key === 'mobile_banner' || f.key === 'mobileBanner';
  const mobileBannerField = fields.find(isMobileKey);
  const mobileRef =
    mobileBannerField?.reference || mobileBannerField?.references?.nodes?.[0];
  const itemMobileField = desktopRef?.fields?.find(isMobileKey);
  const mobileImage =
    extractImageFromRef(mobileRef) ||
    itemMobileField?.reference?.image ||
    extractImageFromRef(itemMobileField?.reference);

  // Extract link
  let link =
    resolveTargetUrl(desktopRef?.fields) ||
    resolveTargetUrl(mobileRef?.fields) ||
    resolveTargetUrl(fields) ||
    '';

  // Return null if neither desktop nor mobile image exists (no fallback / static data)
  if (!desktopImage && !mobileImage) {
    return null;
  }

  const altText =
    desktopImage?.altText ||
    mobileImage?.altText ||
    heading ||
    '';

  return {
    id: bannerEntry.id,
    heading,
    desktopImage: desktopImage || mobileImage,
    mobileImage: mobileImage || desktopImage,
    link,
    altText,
  };
}

/**
 * Hero banner section component
 * Renders desktop and mobile banners under hero slider dynamically
 * @param {{data: any}} props
 */
export function HeroBanner({data}) {
  const banner = parseHeroBannerData(data);

  // Return null if no dynamic banner data exists
  if (!banner) {
    return null;
  }

  const isExternal =
    banner.link && (banner.link.startsWith('http://') || banner.link.startsWith('https://'));

  const bannerContent = (
    <div className="relative w-full overflow-hidden rounded-none">
      {/* Mobile banner for screens < 640px */}
      {banner.mobileImage && (
        <Image
          data={banner.mobileImage}
          alt={banner.altText}
          sizes="100vw"
          className="w-full h-auto object-cover block sm:hidden"
          loading="lazy"
        />
      )}

      {/* Desktop banner for screens >= 640px */}
      {banner.desktopImage && (
        <Image
          data={banner.desktopImage}
          alt={banner.altText}
          sizes="(min-width: 1276px) 1244px, 100vw"
          className="w-full h-auto object-cover hidden sm:block"
          loading="lazy"
        />
      )}
    </div>
  );

  return (
    <div className="w-full bg-white pb-0 sm:pb-10 overflow-hidden">
      <hr className="w-full h-[8px] bg-[#ECEDEB] border-none m-0 flex-shrink-0 block sm:hidden" />
      <section
        className="relative max-w-[1276px] mx-auto px-0 md:px-[16px]"
        aria-label={banner.heading || 'Hero Banner'}
      >
        {/* Same heading style as the other sections (e.g. Babyshop) */}
        <div className="px-4 sm:px-0">
          <SectionHeading heading={banner.heading} />
        </div>
        {banner.link ? (
          isExternal ? (
            <a
              href={banner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full transition-opacity hover:opacity-95"
            >
              {bannerContent}
            </a>
          ) : (
            <Link
              to={banner.link}
              className="block w-full transition-opacity hover:opacity-95"
            >
              {bannerContent}
            </Link>
          )
        ) : (
          bannerContent
        )}
      </section>
      <hr className="w-full h-[8px] bg-[#ECEDEB] border-none m-0 flex-shrink-0 block sm:hidden" />
    </div>
  );
}
