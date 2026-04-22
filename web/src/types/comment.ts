/**
 * UI / mock comment. Aligns with {@link import("@/domain/models").Comment} (`storyId`, `body`, …).
 */
export type StoryComment = {
  id: string;
  storyId: string;
  body: string;
  createdAt: string;
  isAnonymous: boolean;
  authorDisplayName?: string;
};

/**
 * Community comment as stored on disk / Redis. Hash proves delete token without storing the raw secret.
 */
export type StoredCommunityComment = StoryComment & {
  /** sha256 hex of the one-time delete token; omit on legacy rows (not deletable via API). */
  deleteTokenHash?: string;
};
