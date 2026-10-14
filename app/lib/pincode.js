/**
 * Normalise a geocoder postcode to a 6-digit Indian pincode, or '' if it
 * isn't one (e.g. "385 001" -> "385001", "SW1A 1AA" -> "").
 * @param {unknown} value
 */
export function parseIndianPincode(value) {
  const postcode = String(value ?? '').replace(/\s/g, '');
  return /^\d{6}$/.test(postcode) ? postcode : '';
}
