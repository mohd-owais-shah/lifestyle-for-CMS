import {useLoaderData} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PlpView} from '~/components/Plp';
import {seoMeta} from '~/lib/seo';
import {plpShouldRevalidate} from '~/lib/plpRevalidation';

/** Subcategory chips filter locally; don't refetch for `subcat` changes. */
export const shouldRevalidate = plpShouldRevalidate;

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({location, matches}) => {
  const term = new URLSearchParams(location.search).get('q');
  return seoMeta({
    title: term
      ? `Search results for "${term}" | Lifestyle Stores`
      : 'Search | Lifestyle Stores',
    path: '/search',
    noindex: true,
    matches,
  });
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({request, context}) {
  const url = new URL(request.url);
  const isPredictive = url.searchParams.has('predictive');
  try {
    const result = isPredictive
      ? await predictiveSearch({request, context})
      : await regularSearch({request, context});

    if (isPredictive) {
      return Response.json(result);
    }
    return result;
  } catch (error) {
    console.error('SEARCH_LOADER_ERROR:', error);
    if (isPredictive) {
      return Response.json({
        type: 'predictive',
        term: '',
        result: {items: {queries: [], products: [], collections: []}, total: 0},
        error: error.message,
      });
    }
    return {
      type: 'regular',
      term: '',
      result: {total: 0, items: {products: {nodes: []}}},
      error: error.message,
    };
  }
}

/**
 * Renders the /search route with full Lifestyle Stores PLP layout
 */
export default function SearchPage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData() || {};
  const {type, term, result} = data;
  if (type === 'predictive') return null;

  const products = result?.items?.products?.nodes || [];
  const storefrontFilters = result?.items?.products?.productFilters || [];

  const breadcrumbs = [];

  const subcategories = [
    {name: 'Women'},
    {name: 'Kids'},
    {name: 'Men'},
  ];

  return (
    <div className="w-full bg-white no-scrollbar">
      <PlpView
        collection={{
          title: term ? `You searched for ${term}` : 'Search Products',
          // Mobile header shows just the query, like the live site
          mobileTitle: term || 'Search',
          handle: 'search',
        }}
        initialProducts={products}
        breadcrumbs={breadcrumbs}
        subcategories={subcategories}
        storefrontFilters={storefrontFilters}
      />
      <Analytics.SearchView data={{searchTerm: term, searchResults: result}} />
    </div>
  );
}

/**
 * Regular search query and fragments
 */
const SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment SearchProduct on Product {
    __typename
    handle
    id
    publishedAt
    title
    trackingParameters
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
    selectedOrFirstAvailableVariant {
      id
      title
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
`;

const SEARCH_PAGE_FRAGMENT = `#graphql
  fragment SearchPage on Page {
     __typename
     handle
    id
    title
    trackingParameters
  }
`;

const SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
  }
`;

const PAGE_INFO_FRAGMENT = `#graphql
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/search
export const SEARCH_QUERY = `#graphql
  query RegularSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $startCursor: String
    $productFilters: [ProductFilter!]
    $sortKey: SearchSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    articles: search(
      query: $term,
      types: [ARTICLE],
      first: $first,
    ) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
    }
    pages: search(
      query: $term,
      types: [PAGE],
      first: $first,
    ) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
    }
    products: search(
      after: $endCursor,
      before: $startCursor,
      first: $first,
      last: $last,
      query: $term,
      productFilters: $productFilters,
      sortKey: $sortKey,
      reverse: $reverse,
      types: [PRODUCT],
      unavailableProducts: HIDE,
    ) {
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
        ...on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${SEARCH_PRODUCT_FRAGMENT}
  ${SEARCH_PAGE_FRAGMENT}
  ${SEARCH_ARTICLE_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

/**
 * Regular search fetcher
 * @param {Pick<
 *   Route.LoaderArgs,
 *   'request' | 'context'
 * >}
 * @return {Promise<RegularSearchReturn>}
 */
async function regularSearch({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const variables = getPaginationVariables(request, {pageBy: 100});
  const rawQuery = String(url.searchParams.get('q') || '');
  let term = rawQuery;
  const queryFilters = [];

  if (rawQuery.includes(':')) {
    const colonParts = rawQuery.split(':');
    term = colonParts[0].trim();
    for (let i = 1; i < colonParts.length; i += 2) {
      const filterKey = (colonParts[i] || '').toLowerCase();
      const filterVal = colonParts[i + 1] || '';
      if (filterVal) {
        if (filterKey.includes('size')) {
          queryFilters.push({
            variantOption: {name: 'size', value: filterVal},
          });
        } else if (filterKey.includes('color') || filterKey.includes('colour')) {
          queryFilters.push({
            variantOption: {name: 'color', value: filterVal},
          });
        } else if (filterKey.includes('brand') || filterKey.includes('vendor')) {
          queryFilters.push({
            productVendor: filterVal,
          });
        } else if (filterKey.includes('type')) {
          queryFilters.push({
            productType: filterVal,
          });
        } else if (filterKey.includes('tag')) {
          queryFilters.push({
            tag: filterVal,
          });
        }
      }
    }
  }

  // Parse filters parameter from URL and combine with queryFilters
  let productFilters = [...queryFilters];
  const filtersParam = url.searchParams.get('filters');
  if (filtersParam) {
    try {
      const parsed = JSON.parse(filtersParam);
      if (Array.isArray(parsed) && parsed.length > 0) {
        productFilters = [...productFilters, ...parsed];
      }
    } catch {
      // ignore invalid json
    }
  }

  // Support direct vendor or brand param from URL if not already present
  const vendorParam =
    url.searchParams.get('brand') ||
    url.searchParams.get('vendor') ||
    url.searchParams.get('filter.v.vendor');
  if (vendorParam && !productFilters.some((f) => f && f.productVendor)) {
    productFilters.push({productVendor: vendorParam});
  }

  // Support min_price and max_price in URL (only if not already included)
  const hasExistingPriceFilter = productFilters.some((f) => f && f.price);
  const minPrice = url.searchParams.get('min_price');
  const maxPrice = url.searchParams.get('max_price');
  if ((minPrice || maxPrice) && !hasExistingPriceFilter) {
    const priceFilter = {
      price: {
        ...(minPrice ? {min: parseFloat(minPrice)} : {}),
        ...(maxPrice ? {max: parseFloat(maxPrice)} : {}),
      },
    };
    productFilters.push(priceFilter);
  }

  // Parse sort parameters from URL
  const sortBy = url.searchParams.get('sort_by');
  let sortKey = 'RELEVANCE';
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
    case 'relevance':
    default:
      sortKey = 'RELEVANCE';
      reverse = false;
      break;
  }

  // Search articles, pages, and products for the term
  const {errors, ...items} = await storefront.query(SEARCH_QUERY, {
    variables: {
      ...variables,
      term,
      productFilters: productFilters.length > 0 ? productFilters : null,
      sortKey,
      reverse,
    },
  });

  if (!items) {
    throw new Error('No search data returned from Shopify API');
  }

  const total = Object.values(items || {}).reduce(
    (acc, item) => acc + (item?.nodes?.length || 0),
    0,
  );

  const error = errors
    ? errors.map(({message}) => message).join(', ')
    : undefined;

  return {type: 'regular', term, error, result: {total, items}};
}



export const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $query: String!
    $limit: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      query: $query
      limit: $limit
      limitScope: ALL
      types: [QUERY, PRODUCT, COLLECTION]
    ) {
      queries {
        text
      }
      products {
        id
        title
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          url
          altText
        }
      }
      collections {
        id
        title
        handle
        image {
          url
          altText
        }
      }
    }
  }
`;

/**
 * Predictive search fetcher
 * @param {Pick<
 *   Route.ActionArgs,
 *   'request' | 'context'
 * >}
 * @return {Promise<PredictiveSearchReturn>}
 */
async function predictiveSearch({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 10);
  const type = 'predictive';

  if (!term || term.length < 3) {
    return {type, term: term || '', result: {items: {queries: [], products: [], collections: []}, total: 0}};
  }

  const {predictiveSearch: items, errors} = await storefront.query(
    PREDICTIVE_SEARCH_QUERY,
    {
      variables: {
        query: term,
        limit,
      },
    },
  );

  if (errors) {
    console.error('Predictive search errors:', errors);
  }

  const queries = items?.queries || [];
  const products = items?.products || [];
  const collections = items?.collections || [];
  const total =
    (Array.isArray(queries) ? queries.length : 0) +
    (Array.isArray(products) ? products.length : 0) +
    (Array.isArray(collections) ? collections.length : 0);

  return {type, term, result: {items: {queries, products, collections}, total}};
}

/** @typedef {import('./+types/search').Route} Route */
/** @typedef {import('~/lib/search').RegularSearchReturn} RegularSearchReturn */
/** @typedef {import('~/lib/search').PredictiveSearchReturn} PredictiveSearchReturn */
/** @typedef {import('storefrontapi.generated').RegularSearchQuery} RegularSearchQuery */
/** @typedef {import('storefrontapi.generated').PredictiveSearchQuery} PredictiveSearchQuery */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
