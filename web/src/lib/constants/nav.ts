/**
 * Primary navigation — keep in sync across header and footer.
 */
export const MAIN_NAV = [
  { href: "/", label: "Home" },
  { href: "/feed", label: "Stories" },
  { href: "/categories", label: "Categories" },
  { href: "/submit", label: "Share Story" },
  { href: "/guidelines", label: "Guidelines" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/analyze", label: "Analyze" },
] as const;

export type MainNavItem = (typeof MAIN_NAV)[number];
