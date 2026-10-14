/**
 * PLP routes (collections, search) filter by "Shop For" subcategory on the
 * client from the products already loaded. Changing only `subcat` in the URL
 * must not re-run the loader — that refetched the whole product list for no
 * reason. Any other URL change (sort, filters, query, page) revalidates.
 * @type {import('react-router').ShouldRevalidateFunction}
 */
export function plpShouldRevalidate({
  currentUrl,
  nextUrl,
  formMethod,
  defaultShouldRevalidate,
}) {
  if (formMethod && formMethod !== 'GET') return defaultShouldRevalidate;
  if (currentUrl.pathname !== nextUrl.pathname) return defaultShouldRevalidate;

  const current = new URLSearchParams(currentUrl.search);
  const next = new URLSearchParams(nextUrl.search);
  current.delete('subcat');
  next.delete('subcat');
  current.sort();
  next.sort();

  if (current.toString() === next.toString()) return false;
  return defaultShouldRevalidate;
}
