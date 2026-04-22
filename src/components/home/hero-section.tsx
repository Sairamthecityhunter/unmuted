import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-rule">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(77,163,255,0.12),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_50%,rgba(36,48,68,0.9),transparent_70%)]"
        aria-hidden
      />

      <Container maxWidth="xl" className="relative py-16 sm:py-24 lg:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">
          Unmuted
        </p>
        <h1 className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight text-paper sm:text-4xl sm:leading-[1.15] lg:text-5xl lg:leading-[1.1]">
          Real experiences about work, employers, and society—shared{" "}
          <span className="text-mist">safely and on your terms.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
          First-person accounts, strong community standards, and anonymous posting when you
          need it. Built for clarity and trust—not outrage.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <ButtonLink href="/submit" className="min-h-12 px-6 text-center sm:w-auto">
            Share Your Story
          </ButtonLink>
          <ButtonLink
            href="/feed"
            variant="secondary"
            className="min-h-12 px-6 text-center sm:w-auto"
          >
            Explore Stories
          </ButtonLink>
        </div>
        <p className="mt-8 max-w-xl text-xs leading-relaxed text-steel">
          Posts are user-submitted experiences. We moderate for harassment and doxxing; we
          do not verify every claim. Read our{" "}
          <Link href="/guidelines" className="font-medium text-signal hover:text-signal-hover">
            community guidelines
          </Link>{" "}
          before participating.
        </p>
      </Container>
    </section>
  );
}
