export type Money = {
  amount: string;
  currencyCode: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice?: Money;
  description?: string;
  badge?: string;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: Money;
  };
  featuredImage: {
    url: string;
    altText: string;
    width: number;
    height: number;
  } | null;
  variants: ProductVariant[];
};

export type CartLineInput = {
  merchandiseId: string;
  quantity: number;
};

export type ShippingMethod = {
  id: string;
  title: string;
  description: string;
  price: Money;
  eta: string;
};

/** Line item in the funnel cart — maps 1:1 to Shopify cart lines. */
export type CartLine = {
  id: string;
  merchandiseId: string;
  quantity: number;
  title: string;
  subtitle?: string;
  unitPrice: number;
  currencyCode: string;
  kind: "book" | "ticket";
  /** Ticket metadata for confirmation UI */
  ticketMeta?: {
    eventId: string;
    eventTitle: string;
    city: string;
    venue: string;
    date: string;
    time: string;
    ticketTitle: string;
  };
};

export type CartBuyer = {
  email: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  marketingOptIn: boolean;
};

/** Payment fingerprint only — never store full PAN. */
export type CartPayment = {
  last4: string;
  brand: string;
  /** Mock token; live Shopify uses checkoutUrl instead of our card form */
  mockToken: string;
};

/**
 * Funnel cart.
 * open → buyer filling checkout
 * pending_upsell → card/info captured, OTO can still cartLinesAdd
 * completed → paid / handed off to Shopify checkout
 */
export type FunnelCart = {
  id: string;
  status: "open" | "pending_upsell" | "completed";
  lines: CartLine[];
  shippingMethodId: string;
  shippingPrice: number;
  shippingTitle: string;
  currencyCode: string;
  buyer?: CartBuyer;
  payment?: CartPayment;
  /** Populated when Storefront API cartCreate succeeds */
  shopifyCartId?: string;
  checkoutUrl?: string;
  updatedAt: string;
};

export type OrderTicket = {
  eventId: string;
  eventTitle: string;
  city: string;
  venue: string;
  date: string;
  time: string;
  ticketId: string;
  ticketTitle: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type MockOrder = {
  id: string;
  email: string;
  variantId: string;
  variantTitle: string;
  productTitle: string;
  quantity: number;
  subtotal: number;
  shipping: number;
  bookTotal: number;
  tickets?: OrderTicket[];
  ticketsTotal: number;
  total: number;
  currencyCode: string;
  shippingMethod: string;
  createdAt: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    country: string;
  };
  /** Cart id that produced this order — audit trail for Shopify handoff */
  cartId?: string;
};
