/**
 * Canonical story categories — single source of truth for filters, forms, and URLs.
 */
export const STORY_CATEGORIES = [
  {
    id: "workplace",
    label: "Workplace",
    description:
      "Day-to-day roles, norms, safety, scheduling, and team dynamics where you work.",
  },
  {
    id: "company-culture",
    label: "Company culture",
    description:
      "How people are treated, promoted, heard, or excluded—beyond single incidents.",
  },
  {
    id: "job-issues",
    label: "Job issues",
    description:
      "Pay, classification, hours, contracts, job security, and role expectations.",
  },
  {
    id: "society",
    label: "Society",
    description:
      "Public services, institutions, civic life, and community outside a single employer.",
  },
  {
    id: "harassment",
    label: "Harassment",
    description:
      "Unwanted conduct, hostility, or intimidation—online or in person.",
  },
  {
    id: "discrimination",
    label: "Discrimination",
    description:
      "Bias or unequal treatment tied to protected characteristics or power.",
  },
  {
    id: "mental-pressure",
    label: "Mental pressure",
    description:
      "Stress, fear, coercion, or emotional harm from systems, managers, or peers.",
  },
  {
    id: "unfair-treatment",
    label: "Unfair treatment",
    description:
      "Double standards, arbitrary decisions, retaliation, or broken process.",
  },
] as const;

export type StoryCategory = (typeof STORY_CATEGORIES)[number];
export type StoryCategoryId = StoryCategory["id"];

export function getCategoryLabel(id: StoryCategoryId): string {
  const found = STORY_CATEGORIES.find((c) => c.id === id);
  return found?.label ?? id;
}

export function getCategoryById(id: string): StoryCategory | undefined {
  return STORY_CATEGORIES.find((c) => c.id === id);
}

export function isStoryCategoryId(id: string): id is StoryCategoryId {
  return STORY_CATEGORIES.some((c) => c.id === id);
}
