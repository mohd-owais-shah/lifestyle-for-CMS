/**
 * Department pages — all data in one place.
 *
 * `getDepartmentPage(storefront, handle)` is the only entry point. It
 *   1. makes ONE Storefront call for the `<handle>_department` metaobjects,
 *   2. parses them by entry handle (hero-slider, hero-banner, department-list,
 *      everything else = a page section),
 *   3. fills anything empty from the department's static JSON,
 *   4. returns a render-ready response:
 *
 *   {
 *     handle: 'women',
 *     name: 'Women',
 *     sections: [
 *       {type: 'hero', key: 'hero', props: {slider, banners, collections}},
 *       {type: 'showcase', key: 'trending', props: {heading, banner, collections, ...}},
 *       ...
 *     ],
 *   }
 *
 * `type` picks the component in <DepartmentPage> and `props` is passed to it
 * unchanged, so this file decides what each page shows.
 *
 * Server-only (.server.js): the JSON fallback never ships to the browser.
 */
import {resolveTargetUrl} from '~/lib/urlUtils';
import womenPageData from '~/data/womenPageData.json';
import menHeroData from '~/data/menHeroData.json';
import menPageData from '~/data/menPageData.json';
import kidsHeroData from '~/data/kidsHeroData.json';
import kidsPageData from '~/data/kidsPageData.json';
import footwearHeroData from '~/data/footwearHeroData.json';
import footwearPageData from '~/data/footwearPageData.json';
import bagsHeroData from '~/data/bagsHeroData.json';
import bagsPageData from '~/data/bagsPageData.json';
import beautyHeroData from '~/data/beautyHeroData.json';
import beautyPageData from '~/data/beautyPageData.json';
import homelivingHeroData from '~/data/homelivingHeroData.json';
import homelivingPageData from '~/data/homelivingPageData.json';
import babyshopHeroData from '~/data/babyshopHeroData.json';
import babyshopPageData from '~/data/babyshopPageData.json';
import shopByDepartmentData from '~/data/shopByDepartmentData.json';

/* -------------------------------------------------------------------------- */
/* Config                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * URL handle -> display name, the department's Shopify collection (where
 * JSON fallback links that can't be mapped land) and its JSON fallback.
 * The metaobject type is always `<handle>_department`.
 * Add a department here to create its page.
 */
const DEPARTMENTS = {
  women: {name: 'Women', collection: 'women', fallback: womenFallback},
  men: {name: 'Men', collection: 'men', fallback: menFallback},
  kids: {name: 'Kids', collection: 'kids', fallback: kidsFallback},
  footwear: {
    name: 'Footwear',
    collection: 'footwear',
    fallback: footwearFallback,
  },
  bags: {name: 'Bags', collection: 'bags', fallback: bagsFallback},
  beauty: {name: 'Beauty', collection: 'beauty', fallback: beautyFallback},
  homeliving: {
    name: 'Home & Living',
    collection: 'home-living',
    fallback: homelivingFallback,
  },
  babyshop: {
    name: 'Babyshop',
    collection: 'babyshop',
    fallback: babyshopFallback,
  },
};

/* -------------------------------------------------------------------------- */
/* Entry point                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Load everything a department page renders.
 * @param {any} storefront
 * @param {string | undefined} rawHandle URL handle, e.g. "women"
 * @returns {Promise<null | {handle: string, name: string, sections: Array<{type: string, key: string, props: object}>}>}
 *   null when the handle is not a department.
 */
export async function getDepartmentPage(storefront, rawHandle) {
  const handle = rawHandle?.toLowerCase();
  const department = DEPARTMENTS[handle];
  if (!department) return null;

  const nodes = await fetchDepartmentMetaobjects(
    storefront,
    `${handle}_department`,
  );
  // JSON fallback is only built if something below actually needs it. Its
  // links come from the Landmark site and are rewritten to local pages.
  let fallbackData;
  const loadFallback = () =>
    (fallbackData ??= localizeFallbackLinks(
      department.fallback(),
      department.collection,
    ));
  const fallback = {
    get hero() {
      return loadFallback().hero;
    },
    get sections() {
      return loadFallback().sections;
    },
  };

  // Hero: each part independently prefers metaobjects, else JSON.
  const metaHero = parseDepartmentHero(nodes);
  const hero = {
    slides: metaHero.slides.length ? metaHero.slides : fallback.hero.slides,
    banners: metaHero.banners.length ? metaHero.banners : fallback.hero.banners,
    categories: metaHero.categories.length
      ? metaHero.categories
      : fallback.hero.categories,
  };

  // Sections: if any metaobject section has content, metaobject order wins
  // and each empty one is filled by the JSON section with the same title.
  // No metaobject content at all (type missing or only empty shells) -> the
  // JSON page as-is, so untitled JSON sections are not lost.
  const metaSections = parseDepartmentSections(nodes);
  const sections = metaSections.some(sectionHasContent)
    ? metaSections.map((section) =>
        sectionHasContent(section)
          ? section
          : fallback.sections.find(
              (f) =>
                section.title &&
                normalizeTitle(f.title) === normalizeTitle(section.title),
            ),
      )
    : fallback.sections;

  return {
    handle,
    name: department.name,
    sections: [
      heroSection(hero),
      ...sections.filter(sectionHasContent).map(showcaseSection),
    ].filter(Boolean),
  };
}

/** Hero -> {type: 'hero'} response section (props for <DepartmentHero>). */
function heroSection({slides, banners, categories}) {
  if (!slides.length && !banners.length && !categories.length) return null;
  return {
    type: 'hero',
    key: 'hero',
    props: {
      slider: {show: slides.length > 0, slides},
      banners: {show: banners.length > 0, items: banners},
      collections: {show: categories.length > 0, items: categories},
    },
  };
}

/** Parsed section -> {type: 'showcase'} response section (props for <DepartmentShowcase>). */
function showcaseSection({key, title, cards, ...layout}) {
  return {
    type: 'showcase',
    key,
    props: {heading: title, collections: cards, ...layout},
  };
}

/* -------------------------------------------------------------------------- */
/* Storefront query + metaobject parsing                                      */
/* -------------------------------------------------------------------------- */

/**
 * The one Storefront query used by every /departments/:handle page.
 * The page handle maps to the metaobject type `<handle>_department`.
 *
 * Schema (as configured in Shopify admin):
 *   <handle>_department entry — its handle decides how it renders:
 *     hero-slider                           -> hero slider
 *     hero-banner, hero-banner-N            -> hero banners
 *     department-list, hero-categories-mobile -> hero category strip
 *     anything else                         -> page section, ordered by sort_order
 *   entry fields: enable, sort_order, title, name,
 *     section: list.mixed_reference -> hero_slider | hero_banner | roundbanner |
 *              hero_categories | topbrand | trending | shop_by_occasion |
 *              shop_by_department | babyshop_data | ...
 *       desktop_image / mobile_image / desktop_banner / mobile_banner ...
 *       url / redirect_url / collection / category_collection
 *       category_card | babyshop_collection_card: list.metaobject_reference
 */
const DEPARTMENT_METAOBJECTS_QUERY = `#graphql
  fragment DepartmentImage on MediaImage {
    image {
      url
      altText
      width
      height
    }
  }

  fragment DepartmentLeafField on MetaobjectField {
    key
    value
    reference {
      __typename
      ... on MediaImage {
        ...DepartmentImage
      }
      ... on Collection {
        handle
      }
    }
  }

  fragment DepartmentEntry on Metaobject {
    id
    handle
    type
    fields {
      key
      value
      references(first: 20) {
        nodes {
          ... on Metaobject {
            id
            handle
            type
            fields {
              key
              value
              reference {
                __typename
                ... on MediaImage {
                  ...DepartmentImage
                }
                ... on Collection {
                  handle
                }
              }
              references(first: 30) {
                nodes {
                  ... on Metaobject {
                    id
                    handle
                    type
                    fields {
                      ...DepartmentLeafField
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  query DepartmentMetaobjects(
    $type: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    departmentMetaobjects: metaobjects(type: $type, first: 50) {
      nodes {
        ...DepartmentEntry
      }
    }
  }
`;

/**
 * Fetch every entry of a `<handle>_department` metaobject type.
 * Never throws: a Storefront failure renders the page from its fallback data
 * instead of a 500.
 * @param {any} storefront
 * @param {string} type e.g. "women_department"
 */
/**
 * Department content changes rarely: serve it from Hydrogen's sub-request
 * cache for 5 minutes, then keep serving the cached copy for up to a day
 * while it refreshes in the background — so a visitor never waits on
 * Shopify once the cache is warm, and admin edits show up within ~5 minutes.
 */
const DEPARTMENT_CACHE = (storefront) =>
  storefront.CacheCustom({
    mode: 'public',
    maxAge: 60 * 5,
    staleWhileRevalidate: 60 * 60 * 24,
  });

async function fetchDepartmentMetaobjects(storefront, type) {
  const data = await storefront
    .query(DEPARTMENT_METAOBJECTS_QUERY, {
      variables: {type},
      cache: DEPARTMENT_CACHE(storefront),
    })
    .catch((error) => {
      console.error(`[department] failed to load ${type} metaobjects`, error);
      return null;
    });

  return data?.departmentMetaobjects?.nodes || [];
}

/* -------------------------------------------------------------------------- */
/* Field helpers                                                              */
/* -------------------------------------------------------------------------- */

/** @param {Array<{key: string}> | undefined} fields */
const toFieldMap = (fields = []) =>
  Object.fromEntries((fields || []).map((f) => [f.key, f]));

/** `enable` is optional; only an explicit "false" hides an entry. */
const isEnabled = (fieldMap) => fieldMap.enable?.value !== 'false';

const sortOrderOf = (fieldMap, fallback) => {
  const n = parseFloat(fieldMap.sort_order?.value);
  return Number.isNaN(n) ? fallback : n;
};

const bySortOrder = (a, b) => a.sortOrder - b.sortOrder;

const imageOf = (fieldMap, ...keys) => {
  for (const key of keys) {
    const image = fieldMap[key]?.reference?.image;
    if (image?.url) return image;
  }
  return null;
};

const LINK_KEYS = new Set([
  'url',
  'link',
  'redirect_url',
  'collection',
  'category_collection',
  'collection_handle',
]);

/**
 * Link from url/redirect_url, else the referenced collection. Only link
 * fields are considered so card-list references are never mistaken for a
 * collection handle.
 */
const linkOf = (fields = []) =>
  resolveTargetUrl((fields || []).filter((f) => LINK_KEYS.has(f.key))) || '';

/**
 * Optional field `filter` (single line text) on a card / slide / banner
 * decides exactly where it links, without touching its other fields.
 * Comma-separated `key=value` pairs:
 *
 *   link=/departments/kids_department link to this exact page (nothing else applied)
 *   collection=kurtas-kurtis          link to that collection instead
 *   search=Mickey Mouse               link to /search?q=Mickey Mouse
 *   brand=PUMA                        product vendor (exact, as in Shopify)
 *   price=0-799                       price range (min-max)
 *   sort=new-arrivals                 collection sort (sort_by)
 *   tag=Sneakers / product_type=Shoes
 *   type=Heels, gender=Men, fit=Loose ...
 *                                     any other key = `custom.<key>` product
 *                                     metafield (the collection page filters)
 *
 * e.g. "collection=men, brand=PUMA" or "type=Sports Shoes, gender=Men".
 * Repeating a key (brand=A, brand=B) matches either value.
 *
 * Writes the same URL params the collection page writes itself: the readable
 * `<key>=<value>` (marks the filter chip as selected) and the `filters` JSON
 * (what the collection loader sends to the Storefront API).
 */
const FILTER_INPUTS = {
  brand: (value) => ({productVendor: value}),
  vendor: (value) => ({productVendor: value}),
  tag: (value) => ({tag: value}),
  product_type: (value) => ({productType: value}),
};

const parseFilterPairs = (filterValue) =>
  filterValue
    .split(',')
    .map((pair) => {
      const [rawKey, ...rest] = pair.split('=');
      return {
        key: rawKey?.trim().toLowerCase().replace(/\s+/g, '_'),
        value: rest.join('=').trim(),
      };
    })
    .filter(({key, value}) => key && value);

function applyCardFilter(link, filterValue) {
  if (!filterValue?.trim()) return link;
  const pairs = parseFilterPairs(filterValue);

  // Destination: link > search > collection override > the card's own link.
  const exact = pairs.find((p) => p.key === 'link');
  const search = pairs.find((p) => p.key === 'search');
  const collection = pairs.find((p) => p.key === 'collection');
  if (exact) {
    return resolveTargetUrl([{key: 'url', value: exact.value}]) || link;
  }
  if (search) {
    return `/search?${new URLSearchParams({q: search.value})}`;
  }
  const base = collection
    ? `/collections/${collection.value.replace(/^\/?collections\//, '')}`
    : link;
  if (!base) return link;

  const url = new URL(base, 'https://store.local');
  const filters = JSON.parse(url.searchParams.get('filters') || '[]');

  for (const {key, value} of pairs) {
    if (key === 'collection') continue;

    if (key === 'sort' || key === 'sort_by') {
      url.searchParams.set('sort_by', value);
      continue;
    }

    if (key === 'price') {
      const [min, max] = value.split('-').map((n) => n.trim());
      if (min) url.searchParams.set('min_price', min);
      if (max) url.searchParams.set('max_price', max);
      continue;
    }

    const toInput =
      FILTER_INPUTS[key] ||
      ((v) => ({productMetafield: {namespace: 'custom', key, value: v}}));
    filters.push(toInput(value));

    const selected = url.searchParams.get(key);
    url.searchParams.set(key, selected ? `${selected},${value}` : value);
  }

  if (filters.length) url.searchParams.set('filters', JSON.stringify(filters));
  return url.origin === 'https://store.local'
    ? url.pathname + url.search + url.hash
    : url.href;
}

/** Compare section titles loosely ("Trends Higlight" typo aside). */
const normalizeTitle = (title) =>
  (title || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const DESKTOP_IMAGE_KEYS = [
  'desktop_image',
  'image_desktop',
  'desktop_banner',
  'image',
  'categories_images_mobile',
];
const MOBILE_IMAGE_KEYS = [
  'mobile_image',
  'image_mobile',
  'mobile_banner',
  'categories_images_mobile',
];

/**
 * Normalize one referenced metaobject (slide, banner, category card, ...)
 * into {id, image, mobileImage, title, altText, link, sortOrder}.
 * Returns null when disabled or image-less.
 * @param {any} node
 * @param {number} index
 */
function normalizeDepartmentItem(node, index = 0) {
  if (!node?.fields) return null;
  const fieldMap = toFieldMap(node.fields);
  if (!isEnabled(fieldMap)) return null;

  const desktop = imageOf(fieldMap, ...DESKTOP_IMAGE_KEYS);
  const mobile = imageOf(fieldMap, ...MOBILE_IMAGE_KEYS);
  const image = desktop || mobile;
  if (!image) return null;

  const title =
    fieldMap.title?.value ||
    fieldMap.category_name?.value ||
    fieldMap.alt?.value ||
    '';

  return {
    id: node.id || `${node.handle}-${index}`,
    image,
    mobileImage: mobile || image,
    title,
    altText:
      fieldMap.alt_text?.value || fieldMap.alt?.value || image.altText || title,
    link: applyCardFilter(linkOf(node.fields), fieldMap.filter?.value),
    sortOrder: sortOrderOf(fieldMap, index),
  };
}

/* -------------------------------------------------------------------------- */
/* Entries                                                                    */
/* -------------------------------------------------------------------------- */

const HERO_SLIDER_HANDLE = /^hero-slider$/;
const HERO_BANNER_HANDLE = /^hero-banner(-\d+)?$/;
const HERO_CATEGORIES_HANDLE = /^(department-list|hero-categories-mobile)$/;
/** Entries stored on the department type that are not page sections. */
const NON_SECTION_HANDLE = /^(footer-social-icons|products-list)$/;

/**
 * Enabled entries whose handle matches, sorted by sort_order.
 * @param {Array<any>} nodes
 * @param {(handle: string) => boolean} matchHandle
 */
function entriesMatching(nodes, matchHandle) {
  return nodes
    .map((node) => ({node, fieldMap: toFieldMap(node.fields)}))
    .filter(
      ({node, fieldMap}) => matchHandle(node.handle) && isEnabled(fieldMap),
    )
    .map(({node, fieldMap}, index) => ({
      node,
      sortOrder: sortOrderOf(fieldMap, 1000 + index),
    }))
    .sort(bySortOrder)
    .map(({node}) => node);
}

/** Metaobjects referenced by an entry's `section` field. */
const sectionNodes = (entry) =>
  (
    entry?.fields?.find((f) => f.key === 'section' || f.key === 'section_data')
      ?.references?.nodes || []
  ).filter((node) => node?.fields && isEnabled(toFieldMap(node.fields)));

/** Items referenced by an entry's `section` field, normalized + sorted. */
const sectionItems = (entry) =>
  sectionNodes(entry)
    .map(normalizeDepartmentItem)
    .filter(Boolean)
    .sort(bySortOrder);

/**
 * Hero slider, hero banners and category strip for <DepartmentHero>.
 * @param {Array<any>} nodes
 */
function parseDepartmentHero(nodes = []) {
  const slides = entriesMatching(nodes, (h) => HERO_SLIDER_HANDLE.test(h))
    .flatMap(sectionItems)
    .map((item) => ({
      id: item.id,
      desktopImage: item.image,
      mobileImage: item.mobileImage,
      altText: item.altText,
      link: item.link,
    }));

  const banners = entriesMatching(nodes, (h) => HERO_BANNER_HANDLE.test(h))
    .flatMap(sectionItems)
    .map((item) => ({
      id: item.id,
      image: item.image,
      mobileImage: item.mobileImage,
      altText: item.altText,
      link: item.link,
    }));

  const categories = entriesMatching(nodes, (h) =>
    HERO_CATEGORIES_HANDLE.test(h),
  ).flatMap(sectionItems);

  return {slides, banners, categories};
}

/**
 * Layout for a metaobject card section, derived from the card count and the
 * `mobilehorizontalview` flag.
 */
function cardLayout(count, mobileHorizontal) {
  const desktopCardsPerRow = count <= 3 ? 3 : Math.min(count, 6);
  return {
    desktopCardsPerRow,
    desktopView: count > desktopCardsPerRow ? 'slider' : 'gallery',
    mobileView: mobileHorizontal ? 'slider' : 'gallery',
    mobileCardsPerRow: count % 3 === 0 && count >= 6 ? 3 : 2,
  };
}

/**
 * One non-hero entry -> DepartmentShowcase props.
 * The referenced metaobject decides the content: a card list
 * (category_card / babyshop_collection_card) and/or a banner
 * (desktop_banner / desktop_image + redirect_url).
 */
function parseSectionEntry(entry) {
  const entryFields = toFieldMap(entry.fields);
  const [inner] = sectionNodes(entry);
  const innerFields = toFieldMap(inner?.fields);

  const title =
    entryFields.title?.value ||
    innerFields.title?.value ||
    entryFields.name?.value ||
    '';

  const cardNodes =
    inner?.fields?.find((f) => f.references?.nodes?.length)?.references
      ?.nodes || [];
  const cards = cardNodes
    .map(normalizeDepartmentItem)
    .filter(Boolean)
    .sort(bySortOrder)
    .map(({id, image, altText, title: cardTitle, link}) => ({
      id,
      image,
      altText: altText || cardTitle,
      link,
    }));

  const bannerDesktop = imageOf(innerFields, 'desktop_banner', 'desktop_image');
  const bannerMobile = imageOf(innerFields, 'mobile_banner', 'mobile_image');
  const banner =
    bannerDesktop || bannerMobile
      ? {
          desktopImage: bannerDesktop || bannerMobile,
          mobileImage: bannerMobile || bannerDesktop,
          desktopAlt: title || 'Banner',
          link: applyCardFilter(
            linkOf(inner.fields),
            innerFields.filter?.value,
          ),
        }
      : null;

  return {
    key: entry.handle,
    title,
    banner,
    bannerPosition: banner ? 'top' : 'none',
    bottomBanner: null,
    cards,
    ...cardLayout(
      cards.length,
      innerFields.mobilehorizontalview?.value !== 'false',
    ),
  };
}

/** True when the section has something to render. */
const sectionHasContent = (section) =>
  Boolean(section?.cards?.length || section?.banner || section?.bottomBanner);

/**
 * Page sections in sort_order. Banner-only entries (roundbanner) are merged
 * into a neighbouring card section instead of rendering on their own:
 *   1. same title as the previous section -> its bottom banner
 *   2. same title as the next section (or next is untitled) -> its top banner
 *   3. untitled -> bottom banner of the previous section
 * @param {Array<any>} nodes
 */
function parseDepartmentSections(nodes = []) {
  const parsed = entriesMatching(
    nodes,
    (h) =>
      !HERO_SLIDER_HANDLE.test(h) &&
      !HERO_BANNER_HANDLE.test(h) &&
      !HERO_CATEGORIES_HANDLE.test(h) &&
      !NON_SECTION_HANDLE.test(h),
  ).map(parseSectionEntry);

  const sections = [];
  for (let i = 0; i < parsed.length; i++) {
    const section = parsed[i];
    const isBannerOnly = section.banner && section.cards.length === 0;
    const prev = sections[sections.length - 1];
    const canTakeBottom = prev?.cards.length && !prev.bottomBanner;

    if (
      isBannerOnly &&
      section.title &&
      canTakeBottom &&
      normalizeTitle(prev.title) === normalizeTitle(section.title)
    ) {
      prev.bottomBanner = section.banner;
      continue;
    }

    if (isBannerOnly && section.title) {
      const next = parsed[i + 1];
      if (
        next?.cards.length &&
        !next.banner &&
        (!next.title ||
          normalizeTitle(next.title) === normalizeTitle(section.title))
      ) {
        next.banner = section.banner;
        next.bannerPosition = 'top';
        next.title = next.title || section.title;
        continue;
      }
    }

    if (isBannerOnly && !section.title && canTakeBottom) {
      prev.bottomBanner = section.banner;
      continue;
    }

    sections.push(section);
  }

  return sections;
}

/* -------------------------------------------------------------------------- */
/* Static JSON fallback (same shape as the metaobject parsers)                */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* Builders                                                                   */
/* -------------------------------------------------------------------------- */

const img = (url, altText) =>
  url ? {url, ...(altText ? {altText} : {})} : null;

/** Banner from one image used on both breakpoints (or separate mobile). */
const banner = (url, link, alt, mobileUrl) =>
  url || mobileUrl
    ? {
        desktopImage: img(url || mobileUrl),
        mobileImage: img(mobileUrl || url),
        desktopAlt: alt || 'Banner',
        link: link || '',
      }
    : null;

/** Map JSON items to cards: pick(item) -> [imageUrl, link, altText?]. */
const cards = (items, key, pick) =>
  (items || [])
    .map((item, index) => {
      const [url, link, altText] = pick(item);
      return url
        ? {
            id: `${key}-${index}`,
            image: img(url, altText),
            link: link || '',
            altText,
          }
        : null;
    })
    .filter(Boolean);

/** Section with DepartmentShowcase defaults. */
const section = (key, title, props) => ({
  key,
  title: title || '',
  banner: null,
  bottomBanner: null,
  bannerPosition: props.banner ? 'top' : 'none',
  cards: [],
  desktopCardsPerRow: 4,
  desktopView: 'slider',
  mobileView: 'slider',
  mobileCardsPerRow: 2,
  ...props,
});

const heroFromJson = (heroData) => ({
  slides: (heroData.hero_banners || []).map((b, index) => ({
    id: `hero-${index}`,
    desktopImage: img(b.desktop_image_url),
    mobileImage: img(b.mobile_image_url),
    altText: b.banner_name,
    link: b.link,
  })),
  banners: (heroData.modular_blocks || []).map((b, index) => ({
    id: `hero-banner-${index}`,
    image: img(b.desktop_image_url),
    mobileImage: img(b.mobile_image_url),
    link: b.link,
  })),
  categories: (heroData.category_carousel || []).map((c, index) => ({
    id: `hero-category-${index}`,
    image: img(c.desktop_image_url),
    title: '',
    link: c.link,
    sortOrder: index,
  })),
});

const EMPTY_HERO = {slides: [], banners: [], categories: []};

const shopByDepartmentSection = () => {
  const s = shopByDepartmentData.sections?.[0];
  return section('shop-by-department', s?.section_name, {
    cards: cards(s?.items, 'shop-by-dept', (i) => [i.image?.src, i.href]),
    desktopCardsPerRow: 3,
    desktopView: 'gallery',
  });
};

/* -------------------------------------------------------------------------- */
/* Departments                                                                */
/* -------------------------------------------------------------------------- */

function womenFallback() {
  const w = womenPageData;
  const pick = (i) => [i.image_url, i.link];
  return {
    hero: EMPTY_HERO,
    sections: [
      section('top-brands', w[0]?.section_title, {
        cards: cards(w[0]?.items, 'top-brand', pick),
        bottomBanner: banner(w[0]?.banner?.image_url, w[0]?.banner?.link),
        desktopCardsPerRow: 6,
      }),
      section('top-categories', w[1]?.section_title, {
        cards: cards(w[1]?.items, 'top-category', pick),
        desktopCardsPerRow: 6,
        desktopView: 'gallery',
        mobileView: 'gallery',
        mobileCardsPerRow: 3,
      }),
      section('trends-highlight', w[2]?.section_title, {
        banner: banner(w[2]?.banner?.image_url, w[2]?.banner?.link),
        cards: cards(w[2]?.items, 'trends-highlight', pick),
        desktopView: 'gallery',
      }),
      section('brands-we-love', w[3]?.section_title, {
        cards: cards(w[3]?.items, 'brands-we-love', pick),
        desktopCardsPerRow: 6,
      }),
      section('lingerie-love', w[4]?.section_title, {
        banner: banner(w[4]?.banner?.image_url, w[4]?.banner?.link),
        bottomBanner: banner(
          w[4]?.bottom_banner?.image_url,
          w[4]?.bottom_banner?.link,
        ),
        cards: cards(w[4]?.items, 'lingerie-love', pick),
        desktopCardsPerRow: 6,
      }),
      section('shop-by-occasion', w[5]?.section_title, {
        cards: cards(w[5]?.items, 'shop-by-occasion', pick),
      }),
      section('complete-the-look', w[6]?.section_title, {
        cards: cards(w[6]?.items, 'complete-the-look', pick),
        desktopCardsPerRow: 6,
      }),
      shopByDepartmentSection(),
    ],
  };
}

function menFallback() {
  const m = menPageData;
  const pickDesktop = (i) => [i.desktop_image, i.url];
  const pick = (i) => [i.image_url, i.link];
  return {
    hero: heroFromJson(menHeroData),
    sections: [
      section('featured-brands', m[0]?.section_title, {
        cards: cards(m[0]?.items, 'featured-brand', pickDesktop),
        desktopCardsPerRow: 6,
      }),
      section('top-brands', m[1]?.section_title, {
        cards: cards(m[1]?.items, 'top-brand', pickDesktop),
        desktopCardsPerRow: 6,
        mobileView: 'gallery',
      }),
      section('season-crossover', m[2]?.section_title, {
        banner: banner(
          m[2]?.items?.[0]?.desktop_image,
          m[2]?.items?.[0]?.url,
          'Season Crossover Banner',
          m[2]?.items?.[0]?.mobile_image,
        ),
        cards: cards(m[3]?.items, 'season-crossover', (i) => [
          i.desktop_image?.includes('loading')
            ? i.mobile_image
            : i.desktop_image,
          i.url,
        ]),
      }),
      section('must-have-tshirts', m[4]?.section_title, {
        banner: banner(
          m[4]?.items?.[0]?.desktop_image,
          m[4]?.items?.[0]?.url,
          'Must Have T-Shirts Banner',
          m[4]?.items?.[0]?.mobile_image,
        ),
        cards: cards(m[5]?.items, 'must-have-tshirts', pick),
        desktopCardsPerRow: 6,
      }),
      section('buzzing-brands', m[6]?.section_title, {
        cards: cards(m[6]?.items, 'buzzing-brand', pick),
        desktopCardsPerRow: 6,
      }),
      section('shop-by-occasion', m[7]?.section_title, {
        cards: cards(m[7]?.items, 'shop-by-occasion', pick),
      }),
      section('complete-the-look', m[8]?.section_title, {
        cards: cards(m[8]?.items, 'complete-look', pick),
        desktopCardsPerRow: 6,
      }),
      section('the-bottom-line', m[9]?.section_title, {
        banner: banner(
          m[9]?.items?.[0]?.image_url,
          m[9]?.items?.[0]?.link,
          'The Bottom Line Banner',
        ),
        cards: cards(m[10]?.items, 'bottom-line', pick),
        desktopCardsPerRow: 6,
      }),
      shopByDepartmentSection(),
    ],
  };
}

function kidsFallback() {
  const s = kidsPageData.sections || [];
  const pickUrl = (i) => [i.image_url, i.link_url, i.alt_text];
  const pick = (i) => [i.image_url, i.link];
  const mainBanner = (x) =>
    banner(
      x?.main_banner?.image_url,
      x?.main_banner?.link_url,
      x?.main_banner?.alt_text,
    );
  return {
    hero: heroFromJson(kidsHeroData),
    sections: [
      section('fresh-arrival', s[0]?.title, {
        banner: mainBanner(s[0]),
        cards: cards(s[0]?.items, 'fresh-arrival', pickUrl),
      }),
      section('top-categories', s[1]?.title, {
        cards: cards(s[1]?.items, 'top-categories', pickUrl),
        desktopCardsPerRow: 6,
        mobileView: 'gallery',
        mobileCardsPerRow: 3,
      }),
      section('trends-highlight', s[2]?.title, {
        cards: cards(s[2]?.items, 'trends-highlight', pickUrl),
      }),
      section('character-shop', s[3]?.title, {
        banner: mainBanner(s[3]),
        cards: cards(s[3]?.items, 'character-shop', pickUrl),
        desktopCardsPerRow: 6,
      }),
      section('top-brands', s[4]?.section_title, {
        cards: cards(s[4]?.items, 'top-brands', pick),
        desktopCardsPerRow: 6,
        mobileView: 'gallery',
      }),
      section('shop-by-occasion', s[5]?.section_title, {
        cards: cards(s[5]?.items, 'shop-by-occasion', pick),
      }),
      section('complete-the-look', s[6]?.section_title, {
        cards: cards(s[6]?.items, 'complete-look', pick),
      }),
      section('babyshop-collection', s[7]?.section_title, {
        banner: banner(
          s[7]?.items?.[0]?.image_url,
          s[7]?.items?.[0]?.link,
          'Babyshop Collection Banner',
        ),
        cards: cards(s[8]?.items, 'babyshop', pick),
        desktopCardsPerRow: 6,
        mobileView: 'gallery',
      }),
      shopByDepartmentSection(),
    ],
  };
}

function footwearFallback() {
  const s = footwearPageData.sections || [];
  const pickUrl = (i) => [i.image_url, i.link_url, i.alt_text];
  const pick = (i) => [i.image_url, i.link];
  return {
    hero: heroFromJson(footwearHeroData),
    sections: [
      section('new-arrivals', s[0]?.title, {
        banner: banner(
          s[0]?.main_banner?.image_url,
          s[0]?.main_banner?.link_url,
          s[0]?.main_banner?.alt_text,
        ),
        cards: cards(s[0]?.items, 'new-arrivals', pickUrl),
      }),
      section('top-categories', s[1]?.title, {
        cards: cards(s[1]?.items, 'top-categories', pickUrl),
        desktopCardsPerRow: 6,
        mobileView: 'gallery',
        mobileCardsPerRow: 3,
      }),
      section('top-brands', s[2]?.title, {
        cards: cards(s[2]?.items, 'top-brands', pickUrl),
        desktopCardsPerRow: 6,
      }),
      section('trends-highlight', s[3]?.title, {
        cards: cards(s[3]?.items, 'trends-highlight', pickUrl),
        bottomBanner: banner(
          s[4]?.items?.[0]?.image_url,
          s[4]?.items?.[0]?.link,
          'Trends Highlight Banner',
        ),
      }),
      section('featured-brands', s[5]?.section_title, {
        cards: cards(s[5]?.items, 'featured-brands', pick),
        desktopCardsPerRow: 6,
        mobileView: 'gallery',
      }),
      section('price-point-store', s[6]?.section_title, {
        cards: cards(s[6]?.items, 'price-point', pick),
        desktopCardsPerRow: 6,
      }),
      section('shop-by-occasion', s[7]?.section_title, {
        cards: cards(s[7]?.items, 'shop-by-occasion', pick),
      }),
    ],
  };
}

function bagsFallback() {
  const s = bagsPageData.sections || [];
  const pick = (i) => [i.image, i.href, i.alt];
  const first = (x) => x?.items?.[0];
  return {
    hero: heroFromJson(bagsHeroData),
    sections: [
      section('new-arrivals', s[0]?.section_name, {
        banner: banner(first(s[0])?.image, first(s[0])?.href, first(s[0])?.alt),
        cards: cards(s[1]?.items, 'new-arrivals', pick),
        bottomBanner: banner(
          first(s[2])?.image,
          first(s[2])?.href,
          first(s[2])?.alt,
        ),
        desktopCardsPerRow: 5,
      }),
      section('top-categories', s[3]?.section_name, {
        cards: cards(s[3]?.items, 'top-categories', pick),
        desktopCardsPerRow: 6,
        mobileView: 'gallery',
        mobileCardsPerRow: 3,
      }),
      section('trends-highlight', s[4]?.section_name, {
        cards: cards(s[4]?.items, 'trends-highlight', pick),
        desktopView: 'gallery',
      }),
      section('top-brands', s[5]?.section_name, {
        cards: cards(s[5]?.items, 'top-brands', pick),
        desktopCardsPerRow: 6,
      }),
    ],
  };
}

function beautyFallback() {
  const byId = (id) => beautyPageData.sections.find((x) => x.section_id === id);
  const pick = (i) => [i.image_url, i.href, i.alt];
  const items = (id, key) => cards(byId(id)?.items, key, pick);
  const firstBanner = (id) => {
    const item = byId(id)?.items?.[0];
    return banner(item?.image_url, item?.href, item?.alt);
  };
  const rect = {cardShape: 'rectangle'};
  return {
    hero: heroFromJson(beautyHeroData),
    sections: [
      section('shop-by-price', 'Shop By Price', {
        ...rect,
        cards: items('Section3ASlot', 'shop-by-price'),
        desktopCardsPerRow: 6,
        mobileView: 'gallery',
        titlePosition: 'overlay',
      }),
      section('brand-of-the-month', '', {banner: firstBanner('Section3BSlot')}),
      section('season-essentials', 'Season Essentials', {
        ...rect,
        cards: items('Section3CSlot', 'season-essentials'),
        desktopCardsPerRow: 6,
        mobileCardsPerRow: 3,
        titlePosition: 'overlay',
      }),
      section('hottest-deals', 'Hottest Deals', {
        ...rect,
        cards: items('Section3ESlot', 'hottest-deals'),
        mobileView: 'gallery',
      }),
      section('travel-essentials', 'Travel Essentials', {
        ...rect,
        cards: items('Section3GSlot', 'travel-essentials'),
        desktopCardsPerRow: 6,
        desktopView: 'gallery',
        mobileView: 'gallery',
      }),
      section('global-beauty-trends', 'Global Beauty Trends', {
        ...rect,
        cards: items('Section3HSlot', 'global-beauty-trends').map(
          (card, index) => ({
            ...card,
            badge: index < 3 ? 'Trending' : null,
          }),
        ),
        desktopCardsPerRow: 5,
        mobileCardsPerRow: 3,
        titlePosition: 'overlay',
      }),
      section('lakme', 'Lakme', {
        ...rect,
        cards: items('Section3ISlot_Lakme', 'lakme'),
        desktopCardsPerRow: 5,
        mobileCardsPerRow: 3,
      }),
      section('note-worthy', 'Note Worthy', {
        ...rect,
        banner: firstBanner('Section3JSlot'),
        cards: items('Section3JSlot_Carousel', 'note-worthy'),
        desktopCardsPerRow: 6,
        mobileCardsPerRow: 3,
        titlePosition: 'overlay',
      }),
      section('maybelline', 'Maybelline', {
        ...rect,
        cards: items('Section3KSlot', 'maybelline'),
        desktopCardsPerRow: 5,
        mobileView: 'gallery',
      }),
      section('loreal', "L'Oreal", {
        ...rect,
        cards: items('Section3LSlot', 'loreal'),
        desktopCardsPerRow: 6,
        mobileView: 'gallery',
      }),
      section('more-brands-to-love', 'More Brands To Love', {
        cards: items('Section3QSlot', 'more-brands'),
        mobileCardsPerRow: 3,
        cardShape: 'circle',
      }),
    ],
  };
}

function homelivingFallback() {
  const byNumber = (n) =>
    homelivingPageData.sections.find((x) => x.section_number === n);
  const pick = (i) => [i.image?.src, i.link?.href, i.image?.alt];
  const items = (n, key) => cards(byNumber(n)?.items, key, pick);
  const firstBanner = (n) => {
    const item = byNumber(n)?.items?.[0];
    return banner(item?.image?.src, item?.link?.href, item?.image?.alt);
  };
  const bannerWithGrid = (key, title, bannerNumber, cardsNumber) =>
    section(key, title, {
      cardShape: 'rectangle',
      banner: firstBanner(bannerNumber),
      cards: items(cardsNumber, key),
      desktopView: 'gallery',
    });
  return {
    hero: heroFromJson(homelivingHeroData),
    sections: [
      section('gifting-ideas', '500+ Gifting Ideas', {
        cardShape: 'rectangle',
        cards: items(1, 'gifting'),
        desktopCardsPerRow: 3,
        mobileCardsPerRow: 3,
      }),
      bannerWithGrid('decor', 'Decor', 2, 3),
      bannerWithGrid('furnishing', 'Furnishing', 4, 5),
      bannerWithGrid('kitchenware', 'Kitchenware', 6, 7),
      bannerWithGrid('crockery', 'Crockery & Table Linen', 8, 9),
      bannerWithGrid('bath', 'Bath & Laundry', 10, 11),
    ],
  };
}

/** Babyshop JSON carries per-section layout config. */
const BABYSHOP_MOBILE_GALLERY = [
  'tee edit',
  'tiny tots',
  'bottom',
  'shop by brand',
];

function babyshopFallback() {
  return {
    hero: heroFromJson(babyshopHeroData),
    sections: babyshopPageData.sections
      .filter((s) => s.is_active !== false)
      .map((s) => {
        const heading = s.heading?.toLowerCase() || '';
        const position =
          s.banner_position === 'top' || s.banner_position === 'bottom'
            ? s.banner_position
            : 'none';
        return section(s.section_id, s.show_heading ? s.heading : '', {
          banner: s.banner_image
            ? banner(s.banner_image, s.banner_link, s.banner_alt)
            : null,
          bannerPosition: position,
          cards: cards(s.cards, s.section_id, (c) => [
            c.image,
            c.link,
            c.image_alt,
          ]),
          desktopCardsPerRow: s.desktop_cards_to_show || 4,
          desktopView: s.desktop_view === 'slider' ? 'slider' : 'gallery',
          mobileView: BABYSHOP_MOBILE_GALLERY.some((t) => heading.includes(t))
            ? 'gallery'
            : s.mobile_view === 'slider'
              ? 'slider'
              : 'gallery',
          cardShape: s.section_id.includes('shop_by_brand')
            ? 'circle'
            : 'rectangle',
        });
      }),
  };
}

/* -------------------------------------------------------------------------- */
/* Landmark link translation (JSON fallback only)                             */
/* -------------------------------------------------------------------------- */

/**
 * Landmark category slug -> local destination, as a `filter` value (see
 * applyCardFilter). The longest matching prefix wins, so
 * "beauty-skincare-facewash" uses its own entry and "beauty-skincare-serum"
 * falls back to "beauty-skincare".
 */
const LANDMARK_CATEGORIES = {
  // women / men / kids / footwear
  women: 'collection=women',
  'women-tops': 'collection=tops-tunics',
  'women-ethnicwear': 'collection=ethnic-fusion-wear',
  'women-ethnicwear-kurtasandkurtis': 'collection=kurtas-kurtis',
  'women-ethnicwear-salwarsuits': 'collection=kurta-sets',
  'women-dressesandjumpsuits': 'collection=women-dresses-jumpsuits',
  'women-bottoms': 'collection=bottomwear',
  'women-bottoms-jeansandjeggings': 'collection=women-jeans',
  'women-lingerie': 'collection=lingerie-sleepwear',
  'women-sportswear': 'collection=activewear',
  'women-plussize': 'collection=plus-size',
  'women-beauty-fragrance': 'collection=fragrances',
  men: 'collection=men',
  'men-winterwear': 'collection=winterwear',
  'men-winterwear-jackets': 'collection=jackets',
  'men-tops-tshirts': 'collection=t-shirts',
  'men-tops-polos': 'collection=tees-polos',
  'men-tops-casualshirts': 'collection=casual-shirts',
  'men-bottoms-trackpants': 'collection=trackpants',
  'men-sportswear': 'collection=activewear',
  kids: 'collection=kids',
  'kids-girlsclothing': 'collection=girls',
  'kids-girlsclothing-dressesandjumpsuits':
    'collection=girls-dresses-jumpsuits',
  'kids-boysclothing': 'collection=boys',
  'kids-addons-watches': 'collection=watches',
  'kids-addons-sunglasses': 'collection=sunglasses',
  footwear: 'collection=footwear',
  'footwear-women': 'collection=women-footwear',
  'footwear-women-flipflops': 'collection=women-footwear, type=Flip-Flops',
  'footwear-men': 'collection=men-footwear',
  'footwear-boys': 'collection=shop-boys-footwear',
  'footwear-girls': 'collection=shop-girls-footwear',
  // bags
  bags: 'collection=bags',
  'bags-women': 'collection=women-bags',
  'bags-women-handbags': 'collection=handbags',
  'bags-women-backpack': 'collection=backpack',
  'bags-women-slings': 'collection=slings-cluthes',
  'bags-women-clutches': 'collection=slings-cluthes',
  'bags-men-wallets': 'collection=wallets',
  // beauty
  beauty: 'collection=beauty',
  'beauty-lips': 'collection=lips',
  'beauty-eyes': 'collection=eyes',
  'beauty-face': 'collection=face',
  'beauty-nails': 'collection=nail-polish',
  'beauty-skincare': 'collection=skin-care',
  'beauty-skincare-facewash': 'collection=face-wash',
  'beauty-bathandbody': 'collection=bath-body',
  'beauty-fragrance': 'collection=fragrances',
  // home & living
  decor: 'collection=decor',
  'decor-lighting': 'collection=lighting',
  'decor-garden': 'collection=garden',
  'decor-homeaccessories': 'collection=home-accessories',
  furnishing: 'collection=furnishing',
  'furnishing-bedding': 'collection=beddings',
  kitchen: 'collection=kitchen',
  'kitchen-storageandcontainers': 'collection=storage-and-containers',
  'kitchen-cooking': 'collection=cooking',
  'kitchen-kitchenware': 'collection=kitchenware',
  dining: 'collection=tableware',
  'dining-serving': 'collection=serving',
  bathandlaundry: 'collection=bath-laundry',
  'bathandlaundry-laundry': 'collection=laundry',
  // babyshop
  babyshop: 'collection=babyshop',
  babyessentials: 'collection=babyshop',
  'babyessentials-diapering': 'collection=diapering',
  'babyessentials-bathandsafety': 'collection=bath-safety',
  lsbabyessentials: 'collection=babyshop',
  'lsbabyessentials-diapering': 'collection=diapering',
  'lsbabyessentials-feeding': 'collection=feeding',
  'lsbabyessentials-feeding-bottles': 'collection=feeding-bottles',
  'lsbabyessentials-bathandsafety': 'collection=bath-safety',
  travelandbedroom: 'collection=travel-gear',
  lstravelandbedroom: 'collection=travel-gear',
  'lstravelandbedroom-travelgear-strollersandprams':
    'collection=strollers-and-prams',
  'lstravelandbedroom-travelgear-babycarriers': 'collection=baby-carriers',
  'lstravelandbedroom-beddingandblankets': 'collection=bedding-blankets',
  lstoysandschool: 'collection=toys',
  'lstoysandschool-toys-blockspuzzlesandboardgames':
    'collection=blocks-puzzles-and-board-games',
  'lstoysandschool-toys-books': 'collection=books',
  'lsgirlsclothing-babygirls': 'collection=baby-girls-0-4-years',
  'lsboysclothing-babyboys': 'collection=baby-boys-0-4-years',
  lsgirlsclothing: 'collection=girls',
  lsboysclothing: 'collection=boys',
  girlsclothing: 'collection=girls',
  boysclothing: 'collection=boys',
};

const categoryFilter = (slug) => {
  const key = Object.keys(LANDMARK_CATEGORIES)
    .filter((k) => slug === k || slug.startsWith(`${k}-`))
    .sort((a, b) => b.length - a.length)[0];
  return key ? LANDMARK_CATEGORIES[key] : '';
};

/** Landmark facet keys in the `q` string -> local filter keys. */
const LANDMARK_FACETS = [
  [/^manufacturerName(_uFilter|\.en)$/, 'brand', (v) => v.toUpperCase()],
  [/^type(_uFilter|\.en)$/, 'type'],
  [/^fit(_uFilter|\.en)$/, 'fit'],
  [/^fabric(_uFilter|\.en)$/, 'fabric'],
  [/^sleeveLength(_uFilter|\.en)$/, 'sleeve_length'],
  [/^gender(_uFilter|\.en)$/, 'gender'],
];

/**
 * Translate a link from the Landmark site (`/in/en/c/<category>?q=...`,
 * `/in/en/search?q=...`, or the same on www.lifestylestores.com) into a
 * local page. Anything that can't be mapped goes to the department's own
 * collection, so a card never leads to a 404.
 * Links that are already local (/collections, /department, ...) are kept.
 * @param {string} link
 * @param {string} departmentCollection e.g. "beauty"
 */
function localizeLandmarkLink(link, departmentCollection) {
  if (!link) return link;
  let path = link.replace(/^https?:\/\/(www\.)?lifestylestores\.com/i, '');
  if (!path.startsWith('/in/en/')) return path;

  try {
    path = decodeURIComponent(path.replace(/\+/g, ' '));
  } catch {
    // keep the raw path
  }
  const [pathname, query = ''] = path.split('?');
  const q =
    (query.match(/(?:^|&)q=(.*?)(?=&(?:price|range|discount|text|sort)=|$)/) ||
      [])[1] || '';
  const price = (query.match(/(?:^|&)price=(\d+),(\d+)/) || []).slice(1);

  // Category: the path (/c/beauty-lips) unless it is only a department root
  // and the query names a narrower one (/c/women?q=:allCategories:women-tops).
  const pathSlug = (pathname.match(/\/c\/([^/]+)/) || [])[1] || '';
  const qSlug = (q.match(/allCategories:([^:]+)/) || [])[1] || '';
  const pathIsRoot = !pathSlug.includes('-');
  const slug = (
    qSlug && (!pathSlug || pathIsRoot) ? qSlug : pathSlug
  ).toLowerCase();

  // Free-text search: "/in/en/search?q=hya matte:allCategories:beauty"
  const term =
    pathname.endsWith('/search') && !/^[:*]/.test(q)
      ? q.split(':')[0].trim()
      : '';
  const termCategory =
    term && !term.includes(' ') ? categoryFilter(term.toLowerCase()) : '';
  if (term && !termCategory) return applyCardFilter('', `search=${term}`);

  const parts = [
    termCategory ||
      (slug && categoryFilter(slug)) ||
      `collection=${departmentCollection}`,
  ];

  const tokens = q.split(':');
  for (let i = 0; i < tokens.length - 1; i++) {
    const value = tokens[i + 1]?.trim().replace(/%+$/, '');
    if (!value) continue;
    for (const [pattern, key, format = (v) => v] of LANDMARK_FACETS) {
      if (pattern.test(tokens[i])) parts.push(`${key}=${format(value)}`);
    }
    if (
      tokens[i] === 'badgeVisibleTitle_uFilter' &&
      /^(new|fresh)$/i.test(value)
    ) {
      parts.push('sort=new-arrivals');
    }
  }
  if (price.length === 2) parts.push(`price=${price[0]}-${price[1]}`);

  return applyCardFilter('', [...new Set(parts)].join(', '));
}

/** Rewrite every link in a JSON fallback (hero + sections) to a local page. */
function localizeFallbackLinks(data, departmentCollection) {
  const fix = (item) =>
    item && item.link !== undefined
      ? {...item, link: localizeLandmarkLink(item.link, departmentCollection)}
      : item;
  return {
    hero: {
      slides: data.hero.slides.map(fix),
      banners: data.hero.banners.map(fix),
      categories: data.hero.categories.map(fix),
    },
    sections: data.sections.map((section) => ({
      ...section,
      banner: fix(section.banner),
      bottomBanner: fix(section.bottomBanner),
      cards: section.cards.map(fix),
    })),
  };
}
