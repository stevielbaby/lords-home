"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { SiteMenu } from "./SiteMenu";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="safe-pt sticky top-0 z-40 flex items-center justify-between bg-bone px-4 py-3 text-ink sm:px-5 sm:py-4 md:px-8">
        <a
          href="#top"
          className="tap-target flex items-center font-display text-base tracking-[0.14em] uppercase sm:text-lg sm:tracking-[0.18em] md:text-xl"
        >
          {site.author}
        </a>
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="tap-target flex items-center justify-center"
        >
          <span className="sr-only">Menu</span>
          <span className="flex flex-col gap-[5px]">
            <span
              className={`block h-[2px] w-6 bg-ink transition-transform ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`block h-[2px] w-6 bg-ink transition-opacity ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-[2px] w-6 bg-ink transition-transform ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </header>
      <SiteMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
