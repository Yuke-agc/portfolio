"use client";

import { motion } from "framer-motion";

type TitleTextProps = {
  title: string;
  visible: boolean;
};

type TargetOffset = { x: number; y: number; scale: number };

/**
 * 描き終えたYKを実ページの.header-logoと同じ外観に固め、最後にその実座標へ運ぶ。
 * オーバーレイ消滅とHero表示が同じ位置で入れ替わるため、ロゴが連続して見える。
 */
export function TitleText({ title, visible }: TitleTextProps) {
  const logo = typeof document === "undefined" ? null : document.querySelector<HTMLElement>(".header-logo");
  const target: TargetOffset = logo
    ? (() => {
        const rect = logo.getBoundingClientRect();
        return {
      x: rect.left + rect.width / 2 - window.innerWidth / 2,
      y: rect.top + rect.height / 2 - window.innerHeight / 2,
      scale: rect.width / 64,
        };
      })()
    : { x: 0, y: 0, scale: 1 };

  return (
    <motion.div
      className="pointer-events-none fixed left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-[#d9a566] bg-[#d9a566]/[0.06] font-mono text-xl font-bold tracking-[-0.04em] text-[#d9a566] shadow-[0_0_30px_rgba(217,165,102,0.24)]"
      initial={{ opacity: 0, x: 0, y: 0, scale: 1.18 }}
      animate={
        visible
          ? { opacity: [0, 1, 1], x: [0, 0, target.x], y: [0, 0, target.y], scale: [1.18, 1, target.scale] }
          : { opacity: 0, x: 0, y: 0, scale: 1.18 }
      }
      transition={{ duration: 0.9, times: [0, 0.28, 1], ease: [0.16, 1, 0.3, 1] }}
    >
      {title}
    </motion.div>
  );
}
