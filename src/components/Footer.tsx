import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="flex flex-col gap-4 bg-black px-4 py-5 text-bone/70 safe-pb sm:px-5 md:flex-row md:items-center md:justify-between md:px-8">
      <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] tracking-[0.2em] uppercase sm:gap-x-6 sm:text-[11px] sm:tracking-[0.25em]">
        <a
          href="#about"
          className="tap-target inline-flex items-center transition hover:text-bone"
        >
          &gt; Speaking
        </a>
        <a
          href="#newsletter"
          className="tap-target inline-flex items-center transition hover:text-bone"
        >
          &gt; Subscribe to Newsletter
        </a>
        <a
          href={site.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="tap-target inline-flex items-center transition hover:text-bone"
        >
          &gt; Instagram
        </a>
      </div>
      <p className="font-mono text-[10px] tracking-[0.2em] text-bone/40 uppercase">
        © {new Date().getFullYear()} {site.name}
      </p>
    </footer>
  );
}
