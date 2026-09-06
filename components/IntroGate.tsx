"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { IntroContext } from "@/lib/intro-context";

const IntroSplash = dynamic(
  () => import("./intro-splash/IntroSplash").then((m) => m.IntroSplash),
  { ssr: false }
);

type IntroGateProps = {
  children: ReactNode;
};

/**
 * トップページ表示前に IntroSplash を一度だけ再生し、完了後は本編
 * （children）のアニメーションを起動させる。IntroSplash 自体は3D演出だけに
 * 専念させ、SSR対応・prefers-reduced-motion・スクロールロックはここに集約する。
 */
export function IntroGate({ children }: IntroGateProps) {
  const [introDone, setIntroDone] = useState(false);
  const finishedRef = useRef(false);
  const previousOverflowRef = useRef("");

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    try {
      window.sessionStorage.setItem("portfolio-intro-seen", "1");
    } catch {
      // Storageを利用できない環境でも、本体表示は続行する。
    }
    document.body.style.overflow = previousOverflowRef.current;
    setIntroDone(true);
  }, []);

  useEffect(() => {
    let prefersReducedMotion = false;
    try {
      prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    } catch {
      prefersReducedMotion = true;
    }

    const forceReplay = new URLSearchParams(window.location.search).get("intro") === "1";
    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem("portfolio-intro-seen") === "1";
    } catch {
      // 読み取り不可なら通常どおり再生する。
    }

    if (prefersReducedMotion || (alreadySeen && !forceReplay)) {
      finishedRef.current = true;
      queueMicrotask(() => setIntroDone(true));
      return;
    }

    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const fallbackTimer = window.setTimeout(finish, 7000);

    return () => {
      window.clearTimeout(fallbackTimer);
      if (!finishedRef.current) {
        document.body.style.overflow = previousOverflowRef.current;
      }
    };
  }, [finish]);

  const contextValue = useMemo(() => ({ introDone }), [introDone]);

  return (
    <IntroContext.Provider value={contextValue}>
      {/* JS無効時は introDone が永久に false のままになり、オーバーレイが
          ページ全体を覆い続けてしまう。noscript で確実に非表示にする */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: "<style>.intro-splash{display:none !important}</style>",
        }}
      />
      {!introDone && <IntroSplash duration={4200} onComplete={finish} />}
      {children}
    </IntroContext.Provider>
  );
}
