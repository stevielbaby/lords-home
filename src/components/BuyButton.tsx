"use client";

import { useState } from "react";
import { createCheckoutUrl } from "@/lib/shopify/client";
import { bookCopy } from "@/lib/site";

type BuyButtonProps = {
  variantId: string;
  className?: string;
  label?: string;
  tone?: "light" | "dark";
};

export function BuyButton({
  variantId,
  className = "",
  label = bookCopy.cta,
  tone = "light",
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    setLoading(true);
    try {
      const url = await createCheckoutUrl([
        { merchandiseId: variantId, quantity: 1 },
      ]);
      window.location.href = url;
    } finally {
      setLoading(false);
    }
  }

  const tones =
    tone === "dark"
      ? "bg-ink text-bone hover:bg-black"
      : "bg-bone text-ink hover:bg-cream";

  return (
    <button
      type="button"
      onClick={handleBuy}
      disabled={loading}
      className={`inline-flex min-h-12 w-full items-center justify-center px-6 py-3.5 text-center font-display text-lg tracking-[0.16em] uppercase transition disabled:opacity-60 sm:w-auto sm:px-10 sm:py-4 sm:text-xl sm:tracking-[0.2em] ${tones} ${className}`}
    >
      {loading ? "Loading…" : label}
    </button>
  );
}
