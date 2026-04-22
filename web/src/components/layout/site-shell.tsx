import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="flex min-h-full flex-col bg-ink">
      <SkipLink />
      <SiteHeader />
      <div
        id="main-content"
        tabIndex={-1}
        className="flex-1 outline-none focus:outline-none"
      >
        {children}
      </div>
      <SiteFooter />
    </div>
  );
}
