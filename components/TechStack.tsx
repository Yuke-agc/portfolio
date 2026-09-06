import { techStack } from "@/lib/constants/techStack";
import { FadeIn } from "./FadeIn";

const STAGGER_MS = 80;

export function TechStack() {
  return (
    <section
      id="tech-stack"
      className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 sm:px-8 md:grid-cols-[1fr_1.4fr] lg:px-12 lg:py-24"
    >
      <FadeIn delayMs={0}>
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Tools / Craft</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-foreground">考えたものを、<br />動く形まで。</h2>
      </FadeIn>
      <FadeIn delayMs={STAGGER_MS}>
        <ul className="grid grid-cols-2 border-t border-border sm:grid-cols-3">
          {techStack.map((tech, index) => (
            <li
              key={tech}
              className="flex items-center gap-3 border-b border-border py-4 text-sm text-foreground/85"
            >
              <span className="text-[10px] tabular-nums text-muted">{String(index + 1).padStart(2, "0")}</span>
              {tech}
            </li>
          ))}
        </ul>
      </FadeIn>
    </section>
  );
}
