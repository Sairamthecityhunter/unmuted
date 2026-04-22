import Link from "next/link";

import { Container } from "@/components/ui/container";
import { MAIN_NAV } from "@/lib/constants/nav";

const footerLinkClass =
  "text-sm text-mist transition-colors hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal rounded-md";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-rule bg-panel">
      <Container maxWidth="2xl" className="py-12 sm:py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:gap-12">
          <div className="space-y-4">
            <p className="text-base font-semibold text-paper">Unmuted</p>
            <p className="max-w-md text-sm leading-relaxed text-steel">
              Posts are user-submitted personal experiences. We do not verify every claim
              and do not provide legal or professional advice. Do not post private
              addresses, phone numbers, or government IDs.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">
              Navigate
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
              {MAIN_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={footerLinkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-rule pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-steel">© {new Date().getFullYear()} Unmuted</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-steel">
            <Link
              href="/guidelines"
              className="text-mist hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal rounded-md"
            >
              Guidelines
            </Link>
            <span className="text-rule" aria-hidden>
              ·
            </span>
            <Link
              href="/disclaimer"
              className="text-mist hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal rounded-md"
            >
              Disclaimer
            </Link>
            <span className="text-rule" aria-hidden>
              ·
            </span>
            <Link
              href="/about"
              className="text-mist hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal rounded-md"
            >
              About
            </Link>
            <span className="text-rule" aria-hidden>
              ·
            </span>
            <Link
              href="/events"
              className="text-mist hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal rounded-md"
            >
              Events
            </Link>
            <span className="text-rule" aria-hidden>
              ·
            </span>
            <Link
              href="/admin/moderation"
              className="text-mist hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal rounded-md"
            >
              Moderation (demo)
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
