/**
 * Re-export taxonomy so existing `@/lib/constants/categories` imports stay stable.
 */
export {
  STORY_CATEGORIES,
  getCategoryById,
  getCategoryLabel,
  isStoryCategoryId,
  type StoryCategory,
  type StoryCategoryId,
} from "@/lib/taxonomy/categories";
