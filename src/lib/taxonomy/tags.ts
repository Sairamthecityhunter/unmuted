import type { StoryCategoryId } from "@/lib/taxonomy/categories";

/** Hard limits for MVP — tune with product / moderation. */
export const STORY_TAG_LIMITS = {
  maxTagsPerStory: 12,
  maxSlugLength: 40,
  minSlugLength: 2,
} as const;

const NON_ALPHANUM = /[^a-z0-9-]+/g;
const LEADING_TRAILING_HYPHENS = /^-+|-+$/g;

/**
 * Normalize user input into a single tag slug: lowercase, hyphenated, trimmed.
 * Returns null if the result is empty or invalid length.
 */
export function normalizeStoryTag(raw: string): string | null {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return null;
  const slug = trimmed
    .replace(/\s+/g, "-")
    .replace(NON_ALPHANUM, "")
    .replace(LEADING_TRAILING_HYPHENS, "");
  if (
    slug.length < STORY_TAG_LIMITS.minSlugLength ||
    slug.length > STORY_TAG_LIMITS.maxSlugLength
  ) {
    return null;
  }
  return slug;
}

/**
 * Parse comma- or newline-separated tag input into unique, normalized slugs.
 */
export function parseStoryTagsInput(input: string): string[] {
  const parts = input.split(/[\n,]+/);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of parts) {
    const tag = normalizeStoryTag(part);
    if (tag && !seen.has(tag)) {
      seen.add(tag);
      out.push(tag);
    }
  }
  return out;
}

export type StoryTagsValidation =
  | { ok: true; tags: string[] }
  | { ok: false; error: string };

/**
 * Validate a list of tag slugs for persistence (after normalization).
 */
export function validateStoryTags(tags: string[]): StoryTagsValidation {
  if (tags.length > STORY_TAG_LIMITS.maxTagsPerStory) {
    return {
      ok: false,
      error: `Use at most ${STORY_TAG_LIMITS.maxTagsPerStory} tags.`,
    };
  }
  for (const t of tags) {
    if (t.length < STORY_TAG_LIMITS.minSlugLength || t.length > STORY_TAG_LIMITS.maxSlugLength) {
      return { ok: false, error: "Each tag must be between 2 and 40 characters after cleanup." };
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(t)) {
      return {
        ok: false,
        error: "Tags can only use lowercase letters, numbers, and single hyphens.",
      };
    }
  }
  return { ok: true, tags };
}

/**
 * Curated suggestions for pickers and prompts. Authors may still add custom tags
 * that pass {@link validateStoryTags}.
 */
export const SUGGESTED_TAGS_BY_CATEGORY: Record<StoryCategoryId, readonly string[]> = {
  workplace: ["safety", "scheduling", "handoff", "training", "remote-work", "union"],
  "company-culture": ["promotions", "feedback", "inclusion", "leadership", "norms"],
  "job-issues": ["pay", "contract", "overtime", "layoffs", "classification"],
  society: ["public-services", "housing", "benefits", "accessibility", "local-government"],
  harassment: ["hostile-environment", "reporting", "witness", "online"],
  discrimination: ["bias", "accommodations", "promotion", "hiring"],
  "mental-pressure": ["burnout", "anxiety", "deadlines", "retaliation-fear"],
  "unfair-treatment": ["retaliation", "double-standards", "documentation", "whistleblowing"],
};

/** Flat deduped list for global autocomplete / docs. */
export const ALL_SUGGESTED_TAG_SLUGS: readonly string[] = Array.from(
  new Set(Object.values(SUGGESTED_TAGS_BY_CATEGORY).flat()),
).sort();
