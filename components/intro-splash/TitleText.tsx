"use client";

import { motion } from "framer-motion";
import { BrandMark } from "@/components/BrandMark";

type TitleTextProps = { visible: boolean };
type TargetOffset = { x: number; y: number; scale: number };

/** 完成した共通YKロゴを、Heroにある同じロゴの実座標へ運ぶ。 */
export function TitleText({ visible }: TitleTextProps) {
  const logo = typeof document === "undefined"
    ? null
    : document.querySelector<SVGElement>(".header-logo svg");
  const target: TargetOffset = logo
    ? (() => {
        const rect = logo.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - window.innerWidth / 2,
          y: rect.top + rect.height / 2 - window.innerHeight / 2,
          scale: rect.width / 208,
        };
      })()
    : { x: 0, y: 0, scale: 1 };

  return (
    <motion.div
      className="pointer-events-none fixed left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 text-[#d9a566] drop-shadow-[0_0_16px_rgba(217,165,102,0.28)]"
      initial={{ opacity: 0, x: 0, y: 0, scale: 1.04 }}
      animate={visible
        ? { opacity: [0, 1, 1], x: [0, 0, target.x], y: [0, 0, target.y], scale: [1.04, 1, target.scale] }
        : { opacity: 0, x: 0, y: 0, scale: 1.04 }}
      transition={{ duration: 0.82, times: [0, 0.18, 1], ease: [0.16, 1, 0.3, 1] }}
    >
      <BrandMark className="h-full w-full" />
    </motion.div>
  );
}
