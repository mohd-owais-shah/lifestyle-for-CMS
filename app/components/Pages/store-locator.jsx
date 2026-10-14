import {useEffect, useMemo, useRef, useState} from 'react';
import leafletStyles from 'leaflet/dist/leaflet.css?url';
import locatorStyles from '../../styles/store-locator.css?url';
import {normalizeStores} from '~/lib/normalizeStores';
import rawStores from '~/data/lifestyle-stores.json';

export const links = () => [
  {rel: 'stylesheet', href: leafletStyles},
  {rel: 'stylesheet', href: locatorStyles},
];

export const meta = () => [
  {title: 'Store Locator | Lifestyle Stores'},
  {
    name: 'description',
    content: 'Find Lifestyle stores near you across India.',
  },
];

const STORES = normalizeStores(rawStores);
const STATES = [...new Set(STORES.map((s) => s.state))].sort();

const esc = (v) =>
  String(v || '').replace(
    /[&<>"']/g,
    (c) =>
      ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[
        c
      ],
  );

const directionsUrl = (s) =>
  s.lat != null
    ? `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `Lifestyle ${s.title}, ${s.city}`,
      )}`;

const telHref = (p) => `tel:${String(p || '').replace(/[^\d+]/g, '')}`;

function popupHtml(s) {
  const addressParts = [
    s.title,
    s.line2,
    `${s.city ? s.city + ', ' : ''}${s.state ? s.state.toUpperCase() + ', ' : ''}India`,
  ].filter(Boolean);

  return `
    <div class="sl-popup-card">
      <div class="sl-popup-brand">LIFESTYLE</div>
      <div class="sl-popup-address-label">Address:</div>
      <div class="sl-popup-address-text">${addressParts.map(esc).join('<br/>')}</div>
      ${s.phone ? `<div class="sl-popup-phone">Phone ${esc(s.phone)}</div>` : ''}
      <div class="sl-popup-actions">
        <a href="${directionsUrl(s)}" target="_blank" rel="noreferrer">Get directions</a>
        ${s.phone ? `<a href="${telHref(s.phone)}">Call</a>` : ''}
      </div>
    </div>
  `;
}

export default function StoreLocator() {
  const [state, setState] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef(null);
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const markers = useRef(new Map());
  const itemRefs = useRef(new Map());

  const list = useMemo(
    () => STORES.filter((s) => !state || s.state === state),
    [state],
  );

  // 1) Create the Leaflet map (browser only)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !mapEl.current || mapRef.current) return;
      leafletRef.current = L;

      const map = L.map(mapEl.current, {
        zoomControl: false, // will position or keep clean
      }).setView([22.5, 79], 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Add zoom control at bottom right to avoid overlay overlap
      L.control.zoom({position: 'bottomright'}).addTo(map);

      mapRef.current = map;
      setMapReady(true);
    })();

    const currentMarkers = markers.current;

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      currentMarkers.clear();
      setMapReady(false);
    };
  }, []);

  // 2) Draw numbered pins whenever the filtered list changes
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!mapReady || !L || !map) return;

    markers.current.forEach((m) => m.remove());
    markers.current.clear();

    const points = [];
    list.forEach((s, i) => {
      if (s.lat == null || s.lng == null) return;
      const isSelected = s.id === activeId;
      const icon = L.divIcon({
        className: 'sl-pin-wrap',
        html: `<div class="sl-pin ${isSelected ? 'is-active' : ''}"><span>${i + 1}</span></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -28],
      });

      const marker = L.marker([s.lat, s.lng], {icon}).addTo(map);
      marker.bindPopup(popupHtml(s));
      marker.on('click', () => setActiveId(s.id));
      markers.current.set(s.id, marker);
      points.push([s.lat, s.lng]);
    });

    if (points.length) {
      map.fitBounds(points, {padding: [50, 50], maxZoom: state ? 12 : 5});
    }
  }, [mapReady, list, state, activeId]);

  // 3) Selecting a store (from list or pin) zooms to it and opens its popup
  useEffect(() => {
    if (!activeId) return;
    const marker = markers.current.get(activeId);
    const map = mapRef.current;
    if (marker && map) {
      map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 14), {
        duration: 0.6,
      });
      marker.openPopup();
    }
    itemRefs.current
      .get(activeId)
      ?.scrollIntoView({block: 'nearest', behavior: 'smooth'});
  }, [activeId]);

  // Fullscreen toggle handler
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="sl-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        {/* Top Header matching Live Site Screenshot 1 */}
        <div className="sl-header">
          <h1>Store Locator</h1>
          <p>We are near to you!</p>
        </div>

        {/* Map Container with Floating Left Panel matching Live Site */}
        <div className="sl-map-container" ref={containerRef}>
          {/* Floating White Panel on Left */}
          <aside className="sl-floating-panel">
            {/* State Dropdown with Amber/Orange Chevron */}
            <div className="sl-select-container">
              <div className="sl-select-wrapper">
                <select
                  className="sl-select"
                  aria-label="Select a state"
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setActiveId(null);
                  }}
                >
                  <option value="">Select a State</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s.toUpperCase()}
                    </option>
                  ))}
                </select>

                <div className="sl-select-arrow">
                  <svg
                    className="w-3.5 h-3.5 fill-none stroke-current"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Store List */}
            <ol className="sl-store-list">
              {list.map((s, i) => {
                const isSelected = s.id === activeId;
                const fullAddress = [
                  s.title,
                  s.line2,
                  s.city,
                  s.pincode,
                  'India',
                ]
                  .filter(Boolean)
                  .join(', ');

                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      ref={(el) =>
                        el
                          ? itemRefs.current.set(s.id, el)
                          : itemRefs.current.delete(s.id)
                      }
                      className={`sl-store-item ${isSelected ? 'is-active' : ''}`}
                      onClick={() => setActiveId(s.id)}
                    >
                      <div className="sl-store-badge">{i + 1}</div>

                      <div className="sl-store-info">
                        <div className="sl-store-title">Lifestyle</div>
                        <div className="sl-store-address">{fullAddress}</div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </aside>

          {/* Map button on top-left of map (beside floating panel) */}
          <div className="sl-map-control-topleft">
            <button
              type="button"
              className="sl-map-type-btn"
              onClick={() => {
                if (mapRef.current) {
                  mapRef.current.setView([22.5, 79], state ? 8 : 5);
                }
              }}
            >
              Map
            </button>
          </div>

          {/* Fullscreen button on top-right of map */}
          <div className="sl-map-control-topright">
            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="sl-fullscreen-btn"
              aria-label="Toggle Fullscreen"
              title="Fullscreen"
            >
              <svg
                className="w-4 h-4 fill-none stroke-current"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                {isFullscreen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 9L4 4m0 0h5m-5 0v5m11-5l5 5m0-5h-5m5 0v5M9 15l-5 5m0 0h5m-5 0v-5m11 5l5-5m0 5h-5m5 0v-5"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5h-4m4 0v-4m0 4l-5-5"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Underneath Leaflet Map Element */}
          <div
            className="sl-map"
            ref={mapEl}
            role="region"
            aria-label="Lifestyle Store Map"
          />
        </div>
      </div>
    </div>
  );
}

export {StoreLocator as StoreLocatorView};
