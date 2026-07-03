import Image from "next/image";
import { images } from "@/lib/images";
import { aboutCopy, site } from "@/lib/site";

export function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-16 bg-ink px-4 py-14 text-bone sm:px-5 sm:py-20 md:scroll-mt-20 md:px-10 md:py-28"
    >
      <div className="mx-auto grid max-w-6xl gap-8 sm:gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <div className="relative mb-8 aspect-[4/5] overflow-hidden border border-bone/10">
            <Image
              src={images.brandFlag.src}
              alt={images.brandFlag.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent"
            />
          </div>
          <p className="font-mono text-[10px] tracking-[0.28em] text-bone/45 uppercase sm:text-[11px] sm:tracking-[0.35em]">
            {aboutCopy.heading}
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-[0.06em] uppercase sm:mt-4 sm:text-5xl sm:tracking-[0.08em] md:text-6xl">
            {site.author}
          </h2>
          <p className="mt-6 max-w-xs font-mono text-xs leading-relaxed tracking-[0.2em] text-cream/70 uppercase">
            {site.mission}
          </p>
        </div>

        <div className="space-y-6 text-base leading-relaxed text-bone/75 md:text-lg lg:pt-4">
          {aboutCopy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
