// Turns the raw store-locator API response into a clean list for the UI.
// Works with the same JSON shape the live Lifestyle site returns, so when a
// real backend exists you can feed the fetched array straight into this.

const CITY_FIXES = {
  Bangalore: 'Bengaluru',
  Baroda: 'Vadodara',
  Calicut: 'Kozhikode',
  Cochin: 'Kochi',
  Gurgaon: 'Gurugram',
  Trissur: 'Thrissur',
  Trivandrum: 'Thiruvananthapuram',
  Vizag: 'Visakhapatnam',
  Vijaywada: 'Vijayawada',
  Bhubneshwar: 'Bhubaneswar',
  Mysore: 'Mysuru',
  'Goregaon East': 'Mumbai',
};

// Known bad rows in the source data, keyed by rmsStoreCode.
const OVERRIDES = {
  1765: {city: 'Siliguri'}, // source says "Raipur"
  3204: {lat: 21.1384451, lng: 79.070435}, // Nagpur pin pointed at Mumbai
};

const titleCase = (s) =>
  s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bAnd\b/g, 'and');

const cleanTitle = (line1 = '') => {
  const t = line1
    .replace(/^lifestyle(\s+stores?)?[.,\s]*/i, '')
    .replace(/[,\s]+$/, '')
    .trim();
  return t || line1.trim();
};

export function normalizeStores(raw) {
  const seen = new Set();
  const out = [];

  for (const r of raw) {
    // The corporate office is in the feed but is not a store.
    if (/corporate office/i.test(r.name || '')) continue;

    const code = String(r.rmsStoreCode || r.name);
    if (seen.has(code)) continue; // feed contains duplicates (e.g. 3201)
    seen.add(code);

    const a = r.address || {};
    const fix = OVERRIDES[code] || {};
    const town =
      a.town && a.town === a.town.toUpperCase() ? titleCase(a.town) : a.town;
    const city = fix.city || CITY_FIXES[town] || town || '';
    const lat = fix.lat ?? r.geoPoint?.latitude ?? null;
    const lng = fix.lng ?? r.geoPoint?.longitude ?? null;

    out.push({
      id: code,
      title: cleanTitle(a.line1),
      line2: (a.line2 || '').replace(/[,\s]+$/, ''),
      city,
      state: titleCase(a.region?.name || ''),
      pincode: a.postalCode || '',
      phone: a.phone || '1800-123-1555',
      hours: r.workingHours || '',
      clickCollect: Boolean(r.isClickCollect),
      lat: typeof lat === 'number' ? lat : lat ? Number(lat) : null,
      lng: typeof lng === 'number' ? lng : lng ? Number(lng) : null,
    });
  }

  return out.sort(
    (x, y) => x.state.localeCompare(y.state) || x.city.localeCompare(y.city),
  );
}
