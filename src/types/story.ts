import type { PostTypeId } from "@/lib/constants/post-types";
import type { StoryCategoryId } from "@/lib/taxonomy/categories";

/**
 * UI / mock shape for feeds and demos. Maps to {@link import("@/domain/models").Story}
 * with `category` as alias of `categoryId` and split reaction counts instead of `reactionTotals`.
 * Replace with DTOs from the API layer when the database exists.
 */
export type Story = {
  id: string;
  title: string;
  body: string;
  category: StoryCategoryId;
  createdAt: string;
  isAnonymous: boolean;
  authorDisplayName?: string;
  /** Primary acknowledgment count (e.g. heart / support). */
  supportCount: number;
  /** “This mattered” / marking the story as important to readers. */
  importantCount: number;
  /** “I relate” — shared experience, no pile-on. */
  relateCount: number;
  /** Free-form tags for discovery (no PII). */
  tags: string[];
  /** Optional org name from the submit form. */
  company?: string;
  /** Author intent (experience, advice, etc.). */
  postType?: PostTypeId;
  /** True when created via the public Share form (not seed mocks). */
  submittedByCommunity?: boolean;
};
