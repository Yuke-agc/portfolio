"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { profile, BRAND_MARK } from "@/lib/constants/profile";
import { socialLinks } from "@/lib/constants/socialLinks";
import { useScanReplay } from "@/lib/hooks/useScanReplay";
import { useIntroDone } from "@/lib/intro-context";
import { MailtoLink } from "./MailtoLink";

type FadeUpOptions = {
  /** translateY の開始距離(px) */
  distance: number;
  /** アニメーション時間(ms) */
  duration: number;
  /** イントロ終了からの遅延(ms) */
  delayMs: number;
};

export function Hero() {
  const { ref: heroRef, scanKey } = useScanReplay();
  // イントロ演出がある場合、Hero自身の走査線・コンテンツのアニメーションは
  // イントロ終了と同時に開始させる（イントロがない場合は true で即座に開始）
  const introDone = useIntroDone();
  const [pointerActive, setPointerActive] = useState(false);

  // ポインター追従グロー。(hover: hover) and (pointer: fine) の環境でのみ有効にし、
  // 移動のたびに React state を更新せず、rAFで間引いてCSSカスタムプロパティへ直接書き込む
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let enabled = false;
    try {
      enabled =
        window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      if (rafId === null) {
        rafId = window.requestAnimationFrame(applyPointer);
      }
    };

    const handlePointerEnter = () => setPointerActive(true);
    const handlePointerLeave = () => setPointerActive(false);

    hero.addEventListener("pointermove", handlePointerMove);
    hero.addEventListener("pointerenter", handlePointerEnter);
    hero.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerenter", handlePointerEnter);
      hero.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [heroRef]);

  const fadeUpClass = (extra?: string) =>
    ["hero-fade-up", introDone ? "hero-fade-up--in" : "", extra ?? ""]
      .filter(Boolean)
      .join(" ");

  const fadeUpStyle = ({
    distance,
    duration,
    delayMs,
  }: FadeUpOptions): CSSProperties =>
    ({
      "--hero-fade-distance": `${distance}px`,
      "--hero-fade-duration": `${duration}ms`,
      animationDelay: introDone ? `${delayMs}ms` : undefined,
    }) as CSSProperties;

  return (
    <header
      ref={heroRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-5 sm:px-8 lg:min-h-[88vh] lg:px-12"
    >
      {/* JS無効時は introDone が永久に false のままになり、名前・本文・CTAが
          opacity: 0 / clip-path で隠れたままになってしまう。noscript で強制的に表示する */}
      <noscript
        dangerouslySetInnerHTML={{
          __html:
            "<style>.hero-fade-up,.hero-h1-reveal,.hero-scroll-line,.header-logo{opacity:1 !important;clip-path:none !important;transform:none !important;animation:none !important}</style>",
        }}
      />
      {introDone && (
        <>
          <div
            aria-hidden="true"
            className="header-grid pointer-events-none absolute inset-0"
          />
          <div
            key={`grid-glow-${scanKey}`}
            aria-hidden="true"
            className="header-grid-glow pointer-events-none absolute inset-0"
          />
          <div
            key={`scan-line-${scanKey}`}
            aria-hidden="true"
            className="header-scan-line pointer-events-none absolute inset-x-0 top-0 h-0.5"
          />
        </>
      )}
      <div
        aria-hidden="true"
        className={[
          "hero-pointer-glow",
          pointerActive ? "hero-pointer-glow--active" : "",
          "pointer-events-none absolute inset-0",
        ]
          .filter(Boolean)
          .join(" ")}
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center py-20 sm:py-24">
        {/* 1. マーク */}
        <div
          aria-hidden="true"
          className={
            introDone
              ? "header-logo header-logo--visible mb-3"
              : "header-logo mb-3"
          }
        >
          {BRAND_MARK}
        </div>

        {/* 2. 小見出し */}
        <p
          className={fadeUpClass(
            "text-xs font-medium uppercase tracking-[0.3em] text-accent"
          )}
          style={fadeUpStyle({ distance: 8, duration: 450, delayMs: 80 })}
        >
          PORTFOLIO / 01
        </p>

        {/* 3. H1 */}
        <h1
          className={[
            "hero-h1-reveal",
            introDone ? "hero-h1-reveal--in" : "",
            "mt-4 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ animationDelay: introDone ? "180ms" : undefined }}
        >
          {profile.name}
        </h1>

        {/* 4. 肩書き・価値提案 */}
        <div
          className={fadeUpClass()}
          style={fadeUpStyle({ distance: 10, duration: 450, delayMs: 380 })}
        >
          <p className="mt-2 text-base font-medium text-muted sm:text-lg">
            {profile.title}
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {profile.valueProposition}
          </p>
        </div>

        {/* 5. ステータス・CTA・SNSアイコン */}
        <div
          className={fadeUpClass()}
          style={fadeUpStyle({ distance: 8, duration: 400, delayMs: 540 })}
        >
          <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-wider text-muted">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
            />
            <span>Now building: {profile.nowBuilding}</span>
          </div>

          <div aria-hidden="true" className="my-5 h-px w-16 bg-border" />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <a
              href="#works"
              className="group inline-flex min-h-11 w-fit items-center gap-2 rounded-md border border-accent/40 px-5 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 ease-premium hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              代表作を見る
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 ease-premium group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
            <MailtoLink
              user={profile.contactEmailUser}
              domain={profile.contactEmailDomain}
              ariaLabel="メールで連絡する"
              className="group inline-flex min-h-11 w-fit items-center text-sm font-medium text-muted transition-colors duration-200 ease-premium hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="relative">
                相談する
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-200 ease-premium group-hover:scale-x-100"
                />
              </span>
            </MailtoLink>
          </div>

          <ul className="mt-6 flex flex-wrap gap-2">
            {socialLinks.map(({ name, url, icon: Icon }) => (
              <li key={name}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border text-muted transition-colors duration-200 ease-premium hover:border-accent/40 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 7. スクロール誘導（デスクトップのみ） */}
      <div
        aria-hidden="true"
        className={fadeUpClass(
          "pointer-events-none absolute bottom-8 right-5 hidden flex-col items-center gap-3 sm:right-8 lg:right-12 lg:flex"
        )}
        style={fadeUpStyle({ distance: 0, duration: 500, delayMs: 720 })}
      >
        <span className="text-[10px] font-medium tracking-[0.2em] text-muted [writing-mode:vertical-rl]">
          SCROLL TO EXPLORE
        </span>
        <span
          className={[
            "hero-scroll-line",
            introDone ? "hero-scroll-line--in" : "",
            "h-12 w-px bg-accent/50",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </div>
    </header>
  );
}
