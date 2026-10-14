import {useCallback, useMemo, useState, useSyncExternalStore} from 'react';
import {useLocation, useNavigate, useRouteLoaderData} from 'react-router';
import {
  getAccountStorageSnapshot,
  saveWishlist,
  subscribeAccountStorage,
} from '~/lib/accountPreferences.client';

const getServerSnapshot = () => '[]';

export function createWishlistItem(product, selectedVariant) {
  const variant =
    selectedVariant ||
    product?.selectedOrFirstAvailableVariant ||
    product?.variants?.nodes?.find((item) => item.availableForSale) ||
    product?.variants?.nodes?.[0];

  if (!product?.id || !product?.handle || !product?.title) {
    throw new Error('This product cannot be saved to favourites.');
  }

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    vendor: product.vendor || '',
    image:
      product.featuredImage ||
      product.image ||
      product.images?.nodes?.[0] ||
      variant?.image ||
      null,
    price: variant?.price || product.priceRange?.minVariantPrice || null,
    variantId: variant?.id || null,
    variantTitle: variant?.title || '',
    availableForSale: variant?.availableForSale ?? false,
    variants: product.variants?.nodes?.length
      ? product.variants.nodes.map((item) => ({
          id: item.id,
          title: item.title,
          availableForSale: item.availableForSale,
          price: item.price,
        }))
      : variant?.id
        ? [
            {
              id: variant.id,
              title: variant.title,
              availableForSale: variant.availableForSale,
              price: variant.price,
            },
          ]
        : [],
  };
}

export function useAccountWishlist(product, selectedVariant) {
  const snapshot = useSyncExternalStore(
    subscribeAccountStorage,
    getAccountStorageSnapshot,
    getServerSnapshot,
  );
  const [error, setError] = useState('');
  const isLoggedIn = Boolean(useRouteLoaderData('root')?.isLoggedIn);
  const navigate = useNavigate();
  const location = useLocation();
  const items = useMemo(() => {
    try {
      const parsed = JSON.parse(snapshot);
      return Array.isArray(parsed) ? parsed : [];
    } catch (parseError) {
      console.error('Unable to read the saved favourites list.', parseError);
      return [];
    }
  }, [snapshot]);
  const isSaved = Boolean(
    product?.id && items.some((item) => item.id === product.id),
  );

  const toggle = useCallback(() => {
    setError('');
    // Favourites need an account: guests go to sign in, then come back here.
    if (!isLoggedIn) {
      const returnTo = `${location.pathname}${location.search}`;
      navigate(`/account/login?return_to=${encodeURIComponent(returnTo)}`);
      return false;
    }
    try {
      const currentItems = JSON.parse(getAccountStorageSnapshot());
      const savedItems = Array.isArray(currentItems) ? currentItems : [];
      const nextItems = savedItems.some((item) => item.id === product?.id)
        ? savedItems.filter((item) => item.id !== product?.id)
        : [...savedItems, createWishlistItem(product, selectedVariant)];
      saveWishlist(nextItems);
      return nextItems.some((item) => item.id === product?.id);
    } catch (storageError) {
      console.error('Unable to update your favourites.', storageError);
      setError('Your favourites could not be saved on this device.');
      return isSaved;
    }
  }, [isLoggedIn, location, navigate, isSaved, product, selectedVariant]);

  return {items, isSaved, toggle, error};
}
