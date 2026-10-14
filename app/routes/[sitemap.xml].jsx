import {getSitemapIndex} from '@shopify/hydrogen';
import {withPublicOrigin} from '~/lib/seo';

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({request, context: {storefront, env}}) {
  const response = await getSitemapIndex({
    storefront,
    request: withPublicOrigin(request, env),
    // Home, department and shop-in-shop pages are code routes, not Shopify
    // resources, so they are listed in their own child sitemap.
    customChildSitemaps: ['/sitemap-static.xml'],
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}

/** @typedef {import('./+types/[sitemap.xml]').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
