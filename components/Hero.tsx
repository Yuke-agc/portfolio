"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { ArrowDownRight } from "lucide-react";
import { profile } from "@/lib/constants/profile";
import { socialLinks } from "@/lib/constants/socialLinks";
import { useScanReplay } from "@/lib/hooks/useScanReplay";
import { useIntroDone } from "@/lib/intro-context";
import { BrandMark } from "./BrandMark";
import { MailtoLink } from "./MailtoLink";

type FadeUpOptions = { distance: number; duration: number; delayMs: number };

export function Hero() {
  const { ref: heroRef, scanKey } = useScanReplay();
  const introDone = useIntroDone();
  const [pointerActive, setPointerActive] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    let enabled = false;
    try {
      enabled = window.matchMedia("(hover: hover) and (pointer: fine)").matches
        && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      enabled = false;
    }
    if (!enabled) return;

    let rafId: number | null = null;
    let latest = { x: 0, y: 0 };
    const applyPointer = () => {
      rafId = null;
      hero.style.setProperty("--pointer-x", `${latest.x}px`);
      hero.style.setProperty("--pointer-y", `${latest.y}px`);
    };
    const handlePointerMove = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      latest = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      if (rafId === null) rafId = window.requestAnimationFrame(applyPointer);
    };
    const enter = () => setPointerActive(true);
    const leave = () => setPointerActive(false);
    hero.addEventListener("pointermove", handlePointerMove);
    hero.addEventListener("pointerenter", enter);
    hero.addEventListener("pointerleave", leave);
    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerenter", enter);
      hero.removeEventListener("pointerleave", leave);
    };
  }, [heroRef]);

  const fadeUpClass = (extra?: string) => [
    "hero-fade-up",
    introDone ? "hero-fade-up--in" : "",
    extra ?? "",
  ].filter(Boolean).join(" ");
  const fadeUpStyle = ({ distance, duration, delayMs }: FadeUpOptions): CSSProperties => ({
    "--hero-fade-distance": `${distance}px`,
    "--hero-fade-duration": `${duration}ms`,
    animationDelay: introDone ? `${delayMs}ms` : undefined,
  }) as CSSProperties;

  return (
    <header ref={heroRef} className="relative flex min-h-[100svh] flex-col overflow-hidden border-b border-border px-5 sm:px-8 lg:px-12">
      <noscript dangerouslySetInnerHTML={{ __html: "<style>.hero-fade-up,.hero-h1-reveal,.hero-scroll-line,.header-logo{opacity:1!important;clip-path:none!important;transform:none!important;animation:none!important}</style>" }} />
      {introDone && (
        <>
          <div aria-hidden="true" className="header-grid pointer-events-none absolute inset-0" />
          <div key={`grid-${scanKey}`} aria-hidden="true" className="header-grid-glow pointer-events-none absolute inset-0" />
          <div key={`scan-${scanKey}`} aria-hidden="true" className="header-scan-line pointer-events-none absolute inset-x-0 top-0 h-px" />
        </>
      )}
      <div aria-hidden="true" className={`hero-pointer-glow pointer-events-none absolute inset-0 ${pointerActive ? "hero-pointer-glow--active" : ""}`} />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-border/70 py-6">
          <div aria-hidden="true" className={introDone ? "header-logo header-logo--visible" : "header-logo"}>
            <BrandMark className="h-7 w-7" />
          </div>
          <p className={fadeUpClass("text-[10px] uppercase tracking-[0.24em] text-muted sm:text-xs")} style={fadeUpStyle({ distance: 6, duration: 400, delayMs: 80 })}>
            Product Engineer · Japan
          </p>
        </div>

        <div className="grid flex-1 items-center gap-14 py-14 lg:grid-cols-[minmax(0,1.55fr)_minmax(250px,.45fr)] lg:gap-20 lg:py-20">
          <div>
            <p className={fadeUpClass("mb-6 text-xs font-medium uppercase tracking-[0.32em] text-accent")} style={fadeUpStyle({ distance: 8, duration: 450, delayMs: 140 })}>
              Portfolio / 01
            </p>
            <h1 className={`hero-h1-reveal whitespace-pre-line text-balance text-[clamp(2.7rem,5.2vw,5rem)] font-semibold leading-[1.06] tracking-[-0.05em] text-foreground ${introDone ? "hero-h1-reveal--in" : ""}`} style={{ animationDelay: introDone ? "220ms" : undefined }}>
              <span className="sm:hidden">{profile.heroStatementMobile}</span>
              <span className="hidden sm:inline">{profile.heroStatement}</span>
            </h1>
          </div>

          <aside className={fadeUpClass("border-l border-accent/35 pl-6 lg:self-end lg:mb-4")} style={fadeUpStyle({ distance: 12, duration: 550, delayMs: 430 })}>
            <p className="text-sm font-semibold text-foreground">{profile.name}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-accent">{profile.title}</p>
            <p className="mt-5 text-sm leading-7 text-muted">{profile.valueProposition}</p>
            <div className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
              Building {profile.nowBuilding}
            </div>
          </aside>
        </div>

        <div className={fadeUpClass("flex flex-col gap-5 border-t border-border/70 py-6 sm:flex-row sm:items-center sm:justify-between")} style={fadeUpStyle({ distance: 8, duration: 450, delayMs: 620 })}>
          <div className="flex items-center gap-6">
            <a href="#works" className="group inline-flex min-h-11 items-center gap-3 text-sm font-medium text-foreground transition-colors hover:text-accent">
              代表作を見る
              <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" aria-hidden="true" />
            </a>
            <MailtoLink user={profile.contactEmailUser} domain={profile.contactEmailDomain} ariaLabel="メールで連絡する" className="min-h-11 content-center text-sm text-muted transition-colors hover:text-foreground">
              相談する
            </MailtoLink>
          </div>
          <ul className="flex items-center gap-4">
            {socialLinks.map(({ name, url, icon: Icon }) => (
              <li key={name}>
                <a href={url} target="_blank" rel="noopener noreferrer" aria-label={name} className="flex h-11 w-11 items-center justify-center text-muted transition-colors hover:text-accent">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
