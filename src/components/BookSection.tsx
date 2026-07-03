import Image from "next/image";
import { OfferLink } from "./OfferLink";
import { formatMoney } from "@/lib/shopify/client";
import type { Product } from "@/lib/shopify/types";
import { images } from "@/lib/images";
import { bookCopy } from "@/lib/site";

type BookSectionProps = {
  product: Product;
};

export function BookSection({ product }: BookSectionProps) {
  const price = formatMoney(
    product.priceRange.minVariantPrice.amount,
    product.priceRange.minVariantPrice.currencyCode,
  );

  return (
    <section
      id="book"
      className="scroll-mt-16 bg-paper px-4 py-14 text-ink sm:px-5 sm:py-20 md:scroll-mt-20 md:px-10 md:py-28"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative mb-8 aspect-[4/5] overflow-hidden border border-ink/10 bg-ink">
            <Image
              src={images.bookStillLife.src}
              alt={images.bookStillLife.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
          <p className="font-mono text-[11px] tracking-[0.35em] text-ink/45 uppercase">
            {bookCopy.subtitle}
          </p>
          <h2 className="mt-3 font-display text-4xl leading-[0.95] tracking-[0.04em] uppercase sm:mt-4 sm:text-5xl sm:tracking-[0.06em] md:text-6xl">
            {bookCopy.title}
          </h2>
          <p className="mt-4 font-mono text-sm tracking-[0.2em] text-ink/55 uppercase">
            From {price}
          </p>
          <div className="mt-8">
            <OfferLink />
          </div>
        </div>

        <div className="max-w-2xl">
          <p className="font-sans text-2xl leading-snug text-ink md:text-3xl">
            {bookCopy.headline}
          </p>

          <div className="mt-8 space-y-5 text-base leading-relaxed text-ink/75 md:text-lg">
            {bookCopy.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <ul className="mt-12 space-y-4 border-t border-ink/10 pt-10">
            {bookCopy.outcomes.map((item) => (
              <li
                key={item}
                className="flex gap-4 font-sans text-base leading-relaxed text-ink/80 md:text-lg"
              >
                <span className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="mt-12 font-display text-2xl tracking-[0.08em] text-ink uppercase md:text-3xl">
            Are you ready to live like you already belong?
          </p>
        </div>
      </div>
    </section>
  );
}
