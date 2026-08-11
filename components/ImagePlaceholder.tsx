export function ImagePlaceholder({ title }: { title: string }) {
  const initial = [...title.trim()][0] ?? "?";

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-surface to-background">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <span
        className="relative text-5xl font-bold text-accent/70 select-none"
        aria-hidden="true"
      >
        {initial}
      </span>
    </div>
  );
}
