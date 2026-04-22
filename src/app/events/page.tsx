import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { ButtonExternalLink, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { MIN_SUPPORT_TO_HOST_MEETING } from "@/lib/constants/meeting-host";
import { listMeetingsForEventsPage } from "@/lib/meetings-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events & discussions",
  description:
    "Community-hosted meeting links from well-supported stories—Zoom, Meet, Teams, and respectful ground rules.",
};

function formatPosted(iso: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function EventsPage() {
  const items = await listMeetingsForEventsPage();

  return (
    <main className="py-10 sm:py-12 lg:py-14">
      <Container maxWidth="lg" className="space-y-10">
        <PageHeader
          title="Events & discussions"
          description="Meeting links here are posted by hosts from stories that have earned enough community Support—not by staff. Open a story, use Support reactions, and when the total reaches the threshold, the host form appears on that story and listings show up below."
        />

        <Card className="border-watch/25 bg-watch/5 p-5">
          <h2 className="text-sm font-semibold text-paper">How hosting works</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-mist">
            <li>
              Readers tap <strong className="text-paper">Support</strong> on a story; counts are
              saved on this site.
            </li>
            <li>
              When Support reaches{" "}
              <span className="tabular-nums font-medium text-paper">
                {MIN_SUPPORT_TO_HOST_MEETING}
              </span>
              , a <strong className="text-paper">Host a follow-up discussion</strong> form appears on
              that story.
            </li>
            <li>
              Hosts paste an <strong className="text-paper">https://</strong> meeting link; it
              lists here, sorted by how much support the story has now.
            </li>
          </ul>
        </Card>

        <section aria-labelledby="meetings-heading" className="space-y-5">
          <h2 id="meetings-heading" className="text-base font-semibold text-paper">
            Community meeting links
          </h2>

          {items.length === 0 ? (
            <p className="rounded-xl border border-dashed border-rule bg-panel/30 px-6 py-10 text-center text-sm text-mist">
              No public meetings yet. Open a well-supported story (or add Support until the host
              form unlocks) to post the first link.
            </p>
          ) : (
            <ul className="grid gap-5 md:grid-cols-2">
              {items.map(({ meeting, storySupportNow, storyExists }) => (
                <li key={meeting.id}>
                  <Card className="flex h-full flex-col border-rule/80 bg-panel/40 p-5">
                    <h3 className="text-lg font-semibold tracking-tight text-paper">
                      {meeting.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-steel">
                      {meeting.schedule}
                    </p>
                    <p className="mt-1 text-xs text-steel">
                      Posted {formatPosted(meeting.createdAt)}
                      {meeting.isAnonymous ? (
                        <> · Host: anonymous</>
                      ) : meeting.hostDisplayName ? (
                        <> · Host: {meeting.hostDisplayName}</>
                      ) : null}
                    </p>
                    <p className="mt-2 text-xs text-steel">
                      Story support now:{" "}
                      <span className="tabular-nums font-medium text-mist">{storySupportNow}</span>
                    </p>
                    {meeting.description ? (
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-mist">
                        {meeting.description}
                      </p>
                    ) : (
                      <div className="flex-1" />
                    )}
                    <p className="mt-3 text-xs text-steel">
                      From:{" "}
                      {storyExists ? (
                        <Link
                          href={`/stories/${meeting.storyId}`}
                          className="font-medium text-signal hover:text-signal-hover"
                        >
                          {meeting.storyTitleSnapshot}
                        </Link>
                      ) : (
                        <span className="text-mist">{meeting.storyTitleSnapshot} (removed)</span>
                      )}
                    </p>
                    <div className="mt-5">
                      <ButtonExternalLink
                        href={meeting.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto"
                      >
                        Join meeting
                      </ButtonExternalLink>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="max-w-2xl space-y-4">
          <h2 className="text-base font-semibold text-paper">Ground rules</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-mist">
            <li>
              <strong className="text-paper">Hosts are responsible</strong> for waiting rooms,
              removal, and not sharing passwords on Unmuted.
            </li>
            <li>
              <strong className="text-paper">No doxxing.</strong>{" "}
              <Link href="/guidelines" className="font-medium text-signal hover:text-signal-hover">
                Community guidelines
              </Link>{" "}
              apply.
            </li>
            <li>
              <strong className="text-paper">Not therapy or legal advice.</strong>
            </li>
          </ul>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ButtonLink href="/feed">Browse stories</ButtonLink>
          <ButtonLink href="/submit" variant="secondary">
            Share a story
          </ButtonLink>
        </div>
      </Container>
    </main>
  );
}
