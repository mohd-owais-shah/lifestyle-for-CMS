/**
 * Shared SEO meta builder. Every route's `meta` export goes through
 * `seoMeta()` so all pages emit the same tag set as the live Lifestyle
 * site: title, description, keywords, robots, canonical, Open Graph,
 * Twitter card and optional JSON-LD.
 */
import {departmentPath} from '~/lib/urlUtils';

export const SITE_NAME = 'Lifestyle Stores';

export const DEFAULT_TITLE =
  'Online Shopping for Men, Women & Kids in India | Lifestyle Stores';

export const DEFAULT_DESCRIPTION =
  'Online Shopping India - Online Shopping Site for Men, Women, and Kids. Buy Apparel, Footwear, Bags, Fashion Accessories and more on Lifestyle Stores ✔ Easy Returns';

const TWITTER_HANDLE = 'Lifestyle_Store';

/** Static pages that are not Shopify resources — used by the sitemap too. */
export const DEPARTMENT_SEO = {
  women: {
    title: "Women's Clothing - Women Fashion Online in India | Lifestyle Stores",
    description:
      "Online Shopping for Women - Shop for Women's Wear, Fashion & Accessories Online at the best prices on Lifestyle Stores. Available from popular brands ✔ Easy Return ✔ COD",
    keywords: "womenswear, women's wear, womens wear",
  },
  men: {
    title: "Men's Wear - Buy Men's Fashion Online in India | Lifestyle Stores",
    description:
      "Explore Branded Clothes for Men Online on Lifestyle Stores. Discover our latest collection of Men's Clothing with great offers & discounts ✔ COD ✔ Easy Returns",
    keywords: "menswear, men's wear, mens wear",
  },
  kids: {
    title: 'Kids Wear - Buy Kids Clothes Online in India | Lifestyle Stores',
    description:
      'Kids Wear - Kids Clothes Online Shopping in India at the best prices. Choose from the latest collection of Kids Wear Online on Lifestyle Stores ✔ COD ✔ Easy Returns',
    keywords: 'kids wear, kids clothes, kidswear online',
  },
  footwear: {
    title:
      'Footwear - Buy Shoes, Sandals & Sneakers Online in India | Lifestyle Stores',
    description:
      'Shop Footwear Online for Men, Women & Kids - Buy branded Shoes, Sneakers, Sandals, Heels & Flip Flops at the best prices on Lifestyle Stores ✔ COD ✔ Easy Returns',
    keywords: 'footwear, shoes, sneakers, sandals, heels, flip flops',
  },
  bags: {
    title:
      'Bags - Buy Handbags, Backpacks & Wallets Online in India | Lifestyle Stores',
    description:
      'Shop Bags Online - Buy branded Handbags, Backpacks, Wallets, Clutches & Travel Bags at the best prices on Lifestyle Stores ✔ COD ✔ Easy Returns',
    keywords: 'bags, handbags, backpacks, wallets, clutches, travel bags',
  },
  beauty: {
    title: 'Shop for Latest Beauty Products Online in India | Lifestyle Stores',
    description:
      'Beauty Products - Buy the latest Beauty Products Online in India. Select from a wide range of Branded Cosmetic & Beauty Products on Lifestyle stores ✔ COD ✔ Easy Returns',
    keywords: 'beauty products, cosmetics, makeup, skincare, fragrances',
  },
  homeliving: {
    title:
      'Home & Living - Buy Home Decor & Furnishings Online in India | Lifestyle Stores',
    description:
      'Shop Home & Living Online - Buy Home Decor, Bed & Bath Linen, Kitchen & Dining essentials at the best prices on Lifestyle Stores ✔ COD ✔ Easy Returns',
    keywords: 'home decor, home furnishings, bed linen, bath, kitchen, dining',
  },
  babyshop: {
    title:
      'Babyshop Kids Clothing - Babyshop Kids Fashion Online in India | Lifestyle Stores',
    description:
      'Online Shopping for Kids Babyshop - Shop for Kids Wear, Toys & Accessories Online from Babyshop at the best prices on Lifestyle Stores. Available from popular brands ✔ Easy Return ✔ COD',
    keywords:
      'Fashion for Kids, Girls Apparel, Boys Apparel, Infant wear, Toys shopping online, Kidswear online, Babyshop',
  },
};

/** Public, indexable static routes (not Shopify resources) for the sitemap. */
export const STATIC_SITEMAP_PATHS = [
  '/',
  ...Object.keys(DEPARTMENT_SEO).map((d) => departmentPath(d)),
  '/sis/genz',
  '/sis/watches',
  '/sis/luxe',
  '/store-locator',
];

/** @param {Array<any> | undefined} matches */
function getRootData(matches) {
  const root = matches?.find((m) => m?.id === 'root');
  return root?.loaderData ?? root?.data;
}

/**
 * Site origin as resolved by the root loader (`siteUrl`), falling back to
 * a relative URL when the root data is not available (error boundaries).
 * @param {Array<any> | undefined} matches
 */
function getOrigin(matches) {
  return getRootData(matches)?.siteUrl || '';
}

/** Shop brand logo from Shopify admin, used as the default share image. */
function getBrandLogo(matches) {
  return getRootData(matches)?.header?.shop?.brand?.logo?.image?.url || null;
}

/** Trim to a search-snippet-friendly length without cutting mid-word. */
export function truncate(text, max = 220) {
  const clean = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

/**
 * @param {{
 *   title?: string;
 *   description?: string;
 *   keywords?: string;
 *   image?: string | null;
 *   type?: string;
 *   noindex?: boolean;
 *   path?: string;
 *   location?: {pathname: string};
 *   matches?: Array<any>;
 *   jsonLd?: object | object[];
 * }} options
 */
export function seoMeta({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords,
  image,
  type = 'website',
  noindex = false,
  path,
  location,
  matches,
  jsonLd,
} = {}) {
  const origin = getOrigin(matches);
  const pathname = path ?? location?.pathname ?? '/';
  const canonical = `${origin}${pathname === '/' ? '' : pathname}` || '/';
  const desc = truncate(description);
  const ogImage = image || getBrandLogo(matches);

  const tags = [
    {title},
    {name: 'description', content: desc},
    {
      name: 'robots',
      content: noindex ? 'noindex,nofollow' : 'index,follow',
    },
    {property: 'og:site_name', content: SITE_NAME},
    {property: 'og:type', content: type},
    {property: 'og:title', content: title},
    {property: 'og:description', content: desc},
    {property: 'og:url', content: canonical},
    {property: 'og:locale', content: 'en_IN'},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:site', content: TWITTER_HANDLE},
    {name: 'twitter:creator', content: TWITTER_HANDLE},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: desc},
  ];

  if (ogImage) {
    tags.push(
      {property: 'og:image', content: ogImage},
      {name: 'twitter:image', content: ogImage},
    );
  }

  // Canonical only for indexable pages (a 404/noindex URL is not canonical)
  if (!noindex) {
    tags.push({tagName: 'link', rel: 'canonical', href: canonical, hrefLang: 'en-in'});
  }

  if (keywords) tags.push({name: 'keywords', content: keywords});

  const ldList = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  for (const ld of ldList) tags.push({'script:ld+json': ld});

  return tags;
}

/** Organization + WebSite (with sitelinks search box) for the home page. */
export function homeJsonLd(origin, logo) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: origin || undefined,
      logo: logo || undefined,
      sameAs: [
        'https://www.facebook.com/lifestylestores',
        'https://www.instagram.com/lifestylestores',
        'https://twitter.com/Lifestyle_Store',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: origin || undefined,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${origin}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ];
}

/** Breadcrumb JSON-LD from [{name, path}] items. */
export function breadcrumbJsonLd(origin, items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${origin}${item.path}`,
    })),
  };
}

/** Root-data accessors for routes that build JSON-LD themselves. */
export function originFromMatches(matches) {
  return getOrigin(matches);
}

export function brandLogoFromMatches(matches) {
  return getBrandLogo(matches);
}

/**
 * Public origin for canonical URLs, sitemaps and robots.txt. Set
 * PUBLIC_STOREFRONT_URL (e.g. https://www.example.com) in production so
 * Oxygen preview/default domains don't become canonical or get indexed as
 * duplicates; falls back to the request origin when unset.
 * @param {Request} request
 * @param {{PUBLIC_STOREFRONT_URL?: string}} [env]
 */
export function getPublicOrigin(request, env) {
  const configured = String(env?.PUBLIC_STOREFRONT_URL || '').trim();
  if (/^https?:\/\/[^/]+/i.test(configured)) {
    return new URL(configured).origin;
  }
  return new URL(request.url).origin;
}

/**
 * Same request, re-addressed to the public origin (for Hydrogen sitemap
 * helpers that derive their base URL from the request).
 * @param {Request} request
 * @param {{PUBLIC_STOREFRONT_URL?: string}} [env]
 */
export function withPublicOrigin(request, env) {
  const url = new URL(request.url);
  const origin = getPublicOrigin(request, env);
  if (origin === url.origin) return request;
  return new Request(`${origin}${url.pathname}${url.search}`, request);
}
