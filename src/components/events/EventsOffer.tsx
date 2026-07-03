"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FunnelProgress } from "@/components/FunnelProgress";
import { images } from "@/lib/images";
import {
  attachTicketsToOrder,
  loadOrder,
  saveOrder,
} from "@/lib/order";
import {
  eventsCopy,
  speakingEvents,
  type SpeakingEvent,
} from "@/lib/funnel";
import { formatMoney } from "@/lib/shopify/client";
import type { MockOrder } from "@/lib/shopify/types";
import { site } from "@/lib/site";

type EventsOfferProps = {
  orderId: string;
};

export function EventsOffer({ orderId }: EventsOfferProps) {
  const router = useRouter();
  const [order, setOrder] = useState<MockOrder | null>(null);
  const [eventId, setEventId] = useState(speakingEvents[0]?.id ?? "");
  const [ticketId, setTicketId] = useState(
    speakingEvents[0]?.tickets[0]?.id ?? "",
  );
  const [qty, setQty] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = loadOrder();
    if (!stored || stored.id !== orderId) {
      router.replace("/#offer");
      return;
    }
    if (stored.tickets && stored.tickets.length > 0) {
      router.replace(`/thank-you?order=${encodeURIComponent(orderId)}`);
      return;
    }
    setOrder(stored);
  }, [orderId, router]);

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
  const lineTotal = useMemo(() => {
    if (!ticket) return 0;
    return ticket.price * qty;
  }, [ticket, qty]);

  function continueToThankYou() {
    router.push(`/thank-you?order=${encodeURIComponent(orderId)}`);
  }

  async function handleAddTickets() {
    if (!order || !event || !ticket) return;
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));

    const updated = attachTicketsToOrder(order, [
      {
        eventId: event.id,
        eventTitle: event.title,
        city: event.city,
        venue: event.venue,
        date: event.date,
        time: event.time,
        ticketId: ticket.id,
        ticketTitle: ticket.title,
        quantity: qty,
        unitPrice: ticket.price,
        lineTotal,
      },
    ]);
    saveOrder(updated);
    router.push(`/thank-you?order=${encodeURIComponent(orderId)}`);
  }

  if (!order) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-ink px-4 text-bone">
        <p className="font-mono text-xs tracking-[0.2em] uppercase">
          Loading your order…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-ink text-bone">
      <header className="safe-pt border-b border-bone/10 px-4 py-3 sm:px-5 sm:py-4 md:px-8">
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

      <main className="mx-auto max-w-5xl px-4 py-10 pb-32 safe-pb sm:px-5 sm:py-14 md:px-8">
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

        <div className="mt-6 border border-bone/15 bg-black/30 px-4 py-3 text-sm text-bone/65 sm:px-5">
          Book order{" "}
          <span className="font-mono text-bone">{order.id}</span> confirmed for{" "}
          <span className="text-bone">{order.email}</span>
          {" · "}
          {formatMoney(order.bookTotal ?? order.total, order.currencyCode)}
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
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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

        <p className="mt-8 font-mono text-[10px] tracking-[0.18em] text-bone/40 uppercase">
          {eventsCopy.demoNote}
        </p>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-bone/10 bg-ink/95 px-4 pt-3 backdrop-blur safe-pb">
        <div className="mx-auto flex max-w-5xl flex-col gap-3">
          <button
            type="button"
            onClick={handleAddTickets}
            disabled={submitting || !ticket}
            className="flex min-h-12 w-full items-center justify-center bg-bone px-6 py-3.5 font-display text-lg tracking-[0.16em] text-ink uppercase transition hover:bg-cream disabled:opacity-60"
          >
            {submitting
              ? "Adding…"
              : `${eventsCopy.cta} — ${formatMoney(lineTotal)}`}
          </button>
          <button
            type="button"
            onClick={continueToThankYou}
            disabled={submitting}
            className="min-h-11 w-full font-mono text-[11px] tracking-[0.18em] text-bone/55 uppercase transition hover:text-bone"
          >
            {eventsCopy.skip}
          </button>
        </div>
      </div>
    </div>
  );
}
