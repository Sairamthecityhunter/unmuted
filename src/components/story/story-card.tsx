import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { getCategoryLabel } from "@/lib/constants/categories";
import { cn } from "@/lib/utils/cn";
import type { Story } from "@/types/story";

type StoryCardProps = {
  story: Story;
  className?: string;
};

function formatDate(iso: string) {
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

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

export function StoryCard({ story, className }: StoryCardProps) {
  const authorLabel = story.isAnonymous
    ? "Anonymous"
    : (story.authorDisplayName ?? "Member");

  return (
    <article
      className={cn(
        "flex flex-col rounded-xl border border-rule bg-panel/50 p-5 transition-colors hover:border-mist/80",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <Badge variant="muted">{getCategoryLabel(story.category)}</Badge>
        <span className="text-rule" aria-hidden>
          ·
        </span>
        <time className="text-xs text-steel" dateTime={story.createdAt}>
          {formatDate(story.createdAt)}
        </time>
      </div>

      <h2 className="mt-3 text-lg font-semibold tracking-tight text-paper">
        <Link
          href={`/stories/${story.id}`}
          className="hover:text-signal-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal rounded-sm"
        >
          {story.title}
        </Link>
      </h2>

      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-mist">{story.body}</p>

      <div className="mt-4 space-y-3 border-t border-rule/80 pt-4">
        <p className="text-xs">
          <span className="text-steel">Posted by </span>
          <span className="font-medium text-mist">{authorLabel}</span>
        </p>
        <div
          className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-steel"
          aria-label="Community reaction summary (demo counts)"
        >
          <span>
            <span className="tabular-nums font-medium text-mist">{formatCount(story.supportCount)}</span>{" "}
            support
          </span>
          <span>
            <span className="tabular-nums font-medium text-mist">{formatCount(story.relateCount)}</span>{" "}
            relate
          </span>
          <span>
            <span className="tabular-nums font-medium text-mist">{formatCount(story.importantCount)}</span>{" "}
            important
          </span>
        </div>
      </div>
    </article>
  );
}
