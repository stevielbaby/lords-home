# Lord's Home — Book Funnel

Personal branding / book funnel site for **Gavin Dees** and **Lord's Home**, built as a headless Shopify storefront (mock catalog for now).

## Stack

- Next.js (App Router)
- Tailwind CSS
- Shopify-ready product layer (`src/lib/shopify`)

## Funnel flow (demo)

Cart-based (Shopify-shaped) so post-card upsells still land in the **same cart** before capture:

1. **Landing** (`/`) — pick book package → `createFunnelCart` (book line item)
2. **Checkout** (`/checkout?cart=…`) — contact, shipping, card on file (**not charged yet**) → cart status `pending_upsell`
3. **Speaking tickets** (`/events?cart=…`) — `addTicketsToCart` (cartLinesAdd) or skip → `completeCheckout` charges **full cart once**
4. **Thank you** (`/thank-you`) — book + optional tickets

Speaking tickets are controlled by `speakingEventsEnabled` in `src/lib/funnel.ts`.

### Shopify handoff

| Step | Mock today | Live Storefront API |
| --- | --- | --- |
| Start cart | `sessionStorage` cart | `cartCreate` |
| Add tickets OTO | `addTicketsToCart` | `cartLinesAdd` |
| Pay | Simulated capture of full cart | Redirect to `checkoutUrl` **after** lines are complete |

Important: standard Shopify hosted checkout cannot insert an OTO *after* payment is captured. This funnel keeps the card on file / buyer identity, adds ticket lines to the open cart, then finalizes **once**. That maps cleanly to Storefront cart APIs.

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
