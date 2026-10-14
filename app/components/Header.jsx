import {Suspense, useState, useEffect, useMemo} from 'react';
import {DeliveryLocationPicker} from '~/components/DeliveryLocationPicker';
import {
  useDeliveryLocation,
  openDeliveryLocationPicker,
} from '~/lib/deliveryLocation';
import {shopifyImageUrl} from '~/lib/shopifyImage';
import {
  Await,
  Link,
  NavLink,
  useAsyncValue,
  useLocation,
  useNavigate,
  useFetcher,
} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import {AnnouncementBar} from '~/components/AnnouncementBar';
import {
  MobileHeroCategories,
  getDepartmentLinks,
} from '~/components/HomePage/MobileHeroCategories';
import {CustomerAuthModal} from '~/components/CustomerAuthModal';
import menuImages from '~/data/menuImages.json';
import {SignOutButton} from '~/components/PendingIndicator';

const POPULAR_SEARCHES = [
  'Melange Kurta Set Women',
  'watch',
  'tops for women',
  'dresses for women',
  'kurta sets for women',
  'Melange kurtas',
  'CODE Tops for Women',
  'Shirts for men',
  'melange',
  'CODE Dresses for Women',
];

const ROUTE_MAPPING = {
  Women: '/departments/women_department',
  Men: '/departments/men_department',
  Kids: '/departments/kids_department',
  Footwear: '/departments/footwear_department',
  Bags: '/departments/bags_department',
  Beauty: '/departments/beauty_department',
  'Home & Living': '/departments/homeliving_department',
  Babyshop: '/departments/babyshop_department',
  'Gen Z': '/sis/genz',
  Watches: '/sis/watches',
  Luxe: '/sis/luxe',
  LUXE: '/sis/luxe',
};

// Signed-in account dropdown items. Every entry maps to an existing account
// route; the Sign Out action below still posts to the existing logout route.
const ACCOUNT_MENU_ITEMS = [
  {label: 'My Account', to: '/account'},
  {label: 'Favourites', to: '/account/favourites'},
  {label: 'Order History', to: '/account/orders'},
  {label: 'My Addresses', to: '/account/addresses'},
  {label: 'Payment', to: '/account/payment', hidden: true},
  {label: 'My Credit', to: '/account/credit', hidden: true},
  {label: 'Communication', to: '/account/preferences'},
  {label: 'Reviews', to: '/account/reviews'},
  {label: 'Click & Collect', to: '/account/click-collect', hidden: true},
  {label: 'Landmark Rewards', to: '/account/rewards', hidden: true},
];

/**
 * @param {HeaderProps}
 */
export function Header({
  header,
  isLoggedIn,
  customer,
  cart,
  publicStoreDomain,
}) {
  const {shop, menu, topBar} = header;
  const departmentLinks = useMemo(
    () => getDepartmentLinks(header.mobileHeroCategories),
    [header.mobileHeroCategories],
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();
  const isPdp = location?.pathname?.startsWith('/products/');
  const isPlp =
    location?.pathname?.startsWith('/collections/') ||
    /^\/departments?\//.test(location?.pathname || '') ||
    location?.pathname?.startsWith('/sis/') ||
    location?.pathname?.startsWith('/search');
  const isContactPage =
    location?.pathname?.includes('/contact') ||
    location?.pathname?.includes('/write-to-us');
  const isCartPage = location?.pathname?.startsWith('/cart');
  const isAccountPage = location?.pathname?.startsWith('/account');

  const announcements =
    header?.announcementBarMetaobjects?.nodes?.length > 0
      ? header.announcementBarMetaobjects.nodes
      : header?.announcementBarMetaobject
        ? [header.announcementBarMetaobject]
        : [];

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 100) {
            setIsScrolled(true);
          } else if (window.scrollY < 40) {
            setIsScrolled(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOpenAuth = () => setIsAuthModalOpen(true);
    window.addEventListener('lifestyle:open-auth-modal', handleOpenAuth);
    return () =>
      window.removeEventListener('lifestyle:open-auth-modal', handleOpenAuth);
  }, []);

  return (
    <>
      <TopBar topBar={topBar} />
      <div className={`bg-white sticky top-0 border-b border-gray-200 z-50 w-full transition-all duration-300 ${isCartPage ? 'hidden lg:block' : ''}`}>
        <MainHeader
          cart={cart}
          isScrolled={isScrolled}
          metaobject={header.mainHeaderMetaobject}
          setIsMobileSearchOpen={setIsMobileSearchOpen}
          isLoggedIn={isLoggedIn}
          customer={customer}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
        <div className="page-width hidden lg:block pt-2">
          <HeaderMenu
            menu={menu}
            viewport="desktop"
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
            isScrolled={isScrolled}
            hideMenuImages={isPdp || isPlp || isCartPage || isAccountPage}
            departmentLinks={departmentLinks}
          />
        </div>
      </div>
      {!isCartPage && (
        <MobileSubHeader
          isSearchOpen={isMobileSearchOpen}
          setIsSearchOpen={setIsMobileSearchOpen}
          hideLocation={isAccountPage}
        />
      )}

      {/* Mobile Hero Categories - only on homepage, not on PDP/PLP/Contact/Cart/Account */}
      {!(isPdp || isPlp || isContactPage || isCartPage || isAccountPage) &&
        header.mobileHeroCategories && (
          <MobileHeroCategories data={header.mobileHeroCategories} />
        )}

      {!(isPdp || isPlp || isContactPage || isCartPage || isAccountPage) && (
        <AnnouncementBar announcements={announcements} />
      )}

      {location?.pathname === '/' && !isLoggedIn && (
        <MobileLoginPrompt onLogin={() => setIsAuthModalOpen(true)} />
      )}

      <CustomerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 *   publicStoreDomain: HeaderProps['publicStoreDomain'];
 * }}
 */

// Helper to extract text from simple string or rich text JSON
function getFieldValue(fields, keys) {
  if (!fields) return '';
  for (const key of keys) {
    const field = fields.find((f) => f.key.toLowerCase() === key.toLowerCase());
    if (field?.value) return field.value;
  }
  return '';
}

/**
 * Live-site mobile home prompt: "For a richer experience [Login] ×".
 * Dismissal is remembered for the browser session.
 */
function MobileLoginPrompt({onLogin}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(sessionStorage.getItem('lifestyle_login_prompt') !== 'hidden');
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem('lifestyle_login_prompt', 'hidden');
    } catch {
      // ignore
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#5C5C5C] text-white flex items-center justify-between gap-3 px-4 py-2.5 pb-[max(10px,env(safe-area-inset-bottom))]">
      <span className="text-[15px] font-semibold">For a richer experience</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onLogin}
          className="bg-[#FAA619] text-white text-[14px] font-semibold px-6 py-1.5 rounded-[2px] cursor-pointer"
        >
          Login
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="text-white cursor-pointer p-1"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const TopBar = ({topBar}) => {
  const {location} = useDeliveryLocation();
  const hasPincode = Boolean(location?.pincode);

  const leftSideField = topBar?.fields?.find(
    (f) => f.key === 'top_bar_link_left_side',
  );
  const rightSideField = topBar?.fields?.find(
    (f) => f.key === 'top_bar_link_right_side',
  );

  const parseRichText = (str) => {
    if (!str) return '';
    try {
      const parsed = JSON.parse(str);
      // Basic extraction of text from Shopify Rich Text JSON
      if (parsed.children) {
        return parsed.children
          .map((p) => {
            if (p.children) {
              return p.children
                .map((c) => {
                  if (c.type === 'link') {
                    const url = c.url || '#';
                    const text =
                      c.children?.map((cc) => cc.value).join('') || '';
                    return `<a href="${url}" class="underline hover:text-black">${text}</a>`;
                  }
                  return c.value || '';
                })
                .join('');
            }
            return '';
          })
          .join('<br/>');
      }
      return str;
    } catch {
      return str;
    }
  };

  const parseLink = (node) => {
    const fields = node.fields || [];
    return {
      text: getFieldValue(fields, ['text']) || '',
      url: getFieldValue(fields, ['url']) || '#',
      iconUrl:
        fields.find((f) => f.key === 'icon')?.reference?.image?.url || '',
      hoverText: parseRichText(getFieldValue(fields, ['hover_text'])),
    };
  };

  let leftSideLinks = leftSideField?.references?.nodes?.map(parseLink) || [];
  let rightSideLinks = rightSideField?.references?.nodes?.map(parseLink) || [];

  const defaultLeft = [
    {
      text: 'Free Shipping',
      iconUrl:
        'https://media-uk-india-banners.landmarkshops.in/LS-Fest/LS-new/LS-Shipping-icon-D-26JUNE23.png',
      hoverText: 'On All Orders',
    },
    {
      text: 'Click & Collect',
      iconUrl:
        'https://media-uk-india-banners.landmarkshops.in/LS-Fest/LS-new/LS-CNC-icon-D-26JUNE23.png',
      hoverText:
        'Order Online And Collect at a Store Of Your Choice For Free. <a href="#" class="underline hover:text-black">Learn more</a>',
    },
    {
      text: 'Return To Store',
      iconUrl:
        'https://media-uk-india-banners.landmarkshops.in/LS-Fest/LS-new/LS-RTS-icon-D-26JUNE23.png',
      hoverText: 'Return to your nearest Store.',
    },
  ];

  const defaultRight = [
    {text: 'Delivering To', iconUrl: 'svg_delivering'},
    {text: 'Download Our Apps', url: '#'},
    {text: 'Store Locator', url: '/pages/store-locator'},
    {text: 'Help', url: 'https://helpin.lifestylestores.com/support/home'},
  ];

  if (leftSideLinks.length === 0) {
    leftSideLinks = defaultLeft;
  }

  if (rightSideLinks.length === 0) {
    rightSideLinks = defaultRight;
  }

  return (
    <div className="bg-black hidden lg:block py-[9px]">
      <div className="page-width flex justify-between items-center">
        <div className="flex items-center gap-9">
          {leftSideLinks.map((link, index) => (
            <div
              key={`left-${index}`}
              className="relative group flex items-center"
            >
              <div className="flex items-center cursor-pointer">
                {link.iconUrl ? (
                  <img loading="lazy" decoding="async"
                    src={link.iconUrl}
                    alt={link.text}
                    className="w-[20px] h-[20px]"
                  />
                ) : defaultLeft[index]?.iconUrl ? (
                  <img loading="lazy" decoding="async"
                    src={defaultLeft[index].iconUrl}
                    alt={link.text}
                    className="w-[20px] h-[20px]"
                  />
                ) : null}
                <span className="text-[14px] font-medium text-[#FFFFFF] ml-[8px]">
                  {link.text}
                </span>
              </div>
              {link.hoverText && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-[14px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100]">
                  <div className="bg-white shadow-[0_2px_15px_rgba(0,0,0,0.15)] rounded-[2px] relative w-max max-w-[220px] min-w-[160px] px-4 py-3">
                    <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white"></div>
                    <p
                      className="text-[12px] text-[#292D35] font-normal leading-[1.4]"
                      dangerouslySetInnerHTML={{__html: link.hoverText}}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {rightSideLinks.map((link, index) => {
            const isDelivering =
              link.iconUrl === 'svg_delivering' ||
              (!link.iconUrl &&
                defaultRight[index]?.iconUrl === 'svg_delivering') ||
              link.text?.toLowerCase()?.includes('delivering');

            const deliveryLabel = hasPincode
              ? `Delivering to ${[location.city, location.pincode].filter(Boolean).join(' ')}`
              : (link.text || 'Delivering To');

            return (
              <div key={`right-${index}`} className="flex items-center">
                {index > 0 && (
                  <span className="text-[#FFFFFF] opacity-50 mr-4">|</span>
                )}
                <div className="flex items-center cursor-pointer group">
                  {isDelivering ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        openDeliveryLocationPicker('choose');
                      }}
                      className="flex items-center cursor-pointer bg-transparent border-0 p-0 text-[#FFFFFF] hover:text-white group text-left transition-colors"
                      aria-label={deliveryLabel}
                    >
                      <svg
                        viewBox="649 374.5 18 19"
                        className="w-[18px] h-[19px] shrink-0"
                      >
                        <path
                          d="M658 374.5C661.314 374.5 664 377.087 664 380.277C664 381.832 662.576 384.297 661.116 386.417C664.551 386.932 667 388.272 667 389.846C667 391.864 662.97 393.5 658 393.5C653.03 393.5 649 391.864 649 389.846C649 388.272 651.449 386.932 654.883 386.417C653.423 384.297 652 381.831 652 380.277C652 377.087 654.686 374.5 658 374.5ZM655.846 387.762C654.346 387.919 653.03 388.237 652.016 388.648C651.271 388.951 650.755 389.278 650.45 389.571C650.318 389.699 650.252 389.791 650.221 389.846C650.252 389.9 650.318 389.993 650.45 390.12C650.755 390.413 651.271 390.741 652.016 391.043C653.492 391.642 655.608 392.038 658 392.038C660.392 392.038 662.508 391.642 663.984 391.043C664.729 390.741 665.245 390.413 665.55 390.12C665.682 389.993 665.748 389.9 665.779 389.846C665.748 389.791 665.682 389.699 665.55 389.571C665.245 389.278 664.729 388.951 663.984 388.648C662.97 388.237 661.654 387.92 660.153 387.763C659.617 388.488 659.122 389.124 658.741 389.599C658.29 390.161 658 390.5 658 390.5C658 390.5 657.71 390.161 657.259 389.599C656.878 389.123 656.382 388.487 655.846 387.762ZM658 375.566C655.438 375.566 653.2 377.594 653.2 380.277C653.2 380.836 653.481 381.699 654.031 382.782C654.564 383.831 655.284 384.966 656.021 386.024C656.735 387.052 657.452 387.99 658 388.683C658.548 387.99 659.265 387.052 659.979 386.024C660.716 384.966 661.436 383.831 661.969 382.782C662.519 381.699 662.8 380.836 662.8 380.277C662.8 377.594 660.562 375.566 658 375.566ZM658 378.1C659.104 378.1 660 378.995 660 380.1C660 381.204 659.105 382.1 658 382.1C656.895 382.1 656 381.204 656 380.1C656 378.995 656.896 378.1 658 378.1ZM658 379.1C657.448 379.1 657 379.547 657 380.1C657 380.652 657.448 381.1 658 381.1C658.552 381.1 659 380.652 659 380.1C659 379.547 658.552 379.1 658 379.1Z"
                          fill="#FFFFFF"
                        />
                      </svg>
                      <span className="text-[12px] font-bold text-[#FFFFFF] ml-[4px] hover:underline max-w-[200px] truncate">
                        {deliveryLabel}
                      </span>
                    </button>
                  ) : (
                    <>
                      {link.iconUrl ? (
                        <img
                          loading="lazy"
                          decoding="async"
                          src={link.iconUrl}
                          alt={link.text}
                          className="w-[18px] h-[19px] object-contain"
                        />
                      ) : null}
                      {(() => {
                        const textLower = String(link.text || '').toLowerCase();
                        let targetUrl = link.url || '#';
                        if (
                          textLower.includes('store locator') ||
                          textLower === 'store locator'
                        ) {
                          targetUrl = '/pages/store-locator';
                        } else if (
                          textLower.includes('help') ||
                          textLower === 'help'
                        ) {
                          targetUrl =
                            'https://helpin.lifestylestores.com/support/home';
                        }

                        if (targetUrl.startsWith('/')) {
                          return (
                            <Link
                              to={targetUrl}
                              className={`text-[12px] font-bold text-[#FFFFFF] ${link.iconUrl ? 'ml-[4px]' : ''} hover:underline`}
                            >
                              {link.text}
                            </Link>
                          );
                        }

                        return (
                          <a
                            href={targetUrl}
                            className={`text-[12px] font-bold text-[#FFFFFF] ${link.iconUrl ? 'ml-[4px]' : ''} hover:underline`}
                          >
                            {link.text}
                          </a>
                        );
                      })()}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const MainHeader = ({
  cart,
  isScrolled,
  metaobject,
  setIsMobileSearchOpen,
  isLoggedIn,
  onOpenAuthModal,
}) => {
  const navigate = useNavigate();
  const {open} = useAside();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchFetcher = useFetcher({key: 'desktop-predictive-search'});

  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed || trimmed.length < 3) return;

    // Search on every keystroke; a newer load cancels the previous one.
    searchFetcher.load(
      `/api/predictive-search?q=${encodeURIComponent(trimmed)}&limit=10`,
    );
  }, [searchQuery]);

  const isQueryLongEnough = searchQuery.trim().length >= 3;
  const predictiveItems =
    isQueryLongEnough && searchFetcher.data?.result?.items
      ? searchFetcher.data.result.items
      : {queries: [], products: [], collections: []};

  const predictiveQueries = predictiveItems.queries || [];
  const predictiveProducts = predictiveItems.products || [];
  const predictiveCollections = predictiveItems.collections || [];

  const hasPredictiveResults =
    predictiveQueries.length > 0 ||
    predictiveProducts.length > 0 ||
    predictiveCollections.length > 0;
  const isPredictiveLoading = searchFetcher.state === 'loading';

  // Extract metaobject fields
  const fields = metaobject?.fields || [];
  const getRefUrl = (key) =>
    fields.find((f) => f.key === key)?.reference?.image?.url;

  const logoUrl =
    getRefUrl('logo') ||
    'https://assets-cloud.landmarkshops.in/website_images/static-pages/brand_exp/brand2images/logos/prod/lifestyle-logo-136x46.svg';
  const logoText = getFieldValue(fields, ['logo_text']) || 'Lifestyle';

  const searchPlaceholder =
    getFieldValue(fields, ['search_placeholder']) ||
    'What are you looking for?';

  // Popular searches comes from a reference to another metaobject containing "texts_with_link"
  const popularSearchesRef = fields.find(
    (f) => f.key === 'popular_searches',
  )?.reference;
  let popularSearchesText =
    'Melange Kurta Set Women, watch, tops for women, dresses for women, kurta sets for women, Melange kurtas, CODE Tops for Women, Shirts for men, melange, CODE Dresses for Women';
  if (popularSearchesRef) {
    const textWithLinkField = getFieldValue(popularSearchesRef.fields, [
      'texts_with_link',
      'texts_with_links',
    ]);
    if (textWithLinkField) {
      try {
        const parsed = JSON.parse(textWithLinkField);
        // Extract plain text from Rich text assuming it's separated by commas
        if (parsed.children && parsed.children[0]?.children?.[0]?.value) {
          popularSearchesText = parsed.children[0].children[0].value;
        } else {
          popularSearchesText = textWithLinkField;
        }
      } catch {
        popularSearchesText = textWithLinkField;
      }
    }
  }
  const popularSearches = popularSearchesText
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const signInText =
    getFieldValue(fields, ['sign_in_text']) || 'SIGN UP / SIGN IN';
  const signInLink = getFieldValue(fields, ['sign_in_link']) || '/account';

  const favoriteIconUrl = getRefUrl('favorite_icon');
  const favoriteText = getFieldValue(fields, ['favorite_text']) || 'Favorites';
  const favoriteUrl = '/account/favourites';

  const cartIconUrl = getRefUrl('cart_icon');
  const cartText = getFieldValue(fields, ['cart_text']) || 'Basket';
  const cartUrl = getFieldValue(fields, ['cart_url']) || '/cart';

  const moreIconUrl = getRefUrl('more_icon');
  const moreText = getFieldValue(fields, ['more_text']) || 'More';

  // Parse More Dropdown links from Rich Text
  const mainDropdownLinkTexts = getFieldValue(fields, [
    'main_dropdown_link_texts',
  ]);
  let moreLinks = [
    {text: 'Download App', url: '#'},
    {text: 'Online Gift Card', url: '#'},
    {text: 'Store Locator', url: '#'},
    {text: 'Lifestyle EDGE', url: '#'},
    {text: 'Landmark Rewards SBI Credit card', url: '#'},
    {text: 'Landmark Group Foundation', url: '#'},
    {text: 'Gift Card Balance Check', url: '#'},
  ];
  if (mainDropdownLinkTexts) {
    try {
      const parsed = JSON.parse(mainDropdownLinkTexts);
      const links = [];
      parsed.children?.forEach((p) => {
        p.children?.forEach((c) => {
          if (c.type === 'link') {
            links.push({text: c.children?.[0]?.value || '', url: c.url || '#'});
          } else if (c.type === 'text' && c.value.trim()) {
            // If it's just comma separated text in rich text
            c.value.split(',').forEach((text) => {
              if (text.trim()) links.push({text: text.trim(), url: '#'});
            });
          }
        });
      });
      if (links.length > 0) {
        moreLinks = links;
      }
    } catch {
      // If parsing fails, fall back to default
    }
  }

  return (
    <div className="bg-white lg:bg-[#F7F8F7]">
      {/* Top Row */}
      <div className="page-width !py-[12px] !px-[16px] lg:!py-0 lg:h-[72px] lg:!px-[1.5rem] flex justify-between items-center gap-4 lg:gap-8">
        <div className="flex items-center gap-4 lg:gap-6 flex-1 h-full">
          {/* Left Side: Logo */}
          <div className="flex items-center gap-3 lg:gap-4">
            <HeaderMenuMobileToggle />
            <NavLink to="/" prefetch="intent" aria-label={logoText}>
              <svg
                viewBox="104 44 103 15"
                className="w-[85px] lg:w-[108px] h-auto lg:h-[40px] object-contain"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M107.272 44.3326H104.735V58.6674H105.234H107.272H113.702V57.1913H107.272V44.3326Z"
                  fill="#010101"
                />
                <path
                  d="M118.776 44.3326H116.239V58.6674H118.776V44.3326Z"
                  fill="#010101"
                />
                <path
                  d="M125.728 44.3326H123.858V58.6674H126.402V50.8304H131.537V49.3543H126.402V45.8087H132.469V44.3326H126.402H125.728Z"
                  fill="#010101"
                />
                <path
                  d="M137.551 50.663H142.686V49.1869H137.551V45.8087H143.617V44.3326H137.551H136.877H135.006V58.6674H136.877H137.551H143.806V57.1913H137.551V50.663Z"
                  fill="#010101"
                />
                <path
                  d="M162.793 44.3326H158.628V45.8087H162.793V58.6674H165.33V45.8087H169.496V44.3326H165.33H162.793Z"
                  fill="#010101"
                />
                <path
                  d="M182.946 44.3326H181.644L178.493 48.9054L175.214 44.3326H172.041L176.577 50.5945V58.6674H179.114V50.6021L183.431 44.3326H183.227H182.946Z"
                  fill="#010101"
                />
                <path
                  d="M188.505 44.3326H185.968V58.6674H186.468H188.505H194.928V57.1913H188.505V44.3326Z"
                  fill="#010101"
                />
                <path
                  d="M200.01 57.1913V50.663H205.145V49.1869H200.01V45.8087H206.076V44.3326H200.01H199.336H197.473V58.6674H199.336H200.01H206.265V57.1913H200.01Z"
                  fill="#010101"
                />
                <path
                  d="M154.084 50.4424C153.705 50.2141 153.281 50.0163 152.819 49.8565C152.622 49.7881 152.402 49.7196 152.168 49.6511C150.918 49.2707 149.365 48.7989 149.365 47.3609C149.365 46.6837 149.767 46.0674 150.38 45.7935C150.441 45.7631 150.509 45.7402 150.577 45.7174C150.706 45.687 150.835 45.6641 150.971 45.6489C151.85 45.5348 152.766 45.687 153.304 46.037C153.773 46.3261 154.069 46.7978 154.099 47.3304C154.099 47.3381 154.099 47.3533 154.099 47.3609C154.099 47.3609 154.099 47.3761 154.099 47.3837C154.099 47.3913 154.099 47.4065 154.099 47.4141C154.099 47.437 154.099 47.4598 154.099 47.4826C154.099 47.4978 154.099 47.5131 154.099 47.5283V47.6196H155.553V47.2087C155.523 46.7598 155.386 46.3185 155.167 45.9304C154.947 45.5424 154.637 45.2076 154.281 44.9565C153.91 44.6902 153.47 44.5 152.97 44.3859C152.652 44.3098 152.311 44.2641 151.948 44.2565C151.933 44.2565 151.91 44.2565 151.895 44.2565C151.834 44.2565 151.774 44.2565 151.721 44.2565C151.706 44.2565 151.683 44.2565 151.668 44.2565C151.653 44.2565 151.645 44.2565 151.63 44.2565C151.63 44.2565 151.607 44.2565 151.592 44.2565C151.577 44.2565 151.562 44.2565 151.547 44.2565C151.539 44.2565 151.524 44.2565 151.516 44.2565C151.516 44.2565 151.509 44.2565 151.501 44.2565C151.486 44.2565 151.463 44.2565 151.448 44.2565C151.433 44.2565 151.41 44.2565 151.395 44.2565C151.38 44.2565 151.357 44.2565 151.342 44.2565H151.335C151.335 44.2565 151.304 44.2565 151.289 44.2565H151.236H151.175C151.175 44.2565 151.153 44.2565 151.138 44.2641C151.138 44.2641 151.13 44.2641 151.122 44.2641C151.107 44.2641 151.092 44.2641 151.077 44.2641C151.024 44.2641 150.971 44.2794 150.918 44.287H150.888C150.888 44.287 150.865 44.287 150.857 44.2946H150.842C150.842 44.2946 150.82 44.2946 150.804 44.3022C150.804 44.3022 150.804 44.3022 150.797 44.3022C150.782 44.3022 150.766 44.3022 150.751 44.3022H150.744C150.744 44.3022 150.721 44.3022 150.713 44.3022C150.676 44.3022 150.638 44.3174 150.6 44.325C150.6 44.325 150.592 44.325 150.585 44.325H150.554C150.554 44.325 150.532 44.3326 150.524 44.3402C150.509 44.3402 150.494 44.3402 150.479 44.3478C150.471 44.3478 150.456 44.3478 150.448 44.3478C150.433 44.3478 150.418 44.3478 150.403 44.3554C150.388 44.3554 150.373 44.3554 150.358 44.3631C150.327 44.3631 150.297 44.3783 150.267 44.3859H150.259C150.259 44.3859 150.236 44.3935 150.221 44.4011C150.214 44.4011 150.198 44.4011 150.191 44.4087C150.183 44.4087 150.168 44.4087 150.161 44.4163H150.138C150.138 44.4163 150.092 44.4391 150.07 44.4391H150.055H150.047C150.032 44.4391 150.024 44.4467 150.009 44.4544C149.994 44.4544 149.979 44.462 149.964 44.4696C149.964 44.4696 149.956 44.4696 149.949 44.4696C149.926 44.4696 149.903 44.4848 149.88 44.4924C149.873 44.4924 149.865 44.4924 149.858 44.5C149.85 44.5 149.835 44.5 149.827 44.5076C149.827 44.5076 149.812 44.5076 149.797 44.5152C149.759 44.5304 149.714 44.5457 149.683 44.5609C149.676 44.5609 149.661 44.5685 149.653 44.5761C148.987 44.8728 148.426 45.3522 148.025 45.9609C147.616 46.5848 147.396 47.3152 147.396 48.0685C147.396 48.6544 147.495 49.1489 147.692 49.5826C147.866 49.9707 148.123 50.2978 148.472 50.5794C149.108 51.1044 149.971 51.3935 150.804 51.6826C151.706 51.987 152.637 52.3065 153.304 52.9076V52.9152C153.917 53.3489 154.288 54.0641 154.288 54.8174C154.288 55.5707 153.902 56.3163 153.266 56.75H153.258L153.235 56.7728C152.751 57.1913 152.031 57.4196 151.198 57.4196C151.198 57.4196 151.122 57.4196 151.085 57.4196C150.464 57.412 149.873 57.275 149.381 57.0163C148.396 56.5141 147.79 55.5326 147.76 54.3989C147.76 54.2924 147.76 54.1402 147.76 54.0109C147.76 53.9728 147.76 53.9348 147.76 53.9044V53.5163L147.374 53.5011C147.283 53.5011 147.101 53.5011 146.904 53.5011C146.684 53.5011 146.457 53.5011 146.359 53.5011H146.268V53.8967C146.268 54.2696 146.283 54.6652 146.359 55.0457C146.563 56.1794 147.154 57.1533 148.032 57.7924C148.502 58.1348 149.04 58.3859 149.646 58.5381C150.07 58.6446 150.524 58.6978 150.986 58.6978C151.122 58.6978 151.266 58.6978 151.403 58.6826C152.054 58.6446 152.698 58.4924 153.273 58.2413C153.894 57.9674 154.425 57.5946 154.849 57.1228C155.341 56.5902 155.712 55.9359 155.954 55.1902C156.045 54.9163 156.113 54.6272 156.159 54.3304C156.182 54.1631 156.189 54.0033 156.189 53.8359C156.189 52.0326 155.053 50.9598 154.099 50.3815L154.084 50.4424Z"
                  fill="#010101"
                />
              </svg>
            </NavLink>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 w-full max-w-[470px] relative z-[110]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  setIsSearchFocused(false);
                  navigate(
                    `/search?q=${encodeURIComponent(searchQuery.trim())}`,
                  );
                }
              }}
              className={`flex flex-1 w-full h-[40px] items-center ${isSearchFocused ? 'bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] rounded-t-[2px]' : 'bg-[#ECEDEB] rounded-[1px]'} pr-3 pl-2 transition-colors`}
            >
              <button
                type="submit"
                aria-label="Search"
                className="cursor-pointer"
              >
                <svg
                  viewBox="568 154 20 20"
                  className="w-[18px] h-[18px] mr-4 shrink-0"
                >
                  <path
                    d="M576.328 154C580.918 154 584.656 157.738 584.656 162.328C584.656 164.324 583.948 166.157 582.771 167.594L587.744 172.566C587.962 172.775 588.049 173.085 587.973 173.377C587.897 173.669 587.669 173.897 587.377 173.973C587.085 174.049 586.775 173.962 586.566 173.744L581.594 168.771C580.157 169.948 578.324 170.656 576.328 170.656C571.738 170.656 568 166.918 568 162.328C568 157.739 571.739 154 576.328 154ZM576.328 155.666C572.639 155.666 569.666 158.639 569.666 162.328C569.666 166.018 572.639 168.991 576.328 168.991C580.018 168.991 582.991 166.018 582.991 162.328C582.991 158.639 580.018 155.666 576.328 155.666Z"
                    fill="#929391"
                  />
                </svg>
              </button>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-[16px] text-[#292D35] placeholder-[#798086]"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSearchQuery('');
                  }}
                  className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer shrink-0"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </form>
            {isSearchFocused && (
              <div
                className="absolute top-full left-0 w-full min-w-[500px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] rounded-b-[4px] p-4 border border-gray-100 z-[120]"
                onMouseDown={(e) => e.preventDefault()}
              >
                {!isQueryLongEnough ? (
                  <>
                    <h3 className="text-[14px] font-normal text-[#000000] mb-4">
                      Popular searches
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {popularSearches.map((term, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSearchQuery(term);
                            setIsSearchFocused(false);
                            navigate(`/search?q=${encodeURIComponent(term)}`);
                          }}
                          className="h-[32px] px-[12px] flex items-center justify-center border border-gray-300 rounded-full text-[13px] font-normal text-[#000000DE] hover:bg-gray-50 whitespace-nowrap transition-colors bg-white cursor-pointer"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </>
                ) : hasPredictiveResults ? (
                  <div className="flex flex-col">
                    <div
                      className={`grid gap-4 ${predictiveProducts.length > 0 && (predictiveQueries.length > 0 || predictiveCollections.length > 0) ? 'grid-cols-2' : 'grid-cols-1'}`}
                    >
                      {/* Suggestions & Categories */}
                      {(predictiveQueries.length > 0 ||
                        predictiveCollections.length > 0) && (
                        <div className="flex flex-col">
                          {predictiveQueries.length > 0 && (
                            <div>
                              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                                Suggestions
                              </h4>
                              <div className="divide-y divide-gray-100">
                                {predictiveQueries.map((item, idx) => (
                                  <div
                                    key={`item-${idx}`}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      setSearchQuery(item.text);
                                      setIsSearchFocused(false);
                                      navigate(
                                        `/search?q=${encodeURIComponent(item.text)}`,
                                      );
                                    }}
                                    className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded cursor-pointer group transition-colors"
                                  >
                                    <div className="flex items-center gap-2">
                                      <svg
                                        className="w-3.5 h-3.5 text-gray-400 group-hover:text-black shrink-0"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      <span className="text-[13px] text-gray-800 group-hover:text-black font-medium">
                                        {item.text}
                                      </span>
                                    </div>
                                    <svg
                                      className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 shrink-0"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      strokeWidth="2"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M7 17L17 7M17 7H9M17 7V15"
                                      />
                                    </svg>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {predictiveCollections.length > 0 && (
                            <div
                              className={
                                predictiveQueries.length > 0
                                  ? 'mt-3 pt-3 border-t border-gray-100'
                                  : ''
                              }
                            >
                              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                                Categories
                              </h4>
                              <div className="divide-y divide-gray-100">
                                {predictiveCollections.map((col) => (
                                  <div
                                    key={col.id}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      setIsSearchFocused(false);
                                      navigate(`/collections/${col.handle}`);
                                    }}
                                    className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded cursor-pointer group transition-colors"
                                  >
                                    <span className="text-[13px] text-gray-800 group-hover:text-[#FAA619] font-medium">
                                      {col.title}
                                    </span>
                                    <span className="text-[11px] text-gray-400">
                                      in Collections
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Products */}
                      {predictiveProducts.length > 0 && (
                        <div
                          className={`${predictiveQueries.length > 0 || predictiveCollections.length > 0 ? 'border-l border-gray-100 pl-4' : ''}`}
                        >
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                            Products
                          </h4>
                          <div className="flex flex-col gap-2.5">
                            {predictiveProducts.slice(0, 4).map((product) => {
                              const minPrice = parseFloat(
                                product.priceRange?.minVariantPrice?.amount ||
                                  '0',
                              );
                              return (
                                <div
                                  key={product.id}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setIsSearchFocused(false);
                                    navigate(`/products/${product.handle}`);
                                  }}
                                  className="flex items-center gap-3 p-1.5 rounded hover:bg-gray-50 cursor-pointer group transition-colors"
                                >
                                  {product.featuredImage?.url ? (
                                    <img
                                      src={shopifyImageUrl(product.featuredImage.url, {width: 112})}
                                      alt={
                                        product.featuredImage.altText ||
                                        product.title
                                      }
                                      className="w-11 h-14 object-cover rounded bg-gray-50 border border-gray-200 shrink-0"
                                    />
                                  ) : (
                                    <div className="w-11 h-14 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400 shrink-0">
                                      No img
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-medium text-gray-900 group-hover:text-[#FAA619] line-clamp-2 leading-snug">
                                      {product.title}
                                    </p>
                                    {minPrice > 0 && (
                                      <p className="text-[13px] font-bold text-black mt-0.5">
                                        ₹
                                        {Math.round(minPrice).toLocaleString(
                                          'en-IN',
                                        )}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* View all results button */}
                    <div
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setIsSearchFocused(false);
                        navigate(
                          `/search?q=${encodeURIComponent(searchQuery.trim())}`,
                        );
                      }}
                      className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[13px] font-semibold text-[#FAA619] hover:underline cursor-pointer"
                    >
                      <span>
                        View all results for &ldquo;{searchQuery.trim()}&rdquo;
                      </span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </div>
                  </div>
                ) : isPredictiveLoading ? null : (
                  <div>
                    <p className="text-[13px] text-gray-600 mb-3">
                      No suggestions found for &ldquo;
                      <span className="font-semibold text-black">
                        {searchQuery}
                      </span>
                      &rdquo;
                    </p>
                    <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Popular searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((term, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSearchQuery(term);
                            setIsSearchFocused(false);
                            navigate(`/search?q=${encodeURIComponent(term)}`);
                          }}
                          className="h-[30px] px-[12px] flex items-center justify-center border border-gray-300 rounded-full text-[12px] font-normal text-gray-800 hover:bg-gray-50 whitespace-nowrap transition-colors bg-white cursor-pointer"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side CTAs */}
        <div className="flex items-center gap-4 lg:gap-8 h-full">
          {/* Signed-out desktop CTA: prominent orange SIGN UP / SIGN IN button */}
          {!isLoggedIn && (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="hidden lg:flex w-[154px] h-[43px] items-center justify-center bg-[#FAA619] text-[#FFFFFF] border border-[#FAA619] font-bold text-[14px] rounded-[2px] hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FAA619] transition-opacity uppercase cursor-pointer"
            >
              {signInText}
            </button>
          )}

          {/* Mobile header has no account icon (live site); sign-in is in the menu and the home "For a richer experience" bar */}

          {/* Mobile Scrolled Search Icon */}
          {isScrolled && (
            <div
              className="lg:hidden flex flex-col items-center cursor-pointer hover:opacity-80"
              onClick={() => setIsMobileSearchOpen(true)}
            >
              <svg viewBox="568 154 20 20" className="w-[22px] h-[22px]">
                <path
                  d="M576.328 154C580.918 154 584.656 157.738 584.656 162.328C584.656 164.324 583.948 166.157 582.771 167.594L587.744 172.566C587.962 172.775 588.049 173.085 587.973 173.377C587.897 173.669 587.669 173.897 587.377 173.973C587.085 174.049 586.775 173.962 586.566 173.744L581.594 168.771C580.157 169.948 578.324 170.656 576.328 170.656C571.738 170.656 568 166.918 568 162.328C568 157.739 571.739 154 576.328 154ZM576.328 155.666C572.639 155.666 569.666 158.639 569.666 162.328C569.666 166.018 572.639 168.991 576.328 168.991C580.018 168.991 582.991 166.018 582.991 162.328C582.991 158.639 580.018 155.666 576.328 155.666Z"
                  fill="#000000"
                />
              </svg>
            </div>
          )}

          <div className="flex items-stretch gap-1 lg:gap-3 h-full relative">
            {/* Signed-in account control — matches Favourites/Basket/More nav style */}
            {isLoggedIn && (
              <div className="relative group hidden lg:flex flex-col items-center justify-center px-3 border-b-[3px] border-transparent hover:border-[#FAA619] focus-within:border-[#FAA619] transition-colors">
                <NavLink
                  to="/account"
                  prefetch="intent"
                  aria-label="Account"
                  className="flex flex-col items-center justify-center rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FAA619]"
                >
                  <svg
                    className="w-[24px] h-[24px] text-[#000000] group-hover:opacity-80"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.6"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="hidden lg:block text-[10px] mt-1 font-semibold text-[#000000] group-hover:opacity-80">
                    Account
                  </span>
                </NavLink>

                {/* Account Dropdown */}
                <div className="absolute top-[100%] right-0 hidden group-hover:block group-focus-within:block w-max min-w-[200px] bg-white border border-gray-100 shadow-lg rounded-xs py-2 z-[120]">
                  {ACCOUNT_MENU_ITEMS.filter((item) => !item.hidden).map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      prefetch="intent"
                      className="block px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 hover:text-[#FAA619]"
                    >
                      {item.label}
                    </NavLink>
                  ))}
                  <div className="border-t border-gray-100 my-1" />
                  <SignOutButton
                    formClassName="w-full"
                    className="w-full text-left px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 cursor-pointer"
                  />
                </div>
              </div>
            )}

            <Link
              to="/account/favourites"
              prefetch="intent"
              className="flex flex-col items-center justify-center cursor-pointer group hover:opacity-100 px-3 border-b-[3px] border-transparent hover:border-[#FAA619] transition-colors"
            >
              {favoriteIconUrl ? (
                <img
                  src={favoriteIconUrl}
                  alt={favoriteText}
                  className="w-[24px] h-[24px] group-hover:opacity-80"
                />
              ) : (
                <svg
                  viewBox="603 154 22 20"
                  className="w-[24px] h-[24px] group-hover:opacity-80"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M614 170.294L620.976 163.125C622.26 161.805 622.26 159.666 620.976 158.346C619.692 157.026 617.61 157.026 616.325 158.346L614.581 160.138C614.26 160.468 613.74 160.468 613.419 160.138L611.675 158.346C610.391 157.026 608.308 157.026 607.024 158.346C605.74 159.666 605.74 161.805 607.024 163.125L614 170.294ZM614 158.346L615.163 157.151C617.089 155.172 620.212 155.172 622.139 157.151C624.065 159.131 624.065 162.34 622.139 164.32L614.581 172.086C614.26 172.416 613.74 172.416 613.419 172.086L605.862 164.32C603.935 162.34 603.935 159.131 605.862 157.151C607.788 155.172 610.911 155.172 612.837 157.151L614 158.346Z"
                    fill="#000000"
                  />
                </svg>
              )}
              <span className="hidden lg:block text-[10px] mt-1 font-semibold text-[#000000] group-hover:opacity-80">
                {favoriteText}
              </span>
            </Link>

            <CartToggle
              cart={cart}
              customIconUrl={cartIconUrl}
              customText={cartText}
              customUrl={cartUrl}
            />

            <div className="hidden lg:flex flex-col items-center justify-center cursor-pointer group relative px-3 border-b-[3px] border-transparent hover:border-[#FAA619] transition-colors">
              {moreIconUrl ? (
                <img loading="lazy" decoding="async"
                  src={moreIconUrl}
                  alt={moreText}
                  className="w-[24px] h-[24px] group-hover:opacity-80"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-[#000000] group-hover:opacity-80"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                  />
                </svg>
              )}
              <span className="text-[10px] mt-1 font-semibold text-[#000000] group-hover:opacity-80">
                {moreText}
              </span>

              {/* More Dropdown */}
              <div className="absolute top-[100%] right-0 hidden group-hover:block w-max min-w-[240px] z-[120] pt-[2px]">
                <div className="bg-white border border-gray-100 shadow-[0_8px_16px_rgba(0,0,0,0.12)]">
                  <ul className="py-2 text-[13px] text-[#292D35] flex flex-col text-left">
                    {moreLinks.map((link, idx) => (
                      <li
                        key={`more-${idx}`}
                        className="px-5 py-2.5 hover:text-[#FAA619] hover:underline cursor-pointer transition-colors leading-[1.4]"
                      >
                        <a href={link.url} className="block w-full">
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileSubHeader = ({isSearchOpen, setIsSearchOpen, hideLocation = false}) => {
  const navigate = useNavigate();
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const mobileSearchFetcher = useFetcher({
    key: 'mobile-header-predictive-search',
  });

  useEffect(() => {
    const trimmed = mobileSearchQuery.trim();
    if (!trimmed || trimmed.length < 3) return;

    // Search on every keystroke; a newer load cancels the previous one.
    mobileSearchFetcher.load(
      `/api/predictive-search?q=${encodeURIComponent(trimmed)}&limit=10`,
    );
  }, [mobileSearchQuery]);

  const isMobileQueryLongEnough = mobileSearchQuery.trim().length >= 3;
  const mobilePredictiveItems =
    isMobileQueryLongEnough && mobileSearchFetcher.data?.result?.items
      ? mobileSearchFetcher.data.result.items
      : {queries: [], products: [], collections: []};

  const mobilePredictiveQueries = mobilePredictiveItems.queries || [];
  const mobilePredictiveProducts = mobilePredictiveItems.products || [];
  const mobilePredictiveCollections = mobilePredictiveItems.collections || [];

  const hasMobilePredictiveResults =
    mobilePredictiveQueries.length > 0 ||
    mobilePredictiveProducts.length > 0 ||
    mobilePredictiveCollections.length > 0;
  const isMobilePredictiveLoading = mobileSearchFetcher.state === 'loading';

  return (
    <>
      <div className="lg:hidden bg-white">
        {/* Delivery location bar + "Choose your location" sheet (shared pincode) */}
        {!hideLocation && <DeliveryLocationPicker variant="header" />}
        <div className="page-width !py-[10px] !px-[16px] lg:!px-[1.5rem]">
          <div className="w-full h-[40px] relative flex items-center bg-[#ECEDEB] rounded-[2px] pr-3 pl-2">
            <svg
              viewBox="568 154 20 20"
              className="w-[18px] h-[18px] mr-3 shrink-0"
            >
              <path
                d="M576.328 154C580.918 154 584.656 157.738 584.656 162.328C584.656 164.324 583.948 166.157 582.771 167.594L587.744 172.566C587.962 172.775 588.049 173.085 587.973 173.377C587.897 173.669 587.669 173.897 587.377 173.973C587.085 174.049 586.775 173.962 586.566 173.744L581.594 168.771C580.157 169.948 578.324 170.656 576.328 170.656C571.738 170.656 568 166.918 568 162.328C568 157.739 571.739 154 576.328 154ZM576.328 155.666C572.639 155.666 569.666 158.639 569.666 162.328C569.666 166.018 572.639 168.991 576.328 168.991C580.018 168.991 582.991 166.018 582.991 162.328C582.991 158.639 580.018 155.666 576.328 155.666Z"
                fill="#929391"
              />
            </svg>
            <input
              type="text"
              placeholder="What are you looking for?"
              className="bg-transparent border-none outline-none w-full text-[14px] text-[#292D35] placeholder-[#798086]"
              onFocus={() => setIsSearchOpen(true)}
            />
            <svg
              viewBox="553 291 20 18"
              className="w-[20px] h-[18px] shrink-0 ml-2 cursor-pointer"
            >
              <path
                d="M558 291H553V296"
                stroke="#000000"
                strokeWidth="1.2"
                fill="none"
              />
              <path
                d="M568 291H573V296"
                stroke="#000000"
                strokeWidth="1.2"
                fill="none"
              />
              <path
                d="M568 309H573V304"
                stroke="#000000"
                strokeWidth="1.2"
                fill="none"
              />
              <path
                d="M558 309H553V304"
                stroke="#000000"
                strokeWidth="1.2"
                fill="none"
              />
              <path d="M556.1 296H557.3V304H556.1V296Z" fill="#000000" />
              <path d="M558.701 296H560.701V304H558.701V296Z" fill="#000000" />
              <path d="M562.701 296H563.901V304H562.701V296Z" fill="#000000" />
              <path d="M566.201 296H567.401V304H566.201V296Z" fill="#000000" />
              <path d="M569.701 296H570.901V304H569.701V296Z" fill="#000000" />
            </svg>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="fixed inset-0 bg-white z-[9999] flex flex-col lg:hidden overflow-hidden">
          {/* Header */}
          <div className="flex items-center px-4 h-[60px] border-b border-gray-200 shrink-0 gap-3">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1 -ml-1 text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (mobileSearchQuery.trim()) {
                  setIsSearchOpen(false);
                  navigate(
                    `/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`,
                  );
                }
              }}
              className="flex-1 h-[40px] flex items-center bg-[#F4F4F4] rounded-[2px] px-3"
            >
              <input
                type="text"
                placeholder="What are you looking for?"
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-[14px] text-[#292D35]"
                autoFocus
              />
              {mobileSearchQuery && (
                <button
                  type="button"
                  onClick={() => setMobileSearchQuery('')}
                  className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer shrink-0"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </form>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-white">
            {isMobileQueryLongEnough ? (
              hasMobilePredictiveResults ? (
                <div className="flex flex-col divide-y divide-gray-100">
                  {/* Suggestions */}
                  {mobilePredictiveQueries.length > 0 && (
                    <div className="pb-3">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                        Suggestions
                      </h4>
                      <div className="divide-y divide-gray-100">
                        {mobilePredictiveQueries.map((item, idx) => (
                          <div
                            key={`mob-q-${idx}`}
                            onClick={() => {
                              setIsSearchOpen(false);
                              navigate(
                                `/search?q=${encodeURIComponent(item.text)}`,
                              );
                            }}
                            className="flex items-center justify-between py-3 px-1 text-left cursor-pointer group hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-[14px] text-gray-800 group-hover:text-black">
                              {item.text}
                            </span>
                            <svg
                              className="w-4 h-4 text-gray-400 group-hover:text-gray-700 shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7 17L17 7M17 7H9M17 7V15"
                              />
                            </svg>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  {mobilePredictiveCollections.length > 0 && (
                    <div className="py-3">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                        Categories
                      </h4>
                      <div className="divide-y divide-gray-100">
                        {mobilePredictiveCollections.map((col) => (
                          <div
                            key={`mob-col-${col.id}`}
                            onClick={() => {
                              setIsSearchOpen(false);
                              navigate(`/collections/${col.handle}`);
                            }}
                            className="flex items-center justify-between py-3 px-1 text-left cursor-pointer group hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-[14px] text-gray-800 group-hover:text-[#FAA619] font-medium">
                              {col.title}
                            </span>
                            <span className="text-[12px] text-gray-400">
                              in Collections
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Products */}
                  {mobilePredictiveProducts.length > 0 && (
                    <div className="py-3">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                        Products
                      </h4>
                      <div className="flex flex-col gap-3">
                        {mobilePredictiveProducts.slice(0, 5).map((product) => {
                          const minPrice = parseFloat(
                            product.priceRange?.minVariantPrice?.amount || '0',
                          );
                          return (
                            <div
                              key={`mob-prod-${product.id}`}
                              onClick={() => {
                                setIsSearchOpen(false);
                                navigate(`/products/${product.handle}`);
                              }}
                              className="flex items-center gap-3 cursor-pointer group p-1 rounded hover:bg-gray-50"
                            >
                              {product.featuredImage?.url ? (
                                <img
                                  src={shopifyImageUrl(product.featuredImage.url, {width: 112})}
                                  alt={
                                    product.featuredImage.altText ||
                                    product.title
                                  }
                                  className="w-12 h-14 object-cover rounded bg-gray-50 border border-gray-200 shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-14 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400 shrink-0">
                                  No img
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-medium text-gray-900 group-hover:text-[#FAA619] line-clamp-2 leading-snug">
                                  {product.title}
                                </p>
                                {minPrice > 0 && (
                                  <p className="text-[13px] font-bold text-black mt-0.5">
                                    ₹
                                    {Math.round(minPrice).toLocaleString(
                                      'en-IN',
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* View all results button */}
                  <div
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate(
                        `/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`,
                      );
                    }}
                    className="pt-4 flex items-center justify-between text-[14px] font-bold text-[#FAA619] cursor-pointer"
                  >
                    <span>
                      View all results for &ldquo;{mobileSearchQuery.trim()}
                      &rdquo;
                    </span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </div>
                </div>
              ) : isMobilePredictiveLoading ? null : (
                <div>
                  <p className="text-[14px] text-gray-600 mb-4">
                    No suggestions found for &ldquo;
                    <span className="font-semibold text-black">
                      {mobileSearchQuery}
                    </span>
                    &rdquo;
                  </p>
                  <h3 className="text-[13px] font-bold text-black mb-3">
                    Popular searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((term, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigate(`/search?q=${encodeURIComponent(term)}`);
                        }}
                        className="h-[32px] px-[12px] flex items-center justify-center border border-gray-300 rounded-full text-[13px] font-normal text-black bg-white cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )
            ) : (
              <>
                {/* Looking for a missing size */}
                <div className="bg-white rounded-[4px] p-4 mb-4 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h3 className="text-[14px] font-bold text-[#000000] leading-[1.2]">
                      Looking for a missing size in store?
                    </h3>
                    <button className="flex items-center gap-1.5 bg-[#FAA619] text-white px-2 py-1 rounded-[2px] text-[12px] font-bold shrink-0">
                      <svg
                        viewBox="553 291 20 18"
                        className="w-[16px] shrink-0 text-white"
                        style={{height: 'auto'}}
                      >
                        <path
                          d="M558 291H553V296"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          fill="none"
                        />
                        <path
                          d="M568 291H573V296"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          fill="none"
                        />
                        <path
                          d="M568 309H573V304"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          fill="none"
                        />
                        <path
                          d="M558 309H553V304"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          fill="none"
                        />
                        <path
                          d="M556.1 296H557.3V304H556.1V296Z"
                          fill="currentColor"
                        />
                        <path
                          d="M558.701 296H560.701V304H558.701V296Z"
                          fill="currentColor"
                        />
                        <path
                          d="M562.701 296H563.901V304H562.701V296Z"
                          fill="currentColor"
                        />
                        <path
                          d="M566.201 296H567.401V304H566.201V296Z"
                          fill="currentColor"
                        />
                        <path
                          d="M569.701 296H570.901V304H569.701V296Z"
                          fill="currentColor"
                        />
                      </svg>
                      Scan
                    </button>
                  </div>
                  <p className="text-[12px] text-[#798086] leading-relaxed">
                    Are you in a lifestyle store and unable to find your size in
                    a product? Use our scan feature to scan the barcode of the
                    product and get your desired size delivered to your doorstep
                  </p>
                </div>

                {/* Recent Searches */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-[14px] font-bold text-[#000000]">
                      Recent searches
                    </h3>
                    <button className="text-[12px] font-semibold text-[#FAA619]">
                      Clear all
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div className="flex items-center gap-2 text-[#798086]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-[18px] h-[18px]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-[13px] text-[#292D35] ml-1">
                        Popular searches
                      </span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-[16px] h-[16px] text-[#798086]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 19.5L4.5 4.5M4.5 4.5v11.25M4.5 4.5h11.25"
                      />
                    </svg>
                  </div>
                </div>

                {/* Popular Searches */}
                <div>
                  <h3 className="text-[14px] font-normal text-[#000000] mb-3">
                    Popular searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((term, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigate(`/search?q=${encodeURIComponent(term)}`);
                        }}
                        className="h-[32px] px-[12px] flex items-center justify-center border border-gray-300 rounded-full text-[13px] font-normal text-[#000000DE] hover:bg-gray-50 whitespace-nowrap transition-colors bg-white cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
  isScrolled,
  hideMenuImages,
  departmentLinks = {},
}) {
  const className = `header-menu-${viewport}`;

  // Department links come from the admin (Category URL on the department-list
  // metaobject); ROUTE_MAPPING covers anything not set there.
  const routeFor = (title) =>
    departmentLinks[title?.trim().toLowerCase()] || ROUTE_MAPPING[title];
  const {close} = useAside();
  const [activeTabId, setActiveTabId] = useState(null);

  const stripDomain = (url) => {
    if (!url) return '#';
    try {
      if (url.startsWith('http')) {
        const parsedUrl = new URL(url);
        return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
      }
    } catch (e) {}
    return url;
  };

  if (viewport === 'mobile') {
    const activeItem =
      (menu || FALLBACK_HEADER_MENU).items.find((i) => i.id === activeTabId) ||
      (menu || FALLBACK_HEADER_MENU).items[0];

    return (
      <nav
        className="flex flex-col w-full bg-white h-full pb-6"
        role="navigation"
      >
        <div className="flex overflow-x-auto no-scrollbar w-full">
          {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
            const match = item.title.match(
              /^(.*?)\s*[\[(](https?:\/\/[^\s\])]+)/,
            );
            const titleText = match ? match[1].trim() : item.title;
            const isActive =
              activeTabId === item.id ||
              (!activeTabId &&
                item.id === (menu || FALLBACK_HEADER_MENU).items[0]?.id);
            return (
              <button
                key={item.id}
                onClick={() => setActiveTabId(item.id)}
                className={`whitespace-nowrap px-4 py-3 text-[14px] font-semibold transition-colors border-b-[3px] ${isActive ? 'text-[#FAA619] border-[#FAA619]' : 'text-[#798086] border-white'}`}
              >
                {titleText}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeItem?.items?.length > 0 ? (
            <div className="flex flex-col">
              {activeItem.items.map((subItem) => {
                if (subItem.items && subItem.items.length > 0) {
                  return (
                    <details
                      key={subItem.id}
                      className="group border-b border-gray-100"
                    >
                      <summary className="px-4 py-4 text-[14px] text-[#000000] flex justify-between items-center hover:bg-gray-50 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                        {subItem.title}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </summary>
                      <div className="flex flex-col bg-gray-50 pl-8 pr-4 py-2 border-t border-gray-100 shadow-inner">
                        <NavLink
                          to={stripDomain(subItem.url)}
                          className="py-2 text-[13px] font-semibold text-[#000000] hover:text-[#FAA619]"
                          onClick={close}
                        >
                          Shop All {subItem.title}
                        </NavLink>
                        {subItem.items.map((child) => (
                          <NavLink
                            key={child.id}
                            to={stripDomain(child.url)}
                            className="py-2 text-[13px] text-[#5D5E5C] hover:text-[#FAA619]"
                            onClick={close}
                          >
                            {child.title}
                          </NavLink>
                        ))}
                      </div>
                    </details>
                  );
                }

                return (
                  <NavLink
                    key={subItem.id}
                    to={stripDomain(subItem.url)}
                    className="px-4 py-4 text-[14px] text-[#000000] border-b border-gray-100 flex justify-between items-center hover:bg-gray-50"
                    onClick={close}
                  >
                    {subItem.title}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </NavLink>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col">
              <NavLink
                to={
                  routeFor(
                    activeItem?.title.match(/^(.*?)\s*[\[(]/)
                      ? activeItem?.title.match(/^(.*?)\s*[\[(]/)[1].trim()
                      : activeItem?.title,
                  ) ||
                  stripDomain(activeItem?.url) ||
                  '/'
                }
                className="px-4 py-4 text-[14px] font-semibold text-[#000000] border-b border-gray-100 flex justify-between items-center hover:bg-gray-50"
                onClick={close}
              >
                {activeItem?.title.match(/^(.*?)\s*[\[(]/)
                  ? activeItem?.title.match(/^(.*?)\s*[\[(]/)[1].trim()
                  : activeItem?.title}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </NavLink>
            </div>
          )}

          <div className="mt-2 flex flex-col">
            <NavLink
              to="/account"
              className="mx-4 my-2 text-center bg-white border border-gray-200 text-[#FAA619] py-[10px] rounded-[2px] font-semibold text-[14px]"
              onClick={close}
            >
              Sign Up / Sign In
            </NavLink>
            <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-2 cursor-pointer hover:bg-gray-50">
              <span className="text-[14px]">Missing Size In Store</span>
              <span className="bg-[#292D35] text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                NEW
              </span>
            </div>
            <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-2 cursor-pointer hover:bg-gray-50">
              <span className="text-[14px]">In Store</span>
              <span className="bg-[#292D35] text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                NEW
              </span>
            </div>
            <NavLink
              to="/help"
              className="px-4 py-4 border-b border-gray-100 text-[14px] hover:bg-gray-50"
              onClick={close}
            >
              Help
            </NavLink>
            <NavLink
              to="/apps"
              className="px-4 py-4 border-b border-gray-100 text-[14px] hover:bg-gray-50"
              onClick={close}
            >
              Download our Apps
            </NavLink>
            <NavLink
              to="/store-locator"
              className="px-4 py-4 border-b border-gray-100 text-[14px] hover:bg-gray-50"
              onClick={close}
            >
              Store Locator
            </NavLink>
            <NavLink
              to="/feedback"
              className="px-4 py-4 border-b border-gray-100 text-[14px] hover:bg-gray-50"
              onClick={close}
            >
              Feedback
            </NavLink>
            <NavLink
              to="/legal"
              className="px-4 py-4 border-b border-gray-100 text-[14px] hover:bg-gray-50"
              onClick={close}
            >
              Legal
            </NavLink>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className="flex justify-center gap-10 overflow-x-auto overflow-y-hidden pt-2"
      role="navigation"
    >
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        let url = stripDomain(item.url);
        // Extract title and image URL using regex
        // Pattern matches: "Text [http...]" or "Text (http...)", making closing bracket optional
        const match = item.title.match(/^(.*?)\s*[\[(](https?:\/\/[^\s\])]+)/);
        const titleText = match ? match[1].trim() : item.title;
        const imageUrl = hideMenuImages
          ? null
          : menuImages[titleText] || (match ? match[2] : null);

        url = routeFor(titleText) || url;

        return (
          <div key={item.id} className="group flex">
            <NavLink
              className={({isActive}) =>
                `flex flex-col items-center justify-start h-auto pt-[6px] pb-[12px] border-b-[3px] transition-colors ${isActive ? 'border-[#FAA619]' : 'border-transparent'} group-hover:border-[#FAA619] relative z-10`
              }
              end
              onClick={close}
              prefetch="intent"
              to={url}
            >
              {({isActive}) => (
                <>
                  {imageUrl && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out flex flex-col items-center justify-end min-h-0 ${isScrolled ? 'h-0 mb-0 opacity-0 hidden' : 'h-[64px] mb-[10px] opacity-100'}`}
                    >
                      <img loading="lazy" decoding="async"
                        src={shopifyImageUrl(imageUrl, {width: 128})}
                        alt={titleText}
                        className="w-[64px] h-[64px] mx-[12px] rounded-none"
                      />
                    </div>
                  )}
                  <span
                    className={`whitespace-nowrap text-[14px] font-semibold px-[7px] transition-colors ${isActive ? 'text-[#FAA619]' : 'text-[#000000] group-hover:text-[#FAA619]'}`}
                  >
                    {titleText}
                  </span>
                </>
              )}
            </NavLink>

            {/* Mega Menu Dropdown */}
            {item.items && item.items.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white shadow-[0_8px_16px_rgba(0,0,0,0.08)] hidden group-hover:block z-[100] border-t border-gray-100 pb-10 pt-6">
                <div
                  className="page-width text-left"
                  style={{
                    columnCount: Math.min(item.items.length, 6),
                    columnGap: '2.5rem',
                    columnRule: '1px solid #F3F4F6',
                  }}
                >
                  {item.items.map((subItem) => (
                    <div
                      key={subItem.id}
                      className="break-inside-avoid mb-6 inline-block w-full"
                    >
                      <NavLink
                        to={stripDomain(subItem.url)}
                        className="text-[14px] font-semibold text-[#000000] font-sans leading-[20px] mb-[2px] hover:text-[#FAA619] block transition-colors"
                        onClick={close}
                      >
                        {subItem.title}
                      </NavLink>
                      {subItem.items && subItem.items.length > 0 && (
                        <div className="flex flex-col">
                          {subItem.items.map((child) => (
                            <NavLink
                              key={child.id}
                              to={stripDomain(child.url)}
                              className="text-[13px] font-normal text-[#5D5E5C] font-sans leading-[18px] mb-[2px] hover:text-[#FAA619] block transition-colors"
                              onClick={close}
                            >
                              {child.title}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({isLoggedIn, cart}) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="lg:hidden flex flex-col justify-center items-center gap-[4px] w-6 h-6 mr-1"
      onClick={() => open('mobile')}
    >
      <span className="w-5 h-[2px] bg-black block rounded-sm"></span>
      <span className="w-5 h-[2px] bg-black block rounded-sm"></span>
      <span className="w-5 h-[2px] bg-black block rounded-sm"></span>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      Search
    </button>
  );
}

/**
 * @param {{count: number}}
 */
function CartBadge({count, customIconUrl, customText, customUrl}) {
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <Link
      to={customUrl || '/cart'}
      onClick={() => {
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
      className="flex flex-col items-center justify-center cursor-pointer relative group h-full px-3 lg:px-4 border-b-[3px] border-transparent hover:border-[#FAA619] transition-colors"
    >
      <div className="relative group-hover:opacity-80">
        {customIconUrl ? (
          <img
            src={customIconUrl}
            alt={customText || 'Basket'}
            className="w-[24px] h-[24px]"
          />
        ) : (
          <svg viewBox="640 154 20 19" className="w-[24px] h-[24px]">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M655.143 160.25H656.227C657.081 160.25 657.804 160.86 657.925 161.681L659.149 170.014C659.283 170.926 658.632 171.77 657.694 171.9C657.614 171.911 657.533 171.917 657.452 171.917H642.548C641.601 171.917 640.833 171.17 640.833 170.25C640.833 170.171 640.839 170.092 640.85 170.014L642.075 161.681C642.196 160.86 642.919 160.25 643.772 160.25H644.857C644.857 157.489 647.159 155.25 650 155.25C652.84 155.25 655.143 157.489 655.143 160.25ZM646.571 160.25H653.428C653.428 158.409 651.893 156.917 650 156.917C648.106 156.917 646.571 158.409 646.571 160.25ZM642.548 170.25L643.772 161.917H656.227L657.452 170.25H642.548Z"
              fill="#000000"
            />
          </svg>
        )}
        {count > 0 && (
          <div className="absolute top-0 right-0 bg-[#FAA619] text-[#FFFFFF] rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold -mt-1 lg:-mr-1 -mr-2">
            {count}
          </div>
        )}
      </div>
      <span className="text-[10px] mt-1 font-semibold text-[#000000] hidden lg:block group-hover:opacity-80">
        {customText || 'Basket'}
      </span>
    </Link>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart, customIconUrl, customText, customUrl}) {
  return (
    <Suspense
      fallback={
        <CartBadge
          count={0}
          customIconUrl={customIconUrl}
          customText={customText}
          customUrl={customUrl}
        />
      }
    >
      <Await resolve={cart}>
        <CartBanner
          customIconUrl={customIconUrl}
          customText={customText}
          customUrl={customUrl}
        />
      </Await>
    </Suspense>
  );
}

function CartBanner({customIconUrl, customText, customUrl}) {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return (
    <CartBadge
      count={cart?.totalQuantity ?? 0}
      customIconUrl={customIconUrl}
      customText={customText}
      customUrl={customUrl}
    />
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
