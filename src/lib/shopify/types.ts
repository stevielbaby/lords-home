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
  /** Book subtotal + shipping (before tickets) */
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
};
