export function ImagePlaceholder({ title }: { title: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#101012]">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgb(217 165 102 / .06) 1px, transparent 1px), linear-gradient(90deg, rgb(217 165 102 / .06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div aria-hidden="true" className="absolute left-[12%] top-[14%] h-px w-[18%] bg-accent/40" />
      <div aria-hidden="true" className="absolute bottom-[14%] right-[12%] h-px w-[18%] bg-accent/40" />
      <div className="relative flex flex-col items-center text-center select-none">
        <span className="text-[10px] uppercase tracking-[0.42em] text-accent/70">Words, without numbers</span>
        <span className="mt-5 text-5xl font-medium tracking-[0.18em] text-foreground/90 sm:text-7xl">余白</span>
        <span className="mt-5 text-xs tracking-[0.28em] text-muted">{title.replace("余白 | ", "")}</span>
      </div>
    </div>
  );
}
