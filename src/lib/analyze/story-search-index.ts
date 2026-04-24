import { STORY_CATEGORIES } from "@/lib/taxonomy/categories";
import type { Story } from "@/types/story";

const LABEL_BY_ID = Object.fromEntries(STORY_CATEGORIES.map((c) => [c.id, c.label])) as Record<
  string,
  string
>;

/** Query is only “company” / “organization” style — match stories that listed an org on submit. */
const ORG_NAME_INTENT = /^\s*(company|companies|organisation|organization|organizations|org|orgs)\s*$/i;

export type AnalyzeStorySearchRecord = {
  id: string;
  title: string;
  body: string;
  category: string;
  categoryLabel: string;
  tags: string[];
  createdAt: string;
  /** Optional org/company from the share form (searchable). */
  company?: string;
};

export function buildAnalyzeStorySearchIndex(stories: Story[]): AnalyzeStorySearchRecord[] {
  return stories.map((s) => ({
    id: s.id,
    title: s.title,
    body: s.body,
    category: s.category,
    categoryLabel: LABEL_BY_ID[s.category] ?? s.category,
    tags: s.tags,
    createdAt: s.createdAt,
    company: s.company?.trim() ? s.company.trim() : undefined,
  }));
}

/** Same rules as {@link storyMatchesSearch}, for full {@link Story} rows (e.g. live chart data). */
export function storyMatchesSearchForStory(story: Story, query: string): boolean {
  const record: AnalyzeStorySearchRecord = {
    id: story.id,
    title: story.title,
    body: story.body,
    category: story.category,
    categoryLabel: LABEL_BY_ID[story.category] ?? story.category,
    tags: story.tags,
    createdAt: story.createdAt,
    company: story.company?.trim() ? story.company.trim() : undefined,
  };
  return storyMatchesSearch(record, query);
}

export function storyMatchesSearch(record: AnalyzeStorySearchRecord, query: string): boolean {
  const raw = query.trim();
  if (!raw) return true;

  if (ORG_NAME_INTENT.test(raw)) {
    return Boolean(record.company?.trim());
  }

  const q = raw.toLowerCase();
  const blob = [
    record.title,
    record.body,
    record.categoryLabel,
    record.category,
    record.company ?? "",
    ...record.tags,
  ]
    .join(" ")
    .toLowerCase();
  return blob.includes(q);
}
