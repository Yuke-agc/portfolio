import { works } from "@/lib/constants/works";
import { WorkCard } from "./WorkCard";
import { FadeIn } from "./FadeIn";

export function WorkList() {
  return (
    <section id="works" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <FadeIn>
        <div className="mb-12 grid gap-5 border-b border-border pb-8 md:grid-cols-[1fr_1.4fr] md:items-end">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Selected work / 01</p>
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl">
            <span className="inline-block">言葉だけが残る</span>
            <span className="inline-block">場所を設計する。</span>
          </h2>
        </div>
      </FadeIn>
      <div className="space-y-12">
        {works.map((work, index) => <WorkCard key={work.slug} work={work} index={index + 1} />)}
      </div>
    </section>
  );
}
