import {STATIC_SITEMAP_PATHS, getPublicOrigin} from '~/lib/seo';

/**
 * Child sitemap for code-defined pages (home, departments, shop-in-shops).
 * @param {Route.LoaderArgs}
 */
export function loader({request, context}) {
  const origin = getPublicOrigin(request, context.env);
  const urls = STATIC_SITEMAP_PATHS.map(
    (path) => `  <url>
    <loc>${origin}${path === '/' ? '' : path}</loc>
    <changefreq>daily</changefreq>
    <priority>${path === '/' ? '1.0' : '0.8'}</priority>
  </url>`,
  ).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
}

/** @typedef {import('./+types/[sitemap-static.xml]').Route} Route */
