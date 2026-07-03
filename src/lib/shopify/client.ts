import { shopifyConfig } from "./config";
import { mockBookProduct, mockShippingMethods } from "./mock-data";
import type {
  CartLineInput,
  Product,
  ProductVariant,
  ShippingMethod,
} from "./types";

/**
 * Product fetch — mock today, Storefront API tomorrow.
 * Swap the body of these functions when credentials land; call sites stay the same.
 */
export async function getBookProduct(): Promise<Product> {
  if (!shopifyConfig.isLive) {
    return mockBookProduct;
  }

  // TODO: Storefront API productByHandle query
  return mockBookProduct;
}

export async function getProductByHandle(
  handle: string,
): Promise<Product | null> {
  if (!shopifyConfig.isLive) {
    if (handle === mockBookProduct.handle) return mockBookProduct;
    return null;
  }

  // TODO: Storefront API productByHandle query
  return handle === mockBookProduct.handle ? mockBookProduct : null;
}

export async function getVariantById(
  variantId: string,
): Promise<ProductVariant | null> {
  const product = await getBookProduct();
  return product.variants.find((variant) => variant.id === variantId) ?? null;
}

export async function getShippingMethods(): Promise<ShippingMethod[]> {
  return mockShippingMethods;
}

/**
 * Returns a checkout URL for the selected variant.
 * Mock mode routes to the on-site checkout experience.
 */
export async function createCheckoutUrl(
  lines: CartLineInput[],
): Promise<string> {
  if (!shopifyConfig.isLive) {
    const variant = lines[0]?.merchandiseId ?? "default";
    const qty = lines[0]?.quantity ?? 1;
    return `/checkout?variant=${encodeURIComponent(variant)}&qty=${qty}`;
  }

  // TODO: cartCreate mutation → checkoutUrl
  return "/checkout";
}

export function formatMoney(amount: string | number, currencyCode = "USD"): string {
  const value = typeof amount === "number" ? amount : Number.parseFloat(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function createOrderId(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `LH-${stamp.slice(-4)}${rand}`;
}
