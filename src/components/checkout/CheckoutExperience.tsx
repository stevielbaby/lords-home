"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { BookCover } from "@/components/BookCover";
import { FunnelProgress } from "@/components/FunnelProgress";
import { PaymentProcessingModal } from "@/components/PaymentProcessingModal";
import { funnelConfig } from "@/lib/funnel";
import {
  cardBrandFromNumber,
  cartGrandTotal,
  completeCheckout,
  createFunnelCart,
  formatMoney,
  getBookLines,
  loadCartById,
  loadOrder,
  prepareUpsellCheckout,
  updateBookInCart,
  updateCartShipping,
} from "@/lib/shopify/client";
import type { FunnelCart, Product, ShippingMethod } from "@/lib/shopify/types";
import { checkoutCopy, site } from "@/lib/site";

type CheckoutExperienceProps = {
  product: Product;
  shippingMethods: ShippingMethod[];
  cartId?: string;
  fallbackVariantId?: string;
  fallbackQty?: string;
};

const fieldClass =
  "w-full min-h-12 border border-ink/15 bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-ink/35 focus:border-ink";

const labelClass =
  "mb-2 block font-mono text-[10px] tracking-[0.22em] text-ink/50 uppercase";

export function CheckoutExperience({
  product,
  shippingMethods,
  cartId: cartIdProp,
  fallbackVariantId,
  fallbackQty,
}: CheckoutExperienceProps) {
  const router = useRouter();
  const [cart, setCart] = useState<FunnelCart | null>(null);
  const [booting, setBooting] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [checkoutReady, setCheckoutReady] = useState(false);
  const [thankYouPath, setThankYouPath] = useState<string | null>(null);

  const upsellEnabled = funnelConfig.speakingEventsEnabled;

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        let next = cartIdProp ? loadCartById(cartIdProp) : null;

        // Stale cart link after order completed — funnel no longer exists
        if (cartIdProp && !next) {
          const order = loadOrder();
          if (order) {
            router.replace(`/thank-you?order=${encodeURIComponent(order.id)}`);
            return;
          }
        }

        // Already past payment details — resume OTO, don't re-open checkout form
        if (next?.status === "pending_upsell") {
          router.replace(`/events?cart=${encodeURIComponent(next.id)}`);
          return;
        }

        if (!next) {
          const variantId =
            fallbackVariantId ??
            product.variants.find((item) => item.badge)?.id ??
            product.variants[0].id;
          const qty = Math.max(
            1,
            Number.parseInt(fallbackQty ?? "1", 10) || 1,
          );
          next = await createFunnelCart({
            merchandiseId: variantId,
            quantity: qty,
          });
          if (!cancelled) {
            router.replace(`/checkout?cart=${encodeURIComponent(next.id)}`);
          }
        }

        if (!cancelled) setCart(next);
      } catch {
        if (!cancelled) setError("Could not load your cart. Start again from the offer.");
      } finally {
        if (!cancelled) setBooting(false);
      }
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, [cartIdProp, fallbackVariantId, fallbackQty, product.variants, router]);

  const bookLine = cart ? getBookLines(cart)[0] : null;
  const variantId = bookLine?.merchandiseId ?? product.variants[0].id;
  const qty = bookLine?.quantity ?? 1;
  const shippingId = cart?.shippingMethodId ?? shippingMethods[0]?.id ?? "";

  const variant =
    product.variants.find((item) => item.id === variantId) ??
    product.variants[0];

  const totals = useMemo(() => {
    if (!cart) {
      return { unit: 0, ship: 0, subtotal: 0, total: 0 };
    }
    const unit = bookLine?.unitPrice ?? 0;
    return {
      unit,
      ship: cart.shippingPrice,
      subtotal: unit * qty,
      total: cartGrandTotal(cart),
    };
  }, [cart, bookLine, qty]);

  const submitLabel = submitting
    ? upsellEnabled
      ? "Saving…"
      : "Processing…"
    : upsellEnabled
      ? "Continue"
      : `Pay ${formatMoney(totals.total, product.priceRange.minVariantPrice.currencyCode)}`;

  async function handleVariantChange(nextVariantId: string) {
    if (!cart) return;
    const updated = await updateBookInCart(cart.id, nextVariantId, qty);
    setCart(updated);
  }

  async function handleQtyChange(nextQty: number) {
    if (!cart) return;
    const updated = await updateBookInCart(
      cart.id,
      variantId,
      Math.max(1, nextQty),
    );
    setCart(updated);
  }

  async function handleShippingChange(nextShippingId: string) {
    if (!cart) return;
    const updated = await updateCartShipping(cart.id, nextShippingId);
    setCart(updated);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cart) return;
    setError(null);
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const firstName = String(form.get("firstName") ?? "").trim();
    const lastName = String(form.get("lastName") ?? "").trim();
    const address1 = String(form.get("address1") ?? "").trim();
    const address2 = String(form.get("address2") ?? "").trim();
    const city = String(form.get("city") ?? "").trim();
    const province = String(form.get("province") ?? "").trim();
    const zip = String(form.get("zip") ?? "").trim();
    const country = String(form.get("country") ?? "United States").trim();
    const marketingOptIn = form.get("marketing") === "on";
    const card = String(form.get("card") ?? "").replace(/\s/g, "");
    const expiry = String(form.get("expiry") ?? "").trim();
    const cvc = String(form.get("cvc") ?? "").trim();

    if (!email || !firstName || !lastName || !address1 || !city || !province || !zip) {
      setError("Fill in your contact and shipping details to continue.");
      setSubmitting(false);
      return;
    }

    if (card.length < 12 || !expiry || cvc.length < 3) {
      setError("Enter card details to continue. Your card is not charged until the order is completed.");
      setSubmitting(false);
      return;
    }

    try {
      // Card is stored as a fingerprint only — NOT charged yet.
      // Tickets can still be cartLinesAdd'd on the next step.
      await prepareUpsellCheckout(
        cart.id,
        {
          email,
          firstName,
          lastName,
          address1,
          address2: address2 || undefined,
          city,
          province,
          zip,
          country,
          marketingOptIn,
        },
        {
          last4: card.slice(-4),
          brand: cardBrandFromNumber(card),
          mockToken: `tok_mock_${card.slice(-4)}`,
        },
        shippingId,
      );

      if (upsellEnabled) {
        router.push(`/events?cart=${encodeURIComponent(cart.id)}`);
        return;
      }

      setModalOpen(true);
      setCheckoutReady(false);
      setThankYouPath(null);
      const result = await completeCheckout(cart.id);
      const path =
        result.mode === "mock" ? result.thankYouPath : result.checkoutUrl;
      setThankYouPath(path);
      setCheckoutReady(true);
    } catch (err) {
      setModalOpen(false);
      setCheckoutReady(false);
      setError(
        err instanceof Error ? err.message : "Checkout failed. Try again.",
      );
      setSubmitting(false);
    }
  }

  function handleModalComplete() {
    if (!thankYouPath) return;
    if (thankYouPath.startsWith("http")) {
      window.location.href = thankYouPath;
      return;
    }
    router.push(thankYouPath);
  }

  if (booting || !cart || !bookLine) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-paper px-4 text-ink">
        <p className="font-mono text-xs tracking-[0.2em] uppercase">
          {error ?? "Loading cart…"}
        </p>
      </div>
    );
  }

  const summaryControls = (
    <>
      <div className="space-y-3">
        <p className={labelClass}>Package</p>
        {product.variants.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => void handleVariantChange(item.id)}
            className={`flex min-h-12 w-full items-center justify-between border px-4 py-3 text-left text-sm transition ${
              item.id === variantId
                ? "border-ink bg-white"
                : "border-ink/15 active:border-ink/40"
            }`}
          >
            <span>{item.title}</span>
            <span className="font-mono">
              {formatMoney(item.price.amount, item.price.currencyCode)}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className={`${labelClass} mb-0`}>Quantity</p>
        <div className="flex items-center border border-ink/15 bg-white">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => void handleQtyChange(qty - 1)}
            className="tap-target px-3 text-lg leading-none"
          >
            −
          </button>
          <span className="min-w-8 text-center font-mono text-sm">{qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => void handleQtyChange(qty + 1)}
            className="tap-target px-3 text-lg leading-none"
          >
            +
          </button>
        </div>
      </div>
    </>
  );

  const totalsBlock = (
    <dl className="space-y-3 text-sm">
      <div className="flex justify-between">
        <dt className="text-ink/60">Subtotal</dt>
        <dd>{formatMoney(totals.subtotal, cart.currencyCode)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-ink/60">Shipping</dt>
        <dd>
          {totals.ship === 0 ? "Free" : formatMoney(totals.ship, cart.currencyCode)}
        </dd>
      </div>
      <div className="flex justify-between border-t border-ink/10 pt-4 font-display text-2xl tracking-[0.06em] uppercase">
        <dt>Total</dt>
        <dd>{formatMoney(totals.total, cart.currencyCode)}</dd>
      </div>
    </dl>
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-paper text-ink">
      <header className="safe-pt shrink-0 border-b border-ink/10 bg-bone px-4 py-3 sm:px-5 sm:py-4 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="tap-target flex items-center font-display text-base tracking-[0.14em] uppercase sm:text-lg sm:tracking-[0.18em]"
            >
              {site.name}
            </Link>
            <Link
              href="/#offer"
              className="tap-target flex items-center font-mono text-[10px] tracking-[0.16em] text-ink/55 uppercase transition hover:text-ink sm:text-[11px] sm:tracking-[0.2em]"
            >
              ← Back
            </Link>
          </div>
          <FunnelProgress
            current="book"
            showTickets={upsellEnabled}
            tone="light"
          />
        </div>
      </header>

      <div className="mx-auto grid min-h-0 w-full max-w-6xl flex-1 grid-rows-[auto_1fr] overflow-hidden lg:grid-cols-[1.15fr_0.85fr] lg:grid-rows-1">
        <aside className="order-1 shrink-0 border-b border-ink/10 bg-bone lg:order-2 lg:min-h-0 lg:overflow-y-auto lg:border-b-0 lg:border-l">
          <button
            type="button"
            onClick={() => setSummaryOpen((open) => !open)}
            className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-5 lg:hidden"
            aria-expanded={summaryOpen}
          >
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase">
              {summaryOpen ? "Hide cart" : "Show cart"}
            </span>
            <span className="font-display text-xl tracking-[0.06em]">
              {formatMoney(totals.total, cart.currencyCode)}
            </span>
          </button>

          <div
            className={`${summaryOpen ? "block" : "hidden"} px-4 pb-6 sm:px-5 lg:block lg:px-8 lg:py-14`}
          >
            <div className="lg:sticky lg:top-24">
              <h2 className="hidden font-display text-2xl tracking-[0.08em] uppercase lg:block">
                Cart
              </h2>

              <div className="flex gap-4 border-b border-ink/10 pb-6 lg:mt-8 lg:pb-8">
                <div className="relative shrink-0">
                  <BookCover size="sm" />
                  <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 font-mono text-[10px] text-bone">
                    {qty}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg tracking-[0.06em] uppercase sm:text-xl">
                    {product.title}
                  </p>
                  <p className="mt-1 text-sm text-ink/55">{variant.title}</p>
                  <p className="mt-2 font-mono text-sm sm:mt-3">
                    {formatMoney(totals.unit, cart.currencyCode)}
                  </p>
                </div>
              </div>

              <div className="mt-6">{summaryControls}</div>
              <div className="mt-6 border-t border-ink/10 pt-6">{totalsBlock}</div>
            </div>
          </div>
        </aside>

        <form
          id="checkout-form"
          onSubmit={handleSubmit}
          className="order-2 min-h-0 overflow-y-auto overscroll-contain px-4 py-8 sm:px-5 sm:py-10 md:px-8 md:py-14 lg:order-1 lg:pr-12 lg:pb-14"
        >
          <p className="font-mono text-[10px] tracking-[0.24em] text-ink/45 uppercase sm:text-[11px] sm:tracking-[0.3em]">
            Checkout
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-[0.04em] uppercase sm:mt-3 sm:text-4xl sm:tracking-[0.06em] md:text-5xl">
            {upsellEnabled ? "Your details" : "Complete your order"}
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink/60">
            {upsellEnabled
              ? "Enter your info and card. You won’t be charged until you finish — tickets can still be added to this cart on the next screen."
              : checkoutCopy.demoNote}
          </p>

          <div className="mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
            {checkoutCopy.trust.map((item) => (
              <span
                key={item}
                className="border border-ink/10 px-2.5 py-1.5 font-mono text-[9px] tracking-[0.14em] text-ink/55 uppercase sm:px-3 sm:text-[10px] sm:tracking-[0.18em]"
              >
                {item}
              </span>
            ))}
          </div>

          <Section title="Contact">
            <div>
              <label className={labelClass} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@email.com"
                className={fieldClass}
              />
            </div>
            <label className="mt-4 flex items-start gap-3 text-sm leading-snug text-ink/70">
              <input
                type="checkbox"
                name="marketing"
                defaultChecked
                className="mt-0.5 h-5 w-5 shrink-0 accent-ink"
              />
              Email me about drops, gatherings, and words for the house
            </label>
          </Section>

          <Section title="Delivery">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="firstName" label="First name" autoComplete="given-name" required />
              <Field id="lastName" label="Last name" autoComplete="family-name" required />
            </div>
            <div className="mt-4">
              <Field id="address1" label="Address" autoComplete="address-line1" required />
            </div>
            <div className="mt-4">
              <Field
                id="address2"
                label="Apartment, suite, etc. (optional)"
                autoComplete="address-line2"
              />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Field id="city" label="City" autoComplete="address-level2" required />
              <Field id="province" label="State" autoComplete="address-level1" required />
              <Field id="zip" label="ZIP" autoComplete="postal-code" required />
            </div>
            <div className="mt-4">
              <label className={labelClass} htmlFor="country">
                Country
              </label>
              <select
                id="country"
                name="country"
                defaultValue="United States"
                className={fieldClass}
              >
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Australia</option>
              </select>
            </div>
          </Section>

          <Section title="Shipping method">
            <div className="space-y-3">
              {shippingMethods.map((method) => {
                const active = method.id === shippingId;
                return (
                  <label
                    key={method.id}
                    className={`flex min-h-14 cursor-pointer items-center justify-between gap-3 border px-3 py-3 transition sm:gap-4 sm:px-4 sm:py-4 ${
                      active ? "border-ink bg-white" : "border-ink/15"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={active}
                        onChange={() => void handleShippingChange(method.id)}
                        className="h-5 w-5 shrink-0 accent-ink"
                      />
                      <span className="min-w-0">
                        <span className="block font-display text-base tracking-[0.06em] uppercase sm:text-lg sm:tracking-[0.08em]">
                          {method.title}
                        </span>
                        <span className="mt-1 block text-xs text-ink/55 sm:text-sm">
                          {method.eta} · {method.description}
                        </span>
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-sm tracking-[0.1em]">
                      {Number.parseFloat(method.price.amount) === 0
                        ? "Free"
                        : formatMoney(
                            method.price.amount,
                            method.price.currencyCode,
                          )}
                    </span>
                  </label>
                );
              })}
            </div>
          </Section>

          <Section title="Payment">
            <p className="text-sm text-ink/55">
              {upsellEnabled
                ? "Card is authorized for this cart only after you complete the next step. Demo: use 4242 4242 4242 4242."
                : "Demo only — use any card number (e.g. 4242 4242 4242 4242)."}
            </p>
            <div className="mt-5">
              <label className={labelClass} htmlFor="card">
                Card number
              </label>
              <input
                id="card"
                name="card"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="4242 4242 4242 4242"
                className={fieldClass}
              />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="expiry">
                  Expiration
                </label>
                <input
                  id="expiry"
                  name="expiry"
                  autoComplete="cc-exp"
                  placeholder="MM / YY"
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="cvc">
                  Security code
                </label>
                <input
                  id="cvc"
                  name="cvc"
                  autoComplete="cc-csc"
                  placeholder="CVC"
                  className={fieldClass}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className={labelClass} htmlFor="nameOnCard">
                Name on card
              </label>
              <input
                id="nameOnCard"
                name="nameOnCard"
                autoComplete="cc-name"
                className={fieldClass}
              />
            </div>
          </Section>

          {error && (
            <p className="mt-6 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-10 hidden min-h-12 w-full bg-ink px-8 py-4 font-display text-xl tracking-[0.2em] text-bone uppercase transition hover:bg-black disabled:opacity-60 lg:inline-flex lg:items-center lg:justify-center"
          >
            {submitLabel}
          </button>

          <p className="mt-4 hidden text-center font-mono text-[10px] tracking-[0.18em] text-ink/40 uppercase lg:block">
            {upsellEnabled
              ? "Card on file · charge happens after upsell step"
              : "No real charge · Shopify checkout later"}
          </p>
        </form>
      </div>

      <div className="shrink-0 border-t border-ink/10 bg-paper px-4 pt-3 safe-pb lg:hidden">
        <button
          type="submit"
          form="checkout-form"
          disabled={submitting}
          className="flex min-h-12 w-full items-center justify-center bg-ink px-6 py-3.5 font-display text-lg tracking-[0.16em] text-bone uppercase disabled:opacity-60"
        >
          {submitLabel}
        </button>
        <p className="mt-2 pb-1 text-center font-mono text-[9px] tracking-[0.16em] text-ink/40 uppercase">
          {upsellEnabled
            ? "Card on file · charge after upsell"
            : "No real charge · Shopify checkout later"}
        </p>
      </div>

      <PaymentProcessingModal
        open={modalOpen}
        ready={checkoutReady}
        onComplete={handleModalComplete}
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 sm:mt-12">
      <h2 className="font-display text-xl tracking-[0.06em] uppercase sm:text-2xl sm:tracking-[0.08em]">
        {title}
      </h2>
      <div className="mt-4 sm:mt-5">{children}</div>
    </section>
  );
}

function Field({
  id,
  label,
  autoComplete,
  required,
}: {
  id: string;
  label: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        required={required}
        autoComplete={autoComplete}
        className={fieldClass}
      />
    </div>
  );
}
