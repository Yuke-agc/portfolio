import { profile } from "@/lib/constants/profile";
import { ScanReveal } from "./ScanReveal";
import { MailtoLink } from "./MailtoLink";

export function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
    >
      <ScanReveal delayMs={0}>
        <div className="grid gap-8 border-y border-border py-12 md:grid-cols-[1.4fr_.6fr] md:items-end lg:py-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Contact</p>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-[-0.04em] text-foreground sm:text-5xl">
              一緒に、余白のある<br />プロダクトを。
            </h2>
          </div>
          <MailtoLink
            user={profile.contactEmailUser}
            domain={profile.contactEmailDomain}
            ariaLabel="メールで連絡する"
            className="group inline-flex min-h-11 w-fit items-center text-lg font-medium text-foreground transition-colors duration-200 ease-premium hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:justify-self-end"
          >
            <span className="relative">
              メールで相談する ↗
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-200 ease-premium group-hover:scale-x-100"
              />
            </span>
          </MailtoLink>
        </div>
      </ScanReveal>
    </section>
  );
}
