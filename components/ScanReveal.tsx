"use client";

import type { ReactNode } from "react";
import { useInView } from "@/lib/hooks/useInView";

type ScanRevealProps = {
  children: ReactNode;
  /** 表示開始までの遅延（ms）。作品カードのスタッガー表示に使用 */
  delayMs?: number;
  className?: string;
};

/**
 * 画面内に入ったカードを、左から右へ横切る走査線とともに現す。
 * useInView は一度 inView になったら戻らないため、再スクロールで消えることはない。
 */
export function ScanReveal({ children, delayMs = 0, className }: ScanRevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const animationDelay = inView && delayMs ? `${delayMs}ms` : undefined;

  return (
    <div
      ref={ref}
      className={["relative", className ?? ""].filter(Boolean).join(" ")}
    >
      <div
        className={[
          "scan-reveal-content h-full",
          inView ? "scan-reveal-content--in" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ animationDelay }}
      >
        {children}
      </div>
      {inView && (
        <span
          aria-hidden="true"
          className="scan-reveal-line"
          style={{ animationDelay }}
        />
      )}
    </div>
  );
}
