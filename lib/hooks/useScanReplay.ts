"use client";

import { useEffect, useRef, useState } from "react";

const MIN_REPLAY_INTERVAL_MS = 1000;

/**
 * ヘッダーの走査線演出専用フック。
 *
 * 通常の useInView は「一度 true になったら固定」の実装だが、この演出は
 * ヘッダーが完全に画面外へ出てから再び画面内に戻るたびに再生し直したいため、
 * 別フックとして用意している。
 *
 * 返り値の scanKey は再生のたびにインクリメントされる。呼び出し側はこれを
 * 走査線要素の React key に渡すことで DOM ノードを再生成し、
 * CSS animation を最初から再生させる。
 */
export function useScanReplay() {
  const ref = useRef<HTMLElement>(null);
  const [scanKey, setScanKey] = useState(0);
  const hasFullyExitedRef = useRef(false);
  const lastPlayedAtRef = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          // 完全に画面外に出たときだけ「次回入場時に再生してよい」フラグを立てる。
          // 部分的なスクロールの往復では再生させないための唯一の条件。
          hasFullyExitedRef.current = true;
          return;
        }

        if (!hasFullyExitedRef.current) return;

        const now = Date.now();
        if (now - lastPlayedAtRef.current < MIN_REPLAY_INTERVAL_MS) return;

        lastPlayedAtRef.current = now;
        hasFullyExitedRef.current = false;
        setScanKey((key) => key + 1);
      },
      { threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, scanKey };
}
