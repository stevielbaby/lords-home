import Image from "next/image";
import { OfferLink } from "./OfferLink";
import { images } from "@/lib/images";
import { bookCopy, site } from "@/lib/site";

export function IdentitySection() {
  return (
    <section
      id="buy"
      className="overflow-hidden bg-paper px-4 py-14 text-ink sm:px-5 sm:py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-stretch justify-between gap-6 border-b border-ink/10 pb-10 sm:gap-8 sm:pb-12 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] text-ink/45 uppercase sm:text-[11px] sm:tracking-[0.35em]">
              {bookCopy.title}
            </p>
            <p className="mt-3 font-display text-2xl tracking-[0.06em] uppercase sm:text-3xl sm:tracking-[0.08em] md:text-4xl">
              The Book & Study Guide Available Now
            </p>
          </div>
          <OfferLink className="md:w-auto" />
        </div>

        <div className="relative mt-10 aspect-[21/9] overflow-hidden border border-ink/10 sm:mt-12">
          <Image
            src={images.brandFlag.src}
            alt={images.brandFlag.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="mt-12 sm:mt-16 md:mt-24">
          <p className="font-display text-[clamp(3rem,18vw,12rem)] leading-[0.85] tracking-[-0.02em] uppercase">
            {site.author.split(" ")[0]}
          </p>
          <p className="font-display text-[clamp(3rem,18vw,12rem)] leading-[0.85] tracking-[-0.02em] uppercase">
            {site.author.split(" ")[1]}
          </p>
          <p className="mt-6 font-mono text-[11px] tracking-[0.28em] text-ink/55 uppercase sm:mt-8 sm:text-xs sm:tracking-[0.35em] md:text-sm">
            {site.roles.join(". ")}.
          </p>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target mt-4 inline-flex items-center font-mono text-[11px] tracking-[0.24em] text-ink underline decoration-ink/30 underline-offset-4 transition hover:decoration-ink uppercase sm:mt-6 sm:text-xs sm:tracking-[0.3em]"
          >
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
