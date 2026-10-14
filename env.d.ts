/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

declare global {
  interface Env {
    /** Optional public origin (e.g. https://www.example.com) for canonicals/sitemaps */
    PUBLIC_STOREFRONT_URL?: string;
  }
}
