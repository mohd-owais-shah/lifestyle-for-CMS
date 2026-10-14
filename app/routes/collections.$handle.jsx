import {redirect, useLoaderData} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {PlpView} from '~/components/Plp';
import {seoMeta, breadcrumbJsonLd, originFromMatches} from '~/lib/seo';
import {plpShouldRevalidate} from '~/lib/plpRevalidation';

/** Subcategory chips filter locally; don't refetch for `subcat` changes. */
export const shouldRevalidate = plpShouldRevalidate;

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data, location, matches}) => {
  const collection = data?.collection;
  if (!collection) {
    return seoMeta({
      title: 'Collection | Lifestyle Stores',
      noindex: true,
      location,
      matches,
    });
  }
  const path = `/collections/${collection.handle}`;
  return seoMeta({
    title:
      collection.seo?.title ||
      `${collection.title} - Buy ${collection.title} Online in India | Lifestyle Stores`,
    description:
      collection.seo?.description ||
      collection.description ||
      `Shop ${collection.title} online at the best prices on Lifestyle Stores. Choose from the latest collection ✔ COD ✔ Easy Returns`,
    image: collection.image?.url,
    path,
    matches,
    jsonLd: breadcrumbJsonLd(originFromMatches(matches), [
      {name: 'Home', path: '/'},
      {name: collection.title, path},
    ]),
  });
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;
  const url = new URL(request.url); 
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 100,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  // Parse sort parameters from URL
  const sortBy = url.searchParams.get('sort_by');
  let sortKey = null;
  let reverse = false;

  switch (sortBy) {
    case 'price-low-to-high':
      sortKey = 'PRICE';
      reverse = false;
      break;
    case 'price-high-to-low':
      sortKey = 'PRICE';
      reverse = true;
      break;
    case 'new-arrivals':
    case 'newest':
      sortKey = 'CREATED';
      reverse = true;
      break;
    case 'popularity':
    case 'best-selling':
      sortKey = 'BEST_SELLING';
      reverse = false;
      break;
    default:
      sortKey = null;
      reverse = false;
      break;
  }

  // Parse filters parameter from URL (supports JSON array or query params)
  let filters = null;
  const filtersParam = url.searchParams.get('filters');
  if (filtersParam) {
    try {
      filters = JSON.parse(filtersParam);
    } catch {
      filters = null;
    }
  }

  // Support min_price and max_price in URL
  const hasExistingPriceFilter = Array.isArray(filters) && filters.some((f) => f && f.price);
  const minPrice = url.searchParams.get('min_price');
  const maxPrice = url.searchParams.get('max_price');
  if ((minPrice || maxPrice) && !hasExistingPriceFilter) {
    const priceFilter = {
      price: {
        min: minPrice ? parseFloat(minPrice) : 0,
        max: maxPrice ? parseFloat(maxPrice) : 10000,
      },
    };
    filters = filters ? [...filters, priceFilter] : [priceFilter];
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      // Listing data: fresh for 1 minute, then served from cache for up to
      // 10 minutes while it refreshes in the background (default CacheShort
      // expires after ~10s, so nearly every visit waited on Shopify).
      cache: storefront.CacheCustom({
        mode: 'public',
        maxAge: 60,
        staleWhileRevalidate: 60 * 10,
      }),
      variables: {
        handle,
        first: paginationVariables.first || 24,
        after: paginationVariables.endCursor || null,
        filters,
        sortKey,
        reverse,
      },
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
  };
}

/**
 * Load deferred data below the fold
 * @param {Route.LoaderArgs}
 */
function loadDeferredData() {
  return {};
}

export default function Collection() {
  /** @type {LoaderReturnData} */
  const {collection} = useLoaderData();

  // Dynamic breadcrumb generation
  const breadcrumbs = [
    {label: 'Home', url: '/'},
    {label: 'Women', url: '/collections'},
    {label: collection?.title || 'Collection', url: ''},
  ];

  // Fashion subcategory tags matching Lifestyle Stores
  const subcategories = [
    {name: 'Kurtas and Kurtis'},
    {name: 'Salwar Suits'},
    {name: 'Fashion Bottoms'},
    {name: 'Tops & Tunics'},
    {name: 'Straight Pants'},
    {name: 'Dresses'},
    {name: 'Palazzos & Culottes'},
    {name: 'Dupattas & Stoles'},
    {name: 'Winterwear'},
    {name: 'Skirts'},
  ];

  return (
    <div className="w-full bg-white no-scrollbar">
      <PlpView
        collection={collection}
        initialProducts={collection?.products?.nodes || []}
        breadcrumbs={breadcrumbs}
        subcategories={subcategories}
        storefrontFilters={collection?.products?.filters || []}
        categoryBanner={collection?.standardCategoryBanner?.reference?.image}
      />
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/collection
const COLLECTION_QUERY = `#graphql
  query GetCollectionProducts(
    $handle: String!
    $first: Int!
    $after: String
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      seo {
        title
        description
      }
      image {
        url
      }
      standardCategoryBanner: metafield(namespace: "custom", key: "standard_category_banner_mob") {
        type
        reference {
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
      products(
        first: $first
        after: $after
        filters: $filters
        sortKey: $sortKey
        reverse: $reverse
      ) {
        filters {
          id
          label
          type
          presentation
          values {
            id
            label
            count
            input
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
        nodes {
          id
          handle
          title
          description
          availableForSale
          vendor
          productType
          tags
          featuredImage {
            url
            altText
            width
            height
          }
          images(first: 6) {
            nodes {
              id
              altText
              url
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
          variants(first: 100) {
            nodes {
              id
              title
              sku
              availableForSale
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

/** @typedef {import('./+types/collections.$handle').Route} Route */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
