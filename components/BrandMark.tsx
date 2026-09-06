import type { CSSProperties } from "react";
import { BRAND_STROKES, brandStrokePath } from "@/lib/brand-mark";

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
      {BRAND_STROKES.map((points, index) => (
        <path
          key={index}
          d={brandStrokePath(points)}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      ))}
    </svg>
  );
}
