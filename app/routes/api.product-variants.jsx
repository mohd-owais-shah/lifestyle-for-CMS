/**
 * Live variant data for saved favourites. The wishlist copy kept on the
 * device can be stale or hold only one variant, so the basket's size picker
 * reads sizes and availability from here instead.
 * GET /api/product-variants?ids=gid://shopify/Product/1,gid://shopify/Product/2
 */
export async function loader({request, context}) {
  const url = new URL(request.url);
  const ids = String(url.searchParams.get('ids') || '')
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.startsWith('gid://shopify/Product/'))
    .slice(0, 20);

  if (ids.length === 0) {
    return Response.json({products: []}, {status: 400});
  }

  const {nodes} = await context.storefront.query(PRODUCT_VARIANTS_QUERY, {
    variables: {ids},
  });

  return Response.json(
    {products: (nodes || []).filter(Boolean)},
    {headers: {'Cache-Control': 'private, no-store'}},
  );
}

const PRODUCT_VARIANTS_QUERY = `#graphql
  query FavouriteProductVariants(
    $ids: [ID!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    nodes(ids: $ids) {
      ... on Product {
        id
        variants(first: 100) {
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
  }
`;
