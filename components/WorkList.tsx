import { works } from "@/lib/constants/works";
import { WorkCard } from "./WorkCard";
import { FadeIn } from "./FadeIn";
import { ScanReveal } from "./ScanReveal";

const SECTION_STAGGER_MS = 80;
const CARD_STAGGER_MS = 120;
// 見出しの後、120msずつずらしながらカードが現れる
const CARDS_BASE_DELAY_MS = SECTION_STAGGER_MS;

export function WorkList() {
  return (
    <section id="works" className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      <FadeIn delayMs={0}>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          作品一覧
        </h2>
      </FadeIn>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {works.map((work, index) => (
          <ScanReveal
            key={work.slug}
            delayMs={CARDS_BASE_DELAY_MS + index * CARD_STAGGER_MS}
            className="h-full"
          >
            <WorkCard work={work} />
          </ScanReveal>
        ))}
      </div>
    </section>
  );
}
