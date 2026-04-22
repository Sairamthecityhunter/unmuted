/**
 * Enumerations aligned with likely Postgres enums or check constraints.
 * Keep values lowercase_snake_case or kebab-case to match URL slugs where applicable.
 */

export type UserRole = "member" | "moderator" | "admin";

export type StoryStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "hidden"
  | "removed";

export type CommentStatus = "visible" | "hidden" | "removed";

export type ReportTargetType = "story" | "comment";

export type ReportReason =
  | "harassment"
  | "personal_information"
  | "hate_speech"
  | "false_information"
  | "spam"
  | "other";

export type ReportStatus = "open" | "in_review" | "resolved" | "dismissed";

/** Community reactions on stories — one per user per kind in production. */
export type ReactionKind = "support" | "relate" | "important";

export type ReactionTargetType = "story" | "comment";
