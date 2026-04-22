import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description:
    "What you may post on Unmuted—and what is not allowed, including private information and threats.",
};

export default function GuidelinesPage() {
  return (
    <main className="py-10 sm:py-12 lg:py-14">
      <Container maxWidth="sm" className="space-y-10">
        <PageHeader
          title="Community Guidelines"
          description="These guidelines apply to everyone who uses Unmuted. They help keep the community safer for people sharing honest experiences about work and society."
        />

        <section className="space-y-4">
          <h2 className="text-base font-semibold text-paper">Information you must not post</h2>
          <p className="text-sm leading-relaxed text-mist">
            To reduce harm and the risk of harassment or retaliation, you may not use Unmuted
            to publish the following—about yourself or anyone else—unless you have a clear legal
            right and our product explicitly supports it in the future.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-mist">
            <li>
              <strong className="text-paper">Personal addresses.</strong> Do not post home
              addresses, private work locations used to find someone in person, or other
              location details meant to identify where someone lives or can be confronted.
            </li>
            <li>
              <strong className="text-paper">Phone numbers.</strong> Do not share personal,
              direct, or work mobile numbers, or private contact lines intended for individuals.
            </li>
            <li>
              <strong className="text-paper">Private identifying information.</strong> Do not
              post government ID numbers, employee or student IDs, financial account details,
              medical record identifiers, passwords, or other data that could be used to steal
              an identity or break into accounts.
            </li>
            <li>
              <strong className="text-paper">Threats.</strong> Do not threaten anyone, encourage
              violence, or tell others to harm a person or a place. Do not organize harassment or
              “doxxing” campaigns.
            </li>
          </ul>
          <p className="text-sm leading-relaxed text-steel">
            If you are unsure whether a detail is safe to include, leave it out. You can describe
            roles, timelines, and patterns without exposing private contact or identity data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-base font-semibold text-paper">What we expect from posts</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-mist">
            <li>
              Share your own experience in good faith. Do not impersonate others or invent
              stories.
            </li>
            <li>
              Be careful with accusations about identifiable people or employers. Focus on what
              happened to you rather than encouraging pile-ons.
            </li>
            <li>
              Respect moderation and reporting. We may remove content or limit accounts that
              break these guidelines.
            </li>
          </ul>
        </section>

        <p className="rounded-xl border border-watch/30 bg-watch/10 p-4 text-sm leading-relaxed text-mist">
          <strong className="font-medium text-watch">Emergencies.</strong> If you or someone
          else is in immediate danger, contact your local emergency services. Unmuted is not an
          emergency service and cannot intervene in real time.
        </p>

        <p className="text-sm text-steel">
          Posts are user-submitted. We do not verify every claim. Unmuted does not provide legal
          advice.{" "}
          <Link href="/submit" className="font-medium text-signal hover:text-signal-hover">
            Share a story
          </Link>{" "}
          only when you are comfortable with these rules.
        </p>
      </Container>
    </main>
  );
}
