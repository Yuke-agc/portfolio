import { profile } from "@/lib/constants/profile";

export function Header() {
  return (
    <header className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="header-grid pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="header-scan-line pointer-events-none absolute inset-x-0 top-0 h-0.5"
      />

      <div className="relative mx-auto w-full max-w-5xl px-4 pb-10 pt-20 sm:px-6 sm:pt-28">
        <p className="header-reveal text-sm font-medium tracking-widest text-accent [animation-delay:400ms]">
          PORTFOLIO
        </p>
        <h1 className="header-reveal mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl [animation-delay:600ms]">
          {profile.name}
        </h1>
        <p className="header-reveal mt-4 max-w-xl text-base leading-relaxed text-muted [animation-delay:800ms]">
          {profile.tagline}
        </p>
      </div>
    </header>
  );
}
