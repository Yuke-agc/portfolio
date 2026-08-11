import { ExternalLink } from "lucide-react";
import type { Work } from "@/lib/constants/works";
import { BrowserFrame } from "./BrowserFrame";

export function WorkCard({ work }: { work: Work }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface shadow-card transition-[transform,box-shadow] duration-300 ease-premium hover:-translate-y-[3px] hover:shadow-card-hover">
      <div className="p-4 pb-0">
        <a
          href={work.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${work.title} を新しいタブで開く`}
        >
          <BrowserFrame work={work} />
        </a>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <a
          href={work.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-block w-fit"
        >
          <h3 className="relative inline text-lg font-semibold leading-snug text-foreground">
            {work.title}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-200 group-hover:scale-x-100"
            />
          </h3>
        </a>

        <p className="whitespace-pre-line text-sm leading-relaxed text-muted">
          {work.description}
        </p>

        <ul className="flex flex-wrap gap-2 pt-1">
          {work.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>

        <a
          href={work.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-auto flex min-h-11 w-fit items-center gap-1.5 pt-2 text-sm font-medium text-accent"
        >
          <span className="relative">
            サイトを見る
            <span
              aria-hidden="true"
              className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-200 group-hover:scale-x-100"
            />
          </span>
          <ExternalLink
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
  );
}
