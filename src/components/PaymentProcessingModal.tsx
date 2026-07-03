"use client";

import { useEffect, useState, type CSSProperties } from "react";

type PaymentProcessingModalProps = {
  open: boolean;
  /** True when cart capture / checkout API has finished */
  ready: boolean;
  onComplete: () => void;
};

type Phase = "processing" | "complete";

export function PaymentProcessingModal({
  open,
  ready,
  onComplete,
}: PaymentProcessingModalProps) {
  const [phase, setPhase] = useState<Phase>("processing");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) {
      setPhase("processing");
      setProgress(0);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const started = performance.now();
    const duration = 3200;
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      const eased = 1 - (1 - t) ** 3;
      // Hold at 92% until the server/cart work is ready
      const capped = ready ? eased * 100 : Math.min(eased * 100, 92);
      setProgress(Math.round(capped));

      if (!ready || t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setPhase("complete");
      }
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, ready]);

  useEffect(() => {
    if (!open || !ready) return;
    // Snap to complete once work is done and bar is nearly full
    if (progress >= 92) {
      setProgress(100);
      setPhase("complete");
    }
  }, [open, ready, progress]);

  useEffect(() => {
    if (!open || phase !== "complete") return;
    const timer = window.setTimeout(() => {
      onComplete();
    }, 1600);
    return () => window.clearTimeout(timer);
  }, [open, phase, onComplete]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/92 px-5 backdrop-blur-md"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      aria-live="polite"
    >
      <div className="w-full max-w-md border border-bone/15 bg-black px-6 py-10 text-center shadow-[0_30px_80px_rgba(0,0,0,0.65)] sm:px-10 sm:py-12">
        <p className="font-mono text-[10px] tracking-[0.3em] text-cream uppercase">
          {phase === "processing" ? "Processing order" : "Order complete"}
        </p>
        <h2
          id="payment-modal-title"
          className="mt-3 font-display text-3xl tracking-[0.08em] text-bone uppercase sm:text-4xl"
        >
          {phase === "processing" ? "Carrying peace home" : "It is finished"}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-bone/60">
          {phase === "processing"
            ? "Your payment is being sealed. The dove is on its way."
            : "Your place in the house is confirmed."}
        </p>

        <div className="relative mx-auto mt-10 h-28 w-full max-w-sm">
          <div
            aria-hidden
            className="absolute top-1/2 right-4 left-4 h-px -translate-y-1/2 bg-gradient-to-r from-bone/10 via-cream/40 to-bone/10"
          />

          <div aria-hidden className="absolute bottom-3 left-2 text-cream/50">
            <OliveBranch className="h-8 w-8 rotate-[-20deg]" />
          </div>

          <div aria-hidden className="absolute right-2 bottom-3 text-cream/70">
            <OliveBranch className="h-8 w-8 rotate-[20deg] scale-x-[-1]" />
          </div>

          <div
            className={`dove-flight absolute top-1/2 ${
              phase === "processing" ? "is-flying" : ""
            }`}
            style={
              {
                ["--dove-progress"]: `${Math.min(progress, 92)}%`,
              } as CSSProperties
            }
          >
            <DoveWithBranch
              className={`h-14 w-14 text-bone transition duration-500 ${
                phase === "complete" ? "scale-110 text-cream" : ""
              }`}
            />
          </div>
        </div>

        <div className="mx-auto mt-8 h-1 w-full max-w-xs overflow-hidden bg-bone/10">
          <div
            className="h-full bg-cream transition-[width] duration-100 ease-out"
            style={{ width: `${phase === "complete" ? 100 : progress}%` }}
          />
        </div>

        <p className="mt-4 font-mono text-[11px] tracking-[0.25em] text-bone/45 uppercase">
          {phase === "processing" ? `${progress}%` : "Complete"}
        </p>

        {phase === "complete" && (
          <div className="animate-in mt-6 inline-flex items-center gap-2 border border-cream/40 bg-cream/10 px-4 py-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cream font-mono text-[11px] text-ink">
              ✓
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-cream uppercase">
              Process complete
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function DoveWithBranch({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <path
        d="M28 34c-6 0-12 2-16 6 4 1 9 1 14-1 2 4 6 7 12 8-2-4-2-8 0-11 4-1 8-1 12 1-3-5-8-8-14-8-2 0-5 1-8 5z"
        fill="currentColor"
        opacity="0.95"
      />
      <path
        d="M30 30c4-6 10-9 18-9-4 4-6 8-6 13-5-1-9 0-12 3 0-3 0-5 0-7z"
        fill="currentColor"
        opacity="0.75"
      />
      <circle cx="22" cy="28" r="5" fill="currentColor" />
      <circle cx="20.5" cy="27" r="1" fill="#0a0a0a" />
      <path d="M17 28h-4l4 2v-2z" fill="#c4a574" />
      <g transform="translate(6 24)">
        <path
          d="M0 6c6-1 10-4 12-8"
          stroke="#c4a574"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <ellipse
          cx="4"
          cy="3"
          rx="2.5"
          ry="1.4"
          fill="#c4a574"
          transform="rotate(-30 4 3)"
        />
        <ellipse
          cx="8"
          cy="2"
          rx="2.5"
          ry="1.4"
          fill="#c4a574"
          transform="rotate(-10 8 2)"
        />
        <ellipse
          cx="11"
          cy="0"
          rx="2.2"
          ry="1.2"
          fill="#c4a574"
          transform="rotate(10 11 0)"
        />
      </g>
    </svg>
  );
}

function OliveBranch({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path
        d="M4 24c8-2 14-8 18-18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <ellipse
        cx="10"
        cy="18"
        rx="3"
        ry="1.6"
        fill="currentColor"
        transform="rotate(-35 10 18)"
      />
      <ellipse
        cx="16"
        cy="12"
        rx="3"
        ry="1.6"
        fill="currentColor"
        transform="rotate(-20 16 12)"
      />
      <ellipse
        cx="20"
        cy="7"
        rx="2.6"
        ry="1.4"
        fill="currentColor"
        transform="rotate(-5 20 7)"
      />
    </svg>
  );
}
