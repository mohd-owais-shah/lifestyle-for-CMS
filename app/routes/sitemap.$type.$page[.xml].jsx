import {getSitemap} from '@shopify/hydrogen';
import {withPublicOrigin} from '~/lib/seo';

/**
 * Single-locale store (India / English): no locale prefixes in URLs, so the
 * sitemap must not list /EN-CA/... style links that would 404.
 * @param {Route.LoaderArgs}
 */
export async function loader({request, params, context: {storefront, env}}) {
  const response = await getSitemap({
    storefront,
    request: withPublicOrigin(request, env),
    params,
    locales: [],
    getLink: ({type, baseUrl, handle}) => `${baseUrl}/${type}/${handle}`,
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}

/** @typedef {import('./+types/sitemap.$type.$page[.xml]').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
