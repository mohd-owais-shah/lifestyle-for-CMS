import { HeroSlider } from '../watches/HeroSlider';
import { StarWatchSlider } from '../watches/StarWatchSlider';
import { WatchStyleSlider } from '../watches/WatchStyleSlider';
import { BrandSlider } from '../watches/BrandSlider';

// Section 1: Hero Slider Banners
const LUXE_HERO_BANNERS = [
  {
    id: 'luxe-hero-1',
    title: 'Luxe Hero 1',
    desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Desk-HeroBanner5-21Sep26.jpg',
    mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Mob-HeroBanner5-21Sep26.jpg',
    link: '/collections?q=luxe',
  },
  {
    id: 'luxe-hero-2',
    title: 'Luxe Hero 2',
    desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Desk-HeroBanner2-17Sep26.jpg',
    mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Mob-HeroBanner2-17Sep26.jpg',
    link: '/collections?q=luxe',
  },
  {
    id: 'luxe-hero-3',
    title: 'Luxe Hero 3',
    desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Desk-HeroBanner1-12Mar26.jpg',
    mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Mob-HeroBanner1-12Mar26.jpg',
    link: '/collections?q=luxe',
  },
  {
    id: 'luxe-hero-4',
    title: 'Luxe Hero 4',
    desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Desk-HeroBanner6-03Feb26.jpg',
    mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Mob-HeroBanner6-03Feb26.jpg',
    link: '/collections?q=luxe',
  },
  {
    id: 'luxe-hero-5',
    title: 'Luxe Hero 5',
    desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Desk-HeroBanner7-01Jun26.jpg',
    mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Mob-HeroBanner7-01Jun26.jpg',
    link: '/collections?q=luxe',
  },
  {
    id: 'luxe-hero-6',
    title: 'Luxe Hero 6',
    desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Desk-HeroBanner8-01Jun26.jpg',
    mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Mob-HeroBanner8-01Jun26.jpg',
    link: '/collections?q=luxe',
  },
  {
    id: 'luxe-hero-7',
    title: 'Luxe Hero 7',
    desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Desk-HeroBanner9-01Jun26A.jpg',
    mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Mob-HeroBanner9-01Jun26A.jpg',
    link: '/collections?q=luxe',
  },
  {
    id: 'luxe-hero-8',
    title: 'Luxe Hero 8',
    desktopImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Desk-HeroBanner3-31Oct25.jpg',
    mobileImg: 'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Mob-HeroBanner3-31Oct25.jpg',
    link: '/collections?q=luxe',
  },
];

// Section 2: Brand Slider (Section 8 Slot)
const LUXE_BRAND_SLIDER = {
  desktopHeader:
    'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Headet7-Banner1-Desk-05Feb25.jpg',
  mobileHeader:
    'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Headet7-Banner1-Mob-05Feb25.jpg',
  brands: [
    {
      id: 'luxe-brand-1',
      title: 'Luxe Brand 1',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Slot-9-Banner1-Desk-01Jun26.jpg',
      mobileImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Slot-9-Banner1-Mob-01Jun26.jpg',
      link: '/collections?q=luxe-brand-1',
    },
    {
      id: 'luxe-brand-2',
      title: 'Luxe Brand 2',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Slot-9-Banner2-Desk-03Sep26.jpg',
      mobileImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Slot-9-Banner2-Mob-03Sep26.jpg',
      link: '/collections?q=luxe-brand-2',
    },
    {
      id: 'luxe-brand-3',
      title: 'Luxe Brand 3',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Slot-9-Banner3-Desk-01Jun26.jpg',
      mobileImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Slot-9-Banner3-Mob-01Jun26.jpg',
      link: '/collections?q=luxe-brand-3',
    },
    {
      id: 'luxe-brand-4',
      title: 'Luxe Brand 4',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Slot-9-Banner4-Desk-03Sep26.jpg',
      mobileImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Slot-9-Banner4-Mob-03Sep26.jpg',
      link: '/collections?q=luxe-brand-4',
    },
    {
      id: 'luxe-brand-5',
      title: 'Luxe Brand 5',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Slot-9-Banner5-Desk-01Jun26.jpg',
      mobileImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Slot-9-Banner5-Mob-01Jun26.jpg',
      link: '/collections?q=luxe-brand-5',
    },
  ],
};

// Section 3: Product Category Section (Section 5 Slot)
const LUXE_PRODUCT_CATEGORY_SLIDER = {
  desktopHeader:
    'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Header4-Banner1-Desk-05March25.jpg',
  mobileHeader:
    'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Header4-Banner1-Mob-05Feb25.jpg',
  styles: [
    {
      id: 'luxe-cat-1',
      title: 'Luxe Category 1',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Slot6-Banner1-Desk-05Feb25.jpg',
      mobileImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Slot6-Banner1-Mob-05Feb25.jpg',
      link: '/collections?q=luxe-category-1',
    },
    {
      id: 'luxe-cat-2',
      title: 'Luxe Category 2',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Slot6-Banner2-Desk-05Feb25.jpg',
      mobileImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Slot6-Banner2-Mob-05Feb25.jpg',
      link: '/collections?q=luxe-category-2',
    },
    {
      id: 'luxe-cat-3',
      title: 'Luxe Category 3',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Slot6-Banner3-Desk-05Feb25.jpg',
      mobileImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Slot6-Banner3-Mob-05Feb25.jpg',
      link: '/collections?q=luxe-category-3',
    },
    {
      id: 'luxe-cat-4',
      title: 'Luxe Category 4',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Slot6-Banner4-Desk-05Feb25.jpg',
      mobileImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Slot6-Banner4-Mob-05Feb25.jpg',
      link: '/collections?q=luxe-category-4',
    },
  ],
};

// Section 4: Luxe Styles Section (Section 2 Slot)
const LUXE_STYLES_SLIDER = {
  desktopHeader:
    'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Slot-4-Header-Desk-04March25.jpg',
  styles: [
    {
      id: 'luxe-style-1',
      title: 'Luxe Style 1',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Slot-4-Banner9-Desktop-05May26.jpg',
      link: '/collections?q=luxe-style-1',
    },
    {
      id: 'luxe-style-2',
      title: 'Luxe Style 2',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Slot-4-Banner1-Desktop-01Aug25.jpg',
      link: '/collections?q=luxe-style-2',
    },
    {
      id: 'luxe-style-3',
      title: 'Luxe Style 3',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Slot-4-Banner2-Desktop-02Jun25.jpg',
      link: '/collections?q=luxe-style-3',
    },
    {
      id: 'luxe-style-4',
      title: 'Luxe Style 4',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Slot-4-Banner3-Desktop-02Jun25.jpg',
      link: '/collections?q=luxe-style-4',
    },
    {
      id: 'luxe-style-5',
      title: 'Luxe Style 5',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Slot-4-Banner4-Desktop-06Jun25.jpg',
      link: '/collections?q=luxe-style-5',
    },
    {
      id: 'luxe-style-6',
      title: 'Luxe Style 6',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Slot-4-Banner5-Desktop-01Aug25.jpg',
      link: '/collections?q=luxe-style-6',
    },
    {
      id: 'luxe-style-7',
      title: 'Luxe Style 7',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Slot-4-Banner6-Desktop-02Jun25.jpg',
      link: '/collections?q=luxe-style-7',
    },
    {
      id: 'luxe-style-8',
      title: 'Luxe Style 8',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Slot-4-Banner7-Desktop-03Sep26.jpg',
      link: '/collections?q=luxe-style-8',
    },
    {
      id: 'luxe-style-9',
      title: 'Luxe Style 9',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-Luxe-Slot-4-Banner8-Desktop-02Jun25.jpg',
      link: '/collections?q=luxe-style-9',
    },
  ],
};

// Section 5: Brand Promotion Section (Section 6 Slot)
const LUXE_BRAND_PROMOTIONS = {
  desktopHeader:
    'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Header5-Banner1-Desk-10Jan25.jpg',
  mobileHeader:
    'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Header5-Banner1-Desk-10Jan25.jpg',
  bgColor: '#AA502D',
  brands: [
    {
      id: 'luxe-promo-1',
      title: 'Luxe Brand Promo 1',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Slot-7-Banner4-Desk-09Jan25.jpg',
      mobileImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Slot-7-Banner4-Desk-09Jan25.jpg',
      link: '/collections?q=luxe-brand-promo-1',
    },
    {
      id: 'luxe-promo-2',
      title: 'Luxe Brand Promo 2',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Slot-7-Banner5-Desk-17Feb25.jpg',
      mobileImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Slot-7-Banner5-Desk-17Feb25.jpg',
      link: '/collections?q=luxe-brand-promo-2',
    },
    {
      id: 'luxe-promo-3',
      title: 'Luxe Brand Promo 3',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Slot-7-Banner3-Desk-05Feb25.jpg',
      mobileImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Slot-7-Banner3-Desk-05Feb25.jpg',
      link: '/collections?q=luxe-brand-promo-3',
    },
    {
      id: 'luxe-promo-4',
      title: 'Luxe Brand Promo 4',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Slot-7-Banner2-Desk-09Sep25.jpg',
      mobileImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Slot-7-Banner2-Desk-09Sep25.jpg',
      link: '/collections?q=luxe-brand-promo-4',
    },
    {
      id: 'luxe-promo-5',
      title: 'Luxe Brand Promo 5',
      desktopImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=990,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Slot-7-Banner1-Desk-09Jan25.jpg',
      mobileImg:
        'https://cms.landmarkshops.in/cdn-cgi/image/w=500,q=85,fit=cover/LS-Fest/LS-new/LS-SIS-Luxe-Slot-7-Banner1-Desk-09Jan25.jpg',
      link: '/collections?q=luxe-brand-promo-5',
    },
  ],
};

/**
 * Main LUXE SIS Landing Page Component
 */
export function LuxePage() {
  return (
    <div className="w-full flex flex-col bg-white gap-0 p-0 m-0">
      {/* 1. Hero Banner Slider (8 Luxe Hero Banners) */}
      <HeroSlider banners={LUXE_HERO_BANNERS} />

      {/* 2. Brand Slider Section (Header7 + 5 Brand Banners) */}
      <StarWatchSlider
        desktopHeader={LUXE_BRAND_SLIDER.desktopHeader}
        mobileHeader={LUXE_BRAND_SLIDER.mobileHeader}
        brands={LUXE_BRAND_SLIDER.brands}
        ariaLabel="Luxe Brand Slider"
      />

      {/* 3. Product Category Section (Header4 + 4 Category Banners) */}
      <WatchStyleSlider
        desktopHeader={LUXE_PRODUCT_CATEGORY_SLIDER.desktopHeader}
        mobileHeader={LUXE_PRODUCT_CATEGORY_SLIDER.mobileHeader}
        styles={LUXE_PRODUCT_CATEGORY_SLIDER.styles}
        ariaLabel="Luxe Product Category Slider"
      />

      {/* 4. Luxe Styles Section (Slot 4 Header + 9 Style Banners) */}
      <WatchStyleSlider
        desktopHeader={LUXE_STYLES_SLIDER.desktopHeader}
        mobileHeader={LUXE_STYLES_SLIDER.desktopHeader}
        styles={LUXE_STYLES_SLIDER.styles}
        ariaLabel="Luxe Styles Slider"
      />

      {/* 5. Brand Promotion Section (Header5 + 5 Promo Banners with #AA502D Background) */}
      <BrandSlider
        desktopHeader={LUXE_BRAND_PROMOTIONS.desktopHeader}
        mobileHeader={LUXE_BRAND_PROMOTIONS.mobileHeader}
        brands={LUXE_BRAND_PROMOTIONS.brands}
        bgColor={LUXE_BRAND_PROMOTIONS.bgColor}
        ariaLabel="Luxe Brand Promotion Slider"
      />
    </div>
  );
}

export default LuxePage;
