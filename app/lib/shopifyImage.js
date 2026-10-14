/**
 * Ask Shopify's image CDN for a resized copy instead of the full original.
 * Non-Shopify URLs are returned unchanged.
 * @param {string | null | undefined} url
 * @param {{width?: number, height?: number, crop?: 'center' | 'top' | 'bottom' | 'left' | 'right'}} [options]
 */
export function shopifyImageUrl(url, {width, height, crop} = {}) {
  if (!url || !/^https:\/\/cdn\.shopify\.com\//.test(url)) return url || '';
  try {
    const u = new URL(url);
    if (width) u.searchParams.set('width', String(Math.round(width)));
    if (height) u.searchParams.set('height', String(Math.round(height)));
    if (crop) u.searchParams.set('crop', crop);
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * srcset of resized widths for a Shopify CDN image (keeps aspect ratio).
 * @param {string | null | undefined} url
 * @param {number[]} widths
 */
export function shopifySrcSet(url, widths) {
  if (!url || !/^https:\/\/cdn\.shopify\.com\//.test(url)) return undefined;
  return widths.map((w) => `${shopifyImageUrl(url, {width: w})} ${w}w`).join(', ');
}

const LANDMARK_IMAGE_HOST = 'https://cms.landmarkshops.in/';

/**
 * Loader for Hydrogen's <Image> that also resizes images hosted on Landmark's
 * CMS (used by the department JSON fallback). Hydrogen's default loader only
 * adds `?width=` – which that server ignores, so every device downloaded the
 * full original (animated GIF banners of ~1MB). Landmark's CDN resizes and
 * converts (WebP/AVIF) via `/cdn-cgi/image/<options>/<path>`.
 * Shopify CDN images keep the default `?width=&height=&crop=` behaviour.
 * @param {{src?: string, width?: number, height?: number, crop?: string}} params
 */
export function cdnImageLoader({src, width, height, crop}) {
  if (!src) return '';
  if (src.startsWith(LANDMARK_IMAGE_HOST)) {
    const path = src
      .slice(LANDMARK_IMAGE_HOST.length)
      .replace(/^cdn-cgi\/image\/[^/]+\//, '')
      .split('?')[0];
    const options = [
      `w=${Math.round(width || 1232)}`,
      height && `h=${Math.round(height)}`,
      height && 'fit=cover',
      'q=80',
      'f=auto',
    ].filter(Boolean);
    // %2C, not ",": the URL goes into srcset, which is comma-separated
    return `${LANDMARK_IMAGE_HOST}cdn-cgi/image/${options.join('%2C')}/${path}`;
  }
  try {
    const u = new URL(src);
    if (width) u.searchParams.set('width', String(Math.round(width)));
    if (height) u.searchParams.set('height', String(Math.round(height)));
    if (crop) u.searchParams.set('crop', crop);
    return u.toString();
  } catch {
    return src;
  }
}

/**
 * 1x1 transparent GIF. Used as a <picture><source media=…> for a breakpoint
 * where the image's container is hidden, so the browser doesn't download a
 * photo nobody can see (the visible breakpoint loads normally).
 */
export const BLANK_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
