// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/cart
export const CART_QUERY_FRAGMENT = `#graphql
  fragment Money on MoneyV2 {
    currencyCode
    amount
  }
  fragment CartLine on CartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        ...Money
      }
      subtotalAmount {
        ...Money
      }
      amountPerQuantity {
        ...Money
      }
      compareAtAmountPerQuantity {
        ...Money
      }
    }
    discountAllocations {
      discountedAmount {
        ...Money
      }
      ... on CartAutomaticDiscountAllocation {
        title
      }
      ... on CartCodeDiscountAllocation {
        code
      }
      ... on CartCustomDiscountAllocation {
        title
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        quantityAvailable
        compareAtPrice {
          ...Money
        }
        price {
          ...Money
        }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height
        }
        product {
          handle
          title
          id
          vendor
        }
        selectedOptions {
          name
          value
        }
      }
    }
    parentRelationship {
      parent {
        id
      }
    }
  }
  fragment CartLineComponent on ComponentizableCartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        ...Money
      }
      subtotalAmount {
        ...Money
      }
      amountPerQuantity {
        ...Money
      }
      compareAtAmountPerQuantity {
        ...Money
      }
    }
    discountAllocations {
      discountedAmount {
        ...Money
      }
      ... on CartAutomaticDiscountAllocation {
        title
      }
      ... on CartCodeDiscountAllocation {
        code
      }
      ... on CartCustomDiscountAllocation {
        title
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        quantityAvailable
        compareAtPrice {
          ...Money
        }
        price {
          ...Money
        }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height
        }
        product {
          handle
          title
          id
          vendor
        }
        selectedOptions {
          name
          value
        }
      }
    }
    lineComponents {
      ...CartLine
    }
  }
  fragment CartApiQuery on Cart {
    updatedAt
    id
    appliedGiftCards {
      id
      lastCharacters
      amountUsed {
        ...Money
      }
    }
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: $numCartLines) {
      nodes {
        ...CartLine
      }
      nodes {
        ...CartLineComponent
      }
    }
    cost {
      subtotalAmount {
        ...Money
      }
      totalAmount {
        ...Money
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
      applicable
    }
    discountAllocations {
      discountedAmount {
        ...Money
      }
      ... on CartAutomaticDiscountAllocation {
        title
      }
      ... on CartCodeDiscountAllocation {
        code
      }
      ... on CartCustomDiscountAllocation {
        title
      }
    }
  }
`;

const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment GrandChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
    items {
      ...GrandChildMenuItem
    }
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
`;

export const HEADER_QUERY = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  fragment AnnouncementBarMetaobject on Metaobject {
    id
    handle
    type
    fields {
      key
      value
      reference {
        ... on MediaImage {
          id
          image {
            url
            altText
          }
        }
        ... on Collection {
          id
          handle
          title
        }
        ... on Product {
          id
          handle
          title
        }
        ... on Page {
          id
          handle
          title
        }
      }
    }
  }
  query Header(
    $country: CountryCode
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      ...Shop
    }
    menu(handle: $headerMenuHandle) {
      ...Menu
    }
    topBar: metaobject(handle: {type: "top_bar_link_main", handle: "top-bar-link-main"}) {
      fields {
        key
        value
        references(first: 10) {
          nodes {
            ... on Metaobject {
              fields {
                key
                value
                reference {
                  ... on MediaImage {
                    image {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    announcementBarMetaobject: metaobject(handle: {handle: "announcement-bar-1", type: "announcement_bar"}) {
      ...AnnouncementBarMetaobject
    }
    announcementBarMetaobjects: metaobjects(type: "announcement_bar", first: 10) {
      nodes {
        ...AnnouncementBarMetaobject
      }
    }
    mobileHeroCategories: metaobject(handle: {handle: "department-list", type: "home_page"}) {
      id
      handle
      type
      fields {
        key
        value
        reference {
          ... on Metaobject {
            id
            handle
            fields {
              key
              value
              reference {
                ... on MediaImage {
                  image {
                    url
                    altText
                    width
                    height
                  }
                }
                ... on Collection {
                  id
                  handle
                  title
                }
              }
              references(first: 20) {
                nodes {
                  ... on Collection {
                    id
                    handle
                    title
                  }
                }
              }
            }
          }
        }
        references(first: 50) {
          nodes {
            ... on Metaobject {
              id
              handle
              fields {
                key
                value
                reference {
                  ... on MediaImage {
                    image {
                      url
                      altText
                      width
                      height
                    }
                  }
                  ... on Collection {
                    id
                    handle
                    title
                  }
                }
                references(first: 20) {
                  nodes {
                    ... on Collection {
                      id
                      handle
                      title
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
  ${MENU_FRAGMENT}
`;

export const FOOTER_QUERY = `#graphql
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
    moreMenu: menu(handle: "more") {
      ...Menu
    }
    helpMenu: menu(handle: "help") {
      ...Menu
    }
    footerWomen: menu(handle: "footer-women") { ...Menu }
    footerMen: menu(handle: "footer-men") { ...Menu }
    footerKids: menu(handle: "footer-kids") { ...Menu }
    footerHomeLiving: menu(handle: "footer-home-living") { ...Menu }
    footerFootwear: menu(handle: "footer-footwear") { ...Menu }
    footerBeauty: menu(handle: "footer-beauty") { ...Menu }
    footerBags: menu(handle: "footer-bags") { ...Menu }
    footerBabyshop: menu(handle: "footer-babyshop") { ...Menu }
    metaobjects(type: "footer_main", first: 1) {
      nodes {
        fields {
          key
          value
          reference {
            ... on Metaobject {
              fields {
                key
                value
                reference {
                  ... on MediaImage {
                    image {
                      url
                      altText
                    }
                  }
                }
                references(first: 10) {
                  nodes {
                    ... on Metaobject {
                      fields {
                        key
                        value
                        reference {
                          ... on MediaImage {
                            image {
                              url
                              altText
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            ... on MediaImage {
              image {
                url
                altText
              }
            }
          }
          references(first: 10) {
            nodes {
              ... on Metaobject {
                fields {
                  key
                  value
                  reference {
                    ... on MediaImage {
                      image {
                        url
                        altText
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
  }
  ${MENU_FRAGMENT}
`;
