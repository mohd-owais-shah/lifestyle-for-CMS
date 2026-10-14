import {useRef, useState} from 'react';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {SectionHeading} from '../small-uis/SectionHeading';

/**
 * Clean metaobject text value
 * @param {any} val
 */
function cleanMetaobjectText(val) {
  if (!val || typeof val !== 'string') return '';
  const trimmed = val.trim();
  if (trimmed.startsWith('gid://')) return '';

  // Rich text JSON format from Shopify
  if (trimmed.startsWith('{') && trimmed.includes('"type"')) {
    try {
      const parsed = JSON.parse(trimmed);
      const extractText = (obj) => {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        if (obj.value) return obj.value;
        if (Array.isArray(obj.children)) {
          return obj.children.map(extractText).join(' ');
        }
        return '';
      };
      const result = extractText(parsed).trim();
      if (result) return result;
    } catch (_) {}
  }

  // Strip basic HTML tags
  if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
    return trimmed.replace(/<[^>]*>/g, '').trim();
  }

  return trimmed;
}

/**
 * Extract image object from metaobject field reference
 * @param {any} ref
 */
function extractImageFromRef(ref) {
  if (!ref) return null;
  if (ref.image?.url) return ref.image;
  if (ref.reference?.image?.url) return ref.reference.image;
  if (ref.fields && Array.isArray(ref.fields)) {
    const imgField = ref.fields.find(
      (f) =>
        (f.key === 'heading_image' ||
          f.key === 'image' ||
          f.key === 'desktop_image' ||
          f.key === 'banner' ||
          f.key === 'card_image' ||
          f.key === 'icon' ||
          f.key === 'icon_image' ||
          f.key === 'icon_svg' ||
          f.key === 'file') &&
        (f.reference?.image?.url || f.image?.url),
    );
    if (imgField?.reference?.image) return imgField.reference.image;
    if (imgField?.image) return imgField.image;

    const anyImg = ref.fields.find((f) => f.reference?.image?.url);
    if (anyImg?.reference?.image) return anyImg.reference.image;
  }
  return null;
}

/**
 * Check if image is an icon (SVG or approximately square)
 * @param {any} img
 */
function isCleanSquareIcon(img) {
  if (!img?.url) return false;
  if (img.url.includes('.svg')) return true;
  if (img.width && img.height) {
    const ratio = img.width / img.height;
    return ratio >= 0.75 && ratio <= 1.35;
  }
  return false;
}

/**
 * Extract a benefit icon item strictly from Shopify dynamic fields
 * @param {any} node
 */
function extractBenefitIconItem(node) {
  if (!node) return null;
  if (node.title || node.subtitle) return node;

  let title = '';
  let subtitle = '';
  let image = null;
  let link = '';
  let sortOrder = 0;

  if (node.fields && Array.isArray(node.fields)) {
    // Extract non-text fields first (image, link, order)
    for (const f of node.fields) {
      const k = f.key?.toLowerCase().replace(/[-_\s]/g, '') || '';
      
      if (!link && typeof f.value === 'string' && (k === 'link' || k === 'url' || k === 'target')) {
        let url = f.value.trim();
        try { if (url.startsWith('http')) { const pUrl = new URL(url); url = pUrl.pathname + pUrl.search + pUrl.hash; } } catch (e) {}
        link = url.replace(/(^\/?collection\/)/, '/collections/');
      } else if (k === 'sortorder' || k === 'order') {
        const parsed = parseInt(f.value, 10);
        if (!isNaN(parsed)) sortOrder = parsed;
      }

      if (!image) {
        image = extractImageFromRef(f);
      }
    }

    // Smart extraction for text fields
    const textFields = node.fields
      .map((f) => ({ key: f.key?.toLowerCase().replace(/[-_\s]/g, '') || '', val: cleanMetaobjectText(f.value) }))
      .filter((f) => f.val && !f.key.includes('order') && !f.key.includes('url') && !f.key.includes('link') && !f.key.includes('image') && !f.key.includes('icon') && !f.key.includes('banner'));

    const explicitHeading = textFields.find(f => f.key === 'heading');
    const explicitTitle = textFields.find(f => f.key === 'title');
    const explicitSub = textFields.find(f => f.key.includes('sub') || f.key.includes('desc') || f.key.includes('detail') || f.key.includes('caption') || f.key.includes('info'));

    if (explicitHeading && explicitTitle) {
      // Shopify user has both 'heading' and 'title' defined. 'heading' is primary, 'title' is secondary.
      title = explicitHeading.val;
      subtitle = explicitTitle.val;
    } else {
      if (explicitHeading) title = explicitHeading.val;
      else if (explicitTitle) title = explicitTitle.val;
      else if (textFields.length > 0) title = textFields[0].val;

      if (explicitSub) subtitle = explicitSub.val;
      else if (textFields.length > 1) {
        const fallbackSub = textFields.find(f => f.val !== title);
        if (fallbackSub) subtitle = fallbackSub.val;
      }
    }
  }

  if (!image && node.image?.url) image = node.image;
  if (!title && node.title) title = cleanMetaobjectText(node.title);
  if (!subtitle && (node.subtitle || node.description)) {
    subtitle = cleanMetaobjectText(node.subtitle || node.description);
  }

  // Must have dynamic title, subtitle, or image
  if (!title && !subtitle && !image) return null;

  return {
    id: node.id || `${title}-${image?.url || ''}`,
    title,
    subtitle,
    image,
    link,
    sortOrder,
  };
}

/**
 * Extract a collection card strictly from Shopify dynamic fields
 * @param {any} node
 */
function extractCollectionCard(node) {
  if (!node) return null;

  let title = '';
  let offerTag = '';
  let image = null;
  let link = '';
  let sortOrder = 0;

  if (node.fields && Array.isArray(node.fields)) {
    // Extract non-text fields first (image, link, order)
    for (const f of node.fields) {
      const k = f.key?.toLowerCase().replace(/[-_\s]/g, '') || '';
      
      if (!link && typeof f.value === 'string' && (k === 'link' || k === 'url' || k === 'target')) {
        let url = f.value.trim();
        try { if (url.startsWith('http')) { const pUrl = new URL(url); url = pUrl.pathname + pUrl.search + pUrl.hash; } } catch (e) {}
        link = url.replace(/(^\/?collection\/)/, '/collections/');
      } else if (k === 'sortorder' || k === 'order') {
        const parsed = parseInt(f.value, 10);
        if (!isNaN(parsed)) sortOrder = parsed;
      }

      if (!image) {
        image = extractImageFromRef(f);
      }
    }

    // Smart extraction for text fields
    const textFields = node.fields
      .map((f) => ({ key: f.key?.toLowerCase().replace(/[-_\s]/g, '') || '', val: cleanMetaobjectText(f.value) }))
      .filter((f) => f.val && !f.key.includes('order') && !f.key.includes('url') && !f.key.includes('link') && !f.key.includes('image') && !f.key.includes('icon'));


    const explicitHeading = textFields.find(f => f.key === 'heading');
    const explicitTitle = textFields.find(f => f.key === 'title');
    const explicitSub = textFields.find(f => f.key.includes('sub') || f.key.includes('tag') || f.key.includes('offer') || f.key.includes('desc'));

    if (explicitHeading && explicitTitle) {
      // Shopify user has both 'heading' and 'title' defined. 'heading' is primary, 'title' is secondary.
      title = explicitHeading.val;
      offerTag = explicitTitle.val;
    } else {
      if (explicitHeading) title = explicitHeading.val;
      else if (explicitTitle) title = explicitTitle.val;
      else if (textFields.length > 0) title = textFields[0].val;

      if (explicitSub) offerTag = explicitSub.val;
      else if (textFields.length > 1) {
        const fallbackSub = textFields.find(f => f.val !== title);
        if (fallbackSub) offerTag = fallbackSub.val;
      }
    }
  }

  if (!image && node.image?.url) image = node.image;
  if (!title && node.title) title = cleanMetaobjectText(node.title);

  if (!image && !title) return null;

  return {
    id: node.id || `${title}-${image?.url || ''}`,
    title,
    offerTag,
    image,
    link,
    sortOrder,
    debugFields: node.fields ? node.fields.map(f => `${f.key}: ${f.value}`).join(' | ') : 'No fields'
  };
}

/**
 * Unpack Our Benefits Data container strictly dynamically
 * @param {any} containerNode
 */
function unpackBenefitsDataContainer(containerNode) {
  if (!containerNode || !containerNode.fields) {
    return {
      benefits: [],
      collectionCards: [],
      collectionHeadingImage: null,
      collectionHeadingMobileImage: null,
      collectionHeading: '',
      desktopBannerImage: null,
      mobileBannerImage: null,
    };
  }

  const fields = containerNode.fields;
  let benefits = [];
  let collectionCards = [];
  let collectionHeadingImage = null;
  let collectionHeadingMobileImage = null;
  let collectionHeading = '';
  let desktopBannerImage = null;
  let mobileBannerImage = null;
  let bannerLink = '';
  let debugCollectionKeys = '';

  // 1. Benefits Bar
  for (const f of fields) {
    const k = f.key?.toLowerCase() || '';
    if (k.includes('bar') || k.includes('icon') || k.includes('benefit')) {
      if (f.references?.nodes?.length > 0) {
        benefits = f.references.nodes.map(extractBenefitIconItem).filter(Boolean);
        if (benefits.length > 0) break;
      }
    }
  }
  if (benefits.length === 0) {
    for (const f of fields) {
      if (f.references?.nodes?.length > 0) {
        const parsed = f.references.nodes.map(extractBenefitIconItem).filter(Boolean);
        if (parsed.length > 0) {
          benefits = parsed;
          break;
        }
      }
    }
  }

  // 2. Collection Section
  for (const f of fields) {
    const k = f.key?.toLowerCase() || '';
    if (k.includes('collection') || k.includes('section') || k.includes('sale') || k.includes('festive')) {
      const targetNode = f.reference || f.references?.nodes?.[0];
      if (targetNode?.fields) {
        const csFields = targetNode.fields;
        for (const cf of csFields) {
          const ck = cf.key?.toLowerCase() || '';
          debugCollectionKeys += `${ck} (${cf.reference ? (cf.reference.__typename || 'ref_no_type') : 'no_ref'}) | `;
          if (ck.includes('heading') && cf.value) {
            const hText = cleanMetaobjectText(cf.value);
            if (hText) collectionHeading = hText;
          }
          if (ck.includes('heading') && ck.includes('mobile')) {
            const img = extractImageFromRef(cf);
            if (img) collectionHeadingMobileImage = img;
          } else if ((ck.includes('heading') || ck.includes('image') || ck.includes('banner')) && !ck.includes('mobile')) {
            const img = extractImageFromRef(cf);
            if (img) collectionHeadingImage = img;
          }
          if (ck.includes('card') || cf.references?.nodes?.length > 0) {
            if (cf.references?.nodes?.length > 0) {
              collectionCards = cf.references.nodes.map(extractCollectionCard).filter(Boolean);
            }
          }
        }
        if (!collectionHeadingImage) {
          collectionHeadingImage = extractImageFromRef(targetNode);
        }
      }
    }
  }

  // 3. Desktop Banner
  for (const f of fields) {
    const k = f.key?.toLowerCase() || '';
    if ((k.includes('desktop') || k.includes('banner')) && !k.includes('mobile') && !k.includes('heading') && !k.includes('card')) {
      desktopBannerImage = extractImageFromRef(f.reference || f);
      if (desktopBannerImage) break;
    }
  }

  // 4. Mobile Banner
  for (const f of fields) {
    const k = f.key?.toLowerCase() || '';
    if (k.includes('mobile') && (k.includes('banner') || k.includes('chartbuster'))) {
      mobileBannerImage = extractImageFromRef(f.reference || f);
      if (mobileBannerImage) break;
    }
  }

  // 5. Generic Banner URL
  for (const f of fields) {
    const k = f.key?.toLowerCase() || '';
    if (!bannerLink && typeof f.value === 'string' && (k === 'url' || k === 'link' || k === 'banner_link')) {
      let url = f.value.trim();
      try { if (url.startsWith('http')) { const pUrl = new URL(url); url = pUrl.pathname + pUrl.search + pUrl.hash; } } catch (e) {}
      bannerLink = url.replace(/(^\/?collection\/)/, '/collections/');
    }
  }

  return {
    benefits,
    collectionCards,
    collectionHeadingImage,
    collectionHeadingMobileImage,
    collectionHeading,
    desktopBannerImage,
    mobileBannerImage,
    bannerLink,
    debugCollectionKeys,
  };
}

/**
 * Parse dynamic Our Benefits data completely based on Shopify Metaobjects (no fallback strings)
 * @param {any} metaobjectData
 */
export function parseOurBenefitsData(metaobjectData) {
  if (!metaobjectData) return null;

  let entry = null;

  // Direct lookup
  if (metaobjectData.ourBenefitsMetaobject) {
    entry = metaobjectData.ourBenefitsMetaobject;
  }

  // Lookup in homePageMetaobjects list
  if (!entry && metaobjectData.homePageMetaobjects?.nodes) {
    entry = metaobjectData.homePageMetaobjects.nodes.find(
      (node) =>
        node.handle === 'our-benefits' ||
        node.handle === 'our_benefits' ||
        node.fields?.some(
          (f) =>
            (f.key === 'display_name' || f.key === 'name' || f.key === 'title') &&
            f.value?.toLowerCase() === 'our benefits',
        ),
    );
  }

  if (!entry || !entry.fields) return null;

  const fields = entry.fields;

  // 1. Heading (only from Shopify dynamic data)
  let heading = '';
  const headingField = fields.find((f) => f.key === 'heading');
  if (headingField?.reference?.fields) {
    const nested = headingField.reference.fields.find(
      (f) =>
        (f.key === 'text' || f.key === 'heading' || f.key === 'title' || f.key === 'name') &&
        f.value &&
        !f.value.startsWith('gid://'),
    );
    if (nested?.value) heading = cleanMetaobjectText(nested.value);
  }
  if (!heading && headingField?.value && typeof headingField.value === 'string') {
    const cleaned = cleanMetaobjectText(headingField.value);
    if (cleaned && !cleaned.startsWith('gid://')) heading = cleaned;
  }

  // 2. Section Data: Precise lookup
  const sectionDataField =
    fields.find((f) => f.key === 'section_data' || f.key === 'sectionData') ||
    fields.find((f) => f.key !== 'heading' && f.key !== 'mobile_banner' && (f.references?.nodes?.length > 0 || f.reference));

  let benefits = [];
  let collectionCards = [];
  let collectionHeadingImage = null;
  let collectionHeadingMobileImage = null;
  let collectionHeading = '';
  let desktopBannerImage = null;
  let mobileBannerImage = null;
  let bannerLink = '';
  let debugKeys = '';

  const rawNodes = sectionDataField?.references?.nodes || [];

  if (rawNodes.length > 1) {
    benefits = rawNodes.map(extractBenefitIconItem).filter(Boolean);
  } else if (rawNodes.length === 1) {
    const containerResult = unpackBenefitsDataContainer(rawNodes[0]);
    if (containerResult.benefits.length > 0) {
      benefits = containerResult.benefits;
    } else {
      const singleItem = extractBenefitIconItem(rawNodes[0]);
      if (singleItem) benefits = [singleItem];
    }
    if (containerResult.collectionCards.length > 0) collectionCards = containerResult.collectionCards;
    if (containerResult.collectionHeadingImage) collectionHeadingImage = containerResult.collectionHeadingImage;
    if (containerResult.collectionHeadingMobileImage) collectionHeadingMobileImage = containerResult.collectionHeadingMobileImage;
    if (containerResult.collectionHeading) collectionHeading = containerResult.collectionHeading;
    if (containerResult.desktopBannerImage) desktopBannerImage = containerResult.desktopBannerImage;
    if (containerResult.mobileBannerImage) mobileBannerImage = containerResult.mobileBannerImage;
    if (containerResult.bannerLink) bannerLink = containerResult.bannerLink;
    if (containerResult.debugCollectionKeys) debugKeys += containerResult.debugCollectionKeys;
  } else if (sectionDataField?.reference) {
    const containerResult = unpackBenefitsDataContainer(sectionDataField.reference);
    benefits = containerResult.benefits;
    collectionCards = containerResult.collectionCards;
    collectionHeadingImage = containerResult.collectionHeadingImage;
    collectionHeadingMobileImage = containerResult.collectionHeadingMobileImage;
    collectionHeading = containerResult.collectionHeading;
    desktopBannerImage = containerResult.desktopBannerImage;
    mobileBannerImage = containerResult.mobileBannerImage;
    if (containerResult.bannerLink) bannerLink = containerResult.bannerLink;
    if (containerResult.debugCollectionKeys) debugKeys += containerResult.debugCollectionKeys;
  }

  // Cross-check all nodes in homePageMetaobjects if collection or banner data is still needed
  if (metaobjectData.homePageMetaobjects?.nodes) {
    for (const node of metaobjectData.homePageMetaobjects.nodes) {
      const h = node.handle?.toLowerCase() || '';
      if (collectionCards.length === 0 && (h.includes('festive') || h.includes('collection') || h.includes('sale'))) {
        const unpacked = unpackBenefitsDataContainer(node);
        if (unpacked.collectionCards.length > 0) collectionCards = unpacked.collectionCards;
        if (!collectionHeadingImage && unpacked.collectionHeadingImage) collectionHeadingImage = unpacked.collectionHeadingImage;
        if (!collectionHeading && unpacked.collectionHeading) collectionHeading = unpacked.collectionHeading;
        if (unpacked.debugCollectionKeys) debugKeys += unpacked.debugCollectionKeys;
      }
      if (!desktopBannerImage && (h.includes('order') || h.includes('benefit-banner') || h.includes('chartbuster'))) {
        desktopBannerImage = extractImageFromRef(node);
      }
    }
  }

  // Fallback scan on entry fields for benefits list
  if (benefits.length === 0) {
    for (const f of fields) {
      if (f.key === 'heading' || f.key === 'mobile_banner') continue;
      if (f.references?.nodes?.length > 0) {
        const parsed = f.references.nodes.map(extractBenefitIconItem).filter(Boolean);
        if (parsed.length > 0) {
          benefits = parsed;
          break;
        }
      }
    }
  }

  // Extract bannerLink from main entry fields
  if (!bannerLink) {
    for (const f of fields) {
      const k = f.key?.toLowerCase() || '';
      if (typeof f.value === 'string' && (k === 'url' || k === 'link' || k === 'banner_link')) {
        let url = f.value.trim();
        try { if (url.startsWith('http')) { const pUrl = new URL(url); url = pUrl.pathname + pUrl.search + pUrl.hash; } } catch (e) {}
        bannerLink = url.replace(/(^\/?collection\/)/, '/collections/');
        if (bannerLink) break;
      }
    }
  }

  // Return null if NO dynamic data exists
  if (
    benefits.length === 0 &&
    collectionCards.length === 0 &&
    !collectionHeadingImage &&
    !desktopBannerImage
  ) {
    return null;
  }

  return {
    heading,
    benefits,
    collectionHeadingImage,
    collectionHeadingMobileImage,
    collectionHeading,
    collectionCards,
    desktopBannerImage,
    mobileBannerImage,
    bannerLink,
    debugCollectionKeys: debugKeys,
  };
}

/**
 * Vector outline icon matching benefit title (only used when no image is uploaded in Shopify)
 * @param {{title?: string, className?: string}} props
 */
function BenefitDefaultIcon({title = '', className = 'w-6 h-6'}) {
  const lower = title.toLowerCase();

  // Delivery / Shipping
  if (lower.includes('ship') || lower.includes('deliver') || lower.includes('order')) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
        <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
        <path d="M2 10h2" />
        <path d="M1 13h3" />
      </svg>
    );
  }

  // Brands / Global / International
  if (lower.includes('brand') || lower.includes('global') || lower.includes('world')) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    );
  }

  // Authentic / Products / Genuine / Quality
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/**
 * Our Benefits section component
 * 100% Dynamic - Zero Static / Fallback text
 * @param {{data: any}} props
 */
export function OurBenefits({data}) {
  const parsedData = parseOurBenefitsData(data);
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };
  const handleMouseLeave = () => {
    setIsDragging(false);
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleScroll = (e) => {
    const target = e.target;
    setShowLeftArrow(target.scrollLeft > 10);
    setShowRightArrow(target.scrollLeft < target.scrollWidth - target.clientWidth - 10);
  };

  if (!parsedData) {
    return null;
  }

  const {
    heading,
    benefits,
    collectionHeadingImage,
    collectionHeadingMobileImage,
    collectionHeading,
    collectionCards,
    desktopBannerImage,
    mobileBannerImage,
    bannerLink,
    debugCollectionKeys,
  } = parsedData;

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({left: scrollContainerRef.current.clientWidth, behavior: 'smooth'});
    }
  };

  const handleScrollLeftAction = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({left: -scrollContainerRef.current.clientWidth, behavior: 'smooth'});
    }
  };

  return (
    <div className="w-full flex flex-col pb-0 sm:pb-10">
      <hr className="w-full h-[8px] bg-[#ECEDEB] border-none m-0 flex-shrink-0 block sm:hidden" />
      {/* 1. Our Benefits Top Bar (3 Icon Cards) */}
      {benefits.length > 0 && (
        <section
          aria-label={heading || undefined}
          className="w-full max-w-[1244px] mx-auto px-4 sm:px-6 lg:px-0"
        >
          {/* Section Heading with Lifestyle Store orange underline */}
          <SectionHeading heading={heading} />

          {/* Benefits Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-5 mt-5">
            {benefits.map((item, index) => {
              const cardContent = (
                <div
                  key={item.id || index}
                  // Mobile: Add top padding so the icon doesn't clip. Desktop: Add left padding
                  className="flex items-center justify-center h-full w-full pt-6 pb-2 px-1 sm:py-4 sm:pl-8 sm:pr-2"
                >
                  <div 
                    // Mobile: flex-col, top-heavy padding. Desktop: flex-row, left-heavy padding
                    className="relative bg-[#F7F7F7] rounded-[8px] sm:rounded-[12px] flex flex-col sm:flex-row items-center justify-center h-full w-full max-w-[120px] sm:max-w-[310px] pt-7 pb-3 px-1 sm:py-3 sm:pr-5 sm:pl-12"
                  >
                    {/* Icon container */}
                    <div 
                      // Mobile: Top-center. Desktop: Left-center.
                      className="absolute left-1/2 top-[-20px] -translate-x-1/2 sm:left-[-26px] sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 shrink-0 flex items-center justify-center z-10"
                    >
                      {isCleanSquareIcon(item.image) ? (
                        <Image
                          data={item.image}
                          className="w-[40px] h-[40px] sm:w-[54px] sm:h-[54px] object-contain"
                          sizes="60px"
                          alt={item.image.altText || item.title || ''}
                        />
                      ) : (
                        <div className="w-[40px] h-[40px] sm:w-[54px] sm:h-[54px] rounded-full bg-[#212121] flex items-center justify-center text-white">
                          <BenefitDefaultIcon title={item.title} className="w-5 h-5 sm:w-7 sm:h-7" />
                        </div>
                      )}
                    </div>

                    {/* Title and Subtitle strictly from dynamic data */}
                    <div className="flex flex-col min-w-0 justify-center items-center sm:items-start text-center sm:text-left w-full">
                      {item.title ? (
                        <span className="text-[10px] sm:text-[18px] font-bold text-[#212121] leading-tight sm:leading-snug">
                          {item.title}
                        </span>
                      ) : null}
                      {item.subtitle ? (
                        <span className="text-[9px] sm:text-[17px] text-[#757575] leading-tight sm:leading-snug mt-0.5 sm:mt-1">
                          {item.subtitle}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );

              if (item.link) {
                return (
                  <Link
                    key={item.id || index}
                    to={item.link}
                    className="block h-full focus:outline-none focus:ring-2 focus:ring-[#FAA619] rounded-[10px]"
                  >
                    {cardContent}
                  </Link>
                );
              }

              return cardContent;
            })}
          </div>
        </section>
      )}

      {/* 2. Collection Section (Dussehra Sale Header Image Above + Cards Below) */}
      {(collectionHeadingImage || collectionHeadingMobileImage || collectionCards.length > 0) && (
        <section
          aria-label={collectionHeading || undefined}
          className="relative w-full max-w-[1244px] mx-auto overflow-hidden bg-[#140303] text-white pb-6 lg:pb-8 lg:rounded-[12px] lg:my-4"
        >
          {/* Heading Image displayed visibly ABOVE the cards */}
          {(collectionHeadingImage?.url || collectionHeadingMobileImage?.url) && (
            <div className="w-full flex justify-center mb-6 sm:mb-8 flex-col items-center">
              {collectionHeadingMobileImage?.url ? (
                <Image
                  data={collectionHeadingMobileImage}
                  className="w-full h-auto object-contain mx-auto sm:hidden"
                  sizes="100vw"
                  alt={collectionHeadingMobileImage.altText || collectionHeading || 'Sale Mobile'}
                />
              ) : (
                <div className="text-red-500 bg-white p-2 text-xs sm:hidden flex flex-col gap-1">
                  <b>MOBILE IMAGE NOT FOUND IN PARSER</b>
                  <span>Available keys: {debugCollectionKeys}</span>
                </div>
              )}
              {collectionHeadingImage?.url && (
                <Image
                  data={collectionHeadingImage}
                  className={`w-full h-auto object-contain mx-auto ${collectionHeadingMobileImage?.url ? 'hidden sm:block' : 'block'}`}
                  sizes="(min-width: 1244px) 1244px, 100vw"
                  alt={collectionHeadingImage.altText || collectionHeading || 'Sale Desktop'}
                />
              )}
            </div>
          )}

          {/* Dynamic Heading Text if no heading image is available */}
          {!collectionHeadingImage?.url && !collectionHeadingMobileImage?.url && collectionHeading ? (
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-[20px] sm:text-[24px] lg:text-[28px] font-extrabold tracking-wider uppercase text-white font-sans drop-shadow-md">
                {collectionHeading.toUpperCase().includes('SALE') ? (
                  <>
                    {collectionHeading.slice(0, collectionHeading.toUpperCase().lastIndexOf('SALE'))}
                    <span className="text-[#D4FF00]">SALE</span>
                  </>
                ) : (
                  collectionHeading
                )}
              </h2>
            </div>
          ) : null}

          {/* Cards Carousel */}
          {collectionCards.length > 0 && (
            <div className="relative w-full max-w-[1244px] mx-auto px-4 sm:px-6">
              <div
                ref={scrollContainerRef}
                className="flex gap-4 sm:gap-4 lg:gap-5 overflow-x-auto scrollbar-none pb-4 snap-x items-start"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onScroll={handleScroll}
                style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
              >
                {collectionCards.map((card, idx) => {
                  const cardEl = (
                    <div
                      key={card.id || idx}
                      className="relative shrink-0 flex-none w-[163px] sm:w-[224px] lg:w-[284px] rounded-[8px] overflow-hidden group snap-start shadow-lg"
                    >
                      {card.image ? (
                        <Image
                          data={card.image}
                          className="w-full h-auto block rounded-[8px]"
                          sizes="(min-width: 768px) 260px, 190px"
                          alt={card.image.altText || card.title || ''}
                        />
                      ) : (
                        <div className="w-full aspect-[3/4] rounded-[8px] border border-[#8B261D] bg-[#2A100B] flex flex-col justify-end p-4 text-center">
                          {card.title ? (
                            <h3 className="text-white text-[15px] sm:text-[17px] font-bold underline underline-offset-4 decoration-white/80">
                              {card.title}
                            </h3>
                          ) : null}
                          {card.offerTag ? (
                            <p className="text-[#D4FF00] text-[12px] sm:text-[13px] font-extrabold mt-1 uppercase tracking-wide">
                              {card.offerTag}
                            </p>
                          ) : null}
                        </div>
                      )}
                    </div>
                  );

                  if (card.link) {
                    return (
                      <Link 
                        key={card.id || idx} 
                        to={card.link} 
                        className="block shrink-0 focus:outline-none"
                        onClick={(e) => {
                          // Prevent link click if the user was dragging
                          if (isDragging && Math.abs(scrollLeft - scrollContainerRef.current.scrollLeft) > 10) {
                            e.preventDefault();
                          }
                        }}
                        draggable="false"
                      >
                        {cardEl}
                      </Link>
                    );
                  }
                  return cardEl;
                })}
              </div>
              {/* Left Navigation Arrow Button */}
              {collectionCards.length > 3 && showLeftArrow && (
                <button
                  type="button"
                  onClick={handleScrollLeftAction}
                  aria-label="Previous slide"
                  className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-black shadow-xl hidden sm:flex items-center justify-center hover:bg-neutral-100 hover:scale-105 transition-all z-20 cursor-pointer"
                >
                  <svg
                    className="w-5 h-5 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}

              {collectionCards.length > 3 && showRightArrow && (
                <button
                  type="button"
                  onClick={handleScrollRight}
                  aria-label="Next slide"
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-black shadow-xl hidden sm:flex items-center justify-center hover:bg-neutral-100 hover:scale-105 transition-all z-20 cursor-pointer"
                >
                  <svg
                    className="w-5 h-5 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </section>
      )}

      {/* 3. Delivery Strip Banner (Our Benefits Banner Desktop / Mobile) */}
      {(desktopBannerImage || mobileBannerImage) && (
        <section
          aria-label="Promotional banner"
          className="w-full max-w-[1244px] mx-auto px-0 sm:px-6 lg:px-0 my-0 sm:my-2"
        >
          {bannerLink ? (
            <Link to={bannerLink} className="block w-full focus:outline-none">
              <div className="w-full overflow-hidden rounded-none sm:rounded-[8px]">
                {mobileBannerImage && (
                  <Image
                    data={mobileBannerImage}
                    className="w-full h-auto object-cover block sm:hidden"
                    sizes="100vw"
                    alt={mobileBannerImage.altText || ''}
                  />
                )}
                {desktopBannerImage && (
                  <Image
                    data={desktopBannerImage}
                    className={`w-full h-auto object-cover ${mobileBannerImage ? 'hidden sm:block' : 'block'}`}
                    sizes="(min-width: 1276px) 1244px, 100vw"
                    alt={desktopBannerImage.altText || ''}
                  />
                )}
              </div>
            </Link>
          ) : (
            <div className="w-full overflow-hidden rounded-none sm:rounded-[8px]">
              {mobileBannerImage && (
                <Image
                  data={mobileBannerImage}
                  className="w-full h-auto object-cover block sm:hidden"
                  sizes="100vw"
                  alt={mobileBannerImage.altText || ''}
                />
              )}
              {desktopBannerImage && (
                <Image
                  data={desktopBannerImage}
                  className={`w-full h-auto object-cover ${mobileBannerImage ? 'hidden sm:block' : 'block'}`}
                  sizes="(min-width: 1276px) 1244px, 100vw"
                  alt={desktopBannerImage.altText || ''}
                />
              )}
            </div>
          )}
        </section>
      )}
      <hr className="w-full h-[8px] bg-[#ECEDEB] border-none m-0 flex-shrink-0 block sm:hidden" />
    </div>
  );
}
