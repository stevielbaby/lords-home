import type { MockOrder, OrderTicket } from "@/lib/shopify/types";

const ORDER_KEY = "lords-home-last-order";

export function saveOrder(order: MockOrder) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

export function loadOrder(): MockOrder | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(ORDER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MockOrder;
  } catch {
    return null;
  }
}

export function attachTicketsToOrder(
  order: MockOrder,
  tickets: OrderTicket[],
): MockOrder {
  const ticketsTotal = tickets.reduce((sum, ticket) => sum + ticket.lineTotal, 0);
  const bookTotal = order.bookTotal ?? order.subtotal + order.shipping;
  return {
    ...order,
    bookTotal,
    tickets,
    ticketsTotal,
    total: bookTotal + ticketsTotal,
  };
}
