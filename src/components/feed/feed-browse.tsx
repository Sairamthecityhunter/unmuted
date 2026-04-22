"use client";

import { useMemo, useState } from "react";

import { StoryCard } from "@/components/story/story-card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { FEED_FILTERS, type FeedFilterId } from "@/lib/constants/feed-filters";
import type { Story } from "@/types/story";

type FeedBrowseProps = {
  stories: Story[];
};

function storyMatchesFilter(story: Story, filterId: FeedFilterId) {
  const config = FEED_FILTERS.find((f) => f.id === filterId);
  if (!config?.categoryIds) return true;
  return config.categoryIds.includes(story.category);
}

export function FeedBrowse({ stories }: FeedBrowseProps) {
  const [filter, setFilter] = useState<FeedFilterId>("all");

  const filtered = useMemo(
    () => stories.filter((s) => storyMatchesFilter(s, filter)),
    [stories, filter],
  );

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-steel">
          Filter by topic
        </p>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter stories by topic"
        >
          {FEED_FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className="rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
            >
              <Badge variant={filter === item.id ? "active" : "default"}>
                {item.label}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-rule bg-panel/40 px-6 py-12 text-center">
          <p className="text-sm text-mist">No stories match this filter yet.</p>
          <ButtonLink href="/submit" className="mt-4">
            Share a story
          </ButtonLink>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-1 lg:gap-5">
          {filtered.map((story) => (
            <li key={story.id}>
              <StoryCard story={story} />
            </li>
          ))}
        </ul>
      )}

      <p className="text-center text-xs text-steel">
        Demo data for UI only — will load from the database in a later phase.
      </p>
    </div>
  );
}
