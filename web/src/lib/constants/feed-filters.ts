import {
  STORY_CATEGORIES,
  type StoryCategoryId,
} from "@/lib/taxonomy/categories";

export type FeedFilterId = "all" | StoryCategoryId;

export type FeedFilter = {
  id: FeedFilterId;
  label: string;
  categoryIds: StoryCategoryId[] | null;
};

/**
 * Feed chips: All + one chip per canonical category (aligned with taxonomy).
 */
export const FEED_FILTERS: FeedFilter[] = [
  { id: "all", label: "All", categoryIds: null },
  ...STORY_CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label,
    categoryIds: [c.id],
  })),
];
