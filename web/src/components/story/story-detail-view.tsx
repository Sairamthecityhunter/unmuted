import Link from "next/link";

import { StoryCommentList } from "@/components/story/story-comment-list";
import { StoryCommentComposer } from "@/components/story/story-comment-composer";
import { StoryHostMeetingForm } from "@/components/story/story-host-meeting-form";
import { StoryReactionsClient } from "@/components/story/story-reactions-client";
import { StoryReportButton } from "@/components/story/story-report-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCategoryLabel } from "@/lib/constants/categories";
import { MIN_SUPPORT_TO_HOST_MEETING } from "@/lib/constants/meeting-host";
import { POST_TYPES } from "@/lib/constants/post-types";
import type { StoryComment } from "@/types/comment";
import type { Story } from "@/types/story";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function StoryProse({ body }: { body: string }) {
  const paragraphs = body.split(/\n\n+/).filter(Boolean);
  return (
    <div className="max-w-2xl space-y-5 text-base leading-[1.75] text-mist">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-pretty">
          {p.trim()}
        </p>
      ))}
    </div>
  );
}

export function StoryDetailView({
  story,
  comments,
}: {
  story: Story;
  comments: StoryComment[];
}) {
  const authorLabel = story.isAnonymous
    ? "Anonymous"
    : (story.authorDisplayName ?? "Member");
  const postTypeLabel = story.postType
    ? (POST_TYPES.find((p) => p.id === story.postType)?.label ?? story.postType)
    : null;

  return (
    <article className="space-y-10">
      <Card className="border-watch/25 bg-watch/5">
        <p className="text-sm leading-relaxed text-mist">
          <strong className="font-medium text-watch">Personal experience.</strong> This
          post is user-submitted. Unmuted does not independently verify facts or investigate
          claims, and it must not be treated as a formal accusation.{" "}
          <Link href="/disclaimer" className="font-medium text-signal hover:text-signal-hover">
            Disclaimer
          </Link>
          . If you need help in a crisis, contact local emergency services or a trusted
          professional—not this website.
        </p>
      </Card>

      <p className="text-sm">
        <Link
          href="/feed"
          className="font-medium text-signal hover:text-signal-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal rounded-md"
        >
          ← All stories
        </Link>
      </p>

      <header className="space-y-4 border-b border-rule pb-8">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge variant="muted">{getCategoryLabel(story.category)}</Badge>
          {postTypeLabel ? (
            <>
              <span className="text-rule" aria-hidden>
                ·
              </span>
              <span className="text-steel">{postTypeLabel}</span>
            </>
          ) : null}
          <span className="text-rule" aria-hidden>
            ·
          </span>
          <time className="text-steel" dateTime={story.createdAt}>
            {formatDate(story.createdAt)}
          </time>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-paper sm:text-4xl sm:leading-tight">
          {story.title}
        </h1>
        <p className="text-sm text-mist">
          <span className="text-steel">Posted by </span>
          <span className="font-medium text-paper">{authorLabel}</span>
        </p>
        {story.company ? (
          <p className="text-sm text-steel">
            <span className="text-mist">Organization (as shared):</span>{" "}
            <span className="text-paper/90">{story.company}</span>
          </p>
        ) : null}
        {story.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {story.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-rule bg-panel px-2.5 py-1 text-xs font-medium text-mist"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      <section aria-label="Story body">
        <StoryProse body={story.body} />
      </section>

      <section aria-label="Evidence">
        <h2 className="text-sm font-semibold text-paper">Evidence & attachments</h2>
        <div className="mt-3 rounded-xl border border-dashed border-rule bg-panel/30 px-5 py-10 text-center">
          <p className="text-sm text-mist">
            {story.submittedByCommunity
              ? "No files were uploaded with this post. File attachments are not enabled yet on this site."
              : "No files are attached to this story in the demo. When the product supports uploads, authorized viewers will see redacted previews here—only if the author chooses to publish them."}
          </p>
          <p className="mt-2 text-xs text-steel">
            Never upload others’ private documents without legal right or consent.
          </p>
        </div>
      </section>

      <StoryReactionsClient
        storyId={story.id}
        initial={{
          support: story.supportCount,
          relate: story.relateCount,
          important: story.importantCount,
        }}
      />

      {story.supportCount >= MIN_SUPPORT_TO_HOST_MEETING ? (
        <StoryHostMeetingForm storyId={story.id} storyTitle={story.title} />
      ) : (
        <Card className="border-rule/80 bg-panel/30 p-5">
          <p className="text-sm text-mist">
            <strong className="text-paper">Discussion links unlock with support.</strong> When this
            story reaches{" "}
            <span className="tabular-nums text-paper">{MIN_SUPPORT_TO_HOST_MEETING}</span>{" "}
            combined Support (from the post and saved reactions), anyone can add a public meeting
            link here and on{" "}
            <Link href="/events" className="font-medium text-signal hover:text-signal-hover">
              Events
            </Link>
            . Right now:{" "}
            <span className="tabular-nums font-medium text-paper">{story.supportCount}</span>{" "}
            Support.
          </p>
        </Card>
      )}

      <div className="flex flex-col gap-3 border-t border-rule pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-steel">
          See something that breaks our{" "}
          <Link href="/guidelines" className="text-signal hover:text-signal-hover">
            guidelines
          </Link>
          ? Reporting is confidential to moderators.
        </p>
        <StoryReportButton storyId={story.id} storyTitle={story.title} />
      </div>

      <section className="border-t border-rule pt-10" aria-label="Comments">
        <h2 className="text-lg font-semibold text-paper">Comments</h2>
        <p className="mt-1 text-sm leading-relaxed text-steel">
          {comments.length} {comments.length === 1 ? "reply" : "replies"}. This space is for
          supportive perspective and shared learning—not arguments, naming private details, or
          pressure to “prove” the story.
        </p>

        <StoryCommentList storyId={story.id} comments={comments} />

        <div className="mt-8">
          <StoryCommentComposer storyId={story.id} />
        </div>
      </section>
    </article>
  );
}
