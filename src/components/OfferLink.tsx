import { bookCopy } from "@/lib/site";

type OfferLinkProps = {
  className?: string;
  label?: string;
  tone?: "light" | "dark";
};

export function OfferLink({
  className = "",
  label = bookCopy.cta,
  tone = "dark",
}: OfferLinkProps) {
  const tones =
    tone === "dark"
      ? "bg-ink text-bone hover:bg-black"
      : "bg-bone text-ink hover:bg-cream";

  return (
    <a
      href="#offer"
      className={`inline-flex min-h-12 w-full items-center justify-center px-6 py-3.5 text-center font-display text-lg tracking-[0.16em] uppercase transition sm:w-auto sm:px-10 sm:py-4 sm:text-xl sm:tracking-[0.2em] ${tones} ${className}`}
    >
      {label}
    </a>
  );
}
