/**
 * A discussion link posted by someone when a story has enough community support.
 * Stored in data/community-meetings.json or Redis (see meetings-data).
 */
export type CommunityMeetingPost = {
  id: string;
  storyId: string;
  /** Copied at post time so the Events page still reads well if the story is removed. */
  storyTitleSnapshot: string;
  meetingUrl: string;
  title: string;
  schedule: string;
  description: string;
  createdAt: string;
  isAnonymous: boolean;
  hostDisplayName?: string;
};
