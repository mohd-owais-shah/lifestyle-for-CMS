import {useLoaderData} from 'react-router';
import {MockShopNotice} from '~/components/MockShopNotice';
import {HeroSlider} from '~/components/HomePage/HeroSlider';
import {
  ShowcaseSection,
  HOME_PAGE_SECTIONS_QUERY,
} from '~/components/HomePage/ShowcaseSection';

/**
 * Page title metadata
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

/**
 * Route loader fetching critical data
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Await critical data before rendering
  const criticalData = await loadCriticalData(args);

  return {...criticalData};
}

/**
 * Load critical data for home page with a single unified query
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context}) {
  const homePageData = await context.storefront
    .query(HOME_PAGE_SECTIONS_QUERY, {
      cache: context.storefront.CacheShort(),
    })
    .catch((error) => {
      // Return null if metaobject query fails
      console.error('Failed to query Home Page metaobjects:', error);
      return null;
    });

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    homePageData,
  };
}

/**
 * Home page route component
 */
export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  const nodes = data.homePageData?.homePageSections?.nodes || [];

  // Index sections by handle for fast lookup
  const sectionsByHandle = {};
  for (const node of nodes) {
    if (node?.handle) {
      sectionsByHandle[node.handle] = node;
    }
  }

  const heroSliderNode = sectionsByHandle['hero-slider'];
  const bestsellersNode = sectionsByHandle['bestseller'];
  const topBrandsNode = sectionsByHandle['top-brands-on-lifestyle-collections'];
  const festiveEditNode = sectionsByHandle['festive-edit'];
  const homeLivingNode = sectionsByHandle['all-new-home-living-store'];
  const babyShopNode = sectionsByHandle['babyshop'];

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      {data.isShopLinked ? null : <MockShopNotice />}
      <HeroSlider data={{heroSliderMetaobject: heroSliderNode}} />

      {/* 1. Bestsellers - Banner on down side (bottom) */}
      <ShowcaseSection data={bestsellersNode} bannerPosition="bottom" />

      {/* 2. Top Brands on LIFESTYLE - Banner on down side (bottom) */}
      <ShowcaseSection data={topBrandsNode} bannerPosition="bottom" />

      {/* 3. Festive Edit - Banner on down side (bottom) */}
      <ShowcaseSection data={festiveEditNode} bannerPosition="bottom" />

      {/* 4. All New - Home & Living Store - Banner on top */}
      <ShowcaseSection data={homeLivingNode} bannerPosition="top" />

      {/* 5. Babyshop - Banner on top */}
      <ShowcaseSection data={babyShopNode} bannerPosition="top" />
    </div>
  );
}

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
