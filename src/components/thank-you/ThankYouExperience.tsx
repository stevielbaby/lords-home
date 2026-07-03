"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookCover } from "@/components/BookCover";
import { FunnelProgress } from "@/components/FunnelProgress";
import { loadOrder } from "@/lib/order";
import { funnelConfig } from "@/lib/funnel";
import { formatMoney } from "@/lib/shopify/client";
import type { MockOrder, Product } from "@/lib/shopify/types";
import { site, thankYouCopy } from "@/lib/site";

type ThankYouExperienceProps = {
  orderId: string;
  product: Product;
};

export function ThankYouExperience({
  orderId,
  product,
}: ThankYouExperienceProps) {
  const [order, setOrder] = useState<MockOrder | null>(null);

  useEffect(() => {
    const stored = loadOrder();
    if (stored && stored.id === orderId) {
      setOrder(stored);
    }
  }, [orderId]);

  const hasTickets = Boolean(order?.tickets && order.tickets.length > 0);

  return (
    <div className="min-h-[100svh] bg-ink text-bone">
      <header className="safe-pt border-b border-bone/10 px-4 py-3 sm:px-5 sm:py-4 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="tap-target flex items-center font-display text-base tracking-[0.14em] uppercase sm:text-lg sm:tracking-[0.18em]"
          >
            {site.name}
          </Link>
          <FunnelProgress
            current="done"
            showTickets={funnelConfig.speakingEventsEnabled}
          />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 safe-pb sm:px-5 sm:py-14 md:px-8 md:py-20">
        <p className="font-mono text-[10px] tracking-[0.24em] text-cream uppercase sm:text-[11px] sm:tracking-[0.3em]">
          Thank you
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-[0.04em] uppercase sm:mt-4 sm:text-5xl sm:tracking-[0.06em] md:text-7xl">
          {thankYouCopy.heading}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-bone/70 md:text-lg">
          {thankYouCopy.body}
          {hasTickets
            ? " Your tickets are reserved — details are in your confirmation email."
            : ""}
        </p>

        <div className="mt-8 border border-bone/15 bg-black/30 p-4 sm:mt-10 sm:p-6 md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <BookCover size="md" className="mx-auto sm:mx-0" />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] tracking-[0.2em] text-bone/45 uppercase sm:text-[11px] sm:tracking-[0.25em]">
                Order {orderId}
              </p>
              <p className="mt-3 font-display text-2xl tracking-[0.04em] uppercase sm:text-3xl sm:tracking-[0.06em]">
                {order?.productTitle ?? product.title}
              </p>
              <p className="mt-2 text-bone/65">
                {order?.variantTitle ?? "Your package"}
                {order ? ` · Qty ${order.quantity}` : ""}
              </p>

              {order && (
                <dl className="mt-6 space-y-3 text-sm text-bone/70">
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                    <dt>Email</dt>
                    <dd className="break-all text-bone sm:text-right">
                      {order.email}
                    </dd>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                    <dt>Ships to</dt>
                    <dd className="text-bone sm:text-right">
                      {order.shippingAddress.firstName}{" "}
                      {order.shippingAddress.lastName}
                      <br />
                      {order.shippingAddress.address1}
                      <br />
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.province}{" "}
                      {order.shippingAddress.zip}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Book total</dt>
                    <dd className="text-bone">
                      {formatMoney(
                        order.bookTotal ?? order.subtotal + order.shipping,
                        order.currencyCode,
                      )}
                    </dd>
                  </div>
                </dl>
              )}
            </div>
          </div>

          {hasTickets && order?.tickets && (
            <div className="mt-8 border-t border-bone/10 pt-6">
              <p className="font-mono text-[10px] tracking-[0.22em] text-cream uppercase">
                Speaking tickets
              </p>
              <ul className="mt-4 space-y-4">
                {order.tickets.map((ticket) => (
                  <li
                    key={`${ticket.eventId}-${ticket.ticketId}`}
                    className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                  >
                    <div>
                      <p className="font-display text-xl tracking-[0.06em] uppercase">
                        {ticket.city}
                      </p>
                      <p className="mt-1 text-sm text-bone/65">
                        {ticket.eventTitle} · {ticket.venue}
                      </p>
                      <p className="mt-1 font-mono text-[11px] tracking-[0.16em] text-bone/45 uppercase">
                        {ticket.date} · {ticket.time}
                      </p>
                      <p className="mt-2 text-sm text-bone/70">
                        {ticket.ticketTitle} · Qty {ticket.quantity}
                      </p>
                    </div>
                    <p className="font-display text-xl tracking-[0.06em]">
                      {formatMoney(ticket.lineTotal, order.currencyCode)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {order && (
            <div className="mt-6 flex justify-between gap-4 border-t border-bone/10 pt-4 font-display text-xl tracking-[0.06em] text-bone uppercase sm:text-2xl">
              <span>Total</span>
              <span>{formatMoney(order.total, order.currencyCode)}</span>
            </div>
          )}
        </div>

        <section className="mt-12">
          <h2 className="font-display text-2xl tracking-[0.08em] uppercase">
            What happens next
          </h2>
          <ol className="mt-6 space-y-4">
            {(hasTickets
              ? [
                  ...thankYouCopy.nextSteps,
                  "Ticket details and entry info will arrive by email before the night.",
                ]
              : thankYouCopy.nextSteps
            ).map((step, index) => (
              <li key={step} className="flex gap-4 text-bone/75">
                <span className="font-mono text-sm text-cream">
                  0{index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-10 flex flex-col gap-3 sm:mt-14 sm:flex-row sm:gap-4">
          <Link
            href="/"
            className="inline-flex min-h-12 w-full items-center justify-center bg-bone px-8 py-4 font-display text-lg tracking-[0.18em] text-ink uppercase transition hover:bg-cream sm:w-auto"
          >
            Back home
          </Link>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-full items-center justify-center border border-bone/20 px-8 py-4 font-display text-lg tracking-[0.18em] uppercase transition hover:border-bone/50 sm:w-auto"
          >
            Follow on Instagram
          </a>
        </div>
      </main>
    </div>
  );
}
