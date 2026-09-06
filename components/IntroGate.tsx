"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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

  useEffect(() => {
    let prefersReducedMotion = false;
    try {
      prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    } catch {
      prefersReducedMotion = true;
    }

    if (prefersReducedMotion) {
      queueMicrotask(() => setIntroDone(true));
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      if (!finishedRef.current) {
        document.body.style.overflow = previousOverflow;
      }
    };
  }, []);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    document.body.style.overflow = "";
    setIntroDone(true);
  };

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
      {!introDone && <IntroSplash duration={6000} onComplete={finish} />}
      {children}
    </IntroContext.Provider>
  );
}
