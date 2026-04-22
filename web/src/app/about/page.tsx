import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "About",
  description: "What Unmuted is and how we approach safety and trust.",
};

export default function AboutPage() {
  return (
    <main className="py-10 sm:py-12 lg:py-14">
      <Container maxWidth="sm" className="space-y-8">
        <PageHeader
          title="About Unmuted"
          description="A platform for firsthand accounts about work, employers, and society—with moderation and privacy tools designed for sensitive topics."
        />

        <div className="space-y-4 text-sm leading-relaxed text-mist">
          <p>
            Unmuted is not a review site for “drama.” It is a structured space for people
            to document what happened to them, learn from others’ patterns, and share when
            it feels sustainable—often with anonymity.
          </p>
          <p>
            We use clear{" "}
            <Link href="/guidelines" className="font-medium text-signal hover:text-signal-hover">
              community guidelines
            </Link>{" "}
            to reduce doxxing, harassment, and bad-faith campaigns. Moderation is
            imperfect; we aim to be transparent about removals and appeals as the product
            matures.
          </p>
          <p>
            We’re also opening{" "}
            <Link href="/events" className="font-medium text-signal hover:text-signal-hover">
              events and themed discussions
            </Link>{" "}
            so people can talk through problems together—with the same safety expectations as
            the rest of the site.
          </p>
          <p className="text-steel">
            Unmuted does not provide legal advice and does not verify every post. If you
            are in danger, contact local emergency services.
          </p>
        </div>
      </Container>
    </main>
  );
}
