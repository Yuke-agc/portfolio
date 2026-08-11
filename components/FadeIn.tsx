"use client";

import type { ReactNode } from "react";
import { useInView } from "@/lib/hooks/useInView";

type FadeInProps = {
  children: ReactNode;
  /** 表示開始までの遅延（ms）。作品カードのスタッガー表示に使用 */
  delayMs?: number;
  className?: string;
};

export function FadeIn({ children, delayMs = 0, className }: FadeInProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={[
        "transition-[opacity,transform] duration-[900ms] ease-premium motion-reduce:transition-none",
        inView ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ transitionDelay: inView && delayMs ? `${delayMs}ms` : undefined }}
    >
      {children}
    </div>
  );
}
