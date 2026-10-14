import { useState, useMemo, useRef, useEffect } from 'react';
import {
  ProductReviewsModal,
  StarRatingRow,
} from '~/components/pdp/ProductReviews';

const ChevronRightIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#141414"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export function ProductDetailsAccordion({
  product,
  description,
  descriptionHtml,
  tags = [],
  showSizeFitting = false,
  onOpenSizeGuide,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const detailsSectionRef = useRef(null);
  const toggleButtonRef = useRef(null);

  const handleToggle = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setTimeout(() => {
        toggleButtonRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      }, 60);
    } else {
      setIsExpanded(false);
      setTimeout(() => {
        detailsSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }, 60);
    }
  };

  // Extract metafields into a fast lookup map
  const metafieldsMap = useMemo(() => {
    const map = {};
    if (product?.metafields && Array.isArray(product.metafields)) {
      for (const m of product.metafields) {
        if (m && m.key && m.value) {
          map[m.key.toLowerCase()] = m.value;
        }
      }
    }
    return map;
  }, [product?.metafields]);

  // Live Shopify product description (no static fallback data)
  const actualDescription = product?.description || description || '';
  const actualDescriptionHtml = product?.descriptionHtml || descriptionHtml || '';

  const overviewText = useMemo(() => {
    if (actualDescription && actualDescription.trim()) {
      return actualDescription.trim();
    }
    if (actualDescriptionHtml && actualDescriptionHtml.trim()) {
      const stripped = actualDescriptionHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (stripped) return stripped;
    }
    if (metafieldsMap['overview'] && metafieldsMap['overview'].trim()) {
      return metafieldsMap['overview'].trim();
    }
    return '';
  }, [actualDescription, actualDescriptionHtml, metafieldsMap]);

  // Derive comprehensive specifications list
  const specifications = useMemo(() => {
    const title = (product?.title || '').toLowerCase();
    const type = (product?.productType || '').toLowerCase();
    const desc = overviewText.toLowerCase();
    const tagList = (tags || []).map((t) => t.toLowerCase());

    const hasTerm = (...terms) => {
      return terms.some((term) =>
        title.includes(term) ||
        type.includes(term) ||
        desc.includes(term) ||
        tagList.some((t) => t.includes(term))
      );
    };

    // 1. Gender: Metafield > Inferred
    let gender = metafieldsMap['gender'];
    if (!gender) {
      if (hasTerm('women', 'woman', 'ladies', 'girls', 'kurta', 'kurti', 'saree', 'dress', 'bra', 'panty')) {
        gender = 'Women';
      } else if (hasTerm('kids', 'infant', 'baby', 'boy', 'girl')) {
        gender = 'Kids';
      } else {
        gender = 'Men';
      }
    }

    // 2. Product Category: Metafield > Inferred
    let productCategory = metafieldsMap['product_category'] || metafieldsMap['product'];
    if (!productCategory) {
      if (hasTerm('kurta', 'kurti')) productCategory = 'Kurta';
      else if (hasTerm('polo')) productCategory = 'T-shirt';
      else if (hasTerm('jeans')) productCategory = 'Jeans';
      else if (hasTerm('trouser', 'trousers', 'pant')) productCategory = 'Trousers';
      else if (hasTerm('dress')) productCategory = 'Dress';
      else if (hasTerm('shirt')) productCategory = 'Shirt';
      else if (hasTerm('bag', 'backpack', 'handbag')) productCategory = 'Bag';
      else if (product?.productType) productCategory = product.productType;
      else productCategory = 'T-shirt';
    }

    // 3. Type: Metafield > Inferred
    let productTypeLabel = metafieldsMap['type'];
    if (!productTypeLabel) {
      if (hasTerm('polo')) productTypeLabel = 'Polos';
      else if (hasTerm('kurta', 'kurti')) productTypeLabel = 'Straight Kurta';
      else if (hasTerm('tee', 't-shirt')) productTypeLabel = 'Crew Neck T-Shirt';
      else if (hasTerm('skinny')) productTypeLabel = 'Skinny Fit';
      else if (hasTerm('loose')) productTypeLabel = 'Loose Fit';
      else if (hasTerm('slim')) productTypeLabel = 'Slim Fit';
      else productTypeLabel = 'Regular';
    }

    // 4. Design / Pattern: Metafield > Inferred
    let design = metafieldsMap['design'];
    if (!design) {
      if (hasTerm('floral')) design = 'Floral Print';
      else if (hasTerm('print', 'printed')) design = 'Printed';
      else if (hasTerm('stripe', 'striped')) design = 'Striped';
      else if (hasTerm('check', 'checked')) design = 'Checked';
      else if (hasTerm('texture', 'textured')) design = 'Textured';
      else design = 'Solid';
    }

    // 5. Sleeve Length: Metafield > Inferred
    let sleeve = metafieldsMap['sleeve_length'] || metafieldsMap['sleeve'];
    if (!sleeve) {
      if (hasTerm('3/4', 'three quarter')) sleeve = '3/4th Sleeves';
      else if (hasTerm('full sleeve', 'long sleeve')) sleeve = 'Full Sleeves';
      else if (hasTerm('sleeveless')) sleeve = 'Sleeveless';
      else sleeve = 'Half Sleeves';
    }

    // 6. Fabric: Metafield > Inferred
    let fabric = metafieldsMap['fabric'];
    if (!fabric) {
      if (hasTerm('100% cotton', 'pure cotton')) fabric = '100% Cotton';
      else if (hasTerm('viscose', 'rayon')) fabric = 'Viscose Rayon';
      else if (hasTerm('denim')) fabric = 'Cotton Denim';
      else if (hasTerm('polyester')) fabric = 'Polyester Blend';
      else fabric = 'Cotton Blend';
    }

    // 7. Occasion: Metafield > Inferred
    let occasion = metafieldsMap['occasion'];
    if (!occasion) {
      if (hasTerm('ethnic', 'festive', 'kurta', 'saree', 'fusion')) occasion = 'Festive / Ethnic';
      else if (hasTerm('formal', 'office')) occasion = 'Formal';
      else if (hasTerm('active', 'sport', 'gym')) occasion = 'Athleisure';
      else occasion = 'Casual';
    }

    // 8. Fit: Metafield > Default
    const fit = metafieldsMap['fit'] || 'Regular';

    // 9. Length: Metafield > Default
    const length = metafieldsMap['length'] || 'Regular';

    // 10. Care Instructions: Metafield > Default
    const careInstructions = metafieldsMap['care_instructions'] || 'Machine Wash';

    // 11. Model Specs: Metafield > Inferred
    let modelWears = metafieldsMap['model_wears'];
    if (!modelWears) {
      if (gender === 'Women') {
        modelWears = 'Size S, has Height 5\'8", Bust 34" and Waist 28"';
      } else {
        modelWears = 'Size M, has Chest 40" and Waist 32"';
      }
    }

    // 12. Country of Origin, Manufacturer, Customer Care, Net Quantity: Metafield > Default
    const countryOfOrigin = metafieldsMap['country_of_origin'] || 'India';
    const manufacturer = metafieldsMap['manufacturer'] || 'Lifestyle International Pvt Ltd, 77 Degree Town Centre, Building No. 3, West Wing, Off HAL Airport Road, Yamlur, Bangalore-560037';
    const customerCare = metafieldsMap['customer_care'] || 'Manager Commercial, 77 Degree Town Centre, Building No. 3, West Wing, Off HAL Airport Road, Yamlur PO., Bangalore-560037, Phone: 1800-123-1555, help@lifestylestores.com';
    const netQuantity = metafieldsMap['net_quantity'] || '1 Number';

    return [
      `Country of Origin : ${countryOfOrigin}`,
      `Manufactured/Imported By : ${manufacturer}`,
      `Customer Care : ${customerCare}`,
      `Net Quantity : ${netQuantity}`,
      `Occasion : ${occasion}`,
      `Gender : ${gender}`,
      `Product : ${productCategory}`,
      `Type : ${productTypeLabel}`,
      `Design : ${design}`,
      `Length : ${length}`,
      `Sleeve Length : ${sleeve}`,
      `Fabric : ${fabric}`,
      `Fit : ${fit}`,
      `Care Instructions : ${careInstructions}`,
      `Model Wears : ${modelWears}`,
    ];
  }, [product, overviewText, tags, metafieldsMap]);

  const visibleSpecs = isExpanded ? specifications : specifications.slice(0, 6);

  useEffect(() => {
    if (!isOverviewModalOpen || typeof document === 'undefined') return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow || 'unset';
    };
  }, [isOverviewModalOpen]);

  const overviewDescriptionBlock =
    actualDescriptionHtml ? (
      <div
        className="text-[14px] font-normal text-[#000000] leading-[20px] font-sans [&>p]:mb-2 [&>p:last-child]:mb-0 [&>p]:text-[14px] [&>p]:text-[#000000] [&>p]:leading-[20px] [&>p]:font-normal"
        dangerouslySetInnerHTML={{ __html: actualDescriptionHtml }}
      />
    ) : overviewText ? (
      <p className="text-[14px] font-normal text-[#000000] leading-[20px] font-sans">
        {overviewText}
      </p>
    ) : null;

  return (
    <>
      {/* Mobile: Overview row opens full-screen modal */}
      <div className="lg:hidden border-b border-[#EAEAEA]">
        <button
          type="button"
          onClick={() => setIsOverviewModalOpen(true)}
          className="flex w-full items-center justify-between py-4 bg-transparent border-0 p-0 cursor-pointer text-left"
          aria-expanded={isOverviewModalOpen}
          aria-haspopup="dialog"
        >
          <span className="text-[14px] font-semibold text-[#141414] leading-[20px]">
            Overview
          </span>
          <ChevronRightIcon />
        </button>

        {showSizeFitting && onOpenSizeGuide && (
          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="flex w-full items-center justify-between border-t border-[#EAEAEA] py-4 bg-transparent border-x-0 border-b-0 p-0 cursor-pointer text-left"
          >
            <span className="text-[14px] font-semibold text-[#141414] leading-[20px]">
              Size &amp; Fitting
            </span>
            <ChevronRightIcon />
          </button>
        )}

        {/* Ratings & Reviews */}
        <button
          type="button"
          onClick={() => setIsReviewsModalOpen(true)}
          className="flex w-full items-center justify-between gap-2 border-t border-[#EAEAEA] py-4 bg-transparent border-x-0 border-b-0 p-0 cursor-pointer text-left"
          aria-expanded={isReviewsModalOpen}
          aria-haspopup="dialog"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-[14px] font-semibold text-[#141414] leading-[20px]">
              Ratings &amp; Reviews
            </span>
            <div className="flex items-center gap-[3px]">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="#BDBDBD"
                  aria-hidden="true"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          </div>
          <ChevronRightIcon />
        </button>

        <ProductReviewsModal
          isOpen={isReviewsModalOpen}
          onClose={() => setIsReviewsModalOpen(false)}
          reviews={[]}
          data={product}
        />

        {isOverviewModalOpen && (
          <div className="fixed inset-0 z-[100] flex flex-col bg-white">
            <div className="relative flex shrink-0 items-center justify-center border-b border-[#EAEAEA] px-4 py-4">
              <h2
                id="pdp-overview-modal-title"
                className="text-[16px] font-semibold text-[#141414] leading-[22px]"
              >
                Overview
              </h2>
              <button
                type="button"
                onClick={() => setIsOverviewModalOpen(false)}
                className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0 text-[22px] leading-none text-[#141414] cursor-pointer"
                aria-label="Close overview"
              >
                ×
              </button>
            </div>

            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="pdp-overview-modal-title"
              className="flex-1 overflow-y-auto px-4 py-4 pb-24"
            >
              {overviewDescriptionBlock && (
                <div className="mb-5">{overviewDescriptionBlock}</div>
              )}

              <div>
                <h3 className="text-[14px] font-semibold text-[#141414] leading-[20px] mb-3">
                  Details
                </h3>
                <ul className="list-disc pl-5 m-0 text-[14px] font-normal text-[#000000] leading-[20px] font-sans marker:text-black">
                  {specifications.map((spec, idx) => (
                    <li
                      key={idx}
                      className="m-0 p-0 text-[14px] font-normal text-[#000000] leading-[20px] marker:text-black font-sans"
                    >
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop: inline overview & details (unchanged) */}
      <div className="hidden lg:block py-5 border-b border-[#EAEAEA] space-y-5">
      {/* 1. Overview */}
      {(actualDescriptionHtml || overviewText) && (
        <div>
          <h3 className="text-[14px] font-semibold text-[#141414] leading-[20px] mb-2">
            Overview
          </h3>
          {actualDescriptionHtml ? (
            <div
              className="text-[14px] font-normal text-[#000000] leading-[20px] font-sans [&>p]:mb-2 [&>p:last-child]:mb-0 [&>p]:text-[14px] [&>p]:text-[#000000] [&>p]:leading-[20px] [&>p]:font-normal"
              dangerouslySetInnerHTML={{ __html: actualDescriptionHtml }}
            />
          ) : (
            <p className="text-[14px] font-normal text-[#000000] leading-[20px] font-sans">
              {overviewText}
            </p>
          )}
        </div>
      )}

      {/* 2. Details (Bulleted Specifications List) */}
      <div ref={detailsSectionRef}>
        <h3 className="text-[14px] font-semibold text-[#141414] leading-[20px] mb-3">
          Details
        </h3>

        <ul className="list-disc pl-5 m-0 text-[14px] font-normal text-[#000000] leading-[20px] font-sans marker:text-black">
          {visibleSpecs.map((spec, idx) => (
            <li key={idx} className="m-0 p-0 text-[14px] font-normal text-[#000000] leading-[20px] marker:text-black font-sans">
              {spec}
            </li>
          ))}
        </ul>

        {/* Read More / Read Less Toggle in #FAA619 orange (right-aligned) */}
        <div ref={toggleButtonRef} className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={handleToggle}
            className="text-[13px] font-semibold text-[#FAA619] hover:underline cursor-pointer bg-transparent border-0 p-0"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
