import { useLoaderData } from 'react-router';
import { MockShopNotice } from '~/components/MockShopNotice';
import { HeroSlider, HERO_SLIDER_FRAGMENT } from '~/components/HomePage/HeroSlider';
import { HeroBanner, isHeroBannerHandle } from '~/components/HomePage/HeroBanner';
import { OurBenefits } from '~/components/HomePage/OurBenefits';
import {
  ShowcaseSection,
  HOME_PAGE_SECTIONS_QUERY,
} from '~/components/HomePage/ShowcaseSection';
import { CollectionShowcase } from '~/components/HomePage/CollectionShowcase';
import { Chartbusters } from '~/components/HomePage/Chartbusters';
import { TopCategories } from '~/components/HomePage/TopCategories';
import { MobileSocialPresence } from '~/components/HomePage/MobileSocialPresence';
import { HomeSection } from '~/components/HomePage/HomeSection';
import {parseSectionMeta, parseSectionSettings} from '~/lib/homeSectionSettings';
import {seoMeta, homeJsonLd, originFromMatches, brandLogoFromMatches} from '~/lib/seo';

/**
 * Page title metadata
 * @type {Route.MetaFunction}
 */
export const meta = ({location, matches}) =>
  seoMeta({
    location,
    matches,
    jsonLd: homeJsonLd(
      originFromMatches(matches),
      brandLogoFromMatches(matches),
    ),
  });

/**
 * Route loader fetching critical data
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const criticalData = await loadCriticalData(args);
  return { ...criticalData };
}

/**
 * Load critical data for home page with unified queries
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({ context }) {
  const [heroSliderData, homePageData] = await Promise.all([
    context.storefront
      .query(HERO_SLIDER_QUERY, {
        cache: context.storefront.CacheCustom({
          mode: 'public',
          maxAge: 60,
          staleWhileRevalidate: 60 * 60,
        }),
      })
      .catch((error) => {
        console.error('Failed to query Hero Slider metaobject:', error);
        return null;
      }),
    context.storefront
      .query(HOME_PAGE_SECTIONS_QUERY, {
        cache: context.storefront.CacheCustom({
          mode: 'public',
          maxAge: 60,
          staleWhileRevalidate: 60 * 60,
        }),
      })
      .catch((error) => {
        console.error('Failed to query Home Page metaobjects:', error);
        return null;
      }),
  ]);

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    heroSliderData,
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

  // Index sections by handle
  const nodesByHandle = {};
  for (const node of nodes) {
    if (node?.handle) nodesByHandle[node.handle] = node;
  }

  // Banner entries come from the hero query, which includes the banner images
  const heroBannerNodes = (
    data.heroSliderData?.homePageMetaobjects?.nodes || []
  ).filter((node) => isHeroBannerHandle(node?.handle));

  // Define component mapping for each section. `handles` lists the admin
  // entry handles a section answers to (first match wins). Every section's
  // sort order, visibility, background and padding come from that entry.
  const sectionsConfig = [
    {
      id: 'hero-slider',
      fallbackNode: data.heroSliderData?.heroSliderMetaobject,
      // Applies its own settings (it also has slide timer / per-slide toggles)
      selfManaged: true,
      render: () => <HeroSlider key="hero-slider" data={data.heroSliderData} />,
    },
    // One banner section per hero-banner entry (hero-banner, hero-banner-1,
    // hero-banner-2, ...), each placed by its own sort_order
    ...heroBannerNodes.map((bannerNode) => ({
      id: bannerNode.handle,
      fallbackNode: bannerNode,
      render: () => <HeroBanner key={bannerNode.handle} data={bannerNode} />,
    })),
    {
      id: 'lifestyle-exclusives',
      render: (props) => <CollectionShowcase key="lifestyle-exclusives" data={props.node} />,
    },
    {
      id: 'our-benefits',
      fallbackNode: data.heroSliderData?.ourBenefitsMetaobject,
      render: () => <OurBenefits key="our-benefits" data={data.heroSliderData} />,
    },
    {
      id: 'bestseller',
      render: (props) => <ShowcaseSection key="bestseller" data={props.node} bannerPosition="bottom" isGallery={true} />,
    },
    {
      id: 'top-brands-on-lifestyle-collections',
      render: (props) => <ShowcaseSection key="top-brands-on-lifestyle-collections" data={props.node} bannerPosition="bottom" isGallery={true} />,
    },
    {
      id: 'in-trend',
      render: (props) => <CollectionShowcase key="in-trend" data={props.node} />,
    },
    {
      id: 'festive-edit',
      fallbackNode: data.heroSliderData?.festiveEditMetaobject,
      render: (props) => <ShowcaseSection key="festive-edit" data={props.node || data.heroSliderData?.festiveEditMetaobject} bannerPosition="top" />,
    },
    {
      id: 'top-categories',
      render: (props) => <TopCategories key="top-categories" data={props.node} />,
    },
    {
      id: 'chartbusters',
      render: (props) => <Chartbusters key="chartbusters" data={props.node} />,
    },
    {
      id: 'all-new-home-living-store',
      render: (props) => <ShowcaseSection key="all-new-home-living-store" data={props.node} bannerPosition="top" isGallery={true} />,
    },
    {
      id: 'babyshop',
      render: (props) => <ShowcaseSection key="babyshop" data={props.node} bannerPosition="top" />,
    }
  ];

  // Map metadata, filter hidden sections, sort, and render
  const renderedSections = sectionsConfig
    .map((config) => {
      const handles = config.handles || [config.id];
      const node =
        handles.map((handle) => nodesByHandle[handle]).find(Boolean) || null;
      const settingsNode = node || config.fallbackNode;
      return {
        ...config,
        node,
        ...parseSectionMeta(settingsNode?.fields),
        settings: parseSectionSettings(settingsNode?.fields),
      };
    })
    .filter((section) => !section.hidden)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((section) => {
      const content = section.render({node: section.node});
      if (section.selfManaged) return content;
      return (
        <HomeSection key={section.id} id={section.id} settings={section.settings}>
          {content}
        </HomeSection>
      );
    });

  return (
    <div className="w-full flex flex-col pb-0 lg:pb-12">
      {data.isShopLinked ? null : <MockShopNotice />}

      {renderedSections}

      {/* Mobile Social Presence - Bottom before footer */}
      <MobileSocialPresence />
    </div>
  );
}

const HERO_SLIDER_QUERY = `#graphql
  ${HERO_SLIDER_FRAGMENT}
  query HomePageHeroSlider($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    heroSliderMetaobject: metaobject(handle: {handle: "hero-slider", type: "home_page"}) {
      ...HeroSliderMetaobject
    }
    homePageBannerMetaobject: metaobject(handle: {handle: "home-page-banner", type: "home_page"}) {
      ...HeroSliderMetaobject
    }
    ourBenefitsMetaobject: metaobject(handle: {handle: "our-benefits", type: "home_page"}) {
      ...HeroSliderMetaobject
    }
    festiveEditMetaobject: metaobject(handle: {handle: "festive-edit", type: "home_page"}) {
      ...HeroSliderMetaobject
    }
    homePageMetaobjects: metaobjects(type: "home_page", first: 50) {
      nodes {
        ...HeroSliderMetaobject
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
