import { CategorySlider } from './CategorySlider';
import { HeroSlider } from './HeroSlider';
import { StarWatchSlider } from './StarWatchSlider';
import { WatchStyleSlider } from './WatchStyleSlider';
import { ProductCategorySlider } from './ProductCategorySlider';
import { BrandSlider } from './BrandSlider';
import { OfferSlider } from './OfferSlider';
import { GenZBragworthy as StackedBanners } from '../genz/GenZBragworthy';

const WATCH_BRAND_PROMOTIONS = {
  headerImage: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Watches-Header3-Banner1-Desk-23Sep25.jpg',
  cards: [
    {
      id: 'promo-1',
      title: 'Brand Promo 1',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot5-Banner1-Desk-03Jul26.jpg',
      link: '/collections?q=watches-brand-promo-1',
    },
    {
      id: 'promo-2',
      title: 'Brand Promo 2',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot5-Banner2-Desk-03Jul26.jpg',
      link: '/collections?q=watches-brand-promo-2',
    },
    {
      id: 'promo-3',
      title: 'Brand Promo 3',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot5-Banner3-Desk-03Jul26.jpg',
      link: '/collections?q=watches-brand-promo-3',
    },
    {
      id: 'promo-4',
      title: 'Brand Promo 4',
      img: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Watches-Slot5-Banner4-Desk-03Jul26.jpg',
      link: '/collections?q=watches-brand-promo-4',
    },
  ],
};

/**
 * Main Watches SIS Landing Page Component
 * Zero inter-section padding across all sections
 */
export function WatchesPage() {
  return (
    <div className="w-full flex flex-col bg-white gap-0 p-0 m-0">
      {/* 0. Mobile-Only Top Category Navigation */}
      <div className="block md:hidden">
        <CategorySlider />
      </div>

      {/* 1. Hero Banner Slider (10 Hero Banners) */}
      <HeroSlider />

      {/* 2. STAR WATCH (Header5 + 4 Star Brands: G-Shock, Fossil, Titan, AX) */}
      <StarWatchSlider />

      {/* 3. WATCHES, YOUR WAY (Header + 4 Style Cards: Leather, Mesh, Ceramic, Ring) */}
      <WatchStyleSlider />

      {/* 4. Product Category Section (Header3 + ModBlock3 + 5 Category Cards) */}
      <ProductCategorySlider />

      {/* 5. Brand Slider (Header6 + 9 Watch Brand Cards) */}
      <BrandSlider />

      {/* 6. Watch Offers (Header4 + 4 Desktop / 3 Mobile Offer Cards) */}
      <OfferSlider />

      {/* 7. Brand Promotions (Reusable Stacked Full-Width Banners) */}
      <StackedBanners
        headerImage={WATCH_BRAND_PROMOTIONS.headerImage}
        cards={WATCH_BRAND_PROMOTIONS.cards}
        maxWidth="max-w-[1232px]"
        ariaLabel="Brand Promotions"
      />
    </div>
  );
}

export default WatchesPage;
