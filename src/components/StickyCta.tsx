"use client";

import { useEffect, useState } from "react";
import { bookCopy } from "@/lib/site";
import { formatMoney } from "@/lib/shopify/client";

type StickyCtaProps = {
  price: string;
  currencyCode?: string;
};

export function StickyCta({ price, currencyCode = "USD" }: StickyCtaProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const offer = document.getElementById("offer");
      const heroBottom = window.innerHeight * 0.55;
      const pastHero = window.scrollY > heroBottom;
      const offerTop = offer?.offsetTop ?? Number.POSITIVE_INFINITY;
      const offerBottom = offerTop + (offer?.offsetHeight ?? 0);
      const viewportMid = window.scrollY + window.innerHeight * 0.5;
      const inOfferZone = viewportMid > offerTop && viewportMid < offerBottom;
      setVisible(pastHero && !inOfferZone);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-paper/95 px-4 pt-3 backdrop-blur transition duration-300 safe-pb md:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-display text-base tracking-[0.06em] uppercase sm:text-lg sm:tracking-[0.08em]">
            {bookCopy.title}
          </p>
          <p className="font-mono text-[10px] tracking-[0.12em] text-ink/50 uppercase sm:text-[11px]">
            From {formatMoney(price, currencyCode)}
          </p>
        </div>
        <a
          href="#offer"
          className="tap-target shrink-0 bg-ink px-5 py-3 font-display text-sm tracking-[0.16em] text-bone uppercase"
        >
          {bookCopy.cta}
        </a>
      </div>
    </div>
  );
}
