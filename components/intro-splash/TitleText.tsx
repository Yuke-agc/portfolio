"use client";

import { motion } from "framer-motion";
import { BrandMark } from "@/components/BrandMark";

type TitleTextProps = { sourceSize: number };
type TargetOffset = { x: number; y: number; scale: number };

/** 完成した共通YKロゴを、Heroにある同じロゴの実座標へ運ぶ。 */
export function TitleText({ sourceSize }: TitleTextProps) {
  const logo = typeof document === "undefined"
    ? null
    : document.querySelector<SVGElement>(".header-logo svg");
  const target: TargetOffset = logo
    ? (() => {
        const rect = logo.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - window.innerWidth / 2,
          y: rect.top + rect.height / 2 - window.innerHeight / 2,
          scale: rect.width / sourceSize,
        };
      })()
    : { x: 0, y: 0, scale: 1 };

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#d9a566]"
      style={{ width: sourceSize, height: sourceSize }}
      initial={{ opacity: 0, x: 0, y: 0, scale: 1 }}
      animate={{ opacity: [0, 1, 1], x: [0, 0, target.x], y: [0, 0, target.y], scale: [1, 1, target.scale] }}
      transition={{ duration: 0.52, times: [0, 0.3, 1], ease: [0.16, 1, 0.3, 1] }}
    >
      <BrandMark className="h-full w-full" />
    </motion.div>
  );
}
