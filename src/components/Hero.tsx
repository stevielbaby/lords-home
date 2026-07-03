import Image from "next/image";
import { BookCover } from "./BookCover";
import { images } from "@/lib/images";
import { bookCopy, site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink text-bone md:min-h-[88vh]">
      <Image
        src={images.heroAtmosphere.src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-45"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/70 to-ink"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(245,240,232,0.08), transparent 40%), radial-gradient(circle at 80% 70%, rgba(196,165,116,0.12), transparent 35%)",
        }}
      />

      <a
        href="#offer"
        className="group relative flex min-h-[100svh] w-full flex-col items-center justify-center px-4 py-12 text-left sm:px-5 sm:py-16 md:min-h-[88vh] md:px-10"
        aria-label={`${bookCopy.cta} — ${bookCopy.title}`}
      >
        <p className="mb-6 font-mono text-[10px] tracking-[0.28em] text-bone/50 uppercase sm:mb-8 sm:tracking-[0.35em] md:text-xs">
          {bookCopy.clickHint}
        </p>

        <div className="relative mx-auto grid w-full max-w-5xl items-center gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-10">
          <div className="order-2 text-center md:order-1 md:text-left">
            <p className="mb-3 font-mono text-[10px] tracking-[0.28em] text-cream/80 uppercase sm:mb-4 sm:text-[11px] sm:tracking-[0.35em]">
              {site.name} · {site.launchDate}
            </p>
            <h1 className="font-display text-[2.75rem] leading-[0.92] tracking-[0.04em] break-words uppercase sm:text-6xl sm:tracking-[0.06em] md:text-7xl lg:text-8xl">
              {bookCopy.title}
            </h1>
            <p className="mx-auto mt-5 max-w-md font-sans text-base leading-relaxed text-bone/70 sm:mt-6 md:mx-0 md:text-lg">
              A book about identity, family, and coming home to the One who
              already claimed you.
            </p>
          </div>

          <div className="order-1 flex justify-center md:order-2">
            <BookCover
              priority
              className="rotate-[-2deg] transition duration-500 group-hover:rotate-0 group-hover:scale-[1.02]"
            />
          </div>
        </div>

        <span className="mt-10 inline-flex min-h-12 w-full max-w-sm items-center justify-center bg-bone px-8 py-4 text-center font-display text-lg tracking-[0.18em] text-ink uppercase transition group-hover:bg-cream sm:mt-12 sm:w-auto sm:px-12 sm:text-xl sm:tracking-[0.22em]">
          {bookCopy.cta}
        </span>
      </a>
    </section>
  );
}
