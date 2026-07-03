import { testimonials } from "@/lib/site";

export function Testimonials() {
  return (
    <section className="border-y border-ink/10 bg-paper px-4 py-14 text-ink sm:px-5 sm:py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] tracking-[0.28em] text-ink/45 uppercase sm:text-[11px] sm:tracking-[0.35em]">
          From the house
        </p>
        <h2 className="mt-3 font-display text-3xl tracking-[0.04em] uppercase sm:mt-4 sm:text-4xl sm:tracking-[0.06em] md:text-5xl">
          What people are saying
        </h2>

        <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <figure
              key={item.name}
              className="flex h-full flex-col border border-ink/10 bg-bone/40 p-6 md:p-8"
            >
              <blockquote className="flex-1 text-base leading-relaxed text-ink/80 md:text-lg">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-8 border-t border-ink/10 pt-4">
                <p className="font-display text-lg tracking-[0.08em] uppercase">
                  {item.name}
                </p>
                <p className="mt-1 font-mono text-[11px] tracking-[0.2em] text-ink/45 uppercase">
                  {item.detail}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
