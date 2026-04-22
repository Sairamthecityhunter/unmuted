"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Container } from "@/components/ui/container";
import { MAIN_NAV } from "@/lib/constants/nav";
import { cn } from "@/lib/utils/cn";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const desktopLink =
  "shrink-0 whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-medium text-mist transition-colors hover:bg-panel hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal lg:px-1.5 xl:px-2";

const desktopActive = "bg-panel text-paper";

const ctaDesktop =
  "shrink-0 whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm font-semibold text-signal transition-colors hover:bg-signal/10 hover:text-signal-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal xl:px-3";

/** Top strip (h-8) + main bar (h-14) — mobile menu aligns to this total. */
const HEADER_STACK_TOP = "top-[5.5rem]";

const topBarLink =
  "shrink-0 rounded-sm text-mist transition-colors hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";

/** Small mark for the brand — “voices / signal” without implying a trademark. */
function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-xl border border-signal/35 bg-signal/10 text-signal",
        className,
      )}
      aria-hidden
    >
      <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
        />
      </svg>
    </span>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setOpen(false);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-[100] border-b border-rule bg-panel/95 shadow-sm backdrop-blur-md">
      <div className="border-b border-rule/70 bg-ink/35">
        <Container
          maxWidth="2xl"
          className="flex h-8 items-center justify-between gap-3 text-[11px] font-medium uppercase tracking-[0.14em] text-steel sm:text-xs sm:tracking-[0.16em]"
        >
          <span className="min-w-0 truncate">Work, culture & society</span>
          <Link href="/guidelines" className={topBarLink}>
            Guidelines
          </Link>
        </Container>
      </div>

      <Container
        maxWidth="2xl"
        className="flex h-14 min-h-[3.5rem] w-full min-w-0 items-center justify-between gap-2 sm:gap-4"
      >
        <Link
          href="/"
          className="group flex min-w-0 max-w-[min(100%,14rem)] shrink items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal sm:max-w-none sm:gap-3"
        >
          <BrandMark className="transition-colors group-hover:border-signal/50 group-hover:bg-signal/15" />
          <span className="min-w-0 text-base font-semibold tracking-tight text-paper sm:text-[1.05rem]">
            Unmuted
          </span>
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-end gap-0.5 overflow-x-auto overflow-y-hidden lg:flex lg:pl-2 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden xl:gap-1 xl:pl-4"
          aria-label="Main navigation"
        >
          {MAIN_NAV.map((item) => {
            const active = isActivePath(pathname, item.href);
            const isCta = item.href === "/submit";
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  isCta ? ctaDesktop : desktopLink,
                  !isCta && active && desktopActive,
                  isCta && active && "bg-signal/15 text-signal-hover",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Tablet: compact strip — full nav still in hamburger until lg */}
        <nav
          className="hidden items-center gap-1 md:flex lg:hidden"
          aria-label="Quick links"
        >
          <Link
            href="/feed"
            className={cn(
              desktopLink,
              isActivePath(pathname, "/feed") && desktopActive,
            )}
            aria-current={isActivePath(pathname, "/feed") ? "page" : undefined}
          >
            Stories
          </Link>
          <Link
            href="/submit"
            className={cn(ctaDesktop, isActivePath(pathname, "/submit") && "bg-signal/15 text-signal-hover")}
            aria-current={isActivePath(pathname, "/submit") ? "page" : undefined}
          >
            Share
          </Link>
          <button
            type="button"
            className={cn(
              desktopLink,
              "inline-flex items-center gap-1.5",
              open && desktopActive,
            )}
            aria-expanded={open ? "true" : "false"}
            aria-controls="site-mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span>Menu</span>
            <svg
              className={cn("size-4 transition-transform duration-200", open && "rotate-180")}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-paper transition-colors hover:bg-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal md:hidden"
          aria-expanded={open ? "true" : "false"}
          aria-controls="site-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? (
            <svg
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
      </Container>

      {open ? (
        <>
          <button
            type="button"
            className={cn(
              "fixed inset-0 z-[110] bg-ink/70 lg:hidden motion-safe:transition-opacity",
              HEADER_STACK_TOP,
            )}
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div
            id="site-mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            className={cn(
              "fixed inset-x-0 z-[120] max-h-[min(85vh,calc(100dvh-5.5rem))] overflow-y-auto border-b border-rule bg-panel shadow-lg lg:hidden",
              HEADER_STACK_TOP,
            )}
          >
            <nav className="flex flex-col px-4 py-2" aria-label="Mobile navigation">
              {MAIN_NAV.map((item) => {
                const active = isActivePath(pathname, item.href);
                const isCta = item.href === "/submit";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-3 py-3.5 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
                      isCta
                        ? "text-signal"
                        : active
                          ? "bg-panel text-paper"
                          : "text-mist hover:bg-panel/80 hover:text-paper",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      ) : null}
    </header>
  );
}
