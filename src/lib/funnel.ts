/**
 * Funnel feature flags and speaking-event catalog.
 * Flip speakingEventsEnabled off when there is no live tour / engagement run.
 */
export const funnelConfig = {
  /** When false, book checkout goes straight to thank-you */
  speakingEventsEnabled: true,
};

export type TicketTier = {
  id: string;
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
        title: "General Admission",
        description: "Floor access for the full night.",
        price: 25,
        currencyCode: "USD",
      },
      {
        id: "houston-vip",
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
        title: "General Admission",
        description: "Entry to the gathering.",
        price: 30,
        currencyCode: "USD",
      },
      {
        id: "atlanta-vip",
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
        title: "General Admission",
        description: "General entry.",
        price: 35,
        currencyCode: "USD",
      },
      {
        id: "la-vip",
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
  stepLabel: "Step 2 of 2",
  eyebrow: "One more thing",
  heading: "Experience it live",
  body: "Your book is locked in. If you want to be in the room, grab tickets to an upcoming night — only shown when dates are live.",
  skip: "No thanks — continue to confirmation",
  cta: "Add tickets",
  demoNote: "Demo tickets — no payment is processed.",
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
