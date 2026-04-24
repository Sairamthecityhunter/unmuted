import { STORY_CATEGORIES, type StoryCategoryId } from "@/lib/taxonomy/categories";
import type { Story } from "@/types/story";

export type CategoryDatum = {
  id: StoryCategoryId;
  label: string;
  shortLabel: string;
  count: number;
  /** 0–100, one decimal */
  share: number;
};

/** Short labels for chart axes and compact UI. */
export const STORY_CATEGORY_SHORT_LABEL: Record<StoryCategoryId, string> = {
  workplace: "Workplace",
  "company-culture": "Culture",
  "job-issues": "Job issues",
  society: "Society",
  harassment: "Harassment",
  discrimination: "Discrimination",
  "mental-pressure": "Mental",
  "unfair-treatment": "Unfair",
};

/** Count stories per canonical category for charts and copy. */
export function computeCategoryDistribution(
  stories: ReadonlyArray<Pick<Story, "category">>,
): {
  data: CategoryDatum[];
  total: number;
  topId: StoryCategoryId | null;
  topLabel: string | null;
} {
  const total = stories.length;
  const counts = new Map<StoryCategoryId, number>();
  for (const c of STORY_CATEGORIES) {
    counts.set(c.id, 0);
  }
  for (const s of stories) {
    const id = s.category;
    if (counts.has(id as StoryCategoryId)) {
      counts.set(id as StoryCategoryId, (counts.get(id as StoryCategoryId) ?? 0) + 1);
    }
  }

  const data: CategoryDatum[] = STORY_CATEGORIES.map((c) => {
    const count = counts.get(c.id) ?? 0;
    const share = total > 0 ? Math.round((count / total) * 1000) / 10 : 0;
    return {
      id: c.id,
      label: c.label,
      shortLabel: STORY_CATEGORY_SHORT_LABEL[c.id],
      count,
      share,
    };
  });

  let topId: StoryCategoryId | null = null;
  let max = -1;
  for (const d of data) {
    if (d.count > max) {
      max = d.count;
      topId = d.id;
    }
  }

  const topLabel =
    topId && max > 0 ? (data.find((d) => d.id === topId)?.label ?? null) : null;

  return { data, total, topId: max > 0 ? topId : null, topLabel };
}

/** Bar chart: highest counts first. */
export function sortDataForBarChart(data: CategoryDatum[]): CategoryDatum[] {
  return [...data].sort((a, b) => b.count - a.count);
}
