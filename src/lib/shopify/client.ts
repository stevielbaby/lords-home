import {
  addTicketLine,
  clearCart,
  createCartId,
  loadCartById,
  markPendingUpsell,
  orderFromCart,
  replaceBookLine,
  saveCart,
  saveOrder,
  setCartBuyer,
  setCartPayment,
  setCartShipping,
} from "@/lib/cart";
import { shopifyConfig } from "./config";
import { mockBookProduct, mockShippingMethods } from "./mock-data";
import type {
  CartBuyer,
  CartLineInput,
  CartPayment,
  FunnelCart,
  Product,
  ProductVariant,
  ShippingMethod,
} from "./types";

// Re-export cart helpers used by UI (avoid circular imports in components)
export {
  cartBookSubtotal,
  cartGrandTotal,
  cartTicketsTotal,
  getBookLines,
  getTicketLines,
  loadCart,
  loadCartById,
  loadOrder,
} from "@/lib/cart";

/**
 * Product fetch — mock today, Storefront API tomorrow.
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

function newBookLine(
  variant: ProductVariant,
  productTitle: string,
  quantity: number,
) {
  return {
    merchandiseId: variant.id,
    quantity,
    title: productTitle,
    subtitle: variant.title,
    unitPrice: Number.parseFloat(variant.price.amount),
    currencyCode: variant.price.currencyCode,
  };
}

/**
 * Start a funnel cart with the selected book variant.
 * Live: cartCreate Storefront mutation.
 * Mock: session cart.
 */
export async function createFunnelCart(input: {
  merchandiseId: string;
  quantity: number;
}): Promise<FunnelCart> {
  const product = await getBookProduct();
  const variant =
    product.variants.find((item) => item.id === input.merchandiseId) ??
    product.variants[0];
  const shipping = mockShippingMethods[0];

  const cart: FunnelCart = {
    id: createCartId(),
    status: "open",
    lines: [],
    shippingMethodId: shipping.id,
    shippingPrice: Number.parseFloat(shipping.price.amount),
    shippingTitle: shipping.title,
    currencyCode: variant.price.currencyCode,
    updatedAt: new Date().toISOString(),
  };

  const withBook = replaceBookLine(
    cart,
    newBookLine(variant, product.title, input.quantity),
  );

  if (shopifyConfig.isLive) {
    // TODO: cartCreate(lines) → set shopifyCartId + checkoutUrl
    // const remote = await storefront.cartCreate(...)
    // withBook.shopifyCartId = remote.id
  }

  saveCart(withBook);
  return withBook;
}

/**
 * Update the book line (package / qty) while preserving ticket lines.
 * Live: cartLinesUpdate / remove+add.
 */
export async function updateBookInCart(
  cartId: string,
  merchandiseId: string,
  quantity: number,
): Promise<FunnelCart> {
  const cart = loadCartById(cartId);
  if (!cart) throw new Error("Cart not found");

  const product = await getBookProduct();
  const variant =
    product.variants.find((item) => item.id === merchandiseId) ??
    product.variants[0];

  const updated = replaceBookLine(
    cart,
    newBookLine(variant, product.title, quantity),
  );

  if (shopifyConfig.isLive && cart.shopifyCartId) {
    // TODO: cartLinesUpdate on shopifyCartId
  }

  saveCart(updated);
  return updated;
}

export async function updateCartShipping(
  cartId: string,
  shippingMethodId: string,
): Promise<FunnelCart> {
  const cart = loadCartById(cartId);
  if (!cart) throw new Error("Cart not found");
  const method =
    mockShippingMethods.find((item) => item.id === shippingMethodId) ??
    mockShippingMethods[0];

  const updated = setCartShipping(cart, {
    id: method.id,
    title: method.title,
    price: Number.parseFloat(method.price.amount),
  });
  saveCart(updated);
  return updated;
}

/**
 * Save buyer + payment fingerprint and move cart into pending_upsell.
 * Payment is NOT captured yet — ticket OTO can still cartLinesAdd.
 */
export async function prepareUpsellCheckout(
  cartId: string,
  buyer: CartBuyer,
  payment: CartPayment | null,
  shippingMethodId: string,
): Promise<FunnelCart> {
  let cart = loadCartById(cartId);
  if (!cart) throw new Error("Cart not found");

  const method =
    mockShippingMethods.find((item) => item.id === shippingMethodId) ??
    mockShippingMethods[0];

  cart = setCartBuyer(cart, buyer);
  cart = setCartShipping(cart, {
    id: method.id,
    title: method.title,
    price: Number.parseFloat(method.price.amount),
  });
  if (payment) {
    cart = setCartPayment(cart, payment);
  }
  cart = markPendingUpsell(cart);

  if (shopifyConfig.isLive && cart.shopifyCartId) {
    // TODO: cartBuyerIdentityUpdate + cartDeliveryAddressesAdd
  }

  saveCart(cart);
  return cart;
}

/**
 * Add speaking tickets to the open/pending cart (Shopify cartLinesAdd).
 * This is the critical OTO step — must run BEFORE payment is finalized.
 */
export async function addTicketsToCart(
  cartId: string,
  input: {
    merchandiseId: string;
    quantity: number;
    title: string;
    subtitle: string;
    unitPrice: number;
    currencyCode: string;
    ticketMeta: NonNullable<FunnelCart["lines"][number]["ticketMeta"]>;
  },
): Promise<FunnelCart> {
  const cart = loadCartById(cartId);
  if (!cart) throw new Error("Cart not found");
  if (cart.status === "completed") {
    throw new Error("Cannot add lines to a completed cart");
  }

  const updated = addTicketLine(cart, {
    merchandiseId: input.merchandiseId,
    quantity: input.quantity,
    title: input.title,
    subtitle: input.subtitle,
    unitPrice: input.unitPrice,
    currencyCode: input.currencyCode,
    ticketMeta: input.ticketMeta,
  });

  if (shopifyConfig.isLive && cart.shopifyCartId) {
    // TODO: cartLinesAdd(cartId, [{ merchandiseId, quantity }])
  }

  saveCart(updated);
  return updated;
}

export type CompleteCheckoutResult =
  | { mode: "mock"; orderId: string; thankYouPath: string }
  | { mode: "shopify"; checkoutUrl: string };

/**
 * Finalize the cart.
 * Mock: charge full cart (book + tickets) with payment on file → order.
 * Live: return Shopify checkoutUrl for the FULL cart (all lines).
 */
export async function completeCheckout(
  cartId: string,
): Promise<CompleteCheckoutResult> {
  const cart = loadCartById(cartId);
  if (!cart) throw new Error("Cart not found");
  if (!cart.buyer) throw new Error("Buyer missing");

  if (shopifyConfig.isLive) {
    // TODO: ensure remote cart has all lines, then:
    // return { mode: "shopify", checkoutUrl: cart.checkoutUrl }
    // Buyer pays ONCE on Shopify for book + tickets.
    throw new Error(
      "Shopify live checkout not configured — set Storefront API env vars.",
    );
  }

  if (!cart.payment) {
    throw new Error("Payment method missing");
  }

  // Simulate capture of the full cart total
  await new Promise((resolve) => setTimeout(resolve, 900));

  const orderId = createOrderId();
  const order = orderFromCart(cart, orderId);
  saveOrder(order);

  // Funnel is finished — destroy the cart so /checkout and /events no longer exist for this run
  clearCart();

  return {
    mode: "mock",
    orderId,
    thankYouPath: `/thank-you?order=${encodeURIComponent(orderId)}`,
  };
}

/**
 * Entry helper used by Buy buttons — creates cart and returns checkout path.
 */
export async function createCheckoutUrl(
  lines: CartLineInput[],
): Promise<string> {
  const primary = lines[0];
  if (!primary) return "/#offer";

  const cart = await createFunnelCart({
    merchandiseId: primary.merchandiseId,
    quantity: primary.quantity,
  });

  return `/checkout?cart=${encodeURIComponent(cart.id)}`;
}

export function formatMoney(
  amount: string | number,
  currencyCode = "USD",
): string {
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

export function cardBrandFromNumber(card: string): string {
  if (card.startsWith("4")) return "Visa";
  if (card.startsWith("5")) return "Mastercard";
  if (card.startsWith("3")) return "Amex";
  return "Card";
}
