/**
 * Persistence-oriented domain model for Unmuted.
 * Use these types in Server Actions, ORM entities, and API serializers.
 *
 * UI mocks may use narrower shapes under `src/types/` until the data layer lands.
 */

export type { DbId, ISODateString } from "@/domain/common";
export type {
  CommentStatus,
  ReactionKind,
  ReactionTargetType,
  ReportReason,
  ReportStatus,
  ReportTargetType,
  StoryStatus,
  UserRole,
} from "@/domain/enums";
export type {
  Category,
  Comment,
  CommentInsert,
  Reaction,
  Report,
  ReportInsert,
  Story,
  StoryInsert,
  StoryPatch,
  StoryReactionTotals,
  User,
} from "@/domain/models";
