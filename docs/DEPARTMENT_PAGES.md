# Department pages

How `/department/<handle>` works: which files are involved, where the data
comes from, how it is turned into UI, and how to change it.

Pages: `/department/women`, `men`, `kids`, `footwear`, `bags`, `beauty`,
`homeliving`, `babyshop`. Any other handle returns 404.

---

## 1. Files

| File | Role |
|---|---|
| [`app/routes/department.$handle.jsx`](../app/routes/department.$handle.jsx) | The **only** route for all department pages. Loader, SEO meta, revalidation rule. Renders `<DepartmentPage>`. |
| [`app/lib/departmentPage.server.js`](../app/lib/departmentPage.server.js) | **All data logic**, server only: department config, the single GraphQL query, metaobject parsing, link/filter rules, JSON fallback, Landmark-link translation. Exports one function: `getDepartmentPage()`. |
| [`app/components/DepartmentPages/DepartmentPage.jsx`](../app/components/DepartmentPages/DepartmentPage.jsx) | The **only** page component. Renders mobile header, announcement bar, then each section from the response by its `type`. |
| [`app/components/DepartmentPages/reusable-component/DepartmentHero.jsx`](../app/components/DepartmentPages/reusable-component/DepartmentHero.jsx) | Section `type: 'hero'` – hero slider, hero banners, category icon strip. |
| [`app/components/DepartmentPages/reusable-component/DepartmentShowcase.jsx`](../app/components/DepartmentPages/reusable-component/DepartmentShowcase.jsx) | Section `type: 'showcase'` – heading + top banner + cards (slider/grid) + bottom banner. |
| [`app/lib/shopifyImage.js`](../app/lib/shopifyImage.js) | `cdnImageLoader` – resizes images on Shopify's CDN **and** on `cms.landmarkshops.in` (JSON fallback images). |
| [`app/lib/urlUtils.js`](../app/lib/urlUtils.js) | `resolveTargetUrl` – turns a url / redirect_url / collection field into an internal path (strips store, preview and lifestylestores.com domains). |
| [`app/lib/seo.js`](../app/lib/seo.js) | `DEPARTMENT_SEO` – title/description per department; also feeds the sitemap. |
| `app/data/*HeroData.json`, `app/data/*PageData.json`, `app/data/shopByDepartmentData.json` | Static fallback content (copied from the Landmark site). Only read by `departmentPage.server.js`. |

Not used any more: `reusable-component/ProductCarousel.jsx` (no imports).

> Static routes win over dynamic ones in React Router. **Do not add
> `app/routes/department.women.jsx` (etc.) again** – it would silently replace
> the dynamic page for that handle.

---

## 2. Request flow

```
Browser  →  /department/women
              │
              ▼
department.$handle.jsx  loader({params, context})          ← server only
              │  getDepartmentPage(context.storefront, "women")
              ▼
departmentPage.server.js
   1. "women" in DEPARTMENTS?  no → null → loader throws 404
   2. ONE Storefront query: metaobjects(type: "women_department")   (cached)
   3. parse entries by handle → hero {slides, banners, categories}
                              → sections [...] in sort_order
   4. anything empty → filled from the JSON fallback (links translated)
   5. return { handle, name, sections: [{type, key, props}, ...] }
              │
              ▼
loader returns { page }  →  meta() builds SEO + breadcrumb JSON-LD
              │
              ▼
<DepartmentPage page={page}>
   PdpMobileHeader · AnnouncementBar
   page.sections.map → SECTION_COMPONENTS[type] with {...props}
       'hero'     → <DepartmentHero>
       'showcase' → <DepartmentShowcase>
   MobileFooter
```

* Everything is fetched **on the server before render**. The HTML arrives
  complete; nothing on these pages fetches data in the browser (the only
  `useEffect`s run the slider autoplay and scroll arrows).
* Clicking to another department fetches only that route's loader data
  (`/department/men.data`). The root loader (header/footer) is not re-run on
  normal navigation.

---

## 3. Data source: Shopify metaobjects

### 3.1 One metaobject type per department

The URL handle selects the type: `/department/<handle>` → `<handle>_department`
(`women_department`, `men_department`, …).

Each **entry** of that type is one block of the page. Its **handle** decides
where it goes:

| Entry handle | Becomes |
|---|---|
| `hero-slider` | Hero slider slides |
| `hero-banner`, `hero-banner-1`, `hero-banner-2`, … | Hero banners (under the slider) |
| `department-list`, `hero-categories-mobile` | Category icon strip (under the banners) |
| `footer-social-icons`, `products-list` | Ignored (not page sections) |
| **anything else** | A page section, ordered by `sort_order` |

Entry fields used: `enable` (only `"false"` hides it), `sort_order` (decimals
allowed, e.g. `6.1`), `title`, `name`, and `section`
(`list.mixed_reference`) which points to the content metaobject(s).

### 3.2 Content metaobjects (what `section` points to)

| Type | Used for | Fields read |
|---|---|---|
| `hero_slider` | Slides | `desktop_image`, `mobile_image`, `url`, `alt_text`, `sort_order`, `enable`, `filter` |
| `hero_banner` | Hero banners | `desktop_image`, `mobile_image`, `url` / `collection`, `title`, `filter` |
| `hero_categories` | Category icons | `categories_images_mobile`, `category_name`, `category_collection`, `sort_order`, `filter` |
| `roundbanner` | Banner-only section (merged into a neighbour, see 4.3) | `desktop_image`, `mobile_image`, `redirect_url`, `filter` |
| `topbrand`, `trending`, `shop_by_occasion`, `shop_by_department` | Card section | `title`, `mobilehorizontalview`, card list in `category_card`; `trending` also `desktop_banner`, `mobile_banner`, `redirect_url` |
| `babyshop_data` | Card section | card list in `babyshop_collection_card` |
| `collection_categories_card` | One card | `image_desktop` / `image_mobile`, `collection` or `url`, `alt`, `title`, `sort_order`, `filter` |
| `babyshop_collection_card` | One card | `image`, `collection`, `filter` |

Image keys are tried in this order: desktop `desktop_image, image_desktop,
desktop_banner, image, categories_images_mobile`; mobile `mobile_image,
image_mobile, mobile_banner, categories_images_mobile`. An item with no image
is skipped.

### 3.3 The query

`DEPARTMENT_METAOBJECTS_QUERY` (one request per page):

```
metaobjects(type: $type, first: 50)            ← entries
  fields { key value
    references(first: 20)                      ← `section` → content metaobjects
      fields { key value reference{MediaImage|Collection}
        references(first: 30)                  ← card lists → cards
          fields { key value reference{MediaImage|Collection} } } }
```

Query cost ≈ 1,282 (a fully nested "fetch everything" version costs ~19,853
for the same images).

### 3.4 Caching

| Data | Cache | Meaning |
|---|---|---|
| Department metaobjects | `maxAge 5 min`, `staleWhileRevalidate 1 day` | Admin edits appear within ~5 minutes; visitors never wait on Shopify once warm. Change in `DEPARTMENT_CACHE`. |
| Header (root loader) | `1 min` + `1 day` SWR; metaobject + menu fetched in parallel | Every page benefits. |
| Collection pages (where cards link) | `1 min` + `10 min` SWR | Listing prices/stock at most ~1 min behind. |

A failed Storefront call is logged and the page renders from the JSON
fallback instead of returning 500.

---

## 4. Parsing (metaobjects → page)

All in `departmentPage.server.js`.

### 4.1 Normalising one item – `normalizeDepartmentItem(node)`

Any slide / banner / icon / card becomes:

```js
{ id, image, mobileImage, title, altText, link, sortOrder }
```

`title` = `title` → `category_name` → `alt`. `link` = see section 5.

### 4.2 Hero – `parseDepartmentHero(nodes)`

* `slides` from `hero-slider`, `banners` from `hero-banner*`,
  `categories` from `department-list` / `hero-categories-mobile`.
* Each list is sorted by `sort_order`; disabled entries/items are dropped.

### 4.3 Sections – `parseDepartmentSections(nodes)`

1. Every other enabled entry (by `sort_order`) → `parseSectionEntry()`:
   * **heading** = entry `title` → content `title` → entry `name`
   * **cards** = the first card-list field of the content metaobject
   * **banner** = content `desktop_banner`/`desktop_image` (+ mobile) with
     `redirect_url`
   * **layout** from `cardLayout(count, mobilehorizontalview)`:
     * cards per row = 3 if ≤3 cards, else `min(count, 6)`
     * desktop = `slider` if more cards than fit, else `gallery`
     * mobile = `slider` unless `mobilehorizontalview` is `false` (grid)
     * mobile grid columns = 3 when count is a multiple of 3 and ≥ 6, else 2
2. **Banner-only entries** (e.g. `roundbanner`) are merged instead of
   rendering alone:
   1. same title as the **previous** section → its bottom banner
   2. same title as the **next** section, or next is untitled → its top banner
   3. untitled → bottom banner of the previous section

### 4.4 Merge with the JSON fallback – `getDepartmentPage()`

* **Hero:** slides, banners and categories each fall back separately.
* **Sections:**
  * If *any* metaobject section has content → metaobject order wins; each
    empty metaobject section is replaced by the JSON section with the **same
    title** (case/spacing ignored); unmatched empty ones are dropped.
  * If *no* metaobject section has content (type missing, or only empty
    shells) → the JSON page is used as-is.
* The fallback is built lazily – only when something needs it.

---

## 5. Links

### 5.1 Base link of an item – `linkOf()` + `resolveTargetUrl()`

Order: `url` / `link` / `redirect_url` → otherwise the referenced
`collection` / `category_collection` → `/collections/<handle>`.
Absolute URLs on `*.myshopify.com`, `*.shopifypreview.com`,
`lifestylestores.com` or any `landmark` host become relative paths.

### 5.2 The optional `filter` field – `applyCardFilter(link, filter)`

A single-line text field on cards, icons, slides and banners that decides
exactly where the item links, **without editing its other fields**.
Comma-separated `key=value` pairs:

| Value | Link produced |
|---|---|
| `link=/department/kids` | exactly that page (nothing else applied) |
| `search=Mickey Mouse` | `/search?q=Mickey Mouse` |
| `collection=kurtas-kurtis` | that collection instead of the item's own |
| `brand=PUMA` | product vendor filter (value exactly as in Shopify) |
| `type=Heels`, `gender=Men`, `fit=Loose`, `fabric=…`, `sleeve_length=…`, `color=…` | `custom.<key>` product-metafield filter |
| `tag=…`, `product_type=…` | tag / product type filter |
| `price=149-799` | `min_price` / `max_price` |
| `sort=new-arrivals` | `sort_by` |

Combine with commas: `collection=men, brand=PUMA`. Repeat a key for OR:
`brand=ARROW, brand=ARROW SPORT`. Priority: `link` > `search` >
`collection` > the item's own link.

The produced URL uses the same parameters the collection page writes itself:
the readable `type=Heels` (marks the filter chip as selected) and the
`filters` JSON the collection loader sends to the Storefront API.

The field exists on `hero_categories`, `collection_categories_card` and
`babyshop_collection_card`; `hero_slider`, `hero_banner` and `roundbanner`
need it added (see `metaobject-filter-updates.xlsx`, given to data entry).

### 5.3 Landmark links in the JSON fallback – `localizeLandmarkLink()`

The JSON data contains Landmark-site links (`/in/en/c/beauty-lips`,
`/in/en/search?q=…`, `https://www.lifestylestores.com/…`) that don't exist in
this app. Every fallback link is rewritten on the server:

* category slug → a local collection via `LANDMARK_CATEGORIES`
  (longest prefix wins: `beauty-skincare-facewash` → `face-wash`,
  `beauty-skincare-serum` → `skin-care`)
* free-text search → `/search?q=…`
* brand / type / fit / fabric / sleeve / gender / price / "New" badge → filters
* anything unknown → the department's own collection
  (`DEPARTMENTS[handle].collection`) – never a 404

---

## 6. The response

`getDepartmentPage()` returns exactly what the page renders:

```js
{
  handle: 'women',
  name: 'Women',
  sections: [
    { type: 'hero', key: 'hero', props: {
        slider:      { show, slides: [{id, desktopImage, mobileImage, altText, link}] },
        banners:     { show, items:  [{id, image, mobileImage, altText, link}] },
        collections: { show, items:  [{id, image, title, link, sortOrder}] } } },
    { type: 'showcase', key: 'trending', props: {
        heading, banner, bottomBanner, bannerPosition,
        collections: [{id, image, altText, link, badge?}],
        desktopCardsPerRow, desktopView, mobileView, mobileCardsPerRow,
        cardShape?, titlePosition? } },
    …
  ],
}
```

`props` are passed to the component unchanged.

---

## 7. Rendering

### 7.1 `DepartmentPage`

```js
const SECTION_COMPONENTS = { hero: DepartmentHero, showcase: DepartmentShowcase };
page.sections.map(({type, key, props}) => <SECTION_COMPONENTS[type] key={key} {...props} />)
```

No department-specific code. Unknown `type`s render nothing.

### 7.2 `DepartmentHero` – props `slider`, `banners`, `collections`

* **Slider:** autoplay 3.5s (pauses on hover), swipe on touch, arrows + dots.
  Mobile and desktop images use `<picture>` with a blank source for the hidden
  breakpoint, so each device downloads only one. First slide is
  `loading="eager"` + `fetchpriority="high"`. A slide is clickable when it has
  `link` (or `buttonLink`).
* **Banners:** stacked full-width, separate mobile image when different.
* **Collections:** horizontal scroll on mobile, one row grid on desktop,
  sorted by `sortOrder`.

### 7.3 `DepartmentShowcase` – one section

| Prop | Values |
|---|---|
| `heading` | section title (hidden when empty) |
| `banner`, `bannerPosition` | `{desktopImage, mobileImage, desktopAlt, link}`; `'top' \| 'bottom' \| 'none'` |
| `bottomBanner` | second banner below the cards |
| `collections` | cards `{id, image, link, altText, title?, badge?, priceText?}` |
| `desktopCardsPerRow` | 2–6 |
| `desktopView` / `mobileView` | `'slider'` (scroll + arrows) or `'gallery'` (grid) |
| `mobileCardsPerRow` | 1–4 (grid only) |
| `cardShape` | `'rectangle'` (default) or `'circle'` |
| `titlePosition` | `'bottom'` or `'overlay'` (only if a card has `title`) |

Banners render only when they have an image URL.

### 7.4 Images

All `<Image>`s use `cdnImageLoader`:

* Shopify CDN → `?width=&height=&crop=` (Shopify resizes).
* `cms.landmarkshops.in` (JSON fallback) →
  `/cdn-cgi/image/w=<width>%2Cq=80%2Cf=auto/<path>` (resized WebP/AVIF; commas
  encoded so `srcset` stays valid). This took the Beauty hero from ~1.4 MB of
  GIFs to ~320 KB for the first 8 images.

---

## 8. Route details – `department.$handle.jsx`

* **loader** – `getDepartmentPage()`; `null` → `404`.
* **meta** – `DEPARTMENT_SEO[handle]` + breadcrumb JSON-LD (Home → name).
* **shouldRevalidate** – re-run only when the handle changes (not after
  add-to-cart, login, etc.).

---

## 9. Current content source (2026-10-13)

| Page | Source |
|---|---|
| Women, Men, Kids, Footwear | Shopify metaobjects |
| Bags | JSON (metaobject type exists, all sections empty) |
| Beauty | JSON (metaobject type exists, all entries empty) |
| Home & Living, Babyshop | JSON (no metaobject type yet) |

When content is added in Shopify, a page switches from JSON automatically,
section by section – no code change.

---

## 10. How to…

**Add a department** – add a line to `DEPARTMENTS`
(`sale: {name: 'Sale', collection: 'sale', fallback: () => ({hero: EMPTY_HERO, sections: []})}`),
create `sale_department` metaobjects, add `DEPARTMENT_SEO.sale` in `seo.js`.
`/department/sale` then works.

**Add a new kind of section** – produce `{type: 'myType', key, props}` in
`getDepartmentPage()` and register the component in `SECTION_COMPONENTS`.

**Change how fresh content is** – `DEPARTMENT_CACHE` (department data),
`headerCache` in `root.jsx`, the `cache:` option in `collections.$handle.jsx`.

**Support a new filter key** – any unknown key already maps to the
`custom.<key>` product metafield. For other filter types add an entry to
`FILTER_INPUTS`.

**Map another Landmark category** – add the slug to `LANDMARK_CATEGORIES`.

**Change section layout** – metaobject sections: `cardLayout()`; JSON
sections: the per-department `…Fallback()` builders.

---

## 11. Troubleshooting

| Symptom | Likely cause |
|---|---|
| A section is missing | Entry `enable` = false, no images on its cards, or empty with no JSON section of the same title. |
| Section shows twice | A banner-only entry whose title matches neither neighbour (see 4.3). |
| Section has no heading | Entry and content metaobject both have no `title` (e.g. Footwear `trending`). |
| Card opens the whole collection | No `filter` value and the card points at the department collection. |
| Card opens an empty listing | Filter is right but no product has that vendor / `custom.type` / gender yet. |
| Admin edit not visible | Cache: wait ~5 min (department) / ~1 min (header). |
| Card opens another site | A `url` on an external domain – internal domains are stripped automatically. |
