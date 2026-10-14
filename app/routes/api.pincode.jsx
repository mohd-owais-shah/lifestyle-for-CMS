import pincodesData from '~/data/pincodes.json';
import {parseIndianPincode} from '~/lib/pincode';

/**
 * Pincode delivery estimation API endpoint
 * GET /api/pincode?pincode=385520
 * GET /api/pincode?lat=24.17&lng=72.43   (resolves the pincode from GPS)
 */
export async function loader({request}) {
  const url = new URL(request.url);
  let pincode = String(url.searchParams.get('pincode') || '').trim();

  const lat = Number(url.searchParams.get('lat'));
  const lng = Number(url.searchParams.get('lng'));
  if (!pincode && Number.isFinite(lat) && Number.isFinite(lng)) {
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      return Response.json(
        {pincode: '', isServiceable: false, error: 'Invalid location.'},
        {status: 400},
      );
    }
    const lookup = await pincodeFromCoordinates(lat, lng);
    if (lookup.busy) {
      return Response.json(
        {
          pincode: '',
          isServiceable: false,
          error: 'Location lookup is busy. Please try again or enter your pincode.',
        },
        {status: 429, headers: {'Retry-After': '2'}},
      );
    }
    pincode = lookup.pincode;
    if (!pincode) {
      return Response.json(
        {
          pincode: '',
          isServiceable: false,
          error: 'We could not find a pincode for your location. Please enter it manually.',
        },
        {status: 404},
      );
    }
  }

  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return Response.json(
      {
        pincode,
        isServiceable: false,
        error: 'Please enter a valid 6-digit pincode',
      },
      {status: 400},
    );
  }

  const matchedPincode = pincodesData.pincodes[pincode] || pincodesData.default;

  return Response.json({
    pincode,
    isServiceable: Boolean(matchedPincode.isServiceable !== false),
    deliveryDays: matchedPincode.deliveryDays || '5-7 days',
    deliveryText: matchedPincode.deliveryText || 'Delivery in 5-7 days',
    city: matchedPincode.city || '',
    state: matchedPincode.state || '',
  });
}

/**
 * Reverse-geocode coordinates to an Indian pincode via OpenStreetMap
 * Nominatim. Done server-side so the storefront CSP stays unchanged.
 * Coordinates are rounded (~100m) — enough for a pincode, better for privacy,
 * and it lets results be cached: Nominatim allows ~1 request/second, so
 * repeated lookups for the same area must not hit it again.
 */
// Nominatim's usage policy allows at most ~1 request/second for the whole
// application. This guard is per server isolate (Oxygen runs several), so it
// bounds — but cannot globally guarantee — the upstream rate.
const UPSTREAM_MIN_INTERVAL_MS = 1100;
let lastUpstreamAt = 0;
let upstreamInFlight = false;

/** @return {Promise<{pincode: string, busy?: boolean}>} */
async function pincodeFromCoordinates(lat, lng) {
  const endpoint = new URL('https://nominatim.openstreetmap.org/reverse');
  endpoint.searchParams.set('format', 'jsonv2');
  endpoint.searchParams.set('lat', lat.toFixed(3));
  endpoint.searchParams.set('lon', lng.toFixed(3));
  endpoint.searchParams.set('zoom', '16');
  endpoint.searchParams.set('addressdetails', '1');

  const cacheKey = new Request(endpoint.toString());
  let cache = null;
  try {
    cache = await caches.open('pincode-geocode');
    const hit = await cache.match(cacheKey);
    if (hit) return {pincode: (await hit.json()).postcode || ''};
  } catch {
    cache = null; // Cache API unavailable — just do the lookup
  }

  const now = Date.now();
  if (upstreamInFlight || now - lastUpstreamAt < UPSTREAM_MIN_INTERVAL_MS) {
    return {pincode: '', busy: true};
  }
  upstreamInFlight = true;
  lastUpstreamAt = now;

  try {
    const response = await fetch(endpoint, {
      headers: {
        'User-Agent': 'LifestyleStoresHydrogen/1.0 (delivery pincode lookup)',
        'Accept-Language': 'en',
      },
      // Never leave the location sheet hanging on a slow third party
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return {pincode: ''};
    const result = await response.json();
    const pincode = parseIndianPincode(result?.address?.postcode);

    if (cache) {
      await cache
        .put(
          cacheKey,
          new Response(JSON.stringify({postcode: pincode}), {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'public, max-age=2592000',
            },
          }),
        )
        .catch(() => {});
    }
    return {pincode};
  } catch {
    return {pincode: ''};
  } finally {
    upstreamInFlight = false;
  }
}
