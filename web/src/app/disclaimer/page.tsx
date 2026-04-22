import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/container";
import {
  DISCLAIMER_FULL_SECTIONS,
  DISCLAIMER_PAGE_TITLE,
  DISCLAIMER_SHORT_LEDE,
} from "@/lib/content/disclaimer";

export const metadata: Metadata = {
  title: DISCLAIMER_PAGE_TITLE,
  description:
    "How to interpret user-submitted content on Unmuted: unverified experiences, not formal accusations.",
};

export default function DisclaimerPage() {
  return (
    <main className="py-10 sm:py-12 lg:py-14">
      <Container maxWidth="sm" className="space-y-10">
        <PageHeader
          title={DISCLAIMER_PAGE_TITLE}
          description={DISCLAIMER_SHORT_LEDE}
        />

        <div className="space-y-8">
          {DISCLAIMER_FULL_SECTIONS.map((section) => (
            <section key={section.heading} className="space-y-3">
              <h2 className="text-base font-semibold text-paper">{section.heading}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={`${section.heading}-${i}`} className="text-sm leading-relaxed text-mist">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <p className="rounded-xl border border-rule bg-panel p-4 text-sm text-mist">
          For rules on what you may post—including no doxxing or threats—see our{" "}
          <Link href="/guidelines" className="font-medium text-signal hover:text-signal-hover">
            Community Guidelines
          </Link>
          .
        </p>

        <p className="text-sm text-steel">
          Last updated for product copy: April 2026. A lawyer in your jurisdiction should review
          this text before you operate at significant scale.
        </p>
      </Container>
    </main>
  );
}
