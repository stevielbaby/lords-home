import type {
  CartBuyer,
  CartLine,
  CartPayment,
  FunnelCart,
  MockOrder,
  OrderTicket,
} from "@/lib/shopify/types";

const CART_KEY = "lords-home-funnel-cart";
const ORDER_KEY = "lords-home-last-order";

function now() {
  return new Date().toISOString();
}

function lineId() {
  return `line_${Math.random().toString(36).slice(2, 10)}`;
}

export function createCartId() {
  return `cart_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function saveCart(cart: FunnelCart) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CART_KEY, JSON.stringify({ ...cart, updatedAt: now() }));
}

export function loadCart(): FunnelCart | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(CART_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as FunnelCart;
  } catch {
    return null;
  }
}

export function loadCartById(cartId: string): FunnelCart | null {
  const cart = loadCart();
  if (!cart || cart.id !== cartId) return null;
  return cart;
}

export function clearCart() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CART_KEY);
}

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

export function getBookLines(cart: FunnelCart): CartLine[] {
  return cart.lines.filter((line) => line.kind === "book");
}

export function getTicketLines(cart: FunnelCart): CartLine[] {
  return cart.lines.filter((line) => line.kind === "ticket");
}

export function cartMerchandiseSubtotal(cart: FunnelCart): number {
  return cart.lines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0,
  );
}

export function cartBookSubtotal(cart: FunnelCart): number {
  return getBookLines(cart).reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0,
  );
}

export function cartTicketsTotal(cart: FunnelCart): number {
  return getTicketLines(cart).reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0,
  );
}

export function cartGrandTotal(cart: FunnelCart): number {
  return cartMerchandiseSubtotal(cart) + cart.shippingPrice;
}

export function replaceBookLine(
  cart: FunnelCart,
  line: Omit<CartLine, "id" | "kind">,
): FunnelCart {
  const bookLine: CartLine = {
    ...line,
    id: lineId(),
    kind: "book",
  };
  return {
    ...cart,
    lines: [...getTicketLines(cart), bookLine],
    updatedAt: now(),
  };
}

export function addTicketLine(
  cart: FunnelCart,
  line: Omit<CartLine, "id" | "kind">,
): FunnelCart {
  // One ticket package per order — replace any existing ticket lines
  const ticketLine: CartLine = {
    ...line,
    id: lineId(),
    kind: "ticket",
  };
  return {
    ...cart,
    lines: [...getBookLines(cart), ticketLine],
    updatedAt: now(),
  };
}

export function setCartBuyer(cart: FunnelCart, buyer: CartBuyer): FunnelCart {
  return { ...cart, buyer, updatedAt: now() };
}

export function setCartPayment(
  cart: FunnelCart,
  payment: CartPayment,
): FunnelCart {
  return { ...cart, payment, updatedAt: now() };
}

export function setCartShipping(
  cart: FunnelCart,
  input: { id: string; title: string; price: number },
): FunnelCart {
  return {
    ...cart,
    shippingMethodId: input.id,
    shippingTitle: input.title,
    shippingPrice: input.price,
    updatedAt: now(),
  };
}

export function markPendingUpsell(cart: FunnelCart): FunnelCart {
  return { ...cart, status: "pending_upsell", updatedAt: now() };
}

export function markCompleted(cart: FunnelCart): FunnelCart {
  return { ...cart, status: "completed", updatedAt: now() };
}

export function orderFromCart(cart: FunnelCart, orderId: string): MockOrder {
  const book = getBookLines(cart)[0];
  const tickets: OrderTicket[] = getTicketLines(cart).map((line) => ({
    eventId: line.ticketMeta?.eventId ?? "",
    eventTitle: line.ticketMeta?.eventTitle ?? line.title,
    city: line.ticketMeta?.city ?? "",
    venue: line.ticketMeta?.venue ?? "",
    date: line.ticketMeta?.date ?? "",
    time: line.ticketMeta?.time ?? "",
    ticketId: line.merchandiseId,
    ticketTitle: line.ticketMeta?.ticketTitle ?? line.subtitle ?? line.title,
    quantity: line.quantity,
    unitPrice: line.unitPrice,
    lineTotal: line.unitPrice * line.quantity,
  }));

  const bookSubtotal = cartBookSubtotal(cart);
  const ticketsTotal = cartTicketsTotal(cart);
  const bookTotal = bookSubtotal + cart.shippingPrice;

  return {
    id: orderId,
    email: cart.buyer?.email ?? "",
    variantId: book?.merchandiseId ?? "",
    variantTitle: book?.subtitle ?? book?.title ?? "Book",
    productTitle: book?.title ?? "Property of Yahweh",
    quantity: book?.quantity ?? 1,
    subtotal: bookSubtotal,
    shipping: cart.shippingPrice,
    bookTotal,
    tickets: tickets.length ? tickets : undefined,
    ticketsTotal,
    total: cartGrandTotal(cart),
    currencyCode: cart.currencyCode,
    shippingMethod: cart.shippingTitle,
    createdAt: now(),
    cartId: cart.id,
    shippingAddress: {
      firstName: cart.buyer?.firstName ?? "",
      lastName: cart.buyer?.lastName ?? "",
      address1: cart.buyer?.address1 ?? "",
      address2: cart.buyer?.address2,
      city: cart.buyer?.city ?? "",
      province: cart.buyer?.province ?? "",
      zip: cart.buyer?.zip ?? "",
      country: cart.buyer?.country ?? "United States",
    },
  };
}
