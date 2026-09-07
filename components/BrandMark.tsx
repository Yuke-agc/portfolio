import type { CSSProperties } from "react";
import { brandPath, BRAND_STROKE_WIDTH } from "@/lib/brand-mark";

type BrandMarkProps = {
  className?: string;
  style?: CSSProperties;
  title?: string;
};

export function BrandMark({ className, style, title }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={style}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <path
        d={brandPath()}
        fill="none"
        stroke="currentColor"
        strokeWidth={BRAND_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
