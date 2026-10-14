import {redirect} from 'react-router';
import {NotFoundHero} from '~/components/NotFoundHero';

const LEGACY_PATH_MAP = {
  '/contact': '/pages/contact',
  '/contact-us': '/pages/contact',
  '/in/en/contact': '/pages/contact',
  '/write-to-us': '/pages/contact?view=write-to-us',
  '/writetous': '/pages/contact?view=write-to-us',
  '/in/en/write-to-us': '/pages/contact?view=write-to-us',
  '/about': '/pages/about-us',
  '/about-us': '/pages/about-us',
  '/in/en/about': '/pages/about-us',
  '/storelocator': '/pages/store-locator',
  '/store-locator': '/pages/store-locator',
  '/in/en/storelocator': '/pages/store-locator',
  '/lifestyle-edge-2': '/pages/lifestyle-edge-2',
  '/lifestyle-edge': '/pages/lifestyle-edge-2',
  '/edge-membership': '/pages/lifestyle-edge-2',
  '/in/en/lifestyle-edge-2': '/pages/lifestyle-edge-2',
  '/in/en/lifestyle-edge': '/pages/lifestyle-edge-2',
  '/helpshipping': '/pages/helpshipping',
  '/shipping': '/pages/helpshipping',
  '/in/en/helpshipping': '/pages/helpshipping',
  '/return': '/pages/return',
  '/returns': '/pages/return',
  '/in/en/return': '/pages/return',
  '/faq': '/pages/faq',
  '/in/en/faq': '/pages/faq',
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({request}) {
  const url = new URL(request.url);
  const normalized = url.pathname.toLowerCase().replace(/\/$/, '');

  if (LEGACY_PATH_MAP[normalized]) {
    return redirect(LEGACY_PATH_MAP[normalized], 301);
  }

  throw new Response(`${url.pathname} not found`, {
    status: 404,
  });
}

export default function CatchAllPage() {
  return <NotFoundHero />;
}

export function ErrorBoundary() {
  return <NotFoundHero />;
}

/** @typedef {import('./+types/$').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
