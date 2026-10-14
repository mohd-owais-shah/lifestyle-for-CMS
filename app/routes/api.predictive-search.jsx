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
 * Resource route loader for predictive search API
 */
export async function loader({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 10);

  if (!term || term.length < 3) {
    return Response.json({
      type: 'predictive',
      term: term || '',
      result: {
        items: {
          queries: [],
          products: [],
          collections: [],
        },
        total: 0,
      },
    });
  }

  try {
    const {predictiveSearch: items, errors} = await storefront.query(
      PREDICTIVE_SEARCH_QUERY,
      {
        variables: {
          query: term,
          limit,
        },
        cache: storefront.CacheShort ? storefront.CacheShort() : undefined,
      },
    );

    if (errors) {
      console.error('Predictive search storefront errors:', errors);
    }

    const queries = Array.isArray(items?.queries) ? items.queries : [];
    const products = Array.isArray(items?.products) ? items.products : [];
    const collections = Array.isArray(items?.collections) ? items.collections : [];
    const total = queries.length + products.length + collections.length;

    return Response.json(
      {
        type: 'predictive',
        term,
        result: {
          items: {
            queries,
            products,
            collections,
          },
          total,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        },
      },
    );
  } catch (error) {
    console.error('Predictive search route error:', error);
    return Response.json({
      type: 'predictive',
      term,
      result: {
        items: {
          queries: [],
          products: [],
          collections: [],
        },
        total: 0,
      },
      error: error.message,
    });
  }
}
