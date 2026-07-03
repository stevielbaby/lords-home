type FunnelProgressProps = {
  current: "book" | "tickets" | "done";
  showTickets?: boolean;
  tone?: "dark" | "light";
};

const steps = [
  { id: "book", label: "Book" },
  { id: "tickets", label: "Tickets" },
  { id: "done", label: "Confirmed" },
] as const;

export function FunnelProgress({
  current,
  showTickets = true,
  tone = "dark",
}: FunnelProgressProps) {
  const visibleSteps = showTickets
    ? steps
    : steps.filter((step) => step.id !== "tickets");

  const currentIndex = visibleSteps.findIndex((step) => step.id === current);

  const colors =
    tone === "light"
      ? {
          active: "text-ink",
          complete: "text-ink/70",
          idle: "text-ink/35",
          lineActive: "bg-ink/40",
          lineIdle: "bg-ink/15",
        }
      : {
          active: "text-cream",
          complete: "text-bone/70",
          idle: "text-bone/35",
          lineActive: "bg-cream/60",
          lineIdle: "bg-bone/20",
        };

  return (
    <ol className="flex flex-wrap items-center gap-2 sm:gap-3">
      {visibleSteps.map((step, index) => {
        const complete = index < currentIndex;
        const active = index === currentIndex;
        const color = active
          ? colors.active
          : complete
            ? colors.complete
            : colors.idle;
        return (
          <li key={step.id} className="flex items-center gap-2 sm:gap-3">
            {index > 0 && (
              <span
                className={`hidden h-px w-4 sm:block ${complete || active ? colors.lineActive : colors.lineIdle}`}
                aria-hidden
              />
            )}
            <span
              className={`font-mono text-[10px] tracking-[0.18em] uppercase sm:text-[11px] ${color}`}
            >
              <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center border border-current text-[9px]">
                {complete ? "✓" : index + 1}
              </span>
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
