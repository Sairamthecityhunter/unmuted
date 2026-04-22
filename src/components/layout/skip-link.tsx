/**
 * First focusable control in the shell — bypass repeated navigation for keyboard and screen reader users.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className={[
        "sr-only focus:not-sr-only",
        "focus:fixed focus:left-4 focus:top-4 focus:z-[200]",
        "focus:rounded-xl focus:border-2 focus:border-signal focus:bg-panel focus:px-4 focus:py-3",
        "focus:text-sm focus:font-semibold focus:text-paper focus:shadow-lg",
        "focus:outline-none",
      ].join(" ")}
    >
      Skip to main content
    </a>
  );
}
