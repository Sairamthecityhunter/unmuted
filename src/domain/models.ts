import type { PostTypeId } from "@/lib/constants/post-types";
import type { StoryCategoryId } from "@/lib/taxonomy/categories";

import type { DbId, ISODateString } from "@/domain/common";
import type {
  CommentStatus,
  ReactionKind,
  ReactionTargetType,
  ReportReason,
  ReportStatus,
  ReportTargetType,
  StoryStatus,
  UserRole,
} from "@/domain/enums";

// ─── User ─────────────────────────────────────────────────────────────

/**
 * Authenticated account. `email` may be null for passwordless/social-only flows.
 * Never expose `email` publicly without consent; use `displayName` / `username` in UI.
 */
export interface User {
  id: DbId;
  email: string | null;
  emailVerifiedAt: ISODateString | null;
  displayName: string;
  /** Unique public handle when you add profiles; nullable during onboarding. */
  username: string | null;
  role: UserRole;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  suspendedAt: ISODateString | null;
  deletedAt: ISODateString | null;
}

// ─── Category (optional table; often seeded from taxonomy config) ─────

/**
 * Row in `categories` — mirrors {@link StoryCategoryId} slugs from taxonomy.
 * Lets you reorder, deactivate, or add DB-only metadata without redeploying code.
 */
export interface Category {
  id: StoryCategoryId;
  slug: string;
  label: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// ─── Story ───────────────────────────────────────────────────────────

/**
 * Denormalized reaction counts for list/detail (maintain via triggers, jobs, or writes).
 */
export type StoryReactionTotals = Partial<Record<ReactionKind, number>>;

/**
 * Primary content entity. `authorUserId` always set server-side; `isAnonymous` hides
 * public attribution only.
 */
export interface Story {
  id: DbId;
  authorUserId: DbId;
  title: string;
  body: string;
  categoryId: StoryCategoryId;
  postTypeId: PostTypeId | null;
  /** Optional; PII risk — validate/moderate carefully. */
  companyName: string | null;
  tags: string[];
  status: StoryStatus;
  isAnonymous: boolean;
  publishedAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  removedReason: string | null;
  removedAt: ISODateString | null;
  /** Denormalized for read-heavy feeds; source of truth is `reactions` rows. */
  reactionTotals: StoryReactionTotals;
}

// ─── Comment ───────────────────────────────────────────────────────────

/**
 * Threaded reply to a story. `parentCommentId` null = top-level.
 */
export interface Comment {
  id: DbId;
  storyId: DbId;
  authorUserId: DbId;
  parentCommentId: DbId | null;
  body: string;
  status: CommentStatus;
  isAnonymous: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// ─── Report ───────────────────────────────────────────────────────────

/**
 * User-submitted moderation flag. `targetId` references `stories.id` or `comments.id`
 * depending on `targetType`.
 */
export interface Report {
  id: DbId;
  reporterUserId: DbId;
  targetType: ReportTargetType;
  targetId: DbId;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  assignedModeratorUserId: DbId | null;
  resolutionNote: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  resolvedAt: ISODateString | null;
}

// ─── Reaction ────────────────────────────────────────────────────────

/**
 * One reaction edge per user/target/kind. Enforce uniqueness:
 * `(user_id, target_type, target_id, kind)` in the database.
 */
export interface Reaction {
  id: DbId;
  userId: DbId;
  targetType: ReactionTargetType;
  targetId: DbId;
  kind: ReactionKind;
  createdAt: ISODateString;
}

// ─── Insert / update DTOs (optional helpers for API layers) ───────────

/** Fields the server sets automatically on create. */
export type StoryInsert = Omit<
  Story,
  "id" | "createdAt" | "updatedAt" | "reactionTotals" | "removedAt" | "removedReason" | "publishedAt"
> &
  Partial<Pick<Story, "reactionTotals" | "publishedAt">>;

export type StoryPatch = Partial<
  Pick<
    Story,
    | "title"
    | "body"
    | "categoryId"
    | "postTypeId"
    | "companyName"
    | "tags"
    | "status"
    | "isAnonymous"
    | "publishedAt"
    | "removedReason"
    | "removedAt"
  >
>;

export type CommentInsert = Omit<Comment, "id" | "createdAt" | "updatedAt">;

export type ReportInsert = Omit<
  Report,
  | "id"
  | "status"
  | "assignedModeratorUserId"
  | "resolutionNote"
  | "createdAt"
  | "updatedAt"
  | "resolvedAt"
>;
