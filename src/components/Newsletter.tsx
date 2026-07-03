"use client";

import { useState, type FormEvent } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <section
      id="newsletter"
      className="scroll-mt-16 border-t border-bone/10 bg-ink px-4 py-12 text-bone sm:px-5 sm:py-16 md:scroll-mt-20 md:px-10"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md">
          <p className="font-mono text-[10px] tracking-[0.28em] text-bone/45 uppercase sm:text-[11px] sm:tracking-[0.35em]">
            Stay close
          </p>
          <h2 className="mt-3 font-display text-2xl tracking-[0.06em] uppercase sm:text-3xl sm:tracking-[0.08em] md:text-4xl">
            Subscribe to the newsletter
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-bone/60">
            Drops, gatherings, and words for the house — no noise.
          </p>
        </div>

        {submitted ? (
          <p className="font-mono text-sm tracking-[0.2em] text-cream uppercase">
            You&apos;re in. Welcome home.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
          >
            <label className="sr-only" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="min-h-12 flex-1 border border-bone/20 bg-transparent px-4 py-3 font-sans text-base text-bone outline-none placeholder:text-bone/35 focus:border-cream"
            />
            <button
              type="submit"
              className="min-h-12 bg-bone px-6 py-3 font-display text-sm tracking-[0.2em] text-ink uppercase transition hover:bg-cream"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
