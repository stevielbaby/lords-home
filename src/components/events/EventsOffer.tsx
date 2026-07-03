"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FunnelProgress } from "@/components/FunnelProgress";
import { PaymentProcessingModal } from "@/components/PaymentProcessingModal";
import { images } from "@/lib/images";
import {
  eventsCopy,
  speakingEvents,
  type SpeakingEvent,
} from "@/lib/funnel";
import {
  addTicketsToCart,
  cartBookSubtotal,
  cartGrandTotal,
  cartTicketsTotal,
  completeCheckout,
  formatMoney,
  getBookLines,
  getTicketLines,
  loadCartById,
  loadOrder,
} from "@/lib/shopify/client";
import type { FunnelCart } from "@/lib/shopify/types";
import { site } from "@/lib/site";

type EventsOfferProps = {
  cartId: string;
};

export function EventsOffer({ cartId }: EventsOfferProps) {
  const router = useRouter();
  const [cart, setCart] = useState<FunnelCart | null>(null);
  const [eventId, setEventId] = useState(speakingEvents[0]?.id ?? "");
  const [ticketId, setTicketId] = useState(
    speakingEvents[0]?.tickets[0]?.id ?? "",
  );
  const [qty, setQty] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [checkoutReady, setCheckoutReady] = useState(false);
  const [thankYouPath, setThankYouPath] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadCartById(cartId);
    if (!stored || stored.status !== "pending_upsell" || !stored.payment) {
      // Funnel already finished — send them to the receipt, not back into checkout
      const order = loadOrder();
      if (order) {
        router.replace(`/thank-you?order=${encodeURIComponent(order.id)}`);
        return;
      }
      router.replace("/#offer");
      return;
    }
    setCart(stored);
  }, [cartId, router]);

  const event: SpeakingEvent | undefined = speakingEvents.find(
    (item) => item.id === eventId,
  );

  useEffect(() => {
    if (!event) return;
    const stillValid = event.tickets.some((ticket) => ticket.id === ticketId);
    if (!stillValid) {
      setTicketId(event.tickets[0]?.id ?? "");
    }
  }, [event, ticketId]);

  const ticket = event?.tickets.find((item) => item.id === ticketId);
  const ticketLineTotal = useMemo(() => {
    if (!ticket) return 0;
    return ticket.price * qty;
  }, [ticket, qty]);

  const bookTotal = cart
    ? cartBookSubtotal(cart) + cart.shippingPrice
    : 0;
  const projectedTotal = bookTotal + ticketLineTotal;

  async function runPurchase(work: () => Promise<string>) {
    setError(null);
    setSubmitting(true);
    setModalOpen(true);
    setCheckoutReady(false);
    setThankYouPath(null);

    try {
      const path = await work();
      setThankYouPath(path);
      setCheckoutReady(true);
    } catch (err) {
      setModalOpen(false);
      setSubmitting(false);
      setCheckoutReady(false);
      setError(
        err instanceof Error ? err.message : "Could not complete checkout.",
      );
    }
  }

  async function finalize(currentCartId: string): Promise<string> {
    const result = await completeCheckout(currentCartId);
    if (result.mode === "mock") return result.thankYouPath;
    return result.checkoutUrl;
  }

  async function handleAddTickets() {
    if (!cart || !event || !ticket) return;

    await runPurchase(async () => {
      const updated = await addTicketsToCart(cart.id, {
        merchandiseId: ticket.merchandiseId,
        quantity: qty,
        title: `${event.city} · ${event.title}`,
        subtitle: ticket.title,
        unitPrice: ticket.price,
        currencyCode: ticket.currencyCode,
        ticketMeta: {
          eventId: event.id,
          eventTitle: event.title,
          city: event.city,
          venue: event.venue,
          date: event.date,
          time: event.time,
          ticketTitle: ticket.title,
        },
      });
      setCart(updated);
      return finalize(updated.id);
    });
  }

  async function handleSkip() {
    if (!cart) return;
    await runPurchase(() => finalize(cart.id));
  }

  function handleModalComplete() {
    if (!thankYouPath) return;
    if (thankYouPath.startsWith("http")) {
      window.location.href = thankYouPath;
      return;
    }
    router.push(thankYouPath);
  }

  if (!cart) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-ink px-4 text-bone">
        <p className="font-mono text-xs tracking-[0.2em] uppercase">
          Loading your cart…
        </p>
      </div>
    );
  }

  const bookLine = getBookLines(cart)[0];
  const existingTickets = getTicketLines(cart);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-ink text-bone">
      <header className="safe-pt shrink-0 border-b border-bone/10 px-4 py-3 sm:px-5 sm:py-4 md:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="tap-target flex items-center font-display text-base tracking-[0.14em] uppercase sm:text-lg sm:tracking-[0.18em]"
          >
            {site.name}
          </Link>
          <FunnelProgress current="tickets" />
        </div>
      </header>

      <main className="mx-auto min-h-0 w-full max-w-5xl flex-1 overflow-y-auto overscroll-contain px-4 py-10 sm:px-5 sm:py-14 md:px-8">
        <div className="relative mb-8 aspect-[16/9] overflow-hidden border border-bone/10 sm:mb-10 sm:aspect-[21/9]">
          <Image
            src={images.eventNight.src}
            alt={images.eventNight.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent"
          />
          <p className="absolute bottom-4 left-4 font-display text-2xl tracking-[0.08em] text-bone uppercase sm:bottom-6 sm:left-6 sm:text-3xl">
            Live nights
          </p>
        </div>

        <p className="font-mono text-[10px] tracking-[0.24em] text-cream uppercase sm:text-[11px] sm:tracking-[0.3em]">
          {eventsCopy.eyebrow} · {eventsCopy.stepLabel}
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-[0.04em] uppercase sm:text-5xl sm:tracking-[0.06em] md:text-6xl">
          {eventsCopy.heading}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-bone/70 sm:text-base">
          {eventsCopy.body}
        </p>

        <div className="mt-6 space-y-2 border border-bone/15 bg-black/30 px-4 py-4 text-sm text-bone/70 sm:px-5">
          <p>
            Card on file:{" "}
            <span className="text-bone">
              {cart.payment?.brand} ···· {cart.payment?.last4}
            </span>
          </p>
          <p>
            Book in cart:{" "}
            <span className="text-bone">
              {bookLine?.title} ({bookLine?.subtitle}) ·{" "}
              {formatMoney(bookTotal, cart.currencyCode)}
            </span>
          </p>
          {existingTickets.length > 0 && (
            <p>
              Tickets in cart:{" "}
              <span className="text-bone">
                {formatMoney(cartTicketsTotal(cart), cart.currencyCode)}
              </span>
            </p>
          )}
        </div>

        <section className="mt-10">
          <h2 className="font-display text-2xl tracking-[0.08em] uppercase">
            Choose a night
          </h2>
          <div className="mt-5 space-y-3">
            {speakingEvents.map((item) => {
              const active = item.id === eventId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setEventId(item.id)}
                  className={`w-full border px-4 py-4 text-left transition sm:px-5 sm:py-5 ${
                    active
                      ? "border-cream bg-bone/5"
                      : "border-bone/15 active:border-bone/35"
                  }`}
                >
                  <div className="flex gap-3">
                    <span
                      className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        active ? "border-cream" : "border-bone/30"
                      }`}
                    >
                      {active && (
                        <span className="h-2.5 w-2.5 rounded-full bg-cream" />
                      )}
                    </span>
                    <div>
                      <p className="font-display text-xl tracking-[0.06em] uppercase sm:text-2xl">
                        {item.city}
                      </p>
                      <p className="mt-1 font-mono text-[11px] tracking-[0.18em] text-bone/50 uppercase">
                        {item.date} · {item.time}
                      </p>
                      <p className="mt-2 text-sm text-bone/70">
                        {item.title} · {item.venue}
                      </p>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-bone/55">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {event && (
          <section className="mt-10">
            <h2 className="font-display text-2xl tracking-[0.08em] uppercase">
              Ticket type
            </h2>
            <div className="mt-5 space-y-3">
              {event.tickets.map((item) => {
                const active = item.id === ticketId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTicketId(item.id)}
                    className={`w-full border px-4 py-4 text-left transition sm:px-5 sm:py-5 ${
                      active
                        ? "border-cream bg-bone/5"
                        : "border-bone/15 active:border-bone/35"
                    }`}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div className="flex gap-3">
                        <span
                          className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            active ? "border-cream" : "border-bone/30"
                          }`}
                        >
                          {active && (
                            <span className="h-2.5 w-2.5 rounded-full bg-cream" />
                          )}
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-display text-xl tracking-[0.06em] uppercase">
                              {item.title}
                            </p>
                            {item.badge && (
                              <span className="bg-cream px-2 py-1 font-mono text-[10px] tracking-[0.2em] text-ink uppercase">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-bone/60">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <p className="pl-8 font-display text-2xl tracking-[0.06em] sm:pl-0">
                        {formatMoney(item.price, item.currencyCode)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between border border-bone/15 px-4 py-3">
              <p className="font-mono text-[10px] tracking-[0.2em] text-bone/50 uppercase">
                Quantity
              </p>
              <div className="flex items-center border border-bone/20">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((value) => Math.max(1, value - 1))}
                  className="tap-target px-3 text-lg leading-none"
                >
                  −
                </button>
                <span className="min-w-8 text-center font-mono text-sm">
                  {qty}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((value) => Math.min(8, value + 1))}
                  className="tap-target px-3 text-lg leading-none"
                >
                  +
                </button>
              </div>
            </div>
          </section>
        )}

        <div className="mt-8 border border-cream/30 bg-bone/5 px-4 py-4 sm:px-5">
          <p className="font-mono text-[10px] tracking-[0.2em] text-cream uppercase">
            Cart total if you add tickets
          </p>
          <p className="mt-2 font-display text-3xl tracking-[0.06em] uppercase">
            {formatMoney(projectedTotal, cart.currencyCode)}
          </p>
          <p className="mt-2 text-sm text-bone/60">
            Book {formatMoney(bookTotal, cart.currencyCode)} + tickets{" "}
            {formatMoney(ticketLineTotal, cart.currencyCode)} — one charge.
          </p>
        </div>

        {error && (
          <p className="mt-6 border border-red-400/40 bg-red-950/40 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        )}

        <p className="mt-8 mb-2 font-mono text-[10px] tracking-[0.18em] text-bone/40 uppercase">
          {eventsCopy.demoNote}
        </p>
      </main>

      <div className="shrink-0 border-t border-bone/10 bg-ink px-4 pt-3 safe-pb">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 pb-1">
          <button
            type="button"
            onClick={() => void handleAddTickets()}
            disabled={submitting || !ticket}
            className="flex min-h-12 w-full items-center justify-center bg-bone px-6 py-3.5 font-display text-lg tracking-[0.16em] text-ink uppercase transition hover:bg-cream disabled:opacity-60"
          >
            {submitting
              ? "Processing…"
              : `${eventsCopy.cta} — ${formatMoney(projectedTotal)}`}
          </button>
          <button
            type="button"
            onClick={() => void handleSkip()}
            disabled={submitting}
            className="min-h-11 w-full font-mono text-[11px] tracking-[0.18em] text-bone/55 uppercase transition hover:text-bone"
          >
            {eventsCopy.skip} ({formatMoney(bookTotal, cart.currencyCode)})
          </button>
        </div>
      </div>

      <PaymentProcessingModal
        open={modalOpen}
        ready={checkoutReady}
        onComplete={handleModalComplete}
      />
    </div>
  );
}
