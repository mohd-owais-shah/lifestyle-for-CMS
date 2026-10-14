/**
 * Saved addresses of the signed-in customer, for the "Choose your location"
 * sheet (loaded on demand so no page has to fetch them up front).
 * GET /api/customer-addresses
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const {session, storefront} = context;
  const customerAccessToken = session.get('customerAccessToken');

  if (!customerAccessToken) {
    return Response.json({addresses: [], isLoggedIn: false});
  }

  try {
    const {customer} = await storefront.query(CUSTOMER_ADDRESSES_QUERY, {
      variables: {customerAccessToken},
      cache: storefront.CacheNone(),
    });
    return Response.json(
      {addresses: customer?.addresses?.nodes || [], isLoggedIn: true},
      {headers: {'Cache-Control': 'private, no-store'}},
    );
  } catch {
    return Response.json({addresses: [], isLoggedIn: true}, {status: 502});
  }
}

const CUSTOMER_ADDRESSES_QUERY = `#graphql
  query LocationPickerAddresses($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      addresses(first: 20) {
        nodes {
          id
          firstName
          lastName
          address1
          city
          zip
        }
      }
    }
  }
`;

/** @typedef {import('./+types/api.customer-addresses').Route} Route */
