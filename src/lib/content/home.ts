import type { StoryCategoryId } from "@/lib/taxonomy/categories";

export const HOME_MISSION =
  "Unmuted exists so firsthand accounts of work and civic life can be shared with dignity: clear rules, careful moderation, and tools that respect how much risk each person can take.";

/**
 * One-line context for each category on the marketing homepage.
 */
export const CATEGORY_TAGLINES: Record<StoryCategoryId, string> = {
  workplace: "Roles, norms, and day-to-day dynamics where you work.",
  "company-culture": "How people are treated, promoted, and heard.",
  "job-issues": "Hours, pay, contracts, and stability.",
  society: "Public services, institutions, and community life.",
  harassment: "Unwanted conduct and hostile environments.",
  discrimination: "Bias, exclusion, and unequal treatment.",
  "mental-pressure": "Stress, fear, and emotional strain from systems or people.",
  "unfair-treatment": "Arbitrary decisions, double standards, and retaliation patterns.",
};
