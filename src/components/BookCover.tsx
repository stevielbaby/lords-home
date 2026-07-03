import Image from "next/image";
import { images } from "@/lib/images";

type BookCoverProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
};

const sizes = {
  sm: "w-16 aspect-[3/4]",
  md: "w-44 aspect-[3/4] sm:w-52",
  lg: "w-[min(200px,58vw)] sm:w-[280px] md:w-[320px] aspect-[3/4]",
};

const imageSizes = {
  sm: "64px",
  md: "208px",
  lg: "(max-width: 640px) 58vw, 320px",
};

export function BookCover({
  className = "",
  size = "lg",
  priority = false,
}: BookCoverProps) {
  const isLarge = size === "lg";

  return (
    <div
      className={`book-cover relative shrink-0 overflow-hidden bg-[#0d0d0d] shadow-[0_20px_50px_rgba(0,0,0,0.45)] ${sizes[size]} ${className}`}
    >
      {isLarge && (
        <div
          aria-hidden
          className="absolute top-1 -left-2 bottom-1 z-10 w-3 bg-gradient-to-r from-black via-[#1c1c1c] to-[#111]"
        />
      )}
      <Image
        src={images.bookCover.src}
        alt={images.bookCover.alt}
        fill
        priority={priority}
        sizes={imageSizes[size]}
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 border border-bone/15" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-bone/10" />
    </div>
  );
}
