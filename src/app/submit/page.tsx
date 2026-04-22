import type { Metadata } from "next";
import Link from "next/link";

import { ExperienceDisclaimer } from "@/components/legal/experience-disclaimer";
import { PageHeader } from "@/components/layout/page-header";
import { SubmitStoryForm } from "@/components/submit/submit-story-form";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Share Your Story",
  description:
    "Publish your experience for readers worldwide—structured fields, optional anonymity, and community guidelines.",
};

export default function SubmitPage() {
  return (
    <main className="py-10 sm:py-12 lg:py-14">
      <Container maxWidth="sm" className="space-y-8">
        <PageHeader
          title="Share Your Story"
          description="Anyone, anywhere can publish here—no account needed on this demo. Structured fields help you write clearly; you can stay anonymous. Take your time and keep details as general as you need."
        />

        <Card className="border-watch/20 bg-watch/5">
          <p className="text-sm leading-relaxed text-mist">
            <strong className="font-medium text-watch">Safety reminder:</strong> Do not post private addresses,
            phone numbers, government IDs, or other people’s confidential information. If you name an employer,
            understand it may increase visibility and risk.
          </p>
        </Card>

        <ExperienceDisclaimer variant="panel" />

        <p className="text-sm text-mist">
          Before you submit, read the{" "}
          <Link href="/guidelines" className="font-medium text-signal hover:text-signal-hover">
            community guidelines
          </Link>
          . We moderate for harassment and doxxing.
        </p>

        <SubmitStoryForm />
      </Container>
    </main>
  );
}
