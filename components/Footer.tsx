import { socialLinks } from "@/lib/constants/socialLinks";
import { profile } from "@/lib/constants/profile";
import { FadeIn } from "./FadeIn";

const STAGGER_MS = 80;

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <FadeIn delayMs={0}>
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} {profile.name}
          </p>
        </FadeIn>
        <FadeIn delayMs={STAGGER_MS}>
          <ul className="flex flex-wrap gap-2">
            {socialLinks.map(({ name, url, icon: Icon }) => (
              <li key={name}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors duration-200 hover:border-accent/40 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </footer>
  );
}
