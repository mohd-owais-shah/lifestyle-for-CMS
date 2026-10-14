import {useEffect, useMemo, useState} from 'react';
import {Link, useFetcher} from 'react-router';
import {CartForm, Image} from '@shopify/hydrogen';
import {CartSelectSizeModal} from './CartSelectSizeModal';

const MAX_FAVOURITES = 4;

export function CartAddFromFavourites({products = []}) {
  const [selectedVariants, setSelectedVariants] = useState({});
  const [activeModalProductId, setActiveModalProductId] = useState(null);
  const fetcher = useFetcher();
  const variantsFetcher = useFetcher();

  const visibleProducts = useMemo(
    () => (products || []).slice(0, MAX_FAVOURITES),
    [products],
  );
  const productIds = visibleProducts.map((product) => product.id).join(',');

  // Saved favourites can hold stale or partial variants (e.g. only the one
  // variant selected when saved), so load live sizes and availability.
  const {load: loadVariants} = variantsFetcher;
  useEffect(() => {
    if (!productIds) return;
    loadVariants(`/api/product-variants?ids=${encodeURIComponent(productIds)}`);
  }, [productIds, loadVariants]);

  const liveProducts = useMemo(() => {
    const liveById = new Map(
      (variantsFetcher.data?.products || []).map((product) => [
        product.id,
        product,
      ]),
    );
    return visibleProducts.map((product) => {
      const live = liveById.get(product.id);
      return live?.variants?.nodes?.length
        ? {...product, variants: live.variants}
        : product;
    });
  }, [visibleProducts, variantsFetcher.data]);

  const activeModalProduct =
    liveProducts.find((product) => product.id === activeModalProductId) ||
    null;

  if (liveProducts.length === 0) return null;

  const handleOpenSizeModal = (product) => {
    setActiveModalProductId(product.id);
  };

  const handleCloseSizeModal = () => {
    setActiveModalProductId(null);
  };

  const handleConfirmSizeSelection = (variantId, sizeName) => {
    if (!activeModalProduct || !variantId) return;

    setSelectedVariants((prev) => ({
      ...prev,
      [activeModalProduct.id]: {
        variantId,
        sizeName,
      },
    }));

    // Add selected variant directly to basket
    fetcher.submit(
      {
        [CartForm.INPUT_NAME]: JSON.stringify({
          action: CartForm.ACTIONS.LinesAdd,
          inputs: {
            lines: [{merchandiseId: variantId, quantity: 1}],
          },
        }),
      },
      {method: 'POST', action: '/cart'},
    );
  };

  const handleDirectAddToCart = (productId) => {
    const selection = selectedVariants[productId];
    if (!selection?.variantId) return;

    fetcher.submit(
      {
        [CartForm.INPUT_NAME]: JSON.stringify({
          action: CartForm.ACTIONS.LinesAdd,
          inputs: {
            lines: [{merchandiseId: selection.variantId, quantity: 1}],
          },
        }),
      },
      {method: 'POST', action: '/cart'},
    );
  };

  return (
    <div className="mt-10 mb-8 border-t border-gray-200 pt-8">
      {/* Section Title matching Screenshot 3 & Image 1 */}
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
        Add from favourites
      </h3>

      {/* Grid of favourite items matching Screenshot 3 & Image 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {liveProducts.map((product) => {
          const image = product.featuredImage;
          const rawAmount =
            product.priceRange?.minVariantPrice?.amount ||
            product.price?.amount ||
            '0';
          const minPrice = parseFloat(rawAmount);
          const selection = selectedVariants[product.id];
          const isAdding =
            fetcher.state !== 'idle' &&
            fetcher.formData
              ?.get('cartFormInput')
              ?.includes(selection?.variantId || product.id);

          return (
            <div key={product.id} className="flex flex-col bg-white">
              {/* Product Thumbnail */}
              <Link
                to={`/products/${product.handle}`}
                className="block relative aspect-3/4 overflow-hidden rounded bg-gray-50"
              >
                {image ? (
                  <Image
                    data={image}
                    alt={image.altText || product.title}
                    className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                    No image
                  </div>
                )}
              </Link>

              {/* Price & Title */}
              <div className="mt-2.5">
                <span className="text-sm font-bold text-gray-900">
                  ₹{Math.round(minPrice).toLocaleString('en-IN')}
                </span>
                <Link to={`/products/${product.handle}`} className="block mt-1">
                  <h4 className="text-xs text-gray-800 font-normal line-clamp-2 leading-snug hover:text-gray-600">
                    {product.vendor ? `${product.vendor} ` : ''}
                    {product.title}
                  </h4>
                </Link>
              </div>

              {/* Select size button matching Image 1 */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => handleOpenSizeModal(product)}
                  className="w-full py-2 border border-gray-300 rounded text-xs font-semibold text-gray-800 hover:border-gray-500 bg-white transition-colors cursor-pointer text-center"
                >
                  {selection?.sizeName
                    ? `Size: ${selection.sizeName}`
                    : 'Select size'}
                </button>
              </div>

              {/* Add to basket button matching Image 1 */}
              <div className="mt-2">
                <button
                  type="button"
                  disabled={!selection?.variantId || isAdding}
                  onClick={() => handleDirectAddToCart(product.id)}
                  className={`w-full py-2 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                    selection?.variantId
                      ? 'border-[#FAA619] bg-white text-[#FAA619] hover:bg-[#FFF7ED]'
                      : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                  }`}
                >
                  {isAdding ? 'Adding...' : 'Add to basket'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Select Size Modal matching Image 1 */}
      {activeModalProduct && (
        <CartSelectSizeModal
          isOpen={Boolean(activeModalProduct)}
          onClose={handleCloseSizeModal}
          product={activeModalProduct}
          onConfirmSelection={handleConfirmSizeSelection}
        />
      )}
    </div>
  );
}
