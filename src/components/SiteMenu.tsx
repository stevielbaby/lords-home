"use client";

import { site } from "@/lib/site";

const links = [
  { href: "#book", label: "The Book" },
  { href: "#about", label: "About" },
  { href: "#offer", label: "Buy Now" },
  { href: "#newsletter", label: "Newsletter" },
  { href: site.instagram, label: "Instagram", external: true },
];

type SiteMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function SiteMenu({ open, onClose }: SiteMenuProps) {
  return (
    <div
      className={`fixed inset-0 z-50 bg-ink text-bone transition-opacity duration-300 ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      <div className="safe-pt safe-pb flex h-full flex-col px-4 sm:px-5 md:px-8">
        <div className="flex items-center justify-between py-3">
          <p className="font-display text-base tracking-[0.14em] uppercase sm:text-lg sm:tracking-[0.18em]">
            {site.name}
          </p>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="tap-target flex items-center font-mono text-xs tracking-[0.2em] uppercase text-bone/70 hover:text-bone"
          >
            Close
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-center gap-2 sm:gap-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              onClick={onClose}
              className="tap-target flex items-center font-display text-4xl tracking-[0.08em] uppercase transition-colors hover:text-cream sm:text-5xl sm:tracking-[0.12em] md:text-6xl"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <p className="pb-4 font-mono text-[10px] tracking-[0.2em] text-bone/50 uppercase sm:pb-6 sm:text-xs sm:tracking-[0.25em]">
          {site.launchDate} — {site.tagline}
        </p>
      </div>
    </div>
  );
}
