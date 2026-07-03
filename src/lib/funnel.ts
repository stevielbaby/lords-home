/**
 * Funnel feature flags and speaking-event catalog.
 * Flip speakingEventsEnabled off when there is no live tour / engagement run.
 *
 * Ticket tiers include merchandiseId so OTOs map to Shopify cart line items.
 */
export const funnelConfig = {
  /** When false, checkout finalizes payment immediately (no ticket OTO). */
  speakingEventsEnabled: true,
};

export type TicketTier = {
  id: string;
  /** Shopify ProductVariant GID — used by cartLinesAdd */
  merchandiseId: string;
  title: string;
  description: string;
  price: number;
  currencyCode: string;
  badge?: string;
};

export type SpeakingEvent = {
  id: string;
  title: string;
  city: string;
  venue: string;
  date: string;
  time: string;
  description: string;
  tickets: TicketTier[];
};

function ticketGid(id: string) {
  return `gid://shopify/ProductVariant/ticket-${id}`;
}

export const speakingEvents: SpeakingEvent[] = [
  {
    id: "houston-aug-2026",
    title: "Property of Yahweh Night",
    city: "Houston, TX",
    venue: "The House",
    date: "August 14, 2026",
    time: "7:00 PM",
    description:
      "An evening of word, worship, and belonging. Come as family — leave knowing whose you are.",
    tickets: [
      {
        id: "houston-ga",
        merchandiseId: ticketGid("houston-ga"),
        title: "General Admission",
        description: "Floor access for the full night.",
        price: 25,
        currencyCode: "USD",
      },
      {
        id: "houston-vip",
        merchandiseId: ticketGid("houston-vip"),
        title: "VIP + Meet & Greet",
        description: "Priority seating plus a post-night meet with Gavin.",
        price: 75,
        currencyCode: "USD",
        badge: "Limited",
      },
    ],
  },
  {
    id: "atlanta-sep-2026",
    title: "House Gathering",
    city: "Atlanta, GA",
    venue: "Legacy Hall",
    date: "September 11, 2026",
    time: "7:30 PM",
    description:
      "A night for the ones who are done performing. Identity, family, and the Word — live.",
    tickets: [
      {
        id: "atlanta-ga",
        merchandiseId: ticketGid("atlanta-ga"),
        title: "General Admission",
        description: "Entry to the gathering.",
        price: 30,
        currencyCode: "USD",
      },
      {
        id: "atlanta-vip",
        merchandiseId: ticketGid("atlanta-vip"),
        title: "VIP + Meet & Greet",
        description: "Front section seating and a private meet after.",
        price: 85,
        currencyCode: "USD",
        badge: "Limited",
      },
    ],
  },
  {
    id: "la-oct-2026",
    title: "Belonging Tour",
    city: "Los Angeles, CA",
    venue: "The Warehouse",
    date: "October 3, 2026",
    time: "7:00 PM",
    description:
      "West Coast night with Lord's Home. Come ready. Leave covered.",
    tickets: [
      {
        id: "la-ga",
        merchandiseId: ticketGid("la-ga"),
        title: "General Admission",
        description: "General entry.",
        price: 35,
        currencyCode: "USD",
      },
      {
        id: "la-vip",
        merchandiseId: ticketGid("la-vip"),
        title: "VIP + Meet & Greet",
        description: "VIP section and meet & greet access.",
        price: 95,
        currencyCode: "USD",
        badge: "Limited",
      },
    ],
  },
];

export const eventsCopy = {
  stepLabel: "Add to your order",
  eyebrow: "One more thing",
  heading: "Experience it live",
  body: "Your card is on file and your book is in the cart. Add tickets now and they’ll be charged together in one payment — or skip and complete the book order only.",
  skip: "No thanks — complete book order only",
  cta: "Add tickets & complete order",
  demoNote:
    "Tickets are added to the same cart, then the full cart is charged once.",
};

export function getSpeakingEvent(id: string): SpeakingEvent | undefined {
  return speakingEvents.find((event) => event.id === id);
}

export function getTicketTier(
  eventId: string,
  ticketId: string,
): { event: SpeakingEvent; ticket: TicketTier } | null {
  const event = getSpeakingEvent(eventId);
  const ticket = event?.tickets.find((item) => item.id === ticketId);
  if (!event || !ticket) return null;
  return { event, ticket };
}

/** Flat catalog of ticket variants for Shopify merchandise lookups */
export function allTicketVariants(): TicketTier[] {
  return speakingEvents.flatMap((event) => event.tickets);
}
