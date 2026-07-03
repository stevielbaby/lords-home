/**
 * Headless Shopify config.
 * Wire these env vars when the store is ready — the UI already calls through this layer.
 */
export const shopifyConfig = {
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "",
  storefrontAccessToken:
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "",
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION ?? "2025-01",
  /** Product handle for the primary book funnel offer */
  bookHandle:
    process.env.NEXT_PUBLIC_SHOPIFY_BOOK_HANDLE ?? "property-of-yahweh",
  /** Set true once Storefront API credentials are live */
  isLive: Boolean(
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN &&
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  ),
};
