"use client";

import { useEffect, useRef } from "react";
import { profile } from "@/lib/constants/profile";
import { useScanReplay } from "@/lib/hooks/useScanReplay";
import { useIntroDone, useIntroLogoSlot } from "@/lib/intro-context";

// 走査線が各テキストの高さを通過するおおよそのタイミングに合わせた遅延
const PULSE_DELAYS_MS = [400, 600, 800];

export function Header() {
  const { ref: headerRef, scanKey } = useScanReplay();
  const textRefs = useRef<Array<HTMLElement | null>>([]);
  // イントロ演出がある場合、ヘッダー自身の走査線・テキストアニメーションは
  // イントロ終了と同時に開始させる（イントロがない場合は true で即座に開始）
  const introDone = useIntroDone();
  // イントロのキューブが着地先として座標を測るためのロゴ領域
  const logoSlotRef = useIntroLogoSlot();

  useEffect(() => {
    if (!introDone) return;

    textRefs.current.forEach((el, index) => {
      if (!el) return;
      el.classList.remove("header-pulse");
      // 同じクラスを付け直すだけではアニメーションが再生されないため、
      // 強制リフローを挟んでから付け直す
      void el.offsetWidth;
      el.style.animationDelay = `${PULSE_DELAYS_MS[index]}ms`;
      el.classList.add("header-pulse");
    });
  }, [scanKey, introDone]);

  return (
    <header ref={headerRef} className="relative overflow-hidden">
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

      <div className="relative mx-auto w-full max-w-5xl px-4 pb-10 pt-20 sm:px-6 sm:pt-28">
        <div
          ref={logoSlotRef ?? undefined}
          aria-hidden="true"
          className={
            introDone
              ? "header-logo header-logo--visible mb-3"
              : "header-logo mb-3"
          }
        >
          {profile.name.charAt(0)}
        </div>
        <div
          className={
            introDone ? "header-reveal [animation-delay:400ms]" : "opacity-0"
          }
        >
          <p
            ref={(el) => {
              textRefs.current[0] = el;
            }}
            className="text-sm font-medium tracking-widest text-accent"
          >
            PORTFOLIO
          </p>
        </div>
        <div
          className={
            introDone
              ? "header-reveal mt-3 [animation-delay:600ms]"
              : "mt-3 opacity-0"
          }
        >
          <h1
            ref={(el) => {
              textRefs.current[1] = el;
            }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {profile.name}
          </h1>
        </div>
        <div
          className={
            introDone
              ? "header-reveal mt-4 max-w-xl [animation-delay:800ms]"
              : "mt-4 max-w-xl opacity-0"
          }
        >
          <p
            ref={(el) => {
              textRefs.current[2] = el;
            }}
            className="text-base leading-relaxed text-muted"
          >
            {profile.tagline}
          </p>
        </div>
      </div>
    </header>
  );
}
