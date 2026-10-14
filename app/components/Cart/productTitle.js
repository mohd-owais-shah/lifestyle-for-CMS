/**
 * "BRAND Product title", without doubling the brand when the Shopify title
 * already starts with it (e.g. vendor "PUMA" + "PUMA Electrify Nitro...").
 * @param {{title?: string, vendor?: string} | null | undefined} product
 */
export function productDisplayTitle(product) {
  const title = product?.title || '';
  const brand = product?.vendor || '';
  if (!brand || title.toLowerCase().startsWith(brand.toLowerCase())) {
    return title;
  }
  return `${brand} ${title}`;
}
