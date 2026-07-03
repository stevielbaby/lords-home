# Lord's Home — Book Funnel

Personal branding / book funnel site for **Gavin Dees** and **Lord's Home**, built as a headless Shopify storefront (mock catalog for now).

## Stack

- Next.js (App Router)
- Tailwind CSS
- Shopify-ready product layer (`src/lib/shopify`)

## Funnel flow (demo)

1. **Landing** (`/`) — hero, book pitch, offer picker (hardcover / study-guide bundle), testimonials, about, newsletter
2. **Checkout** (`/checkout`) — contact, delivery, shipping, payment, order summary
3. **Speaking tickets** (`/events`) — post-purchase OTO for live engagements (skippable)
4. **Thank you** (`/thank-you`) — confirmation with book + optional tickets

Speaking tickets are controlled by `speakingEventsEnabled` in `src/lib/funnel.ts`. Turn that off when there is no live tour — checkout will skip straight to thank-you.

No real payments are processed. Checkout is a full UI preview until Shopify is connected.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port Next assigns).

## Connect Shopify later

1. Create a Shopify store and a Storefront API access token.
2. Copy `.env.example` → `.env.local` and fill in:
   - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
   - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
   - `NEXT_PUBLIC_SHOPIFY_BOOK_HANDLE`
3. Implement the Storefront queries in `src/lib/shopify/client.ts` (`getBookProduct`, `createCheckoutUrl`).

Until those env vars are set, Buy Now routes to an on-site checkout placeholder.

## Content

Copy and brand strings live in `src/lib/site.ts`. Mock product data lives in `src/lib/shopify/mock-data.ts`.
