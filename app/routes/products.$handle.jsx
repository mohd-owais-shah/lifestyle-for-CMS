import {useState} from 'react';
import {useLoaderData, useNavigate} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

// Component-wise PDP modular architecture
import {PdpBreadcrumbs} from '~/components/pdp/PdpBreadcrumbs';
import {ProductHeader} from '~/components/pdp/ProductHeader';
import {ProductGallery} from '~/components/pdp/ProductGallery';
import {ProductPricing} from '~/components/pdp/ProductPricing';
import {ProductVariantSelector} from '~/components/pdp/ProductVariantSelector';
import {ProductOffers} from '~/components/pdp/ProductOffers';
import {ProductDeliveryChecker} from '~/components/pdp/ProductDeliveryChecker';
import {ProductServices} from '~/components/pdp/ProductServices';
import {ProductDetailsAccordion} from '~/components/pdp/ProductDetailsAccordion';
import {ProductRecommendations} from '~/components/pdp/ProductRecommendations';
import {PdpMobileHeader} from '~/components/pdp/PdpMobileHeader';
import {SelectSizeModal} from '~/components/pdp/SelectSizeModal';
import {ProductSizeGuideModal} from '~/components/pdp/ProductSizeGuideModal';
import {AddedToBasketToast} from '~/components/pdp/AddedToBasketToast';
import {AddToCartButton} from '~/components/AddToCartButton';
import {shopifyImageUrl, shopifySrcSet} from '~/lib/shopifyImage';
import {useAside} from '~/components/Aside';
import {seoMeta, truncate, breadcrumbJsonLd, originFromMatches} from '~/lib/seo';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data, location, matches}) => {
  const product = data?.product;
  if (!product) {
    return seoMeta({
      title: 'Product | Lifestyle Stores',
      noindex: true,
      location,
      matches,
    });
  }

  const origin = originFromMatches(matches);
  const path = `/products/${product.handle}`;
  const title =
    product.seo?.title ||
    `Buy ${product.title} Online in India | Lifestyle Stores`;
  const description =
    product.seo?.description ||
    product.description ||
    `Shop ${product.title} online at the best prices on Lifestyle Stores ✔ COD ✔ Easy Returns`;
  const images = (product.images?.nodes || []).slice(0, 5).map((i) => i.url);
  const variant = product.selectedOrFirstAvailableVariant;
  const price = variant?.price || product.priceRange?.minVariantPrice;

  return seoMeta({
    title,
    description,
    path,
    matches,
    type: 'product',
    image: images[0],
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: truncate(product.description, 500) || undefined,
        image: images,
        sku: variant?.sku || undefined,
        brand: product.vendor
          ? {'@type': 'Brand', name: product.vendor}
          : undefined,
        offers: price
          ? {
              '@type': 'Offer',
              url: `${origin}${path}`,
              priceCurrency: price.currencyCode,
              price: Number(price.amount).toFixed(2),
              itemCondition: 'https://schema.org/NewCondition',
              availability: variant?.availableForSale
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            }
          : undefined,
      },
      breadcrumbJsonLd(origin, [
        {name: 'Home', path: '/'},
        {name: product.title, path},
      ]),
    ],
  });
};

/**
 * Prevent re-fetching heavy PDP queries (product, recommendations, banners) on cart mutations
 * @type {Route.ShouldRevalidateFunction}
 */
export const shouldRevalidate = ({formMethod, formAction, defaultShouldRevalidate}) => {
  if (formAction?.startsWith('/cart') || formAction?.includes('/cart')) {
    return false;
  }
  return defaultShouldRevalidate;
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const criticalData = await loadCriticalData(args);
  return {...criticalData};
}

/**
 * Load critical data for PDP
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // Kick off the above-the-fold product query and every below-the-fold
  // request in parallel. Previously each await added a serial Storefront
  // round-trip before the PDP could respond.
  const productPromise = storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions: getSelectedProductOptions(request)},
  });

  // Recommendations are looked up by handle so they don't have to wait for
  // the product query to return its id.
  const recommendationsPromise = storefront
    .query(RECOMMENDATIONS_QUERY, {
      variables: {handle},
      cache: storefront.CacheShort(),
    })
    .catch(() => null);

  const customersAlsoViewedPromise = storefront
    .query(CUSTOMERS_ALSO_VIEWED_QUERY, {variables: {first: 16}})
    .catch(() => null);

  const bannerPromise = storefront
    ? Promise.all([
        storefront
          .query(CART_OFFER_BANNER_METAOBJECT_QUERY, {
            cache: storefront.CacheShort(),
          })
          .catch(() => null),
        storefront
          .query(PDP_BANNER_METAFIELD_QUERY, {
            cache: storefront.CacheShort(),
          })
          .catch(() => null),
      ])
    : Promise.resolve([null, null]);

  const {product} = await productPromise;

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // 1. Fetch real recommendations dynamically (no static fallback)
  let recommendations = [];
  try {
    const recData = await recommendationsPromise;
    recommendations = (recData?.productRecommendations || []).filter(
      (p) => p.id !== product.id,
    );

    // If Shopify productRecommendations is unindexed, query similar items of same productType
    if (recommendations.length === 0 && product.productType) {
      const typeData = await storefront.query(CUSTOMERS_ALSO_VIEWED_QUERY, {
        variables: {query: `product_type:"${product.productType}"`, first: 10},
        cache: storefront.CacheShort(),
      });
      recommendations = (typeData?.products?.nodes || []).filter(
        (p) => p.id !== product.id,
      );
    }
  } catch (err) {
    recommendations = [];
  }

  // 2. Resolve Customers Also Viewed (request already in flight)
  let customersAlsoViewed = [];
  try {
    const recIds = new Set(recommendations.map((p) => p.id));
    recIds.add(product.id);

    const alsoViewedData = await customersAlsoViewedPromise;
    const nodes = alsoViewedData?.products?.nodes || [];
    customersAlsoViewed = nodes.filter((p) => !recIds.has(p.id));
  } catch (err) {
    customersAlsoViewed = [];
  }

  // 3. Resolve PDP page banner (metaobject banners already in flight)
  let bannerImageUrl = null;
  const [metaobjectData, metafieldData] = await bannerPromise;
  const metaobjectNode = metaobjectData?.metaobjects?.nodes?.[0];
  // Specifically match the 'pdp-page-banner' field
  const pdpField =
    metaobjectNode?.fields?.find(
      (f) =>
        (f.key === 'pdp-page-banner' ||
          f.key === 'pdp_page_banner' ||
          f.key?.includes('pdp')) &&
        f.reference?.image?.url,
    ) || metaobjectNode?.fields?.find((f) => f.reference?.image?.url);

  if (pdpField?.reference?.image?.url) {
    bannerImageUrl = pdpField.reference.image.url;
  }

  if (!bannerImageUrl) {
    bannerImageUrl =
      metafieldData?.shop?.metafield?.reference?.image?.url || null;
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
    recommendations,
    customersAlsoViewed,
    bannerImageUrl,
  };
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product, recommendations, customersAlsoViewed, bannerImageUrl} =
    useLoaderData();
  const {open} = useAside();
  const navigate = useNavigate();

  const [hasUserSelectedSize, setHasUserSelectedSize] = useState(false);
  const [isAddedToBasket, setIsAddedToBasket] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get mapped product options
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const sizeOption = productOptions.find((opt) =>
    opt.name.toLowerCase().includes('size'),
  );
  const hasSizeOption = Boolean(
    sizeOption && sizeOption.optionValues?.length > 1,
  );

  const isOnSale = Boolean(
    selectedVariant?.compareAtPrice &&
    parseFloat(selectedVariant.compareAtPrice.amount) >
      parseFloat(selectedVariant.price.amount),
  );

  const handleMobileShare = async () => {
    if (typeof window === 'undefined') return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          url: window.location.href,
        });
      } catch (err) {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Product link copied to clipboard!');
      } catch (err) {
        // clipboard fallback
      }
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#141414]">
      {/* Toast Notification (Fixed position on Desktop and Mobile) */}
      <AddedToBasketToast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        image={
          selectedVariant?.image?.url ||
          product?.featuredImage?.url ||
          product?.images?.nodes?.[0]?.url
        }
        title={product?.title}
      />

      {/* 1. Mobile Top Header & Location Bar (Strictly mobile only; hidden on desktop web view) */}
      <PdpMobileHeader />

      {/* Main Container: padding pb-28 on mobile for sticky bottom bar; pb-0 on desktop */}
      <div className="w-full max-w-[1276px] mx-auto px-4 pb-28 lg:pb-0">
        {/* Breadcrumb Navigation - Desktop Only */}
        <div className="hidden lg:block">
          <PdpBreadcrumbs product={product} />
        </div>

        {/* Product Title (Lifestyle Store Desktop Header) - Desktop Only */}
        <div className="hidden lg:block mt-2 mb-2">
          <ProductHeader title={product.title} />
        </div>

        {/* Main 2-Column Product Layout (~66.7% gallery, ~33.3% info) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 items-start">
          {/* Left Column: Image Gallery (8 cols = ~66.7% / ~808px) */}
          <div className="lg:col-span-8">
            <ProductGallery
              product={product}
              images={product.images?.nodes || []}
              selectedVariantImage={selectedVariant?.image}
              tags={product.tags || []}
              isOnSale={isOnSale}
            />

            {/* Mobile Product Title & Share Bar (Strictly matching live mobile screenshot) */}
            <div className="lg:hidden mt-3 pb-3 border-b border-[#ECEDEB] flex items-center justify-between">
              <div className="pr-3 flex-1 min-w-0">
                <h1 className="text-[16px] font-bold text-[#141414] leading-snug tracking-tight">
                  {product.title}
                </h1>
                <div className="mt-1">
                  <span className="text-[12px] font-semibold text-[#FAA619]">
                    Free shipping on All orders
                  </span>
                </div>
              </div>

              {/* Vertical Divider & Share Button */}
              <div className="pl-3 border-l border-[#ECEDEB] shrink-0 flex flex-col items-center justify-center">
                <button
                  type="button"
                  onClick={() => {}}
                  className="flex flex-col items-center justify-center cursor-pointer bg-transparent border-0 p-1"
                  aria-label="Share"
                >
                  <svg width={21} height={20} viewBox="0 0 576 512" fill="#212121" xmlns="http://www.w3.org/2000/svg">
                    <path d="M425.5 7c-6.9-6.9-17.2-8.9-26.2-5.2S384.5 14.3 384.5 24l0 56-48 0c-88.4 0-160 71.6-160 160 0 46.7 20.7 80.4 43.6 103.4 8.1 8.2 16.5 14.9 24.3 20.4 9.2 6.5 21.7 5.7 30.1-1.9s10.2-20 4.5-29.8c-3.6-6.3-6.5-14.9-6.5-26.7 0-36.2 29.3-65.5 65.5-65.5l46.5 0 0 56c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l136-136c9.4-9.4 9.4-24.6 0-33.9L425.5 7zm7 97l0-22.1 78.1 78.1-78.1 78.1 0-22.1c0-13.3-10.7-24-24-24L338 192c-50.9 0-93.9 33.5-108.3 79.6-3.3-9.4-5.2-19.8-5.2-31.6 0-61.9 50.1-112 112-112l72 0c13.3 0 24-10.7 24-24zm-320-8c-44.2 0-80 35.8-80 80l0 256c0 44.2 35.8 80 80 80l256 0c44.2 0 80-35.8 80-80l0-24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 24c0 17.7-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l24 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-24 0z" />
                  </svg>
                  <span className="text-[11px] font-medium text-[#FAA619] mt-0.5">
                    Share
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Product Purchase & Info Panel (4 cols = ~33.3% / ~404px) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-1">
            {/* Pricing - Desktop view only; mobile uses the sticky bottom bar matching live app */}
            <div className="hidden lg:block">
              <ProductPricing
                price={selectedVariant?.price}
                compareAtPrice={selectedVariant?.compareAtPrice}
              />
            </div>

            {/* Desktop Only: Offers & Discounts placed after MRP and before Color Variant */}
            <div className="hidden lg:block">
              <ProductOffers idPrefix="desktop" />
            </div>

            {/* Color & Size Variant Selector */}
            <ProductVariantSelector
              product={product}
              productOptions={productOptions}
              selectedVariant={selectedVariant}
              hasUserSelectedSize={hasUserSelectedSize}
              setHasUserSelectedSize={setHasUserSelectedSize}
              isAddedToBasket={isAddedToBasket}
              setIsAddedToBasket={setIsAddedToBasket}
              onOpenSelectSizeModal={() => setIsSizeModalOpen(true)}
              onAddedSuccess={() => {
                setIsAddedToBasket(true);
                setShowToast(true);
              }}
              isSizeGuideOpen={isSizeGuideOpen}
              setIsSizeGuideOpen={setIsSizeGuideOpen}
              showToast={showToast}
              onCloseToast={() => setShowToast(false)}
            />

            {/* Limited Time Offer Image Banner (from cart_offer_banner metaobject) */}
            {bannerImageUrl && (
              <div className="pt-3 pb-1">
                <div className="w-full overflow-hidden rounded-[8px]">
                  <img
                    src={shopifyImageUrl(bannerImageUrl, {width: 800})}
                    srcSet={shopifySrcSet(bannerImageUrl, [400, 600, 800, 1200])}
                    sizes="(min-width: 1024px) 400px, 100vw"
                    alt="Limited Time Offer"
                    className="w-full h-auto object-cover rounded-[8px]"
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            {/* Mobile Only: Offers & Discounts below Limited Time Offer banner */}
            <div className="lg:hidden pt-1">
              <ProductOffers idPrefix="mobile" />
            </div>

            {/* Pincode Delivery Check */}
            <ProductDeliveryChecker />

            {/* Store Services Highlights */}
            <ProductServices vendor={product.vendor} />

            {/* Overview & Specifications */}
            <ProductDetailsAccordion
              product={product}
              description={product.description}
              descriptionHtml={product.descriptionHtml}
              tags={product.tags}
              showSizeFitting={Boolean(sizeOption)}
              onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
            />
          </div>
        </div>

        {/* Bottom Sections: Dynamic Recommendations & Customers Also Viewed */}
        <ProductRecommendations
          title="You may also like"
          products={recommendations}
        />

        <ProductRecommendations
          title="Customers Also Viewed"
          products={customersAlsoViewed}
        />
      </div>

      {/* Sticky Mobile Bottom Bar (matching live app screenshot) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#EAEAEA] px-4 py-2.5 flex items-center justify-between gap-3 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        {/* Left: MRP & Tax Info */}
        <div className="flex-1 min-w-0 flex flex-col pr-2">
          <div className="flex items-baseline gap-1">
            <span className="text-[11px] font-normal text-[#929391]">MRP</span>
            <span className="text-[18px] font-bold text-[#141414] leading-tight">
              ₹
              {Math.round(
                parseFloat(selectedVariant?.price?.amount || '0'),
              ).toLocaleString('en-IN')}
            </span>
            {selectedVariant?.compareAtPrice &&
              parseFloat(selectedVariant.compareAtPrice.amount) >
                parseFloat(selectedVariant.price.amount) && (
                <span className="text-[12px] text-[#929391] line-through ml-1">
                  ₹
                  {Math.round(
                    parseFloat(selectedVariant.compareAtPrice.amount),
                  ).toLocaleString('en-IN')}
                </span>
              )}
          </div>
          <span className="text-[10px] font-normal text-[#929391] leading-tight">
            Inclusive of all taxes
          </span>
        </div>

        {/* Right: ADD TO BASKET / GO TO BASKET Button (Half width on mobile) */}
        <div className="w-1/2 shrink-0 relative">
          {!hasUserSelectedSize && hasSizeOption ? (
            <button
              type="button"
              onClick={() => setIsSizeModalOpen(true)}
              className="w-full h-[44px] py-[6px] px-[16px] rounded-[2px] text-[13px] font-bold uppercase tracking-[0.5px] bg-[#FAA619] active:bg-[#E09212] text-white shadow-sm transition-all flex items-center justify-center cursor-pointer border-0"
            >
              ADD TO BASKET
            </button>
          ) : isAddedToBasket ? (
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="w-full h-[44px] py-[6px] px-[16px] rounded-[2px] text-[13px] font-bold uppercase tracking-[0.5px] bg-[#FAA619] active:bg-[#E09212] text-white shadow-sm transition-all flex items-center justify-center cursor-pointer border-0"
            >
              GO TO BASKET
            </button>
          ) : (
            <AddToCartButton
              disabled={!selectedVariant || !selectedVariant.availableForSale}
              onAdded={() => {
                setIsAddedToBasket(true);
                setShowToast(true);
              }}
              lines={
                selectedVariant
                  ? [
                      {
                        merchandiseId: selectedVariant.id,
                        quantity: 1,
                        selectedVariant,
                      },
                    ]
                  : []
              }
              className={`w-full h-[44px] py-[6px] px-[16px] rounded-[2px] text-[13px] font-bold uppercase tracking-[0.5px] transition-all flex items-center justify-center ${
                selectedVariant?.availableForSale
                  ? 'bg-[#FAA619] active:bg-[#E09212] text-white shadow-sm cursor-pointer border-0'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed border-0'
              }`}
            >
              <span>
                {selectedVariant?.availableForSale
                  ? 'ADD TO BASKET'
                  : 'SOLD OUT'}
              </span>
            </AddToCartButton>
          )}
        </div>
      </div>

      {/* Centered Size Selection Modal */}
      <SelectSizeModal
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        sizeOption={sizeOption}
        selectedVariant={selectedVariant}
        onSelectSize={(val) => {
          setHasUserSelectedSize(true);
          setIsAddedToBasket(false);
          if (val?.variantUriQuery) {
            void navigate(`?${val.variantUriQuery}`, {
              replace: true,
              preventScrollReset: true,
            });
          }
        }}
        onAddedSuccess={() => {
          setIsAddedToBasket(true);
          setShowToast(true);
        }}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      {/* Sizing & Fit Guide Modal (Rendered at root for top-level stacking context) */}
      <ProductSizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        sizes={sizeOption?.optionValues}
      />

      {/* Hydrogen Product Analytics */}
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    productType
    tags
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    images(first: 20) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    options {
      name
      values
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    collections(first: 5) {
      nodes {
        id
        title
        handle
      }
    }
    colorVariantLinking: metafield(namespace: "custom", key: "color_variant_linking") {
      id
      namespace
      key
      value
      references(first: 30) {
        nodes {
          ... on Product {
            id
            title
            handle
            featuredImage {
              id
              url
              altText
              width
              height
            }
            images(first: 1) {
              nodes {
                id
                url
                altText
              }
            }
            options {
              name
              values
            }
            metafield(namespace: "custom", key: "color") {
              value
            }
            selectedOrFirstAvailableVariant {
              id
              title
              availableForSale
              image {
                id
                url
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
    metafields(identifiers: [
      {namespace: "custom", key: "color_variant_linking"},
      {namespace: "custom", key: "gender"},
      {namespace: "custom", key: "product_category"},
      {namespace: "custom", key: "type"},
      {namespace: "custom", key: "design"},
      {namespace: "custom", key: "sleeve_length"},
      {namespace: "custom", key: "fabric"},
      {namespace: "custom", key: "fit"},
      {namespace: "custom", key: "occasion"},
      {namespace: "custom", key: "care_instructions"},
      {namespace: "custom", key: "country_of_origin"},
      {namespace: "custom", key: "manufacturer"},
      {namespace: "custom", key: "customer_care"},
      {namespace: "custom", key: "net_quantity"},
      {namespace: "custom", key: "model_wears"},
      {namespace: "custom", key: "details"},
      {namespace: "custom", key: "specifications"},
      {namespace: "custom", key: "color"},
      {namespace: "custom", key: "overview"}
    ]) {
      id
      namespace
      key
      value
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const RECOMMENDATIONS_QUERY = `#graphql
  query ProductRecommendations(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productHandle: $handle) {
      id
      title
      handle
      vendor
      productType
      availableForSale
      featuredImage {
        id
        url
        altText
        width
        height
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 10) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

const CUSTOMERS_ALSO_VIEWED_QUERY = `#graphql
  query CustomersAlsoViewed(
    $query: String
    $first: Int = 16
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $first, query: $query) {
      nodes {
        id
        title
        handle
        vendor
        productType
        featuredImage {
          id
          url
          altText
          width
          height
        }
        images(first: 2) {
          nodes {
            id
            url
            altText
            width
            height
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

const CART_OFFER_BANNER_METAOBJECT_QUERY = `#graphql
  query CartOfferBannerMetaobject {
    metaobjects(type: "cart_offer_banner", first: 1) {
      nodes {
        fields {
          key
          reference {
            ... on MediaImage {
              image {
                url
              }
            }
          }
        }
      }
    }
  }
`;

const PDP_BANNER_METAFIELD_QUERY = `#graphql
  query PdpBannerMetafield {
    shop {
      metafield(namespace: "pdp", key: "page_banner") {
        reference {
          ... on MediaImage {
            image {
              url
            }
          }
        }
      }
    }
  }
`;

/** @typedef {import('./+types/products.$handle').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
