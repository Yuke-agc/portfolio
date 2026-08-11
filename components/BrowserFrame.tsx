import Image from "next/image";
import type { Work } from "@/lib/constants/works";
import { ImagePlaceholder } from "./ImagePlaceholder";

const DOT_COLORS = ["#ef5350", "#f5bd42", "#5cb85c"];

export function BrowserFrame({ work }: { work: Work }) {
  const domain = new URL(work.url).hostname.replace(/^www\./, "");

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background shadow-frame">
      <div className="flex items-center gap-3 border-b border-border bg-surface px-3 py-2">
        <span className="flex shrink-0 gap-1.5" aria-hidden="true">
          {DOT_COLORS.map((color) => (
            <span
              key={color}
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </span>
        <span className="flex-1 truncate rounded-full bg-background px-3 py-1 text-center text-[11px] text-muted">
          {domain}
        </span>
      </div>
      <div className="relative aspect-[16/10] w-full">
        {work.imagePath ? (
          <Image
            src={work.imagePath}
            alt={`${work.title} のスクリーンショット`}
            fill
            className="object-cover"
          />
        ) : (
          <ImagePlaceholder title={work.title} />
        )}
      </div>
    </div>
  );
}
