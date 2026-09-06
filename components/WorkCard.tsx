import { ArrowUpRight } from "lucide-react";
import type { Work } from "@/lib/constants/works";
import { BrowserFrame } from "./BrowserFrame";
import { FadeIn } from "./FadeIn";

export function WorkCard({ work, index }: { work: Work; index: number }) {
  return (
    <article className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)] lg:gap-12">
      <FadeIn className="min-w-0">
        <a href={work.url} target="_blank" rel="noopener noreferrer" aria-label={`${work.title} を新しいタブで開く`} className="group block">
          <div className="transition-transform duration-500 ease-premium group-hover:-translate-y-1">
            <BrowserFrame work={work} />
          </div>
        </a>
      </FadeIn>

      <FadeIn delayMs={120} className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border pb-4 text-[10px] uppercase tracking-[0.2em] text-muted">
          <span>Project {String(index).padStart(2, "0")}</span>
          <span>Independent product</span>
        </div>
        <h3 className="mt-7 text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">{work.title}</h3>
        <p className="mt-5 whitespace-pre-line text-sm leading-7 text-muted">{work.description}</p>

        <div className="mt-8 border-l border-accent/40 pl-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-accent">Design intent</p>
          <p className="mt-3 text-sm leading-7 text-foreground/85">{work.intent}</p>
        </div>

        <ul className="mt-7 space-y-3">
          {work.decisions.map((decision) => (
            <li key={decision} className="flex gap-3 text-sm leading-6 text-muted">
              <span aria-hidden="true" className="mt-[0.7rem] h-px w-4 shrink-0 bg-accent/60" />
              {decision}
            </li>
          ))}
        </ul>

        <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-5 text-[11px] text-muted">
          {work.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>

        <a href={work.url} target="_blank" rel="noopener noreferrer" className="group mt-8 inline-flex min-h-11 w-fit items-center gap-3 text-sm font-medium text-foreground transition-colors hover:text-accent lg:mt-auto lg:pt-8">
          サイトを見る
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </a>
      </FadeIn>
    </article>
  );
}
