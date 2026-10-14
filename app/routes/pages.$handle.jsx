import {redirect, useLoaderData} from 'react-router';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import locatorStyles from '~/styles/store-locator.css?url';
import {
  AboutUsView,
  StoreLocatorView,
  EdgeMembershipView,
  ContactUsView,
  ShippingView,
  ReturnsView,
  FaqView,
  WriteToUsView,
} from '~/components/Pages';
import {seoMeta} from '~/lib/seo';

export const links = () => [
  {rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'},
  {rel: 'stylesheet', href: locatorStyles},
];

const CUSTOM_HANDLES = {
  'about-us': {
    title: 'About Us | Lifestyle Stores',
    defaultTitle: 'About Us',
  },
  about: {
    title: 'About Us | Lifestyle Stores',
    defaultTitle: 'About Us',
  },
  'store-locator': {
    title: 'Store Locator | Lifestyle Stores',
    defaultTitle: 'Store Locator',
  },
  storelocator: {
    title: 'Store Locator | Lifestyle Stores',
    defaultTitle: 'Store Locator',
  },
  'edge-membership': {
    title: 'Lifestyle Edge Program | Lifestyle Stores',
    defaultTitle: 'Lifestyle Edge Program',
  },
  'lifestyle-edge-2': {
    title: 'Lifestyle Edge Program | Lifestyle Stores',
    defaultTitle: 'Lifestyle Edge Program',
  },
  'lifestyle-edge': {
    title: 'Lifestyle Edge Program | Lifestyle Stores',
    defaultTitle: 'Lifestyle Edge Program',
  },
  contact: {
    title: 'Contact us | Lifestyle Stores',
    defaultTitle: 'Contact us',
  },
  'contact-us': {
    title: 'Contact us | Lifestyle Stores',
    defaultTitle: 'Contact us',
  },
  'write-to-us': {
    title: 'Write to us | Lifestyle Stores',
    defaultTitle: 'Write to us',
  },
  writetous: {
    title: 'Write to us | Lifestyle Stores',
    defaultTitle: 'Write to us',
  },
  shipping: {
    title: 'Shipping | Lifestyle Stores',
    defaultTitle: 'Shipping',
  },
  helpshipping: {
    title: 'Shipping | Lifestyle Stores',
    defaultTitle: 'Shipping',
  },
  returns: {
    title: 'Returns | Lifestyle Stores',
    defaultTitle: 'Returns',
  },
  return: {
    title: 'Returns | Lifestyle Stores',
    defaultTitle: 'Returns',
  },
  faq: {
    title: 'FAQs | Lifestyle Stores',
    defaultTitle: 'Frequently Asked Questions',
  },
};

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data, location, matches}) => {
  const normHandle = data?.page?.handle?.toLowerCase();
  const customConfig = normHandle ? CUSTOM_HANDLES[normHandle] : null;
  const pageTitle =
    data?.page?.seo?.title ||
    customConfig?.title ||
    (data?.page?.title
      ? `${data.page.title} | Lifestyle Stores`
      : 'Lifestyle Stores');
  const bodyText = String(data?.page?.body || '').replace(/<[^>]*>/g, ' ');
  return seoMeta({
    title: pageTitle,
    description: data?.page?.seo?.description || bodyText || undefined,
    location,
    matches,
  });
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const normHandle = (args.params.handle || '').toLowerCase();
  if (normHandle === 'write-to-us' || normHandle === 'writetous') {
    return redirect('/pages/contact?view=write-to-us', 302);
  }
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request, params}) {
  const handle = params.handle;
  if (!handle) {
    throw new Error('Missing page handle');
  }

  const normHandle = handle.toLowerCase();

  let pageData = null;
  try {
    const result = await context.storefront.query(PAGE_QUERY, {
      variables: {handle},
    });
    pageData = result?.page;
  } catch (err) {
    console.error('Error fetching storefront page:', err);
  }

  // If page not found in Shopify but is one of our custom pages, provide custom mock
  if (!pageData) {
    if (CUSTOM_HANDLES[normHandle]) {
      pageData = {
        id: `custom-page-${normHandle}`,
        handle: normHandle,
        title: CUSTOM_HANDLES[normHandle].defaultTitle,
        body: '',
        seo: {
          title: CUSTOM_HANDLES[normHandle].title,
          description: `Lifestyle Stores - ${CUSTOM_HANDLES[normHandle].defaultTitle}`,
        },
      };
    } else {
      throw new Response('Not Found', {status: 404});
    }
  } else {
    redirectIfHandleIsLocalized(request, {handle, data: pageData});
  }

  const metafieldsMap = {};
  if (pageData?.metafields) {
    for (const m of pageData.metafields) {
      if (m?.key) {
        metafieldsMap[m.key] = m;
      }
    }
  }

  let metaobjectData = null;
  if (metafieldsMap['subtitle'] || metafieldsMap['banner_desktop']) {
    metaobjectData = {
      title: pageData.title,
      subtitle: metafieldsMap['subtitle']?.value,
      bannerDesktop:
        metafieldsMap['banner_desktop']?.reference?.image?.url ||
        metafieldsMap['banner_desktop']?.value,
      bannerMobile:
        metafieldsMap['banner_mobile']?.reference?.image?.url ||
        metafieldsMap['banner_mobile']?.value,
      paragraphs: metafieldsMap['description']?.value
        ? metafieldsMap['description'].value.split('\n\n').filter(Boolean)
        : null,
    };
  }

  return {
    page: {
      ...pageData,
      metaobjectData,
    },
  };
}

function loadDeferredData() {
  return {};
}

export default function Page() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  const page = data?.page;
  const handleKey = (page?.handle || '').toLowerCase();

  switch (handleKey) {
    case 'about-us':
    case 'about':
      return <AboutUsView page={page} data={page?.metaobjectData} />;
    case 'store-locator':
    case 'storelocator':
      return <StoreLocatorView data={page?.metaobjectData} />;
    case 'edge-membership':
    case 'lifestyle-edge-2':
    case 'lifestyle-edge':
      return <EdgeMembershipView page={page} data={page?.metaobjectData} />;
    case 'contact':
    case 'contact-us':
      return <ContactUsView />;
    case 'write-to-us':
    case 'writetous':
      return <WriteToUsView />;
    case 'shipping':
    case 'helpshipping':
      return <ShippingView page={page} />;
    case 'returns':
    case 'return':
      return <ReturnsView />;
    case 'faq':
      return <FaqView />;
    default:
      return (
        <div className="w-full bg-white min-h-[60vh ] py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold font-sans text-gray-900 mb-6 border-b border-gray-100 pb-4">
              {page.title}
            </h1>
            <div
              className="prose prose-sm sm:prose max-w-none text-gray-700 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{__html: page.body}}
            />
          </div>
        </div>
      );
  }
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
      metafields(identifiers: [
        {namespace: "custom", key: "subtitle"},
        {namespace: "custom", key: "banner_desktop"},
        {namespace: "custom", key: "banner_mobile"},
        {namespace: "custom", key: "rates_table"},
        {namespace: "custom", key: "faqs"},
        {namespace: "custom", key: "benefits_list"},
        {namespace: "custom", key: "terms_content"}
      ]) {
        key
        namespace
        value
        type
        reference {
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

/** @typedef {import('./+types/pages.$handle').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
