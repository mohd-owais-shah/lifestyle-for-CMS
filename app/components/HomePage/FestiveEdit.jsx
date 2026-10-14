import {useState, useRef} from 'react';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {resolveTargetUrl} from '~/lib/urlUtils';

/**
 * Clean text value from Shopify metaobject field
 * @param {any} val
 */
function cleanText(val) {
  if (!val || typeof val !== 'string') return '';
  const trimmed = val.trim();
  if (trimmed.startsWith('gid://')) return '';

  // Rich text JSON format
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

  // HTML tag stripping
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
        (f.key === 'desktop_image' ||
          f.key === 'image' ||
          f.key === 'banner' ||
          f.key === 'card_image' ||
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
 * Extract an individual card from a metaobject node
 * @param {any} node
 */
function extractCardItem(node) {
  if (!node) return null;

  let title = '';
  let offerTag = '';
  let image = null;
  let link = '';
  let sortOrder = 0;

  if (node.fields && Array.isArray(node.fields)) {
    for (const f of node.fields) {
      const k = f.key?.toLowerCase().replace(/[-_\s]/g, '') || '';
      const textVal = cleanText(f.value);

      if (
        !title &&
        textVal &&
        (k === 'title' ||
          k === 'name' ||
          k === 'category' ||
          k === 'heading' ||
          k === 'label')
      ) {
        title = textVal;
      } else if (
        !offerTag &&
        textVal &&
        (k === 'offertag' ||
          k === 'offer' ||
          k === 'discount' ||
          k === 'badge' ||
          k === 'subtext' ||
          k === 'subtitle' ||
          k === 'promotext')
      ) {
        offerTag = textVal;
      } else if (k === 'sortorder' || k === 'order') {
        const parsed = parseInt(f.value, 10);
        if (!isNaN(parsed)) sortOrder = parsed;
      }

      if (!image) {
        image = extractImageFromRef(f);
      }
    }
  }

  // Check direct node properties
  if (!image && node.image?.url) image = node.image;
  if (!title && node.title) title = cleanText(node.title);

  if (!link) {
    link = resolveTargetUrl(node.fields);
  }

  // Must have at least image or title to render a card
  if (!image && !title) return null;

  return {
    id: node.id || `${title}-${image?.url || ''}`,
    title,
    offerTag,
    image,
    link,
    sortOrder,
  };
}

/**
 * Unpack container metaobject for Festive Edit / Festive Sale
 * @param {any} containerNode
 */
function unpackFestiveContainer(containerNode) {
  if (!containerNode) return {cards: [], bannerImage: null};

  const fields = containerNode.fields || [];

  // Check if container has a single big banner image
  const directBanner = extractImageFromRef(containerNode);

  // Check for references list (cards/items)
  for (const f of fields) {
    if (f.references?.nodes?.length > 0) {
      const cards = f.references.nodes.map(extractCardItem).filter(Boolean);
      if (cards.length > 0) {
        return {cards, bannerImage: directBanner};
      }
    }
  }

  // Check for individual metaobject reference fields
  const refNodes = fields
    .filter((f) => f.reference && (f.reference.fields || f.reference.__typename === 'Metaobject'))
    .map((f) => f.reference);
  if (refNodes.length > 0) {
    const cards = refNodes.map(extractCardItem).filter(Boolean);
    if (cards.length > 0) {
      return {cards, bannerImage: directBanner};
    }
  }

  return {cards: [], bannerImage: directBanner};
}

/**
 * Parse dynamic Festive Edit / Dussehra Sale data from home_page metaobjects
 * Returns null if no valid dynamic data exists (strictly no fallback)
 * @param {any} metaobjectData
 */
export function parseFestiveEditData(metaobjectData) {
  if (!metaobjectData) return null;

  let entry = null;

  // Direct handle lookup
  if (metaobjectData.festiveEditMetaobject) {
    entry = metaobjectData.festiveEditMetaobject;
  }

  // Lookup in homePageMetaobjects list
  if (!entry && metaobjectData.homePageMetaobjects?.nodes) {
    entry = metaobjectData.homePageMetaobjects.nodes.find(
      (node) =>
        node.handle === 'festive-edit' ||
        node.handle === 'festive_edit' ||
        node.handle === 'dussehras-biggest-sale' ||
        node.handle === 'dussehra-sale' ||
        node.fields?.some(
          (f) =>
            (f.key === 'display_name' || f.key === 'name' || f.key === 'title') &&
            (f.value?.toLowerCase().includes('festive') || f.value?.toLowerCase().includes('dussehra')),
        ),
    );
  }

  if (!entry || !entry.fields) return null;

  const fields = entry.fields;

  // 1. Extract Heading
  let heading = '';
  const headingField = fields.find((f) => f.key === 'heading');
  if (headingField?.reference?.fields) {
    const nested = headingField.reference.fields.find(
      (f) => (f.key === 'text' || f.key === 'title' || f.key === 'heading') && f.value,
    );
    if (nested?.value) heading = cleanText(nested.value);
  }
  if (!heading && headingField?.value && typeof headingField.value === 'string') {
    const cleaned = cleanText(headingField.value);
    if (!cleaned.startsWith('gid://')) heading = cleaned;
  }
  if (!heading) heading = "DUSSEHRA'S BIGGEST SALE";

  // 2. Extract Data (Banner or Category Cards)
  const sectionDataField = fields.find(
    (f) =>
      f.key === 'section_data' ||
      f.key === 'sectionData' ||
      f.key === 'banner' ||
      f.key === 'cards',
  );

  let cards = [];
  let bannerImage = null;

  if (sectionDataField?.references?.nodes?.length > 0) {
    const nodes = sectionDataField.references.nodes;
    if (nodes.length === 1) {
      const unpacked = unpackFestiveContainer(nodes[0]);
      cards = unpacked.cards;
      bannerImage = unpacked.bannerImage;
    } else {
      cards = nodes.map(extractCardItem).filter(Boolean);
    }
  } else if (sectionDataField?.reference) {
    const unpacked = unpackFestiveContainer(sectionDataField.reference);
    cards = unpacked.cards;
    bannerImage = unpacked.bannerImage;
  }

  // Check direct banner image if no cards
  if (cards.length === 0 && !bannerImage) {
    bannerImage = extractImageFromRef(entry);
  }

  // Strict requirement: return null if no dynamic cards or banner image
  if (cards.length === 0 && !bannerImage) {
    return null;
  }

  return {
    id: entry.id,
    heading,
    cards: cards.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    bannerImage,
  };
}

/**
 * Festive Edit / Dussehra Sale component
 * Completely dynamic with zero fallback data
 * @param {{data: any}} props
 */
export function FestiveEdit({data}) {
  const festiveData = parseFestiveEditData(data);
  const scrollContainerRef = useRef(null);

  // Return null if no dynamic data exists
  if (!festiveData) return null;

  const {heading, cards, bannerImage} = festiveData;

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({left: 320, behavior: 'smooth'});
    }
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({left: -320, behavior: 'smooth'});
    }
  };

  return (
    <div className="w-full pb-0 sm:pb-10">
      <hr className="w-full h-[8px] bg-[#ECEDEB] border-none m-0 flex-shrink-0 block sm:hidden" />
      <section
        aria-label={heading}
        className="w-full max-w-[1276px] mx-auto px-0 sm:px-[16px] my-0 sm:my-6"
      >
        {/* If cards exist, render the carousel layout matching the screenshot */}
        {cards.length > 0 ? (
          <div className="relative bg-[#1A0B08] rounded-none sm:rounded-[12px] p-6 lg:p-8 overflow-hidden text-white">
            {/* Header Title */}
            <div className="text-center mb-6">
              <h2 className="text-[20px] sm:text-[24px] lg:text-[26px] font-extrabold uppercase tracking-wider text-[#FFFFFF]">
                {heading.split('SALE')[0]}
                <span className="text-[#E7E247]">SALE</span>
              </h2>
            </div>

            {/* Cards Container with Right Navigation Arrow */}
            <div className="relative">
              <div
                ref={scrollContainerRef}
                className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-2 snap-x"
              >
                {cards.map((card, idx) => {
                  const cardInner = (
                    <div
                      key={card.id || idx}
                      className="relative flex-none w-[200px] sm:w-[240px] md:w-[270px] aspect-[3/4] rounded-[10px] overflow-hidden border border-[#8B261D] bg-[#2A100B] group snap-start transition-transform duration-200 hover:scale-[1.02]"
                    >
                      {card.image && (
                        <Image
                          data={card.image}
                          className="w-full h-full object-cover object-center"
                          sizes="(min-width: 768px) 270px, 200px"
                          alt={card.title || heading}
                        />
                      )}

                      {/* Gradient Overlay & Text Content */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-center">
                        {card.title && (
                          <h3 className="text-white text-[16px] sm:text-[18px] font-bold underline underline-offset-4 decoration-[#E7E247]">
                            {card.title}
                          </h3>
                        )}
                        {card.offerTag && (
                          <p className="text-[#E7E247] text-[13px] sm:text-[14px] font-extrabold mt-1">
                            {card.offerTag}
                          </p>
                        )}
                      </div>
                    </div>
                  );

                  if (card.link) {
                    return (
                      <Link key={card.id || idx} to={card.link} className="block">
                        {cardInner}
                      </Link>
                    );
                  }
                  return cardInner;
                })}
              </div>

              {/* Right Arrow Navigation Button */}
              {cards.length > 3 && (
                <button
                  type="button"
                  onClick={handleScrollRight}
                  aria-label="Next slide"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-black shadow-lg flex items-center justify-center hover:bg-neutral-100 transition-colors z-10"
                >
                  <svg
                    className="w-5 h-5"
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
          </div>
        ) : bannerImage ? (
          /* If entry has a full banner graphic, render high-res responsive banner */
          <div className="w-full overflow-hidden rounded-[10px]">
            <Image
              data={bannerImage}
              className="w-full h-auto object-cover"
              sizes="(min-width: 1276px) 1244px, 100vw"
              alt={heading}
            />
          </div>
        ) : null}
      </section>
      <hr className="w-full h-[8px] bg-[#ECEDEB] border-none m-0 flex-shrink-0 block sm:hidden" />
    </div>
  );
}
