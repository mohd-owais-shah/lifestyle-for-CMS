import {useLoaderData, data} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {CartPage} from '~/components/Cart';
import {MobileFooter} from '~/components/small-uis/MobileFooter';
import {seoMeta} from '~/lib/seo';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({location, matches}) =>
  seoMeta({title: "Shopping Bag | Lifestyle Stores", noindex: true, location, matches});

/**
 * @type {HeadersFunction}
 */
export const headers = ({actionHeaders}) => {
  // The basket is per-buyer: keep it out of every cache, while still passing
  // on headers set by cart actions (e.g. the cart id cookie).
  const headers = new Headers(actionHeaders);
  headers.set('Cache-Control', 'private, no-store');
  return headers;
};

/**
 * @param {Route.ActionArgs}
 */
export async function action({request, context}) {
  const {cart} = context;

  const formData = await request.formData();

  let {action, inputs} = CartForm.getFormInput(formData);

  if (!action && formData.has('action')) {
    action = formData.get('action');
    const rawInputs = formData.get('inputs');
    try {
      inputs = typeof rawInputs === 'string' ? JSON.parse(rawInputs) : (rawInputs || {});
    } catch {
      inputs = {};
    }
  }

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      let discountCodes = [];
      if (Array.isArray(inputs.discountCodes)) {
        discountCodes = inputs.discountCodes.map((c) => String(c).trim()).filter(Boolean);
      } else if (typeof inputs.discountCode === 'string' && inputs.discountCode.trim()) {
        discountCodes = [inputs.discountCode.trim()];
      }

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesAdd: {
      const formGiftCardCode = inputs.giftCardCode;

      const giftCardCodes = formGiftCardCode ? [formGiftCardCode] : [];

      result = await cart.addGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      const appliedGiftCardIds = inputs.giftCardCodes;
      result = await cart.removeGiftCardCodes(appliedGiftCardIds);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    case CartForm.ACTIONS.NoteUpdate: {
      result = await cart.updateNote(inputs.note);
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({request, context}) {
  const {cart, storefront, session} = context;

  const url = new URL(request.url);
  const testLoginParam = url.searchParams.get('logged_in');

  // Start every independent request in parallel instead of awaiting them
  // sequentially. Previously the cart loader blocked on the cart, then the
  // banner metaobject, then the product list, then recommendations, adding
  // multiple avoidable Storefront round-trips to time-to-first-byte.
  const cartPromise = cart.get();

  const isLoggedInPromise = (() => {
    if (testLoginParam !== null) {
      return Promise.resolve(testLoginParam === 'true');
    }
    // Login is the Storefront API customer access token kept in the session
    return Promise.resolve(Boolean(session.get('customerAccessToken')));
  })();

  const bannerPromise = storefront
    ? storefront
        .query(CART_OFFER_BANNER_QUERY, {cache: storefront.CacheShort()})
        .catch(() => null)
    : Promise.resolve(null);

  const productsPromise = storefront
    ? storefront
        .query(CART_RECOMMENDED_PRODUCTS_QUERY, {
          variables: {first: 16},
          cache: storefront.CacheShort(),
        })
        .catch((error) => {
          console.error('Failed to fetch recommendations:', error);
          return null;
        })
    : Promise.resolve(null);

  const [cartData, isLoggedIn, metaobjectData, productsData] =
    await Promise.all([
      cartPromise,
      isLoggedInPromise,
      bannerPromise,
      productsPromise,
    ]);

  let bannerImageUrl = null;
  let bannerMobileImageUrl = null;

  // 1. Parse the cart_offer_banner metaobject for desktop/mobile banners
  if (metaobjectData) {
    const metaobjectNode = metaobjectData?.metaobjects?.nodes?.[0];
    const fields = metaobjectNode?.fields || [];

    const desktopField =
      fields.find(
        (f) =>
          (f.key === 'offer_banner' ||
            f.key === 'offer_banner_desktop' ||
            f.key === 'offer-banner-desktop') &&
          f.reference?.image?.url,
      ) ||
      fields.find(
        (f) =>
          f.reference?.image?.url &&
          f.reference.image.url.toLowerCase().includes('desktop'),
      );

    const mobileField =
      fields.find(
        (f) =>
          (f.key === 'offer_banner_mobile' ||
            f.key === 'offer-banner-mobile') &&
          f.reference?.image?.url,
      ) ||
      fields.find(
        (f) =>
          f.reference?.image?.url &&
          f.reference.image.url.toLowerCase().includes('mobile'),
      );

    const firstImageField = fields.find((f) => f.reference?.image?.url);

    bannerImageUrl =
      desktopField?.reference?.image?.url ||
      firstImageField?.reference?.image?.url ||
      null;
    bannerMobileImageUrl = mobileField?.reference?.image?.url || null;
  }

  // 2. Products for "Add from favourites" and "Frequently Bought Together"
  const storeProducts = productsData?.products?.nodes || [];
  const favouriteProducts = storeProducts.slice(0, 4);
  let frequentlyBoughtTogetherProducts = [];

  // Try Shopify productRecommendations if cart has products (depends on cart)
  const firstProductId = cartData?.lines?.nodes?.[0]?.merchandise?.product?.id;
  if (storefront && firstProductId) {
    try {
      const recData = await storefront.query(
        CART_PRODUCT_RECOMMENDATIONS_QUERY,
        {
          variables: {productId: firstProductId},
          cache: storefront.CacheShort(),
        },
      );
      if (recData?.productRecommendations?.length > 0) {
        frequentlyBoughtTogetherProducts = recData.productRecommendations;
      }
    } catch {
      // Fallback to store products
    }
  }

  if (frequentlyBoughtTogetherProducts.length === 0) {
    frequentlyBoughtTogetherProducts =
      storeProducts.slice(4).length > 0 ? storeProducts.slice(4) : storeProducts;
  }

  return {
    cart: cartData || null,
    isLoggedIn,
    bannerImageUrl,
    bannerMobileImageUrl,
    favouriteProducts,
    frequentlyBoughtTogetherProducts,
  };
}

export default function Cart() {
  const {
    cart,
    isLoggedIn,
    bannerImageUrl,
    bannerMobileImageUrl,
    favouriteProducts,
    frequentlyBoughtTogetherProducts,
  } = useLoaderData();

  return (
    <>
      <CartPage
        cart={cart}
        isLoggedIn={isLoggedIn}
        bannerImageUrl={bannerImageUrl}
        bannerMobileImageUrl={bannerMobileImageUrl}
        favouriteProducts={favouriteProducts}
        frequentlyBoughtTogetherProducts={frequentlyBoughtTogetherProducts}
      />
      <MobileFooter />
    </>
  );
}

const CART_OFFER_BANNER_QUERY = `#graphql
  query CartPageOfferBannerMetaobject {
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

const CART_RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query CartRecommendedProducts($first: Int!) {
    products(first: $first) {
      nodes {
        id
        title
        handle
        vendor
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
  }
`;

const CART_PRODUCT_RECOMMENDATIONS_QUERY = `#graphql
  query CartProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      id
      title
      handle
      vendor
      productType
      availableForSale
      featuredImage {
        url
        altText
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
      variants(first: 10) {
        nodes {
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
        }
      }
    }
  }
`;

/** @typedef {import('react-router').HeadersFunction} HeadersFunction */
/** @typedef {import('./+types/cart').Route} Route */
/** @typedef {import('@shopify/hydrogen').CartQueryDataReturn} CartQueryDataReturn */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
/** @typedef {ReturnType<typeof useActionData<typeof action>>} ActionReturnData */
