require('dotenv').config();
const token = process.env.PUBLIC_STOREFRONT_API_TOKEN;
const domain = process.env.PUBLIC_STORE_DOMAIN;
const query = `
  query {
    metaobjects(type: "footer_main", first: 1) {
      nodes {
        fields {
          key
          value
        }
      }
    }
  }
`;

fetch(`https://${domain}/api/2024-01/graphql.json`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': token
  },
  body: JSON.stringify({ query })
})
.then(res => res.json())
.then(res => console.log(JSON.stringify(res, null, 2)))
.catch(console.error);
