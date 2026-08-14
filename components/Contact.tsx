import { profile } from "@/lib/constants/profile";
import { ScanReveal } from "./ScanReveal";
import { MailtoLink } from "./MailtoLink";

export function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6"
    >
      <ScanReveal delayMs={0}>
        <div className="flex flex-col items-start gap-4">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted">
            連絡はこちらへ
          </h2>
          <MailtoLink
            user={profile.contactEmailUser}
            domain={profile.contactEmailDomain}
            ariaLabel="メールで連絡する"
            className="group inline-flex min-h-11 w-fit items-center text-lg font-medium text-foreground transition-colors duration-200 ease-premium hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="relative">
              相談する
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
