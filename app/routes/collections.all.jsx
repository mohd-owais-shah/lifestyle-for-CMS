import {useLoaderData} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PlpView} from '~/components/Plp';
import {seoMeta} from '~/lib/seo';
import {plpShouldRevalidate} from '~/lib/plpRevalidation';

/** Subcategory chips filter locally; don't refetch for `subcat` changes. */
export const shouldRevalidate = plpShouldRevalidate;

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({location, matches}) =>
  seoMeta({
    title: 'All Products - Shop Fashion Online in India | Lifestyle Stores',
    description:
      'Shop all products online at Lifestyle Stores - Clothing, Footwear, Bags, Beauty & Home for Men, Women and Kids at the best prices ✔ COD ✔ Easy Returns',
    location,
    matches,
  });

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
async function loadCriticalData({context, request}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const rawQuery = (url.searchParams.get('q') || '').trim();
  let searchTerm = rawQuery;
  let queryFilters = [];

  if (rawQuery.includes(':')) {
    const colonParts = rawQuery.split(':');
    searchTerm = colonParts[0].trim();
    for (let i = 1; i < colonParts.length; i += 2) {
      const filterKey = (colonParts[i] || '').toLowerCase();
      const filterVal = colonParts[i + 1] || '';
      if (filterVal) {
        if (filterKey.includes('size')) {
          queryFilters.push({
            variantOption: {name: 'size', value: filterVal},
          });
        } else if (filterKey.includes('color')) {
          queryFilters.push({
            variantOption: {name: 'color', value: filterVal},
          });
        }
      }
    }
  }

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 24,
  });

  if (searchTerm) {
    const [{search}] = await Promise.all([
      storefront.query(SEARCH_CATALOG_QUERY, {
        variables: {
          ...paginationVariables,
          searchTerm,
          productFilters: queryFilters.length > 0 ? queryFilters : null,
        },
      }),
    ]);
    return {
      products: {
        nodes: search?.nodes || [],
        pageInfo: search?.pageInfo,
      },
      filters: search?.productFilters || [],
      searchTerm,
    };
  }

  const [{products, search}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
  ]);
  return {
    products,
    filters: search?.productFilters || products?.filters || [],
    searchTerm: '',
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
  const {products, filters, searchTerm} = useLoaderData();

  const breadcrumbs = [
    {label: 'Home', url: '/'},
    {label: 'Catalog', url: '/collections'},
    {label: searchTerm ? `"${searchTerm}"` : 'All Products', url: ''},
  ];

  const subcategories = [
    {name: 'Kurtas & Kurtis'},
    {name: 'Tops & Tees'},
    {name: 'Dresses'},
    {name: 'Jeans & Jeggings'},
    {name: 'Shirts'},
    {name: 'Trousers'},
    {name: 'Footwear'},
    {name: 'Accessories'},
  ];

  return (
    <div className="w-full bg-white no-scrollbar">
      <PlpView
        collection={{
          title: searchTerm ? `Results for "${searchTerm}"` : 'All Products',
          handle: 'all',
        }}
        initialProducts={products?.nodes || []}
        breadcrumbs={breadcrumbs}
        subcategories={subcategories}
        storefrontFilters={filters || []}
      />
    </div>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
    vendor
    productType
    tags
    featuredImage {
      id
      altText
      url
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
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
    search(query: "", first: 1, types: PRODUCT) {
      productFilters {
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
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
`;

const SEARCH_CATALOG_QUERY = `#graphql
  query SearchCatalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $searchTerm: String!
    $productFilters: [ProductFilter!]
  ) @inContext(country: $country, language: $language) {
    search(
      query: $searchTerm
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
      productFilters: $productFilters
      types: PRODUCT
    ) {
      totalCount
      productFilters {
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
        ... on Product {
          ...CollectionItem
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
`;

/** @typedef {import('./+types/collections.all').Route} Route */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
