"use client";

import { useEffect, useRef } from "react";
import { profile } from "@/lib/constants/profile";
import { useScanReplay } from "@/lib/hooks/useScanReplay";

// 走査線が各テキストの高さを通過するおおよそのタイミングに合わせた遅延
const PULSE_DELAYS_MS = [400, 600, 800];

export function Header() {
  const { ref: headerRef, scanKey } = useScanReplay();
  const textRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    textRefs.current.forEach((el, index) => {
      if (!el) return;
      el.classList.remove("header-pulse");
      // 同じクラスを付け直すだけではアニメーションが再生されないため、
      // 強制リフローを挟んでから付け直す
      void el.offsetWidth;
      el.style.animationDelay = `${PULSE_DELAYS_MS[index]}ms`;
      el.classList.add("header-pulse");
    });
  }, [scanKey]);

  return (
    <header ref={headerRef} className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="header-grid pointer-events-none absolute inset-0"
      />
      <div
        key={scanKey}
        aria-hidden="true"
        className="header-scan-line pointer-events-none absolute inset-x-0 top-0 h-0.5"
      />

      <div className="relative mx-auto w-full max-w-5xl px-4 pb-10 pt-20 sm:px-6 sm:pt-28">
        <div className="header-reveal [animation-delay:400ms]">
          <p
            ref={(el) => {
              textRefs.current[0] = el;
            }}
            className="text-sm font-medium tracking-widest text-accent"
          >
            PORTFOLIO
          </p>
        </div>
        <div className="header-reveal mt-3 [animation-delay:600ms]">
          <h1
            ref={(el) => {
              textRefs.current[1] = el;
            }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {profile.name}
          </h1>
        </div>
        <div className="header-reveal mt-4 max-w-xl [animation-delay:800ms]">
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
