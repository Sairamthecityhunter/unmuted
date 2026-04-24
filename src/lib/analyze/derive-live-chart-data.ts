import {
  computeCategoryDistribution,
  STORY_CATEGORY_SHORT_LABEL,
} from "@/lib/analytics/category-distribution";
import { CATEGORY_FILL } from "@/lib/analyze/unmuted-chart-demo-data";
import type { StoryCategoryId } from "@/lib/taxonomy/categories";
import type { Story } from "@/types/story";

export type MonthlyEngagementRow = {
  name: string;
  submissions: number;
  support: number;
  relate: number;
};

export type NestedPieSlice = { name: string; value: number };

export type RadarThemeRow = {
  subject: string;
  recent: number;
  prior: number;
  fullMark: number;
};

export type RadialSupportRow = { name: string; share: number; fill: string };

export type ScatterPoint = { x: number; y: number; z: number };

const MS_DAY = 86400000;

const CATEGORY_GROUP: Record<StoryCategoryId, "work" | "culture" | "bias" | "society"> = {
  workplace: "work",
  "job-issues": "work",
  "company-culture": "culture",
  "mental-pressure": "culture",
  harassment: "bias",
  discrimination: "bias",
  "unfair-treatment": "bias",
  society: "society",
};

const OUTER_GROUP_LABEL: Record<string, string> = {
  work: "Work & roles",
  culture: "Culture & pressure",
  bias: "Bias & misconduct",
  society: "Society & institutions",
};

function monthBucketKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Last `monthCount` calendar months; counts submissions and reaction totals for stories posted in each month. */
export function buildMonthlyEngagementSeries(
  stories: ReadonlyArray<Story>,
  monthCount = 7,
): MonthlyEngagementRow[] {
  const now = new Date();
  const rows: (MonthlyEngagementRow & { _key: string })[] = [];
  for (let i = monthCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    rows.push({
      _key: monthBucketKey(d),
      name: d.toLocaleString("en", { month: "short", year: "numeric" }),
      submissions: 0,
      support: 0,
      relate: 0,
    });
  }
  const indexByKey = new Map(rows.map((r, idx) => [r._key, idx]));
  for (const s of stories) {
    const cd = new Date(s.createdAt);
    if (Number.isNaN(cd.getTime())) continue;
    const k = monthBucketKey(cd);
    const idx = indexByKey.get(k);
    if (idx === undefined) continue;
    const row = rows[idx];
    row.submissions += 1;
    row.support += s.supportCount;
    row.relate += s.relateCount;
  }
  return rows.map((r) => ({
    name: r.name,
    submissions: r.submissions,
    support: r.support,
    relate: r.relate,
  }));
}

export function buildNestedPieFromStories(stories: ReadonlyArray<Story>): {
  outer: NestedPieSlice[];
  inner: NestedPieSlice[];
} {
  const { data } = computeCategoryDistribution(stories);
  const inner: NestedPieSlice[] = data
    .filter((d) => d.count > 0)
    .map((d) => ({ name: d.shortLabel, value: d.count }));

  const outerAcc = new Map<string, number>();
  for (const d of data) {
    if (d.count === 0) continue;
    const g = CATEGORY_GROUP[d.id];
    outerAcc.set(g, (outerAcc.get(g) ?? 0) + d.count);
  }
  const outer: NestedPieSlice[] = [...outerAcc.entries()].map(([k, v]) => ({
    name: OUTER_GROUP_LABEL[k] ?? k,
    value: v,
  }));

  return { outer, inner };
}

const RADAR_CATEGORIES: { id: StoryCategoryId; subject: string }[] = [
  { id: "workplace", subject: "Workplace" },
  { id: "company-culture", subject: "Culture" },
  { id: "job-issues", subject: "Job issues" },
  { id: "harassment", subject: "Harassment" },
  { id: "discrimination", subject: "Discrimination" },
  { id: "society", subject: "Society" },
];

/** Story counts by theme: last 30 days vs the prior 30 days (by `createdAt`). */
export function buildRadarThemeComparison(stories: ReadonlyArray<Story>): RadarThemeRow[] {
  const now = Date.now();
  const recentStart = now - 30 * MS_DAY;
  const priorStart = now - 60 * MS_DAY;

  function countInRange(start: number, end: number, categoryId: StoryCategoryId): number {
    return stories.filter((s) => {
      const t = new Date(s.createdAt).getTime();
      if (Number.isNaN(t)) return false;
      return t >= start && t < end && s.category === categoryId;
    }).length;
  }

  let maxV = 0;
  const raw = RADAR_CATEGORIES.map(({ id, subject }) => {
    const recent = countInRange(recentStart, now, id);
    const prior = countInRange(priorStart, recentStart, id);
    maxV = Math.max(maxV, recent, prior);
    return { subject, recent, prior };
  });

  const fullMark = Math.max(8, Math.ceil(maxV * 1.15));
  return raw.map((r) => ({ ...r, fullMark }));
}

/** Share of total Support reactions by category (for radial bar). */
export function buildRadialSupportShare(stories: ReadonlyArray<Story>): RadialSupportRow[] {
  const totals = new Map<StoryCategoryId, number>();
  let sum = 0;
  for (const s of stories) {
    const c = s.supportCount;
    if (c <= 0) continue;
    totals.set(s.category, (totals.get(s.category) ?? 0) + c);
    sum += c;
  }
  if (sum <= 0) return [];

  const rows: RadialSupportRow[] = [];
  for (const [id, v] of totals) {
    rows.push({
      name: STORY_CATEGORY_SHORT_LABEL[id],
      share: Math.round((v / sum) * 1000) / 10,
      fill: CATEGORY_FILL[id],
    });
  }
  rows.sort((a, b) => b.share - a.share);
  return rows;
}

/** Per-story points: community posts vs seed/featured (bubble ~ engagement). */
export function buildScatterByOrigin(stories: ReadonlyArray<Story>): {
  community: ScatterPoint[];
  featured: ScatterPoint[];
} {
  const community: ScatterPoint[] = [];
  const featured: ScatterPoint[] = [];
  for (const s of stories) {
    const pt: ScatterPoint = {
      x: s.supportCount,
      y: s.relateCount,
      z: Math.max(24, s.importantCount * 28 + s.relateCount * 4 + 20),
    };
    if (s.submittedByCommunity) community.push(pt);
    else featured.push(pt);
  }
  return { community, featured };
}
