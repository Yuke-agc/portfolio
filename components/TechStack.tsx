import { techStack } from "@/lib/constants/techStack";
import { FadeIn } from "./FadeIn";

const STAGGER_MS = 80;

export function TechStack() {
  return (
    <section
      id="tech-stack"
      className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6"
    >
      <FadeIn delayMs={0}>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          技術スタック
        </h2>
      </FadeIn>
      <FadeIn delayMs={STAGGER_MS}>
        <ul className="mt-8 flex flex-wrap gap-3">
          {techStack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground/90"
            >
              {tech}
            </li>
          ))}
        </ul>
      </FadeIn>
    </section>
  );
}
