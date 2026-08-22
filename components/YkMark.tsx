/**
 * Design reminder — Shared YK monogram: one vertical spine, one open Y arm,
 * and two precise K arms. The form stays readable at every scale.
 */
type YkMarkProps = {
  className?: string;
  title?: string;
};

export function YkMark({ className = "", title }: YkMarkProps) {
  return (
    <svg className={`yk-logo ${className}`} viewBox="0 0 100 100" fill="none" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <path d="M16 18 50 52V86" />
      <path d="M84 18 50 52" />
      <path d="M54 52 84 84" />
    </svg>
  );
}
