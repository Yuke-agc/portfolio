"use client";

import { useEffect, useRef, useState } from "react";

type UseInViewOptions = {
  threshold?: number;
  rootMargin?: string;
  /** observe開始からこの時間(ms)経過しても発火しない場合、強制的に inView=true にする */
  fallbackDelayMs?: number;
};

/**
 * 要素がビューポートに入ったかを判定するフック。
 * prefers-reduced-motion が有効な環境や IntersectionObserver 非対応環境では
 * 初回描画から inView = true を返し、アニメーションをスキップする。
 *
 * フッターのように文書末尾ぎりぎりに置かれた要素は、rootMargin の下端マージンで
 * 除外される領域に収まってしまい一度も isIntersecting が true にならないことがあるため、
 * fallbackDelayMs 経過後に強制的に表示するフォールバックを備えている。
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -10% 0px",
    fallbackDelayMs = 1500,
  } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      // setState をエフェクト内で直接同期呼び出ししないよう、マイクロタスクに逃がす
      queueMicrotask(() => setInView(true));
      return;
    }

    const reveal = () => {
      setInView(true);
      observer.unobserve(node);
      clearTimeout(fallbackTimer);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) reveal();
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    // ビューポート下端付近の要素が一度も交差判定されないケースの保険
    const fallbackTimer = setTimeout(reveal, fallbackDelayMs);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [threshold, rootMargin, fallbackDelayMs]);

  return { ref, inView };
}
