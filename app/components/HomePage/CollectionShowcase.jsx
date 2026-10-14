import {useRef, useCallback, useState, useEffect} from 'react';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {SectionHeading} from '../small-uis/SectionHeading';
import {resolveTargetUrl} from '~/lib/urlUtils';

/**
 * Helper to map metaobject fields array into a key-value object
 * @param {Array<{key: string, value: string, reference?: any, references?: any}>} fields
 */
function mapFields(fields = []) {
  const mapped = {};
  for (const field of fields) {
    mapped[field.key] = field;
  }
  return mapped;
}

/**
 * Parse collection showcase data from a home_page metaobject node
 * Supports both "Lifestyle Exclusives" and "In Trend" section structures
 * @param {any} sectionNode - The home_page metaobject node
 * @returns {object|null} Parsed section data with heading and cards
 */
export function parseCollectionShowcaseData(sectionNode) {
  if (!sectionNode?.fields) return null;

  const hpFields = mapFields(sectionNode.fields);

  // ── Extract heading ──
  const heading =
    hpFields.heading?.reference?.fields
      ? mapFields(hpFields.heading.reference.fields).heading?.value
      : hpFields.heading?.value || '';

  if (!heading) return null;

  // ── Extract section data node ──
  let sectionDataNode = null;

  // section_data can come as a single reference or as a references list
  if (hpFields.section_data?.reference?.fields) {
    sectionDataNode = hpFields.section_data.reference;
  } else if (hpFields.section_data?.references?.nodes?.length > 0) {
    sectionDataNode = hpFields.section_data.references.nodes[0];
  }

  if (!sectionDataNode?.fields) return null;

  const dFields = mapFields(sectionDataNode.fields);

  // ── Extract cards from any list-type field (cards / collection cards) ──
  let cards = [];

  for (const [key, field] of Object.entries(dFields)) {
    if (field.references?.nodes?.length > 0) {
      cards = field.references.nodes
        .map((cardNode) => {
          if (!cardNode?.fields) return null;

          const cFields = mapFields(cardNode.fields);

          // Image extraction
          const imageRef = cFields.image?.reference;
          const image = imageRef?.image || null;
          if (!image?.url) return null;

          // Sort order
          const sortVal = cFields.sort_order?.value;
          const sortOrder =
            sortVal !== undefined && sortVal !== null
              ? parseInt(sortVal, 10)
              : 0;

          // From price text
          const fromPrice = cFields.from_price?.value || '';

          // URL / Collection resolution
          const link = resolveTargetUrl(cFields);

          // Alt text
          const alt = cFields.alt?.value || '';

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

      // Use the first list field that has valid cards
      if (cards.length > 0) break;
    }
  }

  if (cards.length === 0) return null;

  return {
    handle: sectionNode.handle || sectionDataNode.handle || '',
    heading,
    cards,
  };
}

// ── Slider threshold: show slider only on desktop when cards > 6 ──
const SLIDER_THRESHOLD = 6;

/**
 * CollectionShowcase – universal component for brand/collection card sections
 *
 * Used for:
 *  - Lifestyle Exclusives
 *  - In Trend
 *
 * Features:
 *  - SectionHeading with amber underline
 *  - 2-column grid on mobile (no slider, ever)
 *  - On desktop: plain flex grid when cards ≤ 6, horizontal slider when > 6
 *  - page-width alignment consistent with other homepage sections
 *
 * @param {{ data: any, className?: string }} props
 */
export function CollectionShowcase({data, className = ''}) {
  const parsed = parseCollectionShowcaseData(data);

  if (!parsed) return null;

  const {heading, cards} = parsed;
  const needsSlider = cards.length > SLIDER_THRESHOLD;

  return (
    <div className={`w-full bg-white overflow-hidden pb-0 sm:pb-10 ${className}`}>
      {/* Heading */}
      <section className="page-width">
          <SectionHeading heading={heading} />
      </section>

      {/* Cards */}
      <section className="page-width px-4 sm:px-6 lg:px-0">
        {needsSlider ? (
          <SliderLayout cards={cards} heading={heading} />
        ) : (
          <GridLayout cards={cards} heading={heading} />
        )}
      </section>

      {/* Mobile bottom divider */}
      <hr className="w-full h-[8px] bg-[#ECEDEB] border-none mt-4 mb-0 flex-shrink-0 block sm:hidden" />
    </div>
  );
}

/**
 * Grid layout (≤ 6 cards) – no slider on any device
 * Desktop: up to 6 columns | Mobile: 2 columns
 */
function GridLayout({cards, heading}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-4 py-2">
      {cards.map((card, index) => (
        <CollectionCard
          key={card.id || `card-${index}`}
          card={card}
          heading={heading}
          index={index}
        />
      ))}
    </div>
  );
}

/**
 * Slider layout (> 6 cards on desktop) – slider arrows on desktop, 2-col grid on mobile
 */
function SliderLayout({cards, heading}) {
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = useCallback(() => {
    if (sliderRef.current) {
      const {scrollLeft, scrollWidth, clientWidth} = sliderRef.current;
      setShowLeftArrow(scrollLeft > 5);
      
      const maxScroll = scrollWidth - clientWidth;
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

  return (
    <div className="relative pb-1">
      {/* Left arrow – desktop only */}
      {showLeftArrow && (
        <button
          type="button"
          onClick={scrollLeft}
          aria-label="Previous slide"
          className="hidden lg:flex absolute left-2 lg:-left-4 top-[45%] -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full bg-white text-[#212121] shadow-[0px_1px_1px_rgba(0,0,0,0.15),0px_2px_10px_rgba(0,0,0,0.08)] cursor-pointer transition-opacity duration-300"
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
      )}

      {/* Right arrow – desktop only */}
      {showRightArrow && (
        <button
          type="button"
          onClick={scrollRight}
          aria-label="Next slide"
          className="hidden lg:flex absolute right-2 lg:-right-4 top-[45%] -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full bg-white text-[#212121] shadow-[0px_1px_1px_rgba(0,0,0,0.15),0px_2px_10px_rgba(0,0,0,0.08)] cursor-pointer transition-opacity duration-300"
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
      )}

      {/* Desktop: horizontal slider | Mobile: 2-col grid */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-4 py-2 lg:flex lg:overflow-x-auto lg:scroll-smooth lg:snap-x lg:snap-mandatory no-scrollbar"
        style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
      >
        {cards.map((card, index) => (
          <div
            key={card.id || `card-${index}`}
            className="w-full lg:w-[calc((100%-80px)/6)] lg:shrink-0 lg:snap-start"
          >
            <CollectionCard
              card={card}
              heading={heading}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Individual collection card with image and "From ₹XXX" price label
 * Renders a rounded card with the brand image, overlaid price bottom-left
 */
function CollectionCard({card, heading, index}) {
  const cardContent = (
    <div className="relative w-full overflow-hidden rounded-lg group transition-transform duration-300">
      {/* Card image */}
      <div
        className="relative w-full"
        style={{aspectRatio: '3 / 4'}}
      >
        <Image
          data={card.image}
          alt={card.alt || `${heading} card ${index + 1}`}
          sizes="(min-width: 1024px) 190px, (min-width: 640px) 31vw, 46vw"
          className="w-full h-full object-cover pointer-events-none rounded-lg"
          loading="lazy"
        />

        {/* From Price overlay */}
        {card.fromPrice && (
          <div className="absolute bottom-0 left-0 right-0 py-2 px-3">
            <span className="text-white text-[13px] sm:text-[14px] font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              {card.fromPrice}
            </span>
          </div>
        )}
      </div>
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

export default CollectionShowcase;
