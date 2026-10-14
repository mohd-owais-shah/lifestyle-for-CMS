import {useLoaderData} from 'react-router';
import {GenZPage} from '~/components/sis/genz/GenZPage';
import {WatchesPage} from '~/components/sis/watches/WatchesPage';
import {LuxePage} from '~/components/sis/Luxe/LuxePage';
import {MobileFooter} from '~/components/small-uis/MobileFooter';
import {seoMeta} from '~/lib/seo';

/**
 * Route metadata dynamically configured per SIS department
 * @type {Route.MetaFunction}
 */
const SIS_SEO = {
  genz: {
    title: 'Gen Z Clothing & Youth Streetwear | Lifestyle Stores',
    description:
      'Explore Gen Z fashion online at Lifestyle Stores. Shop oversized tees, baggy denims, parachute cargoes, Y2K fits, and streetwear ✔ COD ✔ Easy Returns',
  },
  watches: {
    title: 'Watches - Buy Branded Watches Online in India | Lifestyle Stores',
    description:
      'Shop branded analog, digital, and chronograph watches for Men & Women online at Lifestyle Stores at the best prices ✔ COD ✔ Easy Returns',
  },
  luxe: {
    title: 'LUXE Store - Premium & Luxury Fashion Brands | Lifestyle Stores',
    description:
      'Discover luxury and premium fashion brands at the Lifestyle Stores LUXE store. Shop designer clothing, bags and accessories ✔ COD ✔ Easy Returns',
  },
};

/**
 * SIS page components. Their content is static in the component files —
 * there is no `sis_page` metaobject type in the store yet, so the loader
 * does not query Shopify.
 */
const SIS_PAGES = {
  genz: GenZPage,
  watches: WatchesPage,
  luxe: LuxePage,
};

export const meta = ({data, location, matches}) =>
  seoMeta({
    ...(SIS_SEO[data?.type] || {title: 'Shop In Shop | Lifestyle Stores'}),
    location,
    matches,
  });

/**
 * Dynamic SIS loader handling /sis/genz, /sis/watches, /sis/luxe
 * @param {Route.LoaderArgs} args
 */
export async function loader({params}) {
  const type = params.type?.toLowerCase();

  if (!SIS_PAGES[type]) {
    throw new Response(`SIS page "/sis/${params.type}" not found`, {status: 404});
  }

  return {type};
}

/**
 * Dynamic SIS Route Component
 */
export default function SisRoute() {
  /** @type {LoaderReturnData} */
  const {type} = useLoaderData();
  const SisPage = SIS_PAGES[type];

  return (
    <div className="w-full min-h-screen bg-white">
      <SisPage />
      <MobileFooter />
    </div>
  );
}

/** @typedef {import('./+types/sis.$type').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
