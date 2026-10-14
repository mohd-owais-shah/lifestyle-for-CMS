import {useState} from 'react';
import {useNavigate} from 'react-router';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAccountWishlist} from '~/hooks/useAccountWishlist';
import {shopifyImageUrl} from '~/lib/shopifyImage';
import {WishlistHeartIcon} from '~/components/WishlistHeartIcon';

/**
 * Product Variant Selector (Colors, Sizes, Size Guide, Add To Basket CTA)
 * Matches LIVE Lifestyle Store PDP:
 * - "[N] colors available" header (only shown when total colors > 1)
 * - Swatch grid supporting Shopify "Color Variant Linking" metafield and native variant options
 * - Active swatch highlighted with signature orange border
 * - "Color: [Name]" label below
 * - Size: [XS, S, M, L, XL, XXL, 3XL] with Size Guide
 */
export function ProductVariantSelector({
  product,
  productOptions = [],
  selectedVariant,
  hasUserSelectedSize,
  setHasUserSelectedSize,
  isAddedToBasket,
  setIsAddedToBasket,
  onOpenSelectSizeModal,
  onAddedSuccess,
  isSizeGuideOpen,
  setIsSizeGuideOpen,
  showToast,
  onCloseToast,
}) {
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);
  const {
    isSaved: isFavourite,
    toggle: toggleFavourite,
    error: wishlistError,
  } = useAccountWishlist(product, selectedVariant);

  const handleShare = () => {};

  // Check if formal Color option exists in options
  const colorOption = productOptions.find(
    (opt) =>
      opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour',
  );
  const otherOptions = productOptions.filter((opt) => {
    const name = opt.name.toLowerCase();
    if (name === 'color' || name === 'colour') return false;
    if (name === 'title') return false;
    if (
      opt.optionValues?.length === 1 &&
      opt.optionValues[0].name.toLowerCase() === 'default title'
    ) {
      return false;
    }
    return true;
  });

  // Helper to extract clean color name from a product / variant
  const getColorName = (prod, variant) => {
    // 1. Metafield 'color' or 'colour'
    const metaColor =
      prod?.metafield?.value ||
      prod?.metafields?.find?.(
        (m) =>
          m &&
          (m.key?.toLowerCase() === 'color' ||
            m.key?.toLowerCase() === 'colour'),
      )?.value;
    if (metaColor) return metaColor;

    // 2. Selected option
    const optionColor = variant?.selectedOptions?.find(
      (opt) =>
        opt.name.toLowerCase().includes('color') ||
        opt.name.toLowerCase().includes('colour'),
    )?.value;
    if (optionColor) return optionColor;

    // 3. Option value
    const optVal = prod?.options?.find(
      (o) =>
        o.name.toLowerCase().includes('color') ||
        o.name.toLowerCase().includes('colour'),
    )?.values?.[0];
    if (optVal) return optVal;

    // 4. Extract from Title if formatted like "Product - Color"
    const titleParts = (prod?.title || '').split(/\s*[-–—|]\s*/);
    if (titleParts.length > 1) {
      const candidate = titleParts[titleParts.length - 1].trim();
      if (candidate && candidate.length <= 20) return candidate;
    }

    return '';
  };

  // 1. Resolve Color Items: Check Shopify "Color Variant Linking" metafield first
  const linkedProductNodes =
    product?.colorVariantLinking?.references?.nodes || [];

  let colorItems = [];

  if (linkedProductNodes.length > 0) {
    const isCurrentInLinked = linkedProductNodes.some(
      (p) => p.id === product.id || p.handle === product.handle,
    );

    const currentItem = {
      id: product.id,
      handle: product.handle,
      title: product.title,
      colorName: getColorName(product, selectedVariant),
      image:
        selectedVariant?.image?.url ||
        product.featuredImage?.url ||
        product.images?.nodes?.[0]?.url,
      isSelected: true,
      available: selectedVariant?.availableForSale ?? true,
      isLinkedProduct: true,
    };

    const mappedLinked = linkedProductNodes.map((node) => {
      const isCurrent =
        node.id === product.id || node.handle === product.handle;
      const nodeColor = getColorName(
        node,
        node.selectedOrFirstAvailableVariant,
      );
      return {
        id: node.id,
        handle: node.handle,
        title: node.title,
        colorName:
          isCurrent && currentItem.colorName
            ? currentItem.colorName
            : nodeColor,
        image:
          node.selectedOrFirstAvailableVariant?.image?.url ||
          node.featuredImage?.url ||
          node.images?.nodes?.[0]?.url,
        isSelected: isCurrent,
        available:
          node.selectedOrFirstAvailableVariant?.availableForSale ?? true,
        isLinkedProduct: true,
      };
    });

    colorItems = isCurrentInLinked
      ? mappedLinked
      : [currentItem, ...mappedLinked];
  } else if (colorOption && colorOption.optionValues?.length > 1) {
    // 2. Standard multi-color variant options within same product
    colorItems = colorOption.optionValues.map((val) => ({
      id: val.name,
      variantUriQuery: val.variantUriQuery,
      title: val.name,
      colorName: val.name,
      image:
        val.swatch?.image?.previewImage?.url ||
        val.firstSelectableVariant?.image?.url ||
        selectedVariant?.image?.url ||
        product.featuredImage?.url ||
        product.images?.nodes?.[0]?.url,
      isSelected: Boolean(val.selected),
      available: Boolean(val.available && val.exists),
      isLinkedProduct: false,
    }));
  } else {
    // 3. Single color product (1 color available)
    const singleColor = getColorName(product, selectedVariant);
    colorItems = [
      {
        id: product.id,
        handle: product.handle,
        title: product.title,
        colorName: singleColor,
        image:
          selectedVariant?.image?.url ||
          product.featuredImage?.url ||
          product.images?.nodes?.[0]?.url,
        isSelected: true,
        available: true,
        isLinkedProduct: false,
      },
    ];
  }

  // Active color name for display
  const activeItem = colorItems.find((c) => c.isSelected) || colorItems[0];
  const activeColorName = activeItem?.colorName || '';

  return (
    <div className="pt-4 pb-0">
      {/* 1. COLOR SELECTION */}
      <div className="pb-3 border-b border-[#EAEAEA]">
        {/* Only show "[N] colors available" if more than 1 color is available */}
        {colorItems.length > 1 && (
          <div className="text-[13px] text-[#292D35] font-normal mb-2.5">
            {colorItems.length} colors available
          </div>
        )}

        {/* Swatches Grid */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {colorItems.map((item) => {
            const {
              id,
              title,
              colorName,
              image,
              isSelected,
              available,
              isLinkedProduct,
              variantUriQuery,
              handle,
            } = item;

            return (
              <button
                key={id || colorName}
                type="button"
                disabled={!available && isSelected}
                onClick={() => {
                  if (isSelected) return;
                  setIsAddedToBasket?.(false);
                  setHasUserSelectedSize?.(false);
                  if (isLinkedProduct && handle) {
                    void navigate(`/products/${handle}`);
                  } else if (variantUriQuery) {
                    void navigate(`?${variantUriQuery}`, {
                      replace: true,
                      preventScrollReset: true,
                    });
                  }
                }}
                className={`relative w-[48px] h-[52px] p-[2px] rounded-[4px] overflow-hidden transition-all flex items-center justify-center bg-white ${
                  isSelected
                    ? 'border-2 border-[#FAA619] shadow-sm'
                    : 'border border-gray-200 hover:border-gray-400'
                } ${!available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                title={colorName || title}
              >
                <div className="w-full h-full overflow-hidden flex items-center justify-center rounded-[2px]">
                  {image ? (
                    <img
                      // 44x48px swatch: request a small (aspect-preserving) copy, not the
                      // full-size original; object-cover frames it exactly as before
                      src={shopifyImageUrl(image, {width: 150})}
                      alt={colorName || title}
                      width={44}
                      height={48}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                </div>
                {!available && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center bg-black/50">
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Color text below the swatch */}
        <div className="pt-[16px] flex items-center">
          <span className="text-[14px] font-normal text-[#929391] leading-[20px]">
            Color:
          </span>
          {activeColorName && (
            <span className="text-[14px] font-medium text-[#000000] leading-[20px] pl-[6px]">
              {activeColorName}
            </span>
          )}
        </div>
      </div>

      {/* 2. SIZE AND OTHER OPTIONS */}
      {otherOptions.map((option) => {
        const isSize = option.name.toLowerCase().includes('size');

        return (
          <div
            key={option.name}
            id={isSize ? 'details-size' : undefined}
            className={isSize ? 'pt-[24px]' : 'pt-4'}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] font-normal text-[#000000] leading-[20px]">
                {isSize ? 'Size:' : `${option.name}:`}
              </span>
              {isSize && (
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen?.(true)}
                  className="text-[14px] font-normal text-[#000000] underline underline-offset-2 hover:text-[#FAA619] transition-colors cursor-pointer bg-transparent border-0"
                >
                  Size Guide
                </button>
              )}
            </div>

            <div
              className="flex items-center gap-1.5 sm:gap-2 w-full"

            >
              {option.optionValues.map((val) => {
                const {name, variantUriQuery, selected, available, exists} =
                  val;
                const isSelected = isSize
                  ? Boolean(selected && (hasUserSelectedSize || option.optionValues.length === 1))
                  : Boolean(selected);

                return (
                  /* div.jss920: 103.2px on phone, 58.85px on web */
                  <div
                    key={name}
                    className="flex-1 min-w-0 max-w-[84px]"
                  >
                    <button
                      type="button"
                      disabled={!exists}
                      onClick={() => {
                        if (isSize) {
                          setHasUserSelectedSize?.(true);
                          setIsAddedToBasket?.(false);
                        }
                        if (!selected) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                      className={`relative w-full h-[48px] px-1 sm:px-2 rounded-[2px] flex items-center justify-center text-[12px] xs:text-[13px] sm:text-[14px] font-semibold transition-all ${
                        isSelected
                          ? 'border-2 border-[#FAA619] bg-white text-[#FAA619] shadow-sm'
                          : 'border-2 border-[#DFE1E8] bg-white text-[#000000]'
                      } ${
                        !available
                          ? 'text-gray-300 border-2 border-[#E5E7EB] bg-gray-50 cursor-not-allowed'
                          : 'cursor-pointer'
                      }`}
                    >
                      <span className="whitespace-nowrap">{name}</span>
                      {/* Diagonal line for sold out items */}
                      {!available && (
                        <span className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                          <span className="w-[120%] h-[1px] bg-gray-300 rotate-45 transform" />
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* 3. CTA: ADD TO BASKET / GO TO BASKET (Desktop view; mobile uses sticky bottom bar) */}
      <div className="pt-[16px] hidden lg:block">
        <div>
          {!hasUserSelectedSize && otherOptions.some((o) => o.name.toLowerCase().includes('size')) ? (
            <button
              type="button"
              onClick={onOpenSelectSizeModal}
              className="w-full h-[56px] py-[6px] px-[16px] rounded-[2px] text-[14px] font-bold uppercase tracking-[0.5px] bg-[#FAA619] hover:bg-[#E09212] active:bg-[#C9800E] text-white shadow-sm transition-all flex items-center justify-center cursor-pointer border-0"
            >
              ADD TO BASKET
            </button>
          ) : isAddedToBasket ? (
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="w-full h-[56px] py-[6px] px-[16px] rounded-[2px] text-[14px] font-bold uppercase tracking-[0.5px] bg-[#FAA619] hover:bg-[#E09212] active:bg-[#C9800E] text-white shadow-sm transition-all flex items-center justify-center cursor-pointer border-0"
            >
              GO TO BASKET
            </button>
          ) : (
            <AddToCartButton
              disabled={!selectedVariant || !selectedVariant.availableForSale}
              onAdded={onAddedSuccess}
              lines={
                selectedVariant
                  ? [
                      {
                        merchandiseId: selectedVariant.id,
                        quantity: 1,
                        selectedVariant,
                      },
                    ]
                  : []
              }
              className={`w-full h-[56px] py-[6px] px-[16px] rounded-[2px] text-[14px] font-bold uppercase tracking-[0.5px] transition-all flex items-center justify-center ${
                selectedVariant?.availableForSale
                  ? 'bg-[#FAA619] hover:bg-[#E09212] active:bg-[#C9800E] text-white shadow-sm cursor-pointer border-0'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed border-0'
              }`}
            >
              <span>
                {selectedVariant?.availableForSale
                  ? 'ADD TO BASKET'
                  : 'SOLD OUT'}
              </span>
            </AddToCartButton>
          )}
        </div>
      </div>

      {/* 4. ACTIONS: ADD TO FAVOURITES & SHARE (Desktop view matching div.MuiBox-root.jss940; mobile has floating heart & title share) */}
      <div className="hidden lg:flex mt-[16px] py-[16px] border-t border-[#ECEDEB] border-b-[3px] border-[#ECEDEB] items-center w-full">
        {/* Left: Add to Favourites (matching div.MuiBox-root.jss955: #212121, 14px Figtree-Semibold, padding: 0px 0px 0px 6px) */}
        <button
          type="button"
          onClick={toggleFavourite}
          aria-pressed={isFavourite}
          className="flex-1 flex items-center justify-center text-[14px] font-semibold text-[#212121] cursor-pointer bg-transparent border-0 outline-none"
        >
          <svg width={20} height={22} viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            {/* Heart */}
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              fill={isFavourite ? '#E53935' : 'none'}
              stroke={isFavourite ? '#E53935' : '#1A1A1A'}
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Circle Badge */}
            <circle
              cx="17"
              cy="18"
              r="5.4"
              fill={isFavourite ? '#E53935' : '#FFFFFF'}
              stroke={isFavourite ? '#FFFFFF' : '#1A1A1A'}
              strokeWidth={1.5}
            />
            {/* Plus (unfaved) or Checkmark (faved) */}
            {isFavourite ? (
              <path
                d="M14.7 17.9L16.4 19.6L19.3 16.3"
                stroke="#FFFFFF"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M14.7 18H19.3M17 15.7V20.3"
                stroke="#1A1A1A"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
          <span className="pl-[6px] text-[14px] font-semibold text-[#212121] leading-[24.5px]">
            {isFavourite ? 'Added to Favourites' : 'Add to Favourites'}
          </span>
        </button>
        {wishlistError && (
          <span className="sr-only" role="status">
            {wishlistError}
          </span>
        )}

        {/* Center Divider */}
        <div className="w-[1.5px] h-[20px] bg-[#ECEDEB]" />

        {/* Right: Share (matching div.MuiBox-root.jss956: #212121, 14px Figtree-Semibold, padding: 0px 0px 0px 9.6px) */}
        <button
          type="button"
          onClick={handleShare}
          className="flex-1 flex items-center justify-center text-[14px] font-semibold text-[#212121] cursor-pointer bg-transparent border-0 outline-none"
        >
          <svg width={21} height={20} viewBox="0 0 576 512" fill="#1A1A1A" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M425.5 7c-6.9-6.9-17.2-8.9-26.2-5.2S384.5 14.3 384.5 24l0 56-48 0c-88.4 0-160 71.6-160 160 0 46.7 20.7 80.4 43.6 103.4 8.1 8.2 16.5 14.9 24.3 20.4 9.2 6.5 21.7 5.7 30.1-1.9s10.2-20 4.5-29.8c-3.6-6.3-6.5-14.9-6.5-26.7 0-36.2 29.3-65.5 65.5-65.5l46.5 0 0 56c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l136-136c9.4-9.4 9.4-24.6 0-33.9L425.5 7zm7 97l0-22.1 78.1 78.1-78.1 78.1 0-22.1c0-13.3-10.7-24-24-24L338 192c-50.9 0-93.9 33.5-108.3 79.6-3.3-9.4-5.2-19.8-5.2-31.6 0-61.9 50.1-112 112-112l72 0c13.3 0 24-10.7 24-24zm-320-8c-44.2 0-80 35.8-80 80l0 256c0 44.2 35.8 80 80 80l256 0c44.2 0 80-35.8 80-80l0-24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 24c0 17.7-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l24 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-24 0z" />
          </svg>
          <span className="pl-[9.6px] text-[14px] font-semibold text-[#212121] leading-[24.5px]">
            Share
          </span>
        </button>
      </div>
    </div>
  );
}
