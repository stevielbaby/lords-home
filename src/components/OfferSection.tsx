"use client";

import Image from "next/image";
import { useState } from "react";
import { BuyButton } from "./BuyButton";
import { BookCover } from "./BookCover";
import { formatMoney } from "@/lib/shopify/client";
import type { Product } from "@/lib/shopify/types";
import { images } from "@/lib/images";
import { offerCopy } from "@/lib/site";

type OfferSectionProps = {
  product: Product;
};

export function OfferSection({ product }: OfferSectionProps) {
  const [selectedId, setSelectedId] = useState(
    product.variants.find((v) => v.badge)?.id ?? product.variants[0].id,
  );
  const selected =
    product.variants.find((v) => v.id === selectedId) ?? product.variants[0];

  return (
    <section
      id="offer"
      className="scroll-mt-16 bg-ink px-4 py-14 text-bone sm:px-5 sm:py-20 md:scroll-mt-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="font-mono text-[10px] tracking-[0.28em] text-bone/45 uppercase sm:text-[11px] sm:tracking-[0.35em]">
            The offer
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-[0.04em] uppercase sm:mt-4 sm:text-5xl sm:tracking-[0.06em] md:text-6xl">
            {offerCopy.heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-bone/65 sm:mt-4 sm:text-base md:text-lg">
            {offerCopy.subheading}
          </p>
        </div>

        <div className="mt-8 flex justify-center lg:hidden">
          <BookCover size="md" />
        </div>

        <div className="mt-8 grid gap-6 sm:mt-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="relative hidden min-h-[28rem] overflow-hidden border border-bone/10 lg:block">
            <Image
              src={images.bookStillLife.src}
              alt={images.bookStillLife.alt}
              fill
              sizes="40vw"
              className="object-cover opacity-80"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 flex justify-center p-8">
              <BookCover size="md" />
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {product.variants.map((variant) => {
              const active = variant.id === selectedId;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedId(variant.id)}
                  className={`w-full border px-4 py-4 text-left transition sm:px-5 sm:py-5 md:px-6 md:py-6 ${
                    active
                      ? "border-cream bg-bone/5"
                      : "border-bone/15 active:border-bone/35"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <span
                        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          active ? "border-cream" : "border-bone/30"
                        }`}
                      >
                        {active && (
                          <span className="h-2.5 w-2.5 rounded-full bg-cream" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <p className="font-display text-xl tracking-[0.06em] uppercase sm:text-2xl sm:tracking-[0.08em]">
                            {variant.title}
                          </p>
                          {variant.badge && (
                            <span className="bg-cream px-2 py-1 font-mono text-[10px] tracking-[0.2em] text-ink uppercase">
                              {variant.badge}
                            </span>
                          )}
                        </div>
                        {variant.description && (
                          <p className="mt-2 text-sm leading-relaxed text-bone/60">
                            {variant.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2 pl-8 sm:flex-col sm:items-end sm:pl-0 sm:text-right">
                      <p className="font-display text-2xl tracking-[0.06em]">
                        {formatMoney(
                          variant.price.amount,
                          variant.price.currencyCode,
                        )}
                      </p>
                      {variant.compareAtPrice && (
                        <p className="font-mono text-xs tracking-[0.1em] text-bone/40 line-through">
                          {formatMoney(
                            variant.compareAtPrice.amount,
                            variant.compareAtPrice.currencyCode,
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}

            <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-center sm:gap-4 sm:pt-4">
              <BuyButton
                variantId={selected.id}
                label={`Get ${selected.title}`}
              />
              <p className="text-center font-mono text-[10px] tracking-[0.16em] text-bone/45 uppercase sm:text-left sm:text-[11px] sm:tracking-[0.2em]">
                Ships with care · Free standard shipping
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
