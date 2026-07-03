import type { Product, ShippingMethod } from "./types";

/** Placeholder catalog until Shopify Storefront API is connected. */
export const mockBookProduct: Product = {
  id: "gid://shopify/Product/mock-book-001",
  handle: "property-of-yahweh",
  title: "Property of Yahweh",
  description:
    "You were never meant to belong to the world. This book is a call back to identity, family, and the quiet confidence of knowing exactly whose you are.",
  descriptionHtml:
    "<p>You were never meant to belong to the world. This book is a call back to identity, family, and the quiet confidence of knowing exactly whose you are.</p>",
  availableForSale: true,
  priceRange: {
    minVariantPrice: {
      amount: "24.00",
      currencyCode: "USD",
    },
  },
  featuredImage: {
    url: "/images/book-cover.png",
    altText: "Property of Yahweh book cover by Gavin Dees",
    width: 1024,
    height: 1536,
  },
  variants: [
    {
      id: "gid://shopify/ProductVariant/mock-book-001-default",
      title: "Hardcover",
      availableForSale: true,
      description: "The full book. Keep it. Mark it up. Pass it on.",
      price: {
        amount: "24.00",
        currencyCode: "USD",
      },
    },
    {
      id: "gid://shopify/ProductVariant/mock-book-001-bundle",
      title: "Book + Study Guide",
      availableForSale: true,
      badge: "Most chosen",
      description:
        "The book plus a guided study for personal devotion or small groups.",
      price: {
        amount: "36.00",
        currencyCode: "USD",
      },
      compareAtPrice: {
        amount: "44.00",
        currencyCode: "USD",
      },
    },
  ],
};

export const mockShippingMethods: ShippingMethod[] = [
  {
    id: "standard",
    title: "Standard",
    description: "Tracked shipping",
    price: { amount: "0.00", currencyCode: "USD" },
    eta: "5–8 business days",
  },
  {
    id: "express",
    title: "Express",
    description: "Priority handling",
    price: { amount: "12.00", currencyCode: "USD" },
    eta: "2–3 business days",
  },
];
