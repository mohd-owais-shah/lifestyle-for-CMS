import {useState, useEffect} from 'react';
import {CartForm, Image} from '@shopify/hydrogen';
import {Link, useFetcher} from 'react-router';
import {useAccountWishlist} from '~/hooks/useAccountWishlist';
import {saveWishlist} from '~/lib/accountPreferences.client';
import {ParticipatingBrands} from '~/components/Account/ParticipatingBrands';

export const meta = () => [{title: 'Favourites'}];

export default function AccountFavourites() {
  const {items: hookItems} = useAccountWishlist(null);
  const [mounted, setMounted] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [storageError, setStorageError] = useState('');
  const fetcher = useFetcher();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only show items after client mount so we read from localStorage, not SSR empty state
  const items = mounted ? hookItems : [];

  const cartErrors = Array.isArray(fetcher.data?.errors)
    ? fetcher.data.errors
    : [];
  const cartError = cartErrors.find((error) => error?.message)?.message;

  const handleRemove = (productId) => {
    setStorageError('');
    try {
      const nextItems = items.filter((item) => item.id !== productId);
      // saveWishlist persists to localStorage and notifies the shared
      // useSyncExternalStore subscription in useAccountWishlist, which
      // re-renders this list with the updated items.
      saveWishlist(nextItems);
    } catch (error) {
      console.error('Unable to remove a favourite.', error);
      setStorageError('This favourite could not be removed from this device.');
    }
  };

  const handleAddToCart = (variantId) => {
    if (!variantId) return;
    fetcher.submit(
      {
        [CartForm.INPUT_NAME]: JSON.stringify({
          action: CartForm.ACTIONS.LinesAdd,
          inputs: {lines: [{merchandiseId: variantId, quantity: 1}]},
        }),
      },
      {method: 'POST', action: '/cart'},
    );
  };

  return (
    <div className="w-full max-w-[800px] mx-auto">
      {/* Header card matching Image 2 */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-base font-semibold text-gray-900">Favourites</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            View your most wanted products.
          </p>
        </div>
        <svg
          className="w-7 h-7 text-gray-400 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20.8 8.8c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />
        </svg>
      </div>

      {storageError && (
        <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">
          {storageError}
        </p>
      )}
      {cartError && fetcher.state === 'idle' && (
        <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">
          {cartError}
        </p>
      )}
      {fetcher.data?.cart && fetcher.state === 'idle' && (
        <p className="mt-4 border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700" role="status">
          Added to your basket.
        </p>
      )}

      {/* Favourites list */}
      {items.length ? (
        <div className="divide-y divide-gray-200">
          {items.map((product) => {
            const variants = product.variants || [];
            const availableVariants = variants.filter(
              (variant) => variant.availableForSale,
            );
            const defaultVariant =
              availableVariants.find(
                (variant) => variant.id === product.variantId,
              ) ||
              availableVariants[0] ||
              variants.find((variant) => variant.id === product.variantId);
            const selectedVariant =
              selectedVariants[product.id] || defaultVariant?.id || '';
            const canAdd = variants.some(
              (variant) =>
                variant.id === selectedVariant && variant.availableForSale,
            );
            const price =
              variants.find((variant) => variant.id === selectedVariant)
                ?.price || product.price;

            const formattedPrice = price?.amount
              ? new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: price.currencyCode || 'INR',
                  maximumFractionDigits: 0,
                }).format(Number(price.amount))
              : '';

            return (
              <article
                key={product.id}
                className="py-4 flex items-center justify-between gap-4"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                  <Link
                    className="w-[84px] h-[112px] sm:w-[92px] sm:h-[122px] bg-gray-50 overflow-hidden shrink-0 border border-gray-100"
                    to={`/products/${product.handle}`}
                    aria-label={`View ${product.title}`}
                  >
                    {product.image?.url ? (
                      <Image
                        data={product.image}
                        alt={product.image.altText || product.title}
                        className="w-full h-full object-cover object-top"
                        sizes="100px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 bg-gray-100">
                        No image
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0">
                    <span className="block text-[11px] font-semibold tracking-wider text-gray-500 uppercase mb-0.5">
                      {product.vendor || 'LIFESTYLE'}
                    </span>
                    <Link
                      className="block text-xs sm:text-sm text-gray-800 hover:text-black line-clamp-2 mb-3.5 font-normal"
                      to={`/products/${product.handle}`}
                    >
                      {product.title}
                    </Link>

                    <div className="flex items-center gap-3">
                      {variants.length > 1 ? (
                        <div className="relative inline-block">
                          <select
                            value={selectedVariant}
                            onChange={(event) =>
                              setSelectedVariants((current) => ({
                                ...current,
                                [product.id]: event.target.value,
                              }))
                            }
                            className="appearance-none border border-gray-300 bg-white text-xs text-gray-700 py-1 pl-2.5 pr-6 rounded-none cursor-pointer focus:outline-none focus:border-gray-500"
                          >
                            <option value="">Size</option>
                            {variants.map((variant) => (
                              <option
                                key={variant.id}
                                value={variant.id}
                                disabled={!variant.availableForSale}
                              >
                                {variant.title}
                                {!variant.availableForSale ? ' (Sold out)' : ''}
                              </option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-gray-500">
                            ▼
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="border border-gray-300 bg-white text-xs text-gray-700 py-1 px-2.5 flex items-center gap-1 rounded-none"
                        >
                          <span>Size</span>
                          <span className="text-[9px] text-gray-500">▼</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemove(product.id)}
                        className="text-xs text-gray-500 hover:text-gray-900 cursor-pointer transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Price & Add to Basket */}
                <div className="flex flex-col items-end justify-between self-stretch py-1 shrink-0">
                  <span className="text-sm font-semibold text-gray-900">
                    {formattedPrice}
                  </span>
                  <button
                    type="button"
                    disabled={!canAdd || fetcher.state !== 'idle'}
                    onClick={() => handleAddToCart(selectedVariant)}
                    className="text-xs font-semibold text-[#FAA619] hover:text-[#e09212] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {fetcher.state !== 'idle' ? 'Adding…' : 'Add to Basket'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-sm text-gray-600 mb-3">
            You haven&apos;t saved any favourites on this device yet.
          </p>
          <Link
            to="/collections/all"
            className="text-xs font-semibold text-[#FAA619] hover:underline"
          >
            Start Shopping →
          </Link>
        </div>
      )}

      {/* Participating Brands footer */}
      <ParticipatingBrands />
    </div>
  );
}
