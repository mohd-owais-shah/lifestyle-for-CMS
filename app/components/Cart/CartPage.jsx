import {useState, useEffect, useMemo} from 'react';
import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {CartLineItem} from './CartLineItem';
import {CartComboCard} from './CartComboCard';
import {CartSummary} from './CartSummary';
import {CartPromoBanner} from './CartPromoBanner';
import {CartPincodeBox} from './CartPincodeBox';
import {DeliveryLocationPicker} from '~/components/DeliveryLocationPicker';
import {useDeliveryLocation} from '~/lib/deliveryLocation';
import {CartOffersSection} from './CartOffersSection';
import {CartLoyaltyAndInstallments} from './CartLoyaltyAndInstallments';
import {CartAddFromFavourites} from './CartAddFromFavourites';
import {CartFrequentlyBoughtTogether} from './CartFrequentlyBoughtTogether';
import {CartEmpty} from './CartEmpty';
import {CartMobileStickyBar} from './CartMobileStickyBar';
import {useAccountWishlist} from '~/hooks/useAccountWishlist';

export function CartPage({
  cart: originalCart,
  isLoggedIn = false,
  bannerImageUrl,
  bannerMobileImageUrl,
  frequentlyBoughtTogetherProducts = [],
}) {
  const cart = useOptimisticCart(originalCart);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [activeBasketTab, setActiveBasketTab] = useState('online');
  const [mounted, setMounted] = useState(false);
  const {items: savedWishlist} = useAccountWishlist(null);
  const cartFavouriteProducts = useMemo(() => {
    return savedWishlist.map((product) => ({
      ...product,
      featuredImage: product.image,
      // Expose priceRange so CartAddFromFavourites can read minVariantPrice.amount
      priceRange: {
        minVariantPrice: product.price || {amount: '0', currencyCode: 'INR'},
      },
      variants: {nodes: product.variants || []},
    }));
  }, [savedWishlist]);

  // Delivery pincode shared with the rest of the store (home, PDP, cart)
  const {
    location: deliveryInfo,
    save: handleVerifyPincode,
    clear: handleResetPincode,
  } = useDeliveryLocation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalQuantity = cart?.totalQuantity || 0;
  const lines = useMemo(() => cart?.lines?.nodes || [], [cart?.lines?.nodes]);

  // Group lines into combo offers (e.g. Buy 1 get 1, Buy 2 get 15% off) and regular items
  const {comboGroups, singleLines} = useMemo(() => {
    const discountGroups = new Map();
    const unassigned = [];

    for (const line of lines) {
      const allocations = line.discountAllocations || [];
      const discountTitle = allocations[0]?.title;

      if (discountTitle) {
        if (!discountGroups.has(discountTitle)) {
          discountGroups.set(discountTitle, []);
        }
        discountGroups.get(discountTitle).push(line);
      } else {
        unassigned.push(line);
      }
    }

    const combos = [];
    const singles = [...unassigned];

    for (const [title, groupLines] of discountGroups.entries()) {
      // Multiple items or lines participating in the same offer form a combo
      if (groupLines.length >= 2) {
        const priceTotal = groupLines.reduce(
          (sum, l) => sum + parseFloat(l.cost?.totalAmount?.amount || '0'),
          0,
        );
        const compareAtTotal = groupLines.reduce((sum, l) => {
          const comp = l.merchandise?.compareAtPrice?.amount
            ? parseFloat(l.merchandise.compareAtPrice.amount)
            : parseFloat(l.merchandise?.price?.amount || '0');
          return sum + comp * (l.quantity || 1);
        }, 0);

        const comboDisplayTitle =
          title && !title.toLowerCase().includes('buy 1 get 1')
            ? title
            : 'Buy 2 Get 15 Percent Off';

        combos.push({
          id: `combo-${title}`,
          title: comboDisplayTitle,
          lines: groupLines,
          priceTotal,
          compareAtTotal,
        });
      } else {
        singles.push(...groupLines);
      }
    }

    return {comboGroups: combos, singleLines: singles};
  }, [lines]);

  const comboCount = comboGroups.length;
  const comboSuffix =
    comboCount > 0
      ? ` (Including ${comboCount} ${comboCount === 1 ? 'combo' : 'combos'})`
      : '';

  if (!cart || totalQuantity === 0 || lines.length === 0) {
    return <CartEmpty />;
  }

  return (
    <div className="min-h-screen bg-white pb-28 lg:pb-16 text-[#292D35]">
      {/* Mobile Top Stepper Header matching Screenshots 3 & 4 */}
      <div className="lg:hidden bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              aria-label="Go back"
              className="p-1 -ml-1 text-gray-800"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </Link>
            <h1 className="text-base font-bold text-gray-900">
              Check out{' '}
              <span className="text-xs text-gray-500 font-normal">(1/3)</span>
            </h1>
          </div>

          <Link
            to="/policies/terms-of-service"
            className="text-xs font-bold text-[#FAA619] hover:underline"
          >
            Help
          </Link>
        </div>

        {/* Step Indicator matching Screenshot 3 */}
        <div className="flex items-center justify-center gap-2 py-2.5 px-4 border-t border-gray-100 text-[11px] font-semibold text-gray-500">
          <span className="flex items-center gap-1.5 text-gray-900 font-bold">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[#FAA619] bg-[#FAA619] inline-block"></span>
            Basket
          </span>
          <span className="w-10 h-[1px] bg-gray-300"></span>
          <span className="flex items-center gap-1.5 text-gray-400">
            <span className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block"></span>
            Shipping
          </span>
          <span className="w-10 h-[1px] bg-gray-300"></span>
          <span className="flex items-center gap-1.5 text-gray-400">
            <span className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block"></span>
            Payments
          </span>
        </div>

        {/* Tabs: Online Basket / In Store Basket matching Screenshot 3 */}
        <div className="grid grid-cols-2 text-center text-xs font-bold border-t border-gray-200">
          <button
            type="button"
            onClick={() => setActiveBasketTab('online')}
            className={`py-3 transition-colors ${
              activeBasketTab === 'online'
                ? 'bg-white text-gray-900 border-b-2 border-gray-900 font-bold'
                : 'bg-[#EEEEEE] text-gray-600'
            }`}
          >
            Online Basket
          </button>
          <button
            type="button"
            onClick={() => setActiveBasketTab('instore')}
            className={`py-3 transition-colors ${
              activeBasketTab === 'instore'
                ? 'bg-white text-gray-900 border-b-2 border-gray-900 font-bold'
                : 'bg-[#EEEEEE] text-gray-600'
            }`}
          >
            In Store Basket
          </button>
        </div>

        {/* Enable location bar + "Choose your location" sheet (mobile) */}
        <DeliveryLocationPicker variant="cart" showNotice />
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 lg:pt-8">
        {/* Desktop Heading matching Screenshot 1 */}
        <h1 className="hidden lg:block text-2xl font-bold text-gray-900 mb-6">
          Your Shopping Basket
        </h1>

        {/* 2-Column Responsive Layout matching Screenshots 1 & 2 */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          {/* Left Column: Promo Banner + Products (Col 8) */}
          <div className="lg:col-span-8">
            {/* Promo Banner matching Screenshots 1 & 3 */}
            <CartPromoBanner
              bannerImageUrl={bannerImageUrl}
              bannerMobileImageUrl={bannerMobileImageUrl}
              onOpenOffers={() => setIsOffersModalOpen(true)}
            />

            {/* Product Count Header matching Image 2 */}
            <div className="-mx-4 sm:-mx-6 lg:mx-0 px-4 sm:px-6 lg:px-0 py-3.5 lg:py-0 lg:mb-3.5 border-b border-gray-200 lg:border-0">
              <h2 className="text-sm font-bold text-gray-900">
                {totalQuantity} {totalQuantity === 1 ? 'Product' : 'Products'}
                {comboSuffix}
              </h2>
            </div>

            {/* Line Items List with Combo Grouping matching Image 2 */}
            <div className="-mx-4 sm:-mx-6 lg:mx-0 lg:space-y-4">
              {/* Combo Offer Cards */}
              {comboGroups.map((combo) => (
                <CartComboCard
                  key={combo.id}
                  title={combo.title}
                  lines={combo.lines}
                  priceTotal={combo.priceTotal}
                  compareAtTotal={combo.compareAtTotal}
                  deliveryText={
                    deliveryInfo?.deliveryText || 'Delivery in 5-7 days'
                  }
                />
              ))}

              {/* Standalone Line Items */}
              {singleLines.map((line) => (
                <CartLineItem
                  key={line.id}
                  line={line}
                  hasPincode={Boolean(deliveryInfo?.pincode)}
                  deliveryText={
                    deliveryInfo?.deliveryText || 'Delivery in 5-7 days'
                  }
                />
              ))}
            </div>

            {/* Mobile: Offers for you! right after the products */}
            <div className="lg:hidden -mx-4 sm:-mx-6 bg-[#F2F2F2] px-3 pt-3">
              <CartOffersSection
                cart={cart}
                isModalOpen={isOffersModalOpen}
                setIsModalOpen={setIsOffersModalOpen}
                variant="mobile"
              />
            </div>

            {/* Add from favourites - rendered only after client-side mount to read localStorage */}
            {mounted && (
              <CartAddFromFavourites products={cartFavouriteProducts} />
            )}

            {/* Frequently Bought Together matching Screenshot 4 */}
            <CartFrequentlyBoughtTogether
              products={frequentlyBoughtTogetherProducts}
            />

            {/* Mobile: Landmark Reward points after Frequently Bought Together */}
            <div className="lg:hidden -mx-4 sm:-mx-6 bg-[#F2F2F2] px-3 pt-3">
              <CartLoyaltyAndInstallments
                isLoggedIn={isLoggedIn}
                cart={cart}
                showInstallments={false}
              />
            </div>
          </div>

          {/* Right Column: Delivering To, Price Details, Offers (Col 4) */}
          <div className="hidden lg:block lg:col-span-4">
            {/* Desktop Delivering to Box matching Screenshot 1 & Image 2 */}
            <div className="hidden lg:block">
              <CartPincodeBox
                deliveryInfo={deliveryInfo}
                onVerifyPincode={handleVerifyPincode}
                onResetPincode={handleResetPincode}
              />
            </div>

            {/* Price Details matching Screenshots 1 & 2 */}
            <CartSummary cart={cart} />

            {/* Offers for you! matching Screenshot 2 */}
            <CartOffersSection
              cart={cart}
              isModalOpen={isOffersModalOpen}
              setIsModalOpen={setIsOffersModalOpen}
            />

            {/* Landmark Reward Points & Installments matching Screenshots 1 & 2 */}
            <CartLoyaltyAndInstallments isLoggedIn={isLoggedIn} cart={cart} />
          </div>
        </div>
      </div>

      {/* Mobile Sticky Checkout Bar matching Images 3 & 4 */}
      <CartMobileStickyBar cart={cart} />
    </div>
  );
}
