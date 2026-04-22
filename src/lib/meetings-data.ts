import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";

import { Redis } from "@upstash/redis";

import {
  MAX_MEETINGS_PER_STORY,
  MIN_SUPPORT_TO_HOST_MEETING,
} from "@/lib/constants/meeting-host";
import { getStoryById } from "@/lib/stories-data";
import type { CommunityMeetingPost } from "@/types/community-meeting";

const MEETINGS_FILE = path.join(process.cwd(), "data", "community-meetings.json");
const REDIS_KEY = "unmuted:community-meetings";

function isRedisConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

let redisClient: Redis | null = null;
function getRedis(): Redis {
  if (!redisClient) {
    redisClient = Redis.fromEnv();
  }
  return redisClient;
}

async function readStored(): Promise<CommunityMeetingPost[]> {
  if (isRedisConfigured()) {
    try {
      const raw = await getRedis().get<string>(REDIS_KEY);
      if (!raw) return [];
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      return Array.isArray(parsed) ? (parsed as CommunityMeetingPost[]) : [];
    } catch {
      return [];
    }
  }

  try {
    const text = await fs.readFile(MEETINGS_FILE, "utf-8");
    const parsed = JSON.parse(text) as unknown;
    return Array.isArray(parsed) ? (parsed as CommunityMeetingPost[]) : [];
  } catch {
    return [];
  }
}

async function writeStored(meetings: CommunityMeetingPost[]): Promise<void> {
  const payload = JSON.stringify(meetings, null, 2);
  if (isRedisConfigured()) {
    await getRedis().set(REDIS_KEY, payload);
    return;
  }
  await fs.mkdir(path.dirname(MEETINGS_FILE), { recursive: true });
  await fs.writeFile(MEETINGS_FILE, payload, "utf-8");
}

function isValidHttpsUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

export type CreateMeetingPayload = {
  storyId: string;
  meetingUrl: string;
  title: string;
  schedule: string;
  description: string;
  anonymous: boolean;
  hostDisplayName?: string;
};

export type CreateMeetingResult =
  | { ok: true; meeting: CommunityMeetingPost }
  | { ok: false; error: string; code?: string };

export async function createCommunityMeeting(
  payload: CreateMeetingPayload,
): Promise<CreateMeetingResult> {
  const story = await getStoryById(payload.storyId);
  if (!story) {
    return { ok: false, error: "Story not found.", code: "NOT_FOUND" };
  }

  if (story.supportCount < MIN_SUPPORT_TO_HOST_MEETING) {
    return {
      ok: false,
      error: `This story needs at least ${MIN_SUPPORT_TO_HOST_MEETING} support (from the story and saved reactions) before someone can add a public meeting link.`,
      code: "NOT_ENOUGH_SUPPORT",
    };
  }

  const existing = await readStored();
  const countForStory = existing.filter((m) => m.storyId === payload.storyId).length;
  if (countForStory >= MAX_MEETINGS_PER_STORY) {
    return {
      ok: false,
      error: `This story already has ${MAX_MEETINGS_PER_STORY} discussion links. Remove old ones from data or ask a moderator when that exists.`,
      code: "LIMIT",
    };
  }

  const meetingUrl = (payload.meetingUrl ?? "").trim();
  if (!isValidHttpsUrl(meetingUrl)) {
    return {
      ok: false,
      error: "Use a secure https:// link (Zoom, Google Meet, Teams, etc.).",
    };
  }

  const title = (payload.title ?? "").trim();
  if (title.length < 3 || title.length > 120) {
    return { ok: false, error: "Add a short title (3–120 characters)." };
  }

  const schedule = (payload.schedule ?? "").trim();
  if (schedule.length < 3 || schedule.length > 200) {
    return { ok: false, error: "Add when you’re meeting (3–200 characters), e.g. “Sat 3pm ET”." };
  }

  const description = (payload.description ?? "").trim();
  if (description.length > 2000) {
    return { ok: false, error: "Description is too long." };
  }

  const isAnonymous = Boolean(payload.anonymous);
  let hostDisplayName: string | undefined;
  if (!isAnonymous) {
    const name = (payload.hostDisplayName ?? "").trim();
    if (name.length === 0) {
      return { ok: false, error: "Add a display name or post as anonymous host." };
    }
    if (name.length > 80) {
      return { ok: false, error: "Display name is too long." };
    }
    hostDisplayName = name;
  }

  const meeting: CommunityMeetingPost = {
    id: `mt-${Date.now()}-${randomBytes(4).toString("hex")}`,
    storyId: story.id,
    storyTitleSnapshot: story.title,
    meetingUrl,
    title,
    schedule,
    description,
    createdAt: new Date().toISOString(),
    isAnonymous,
    hostDisplayName,
  };

  try {
    await writeStored([meeting, ...existing]);
  } catch {
    return {
      ok: false,
      error:
        "Could not save the meeting. On Vercel, connect Upstash Redis (see README) or use a host with a writable disk.",
      code: "STORAGE_ERROR",
    };
  }

  return { ok: true, meeting };
}

export type MeetingListItem = {
  meeting: CommunityMeetingPost;
  storySupportNow: number;
  storyExists: boolean;
};

export async function listMeetingsForEventsPage(): Promise<MeetingListItem[]> {
  const meetings = await readStored();
  const items: MeetingListItem[] = await Promise.all(
    meetings.map(async (meeting) => {
      const story = await getStoryById(meeting.storyId);
      return {
        meeting,
        storySupportNow: story?.supportCount ?? 0,
        storyExists: Boolean(story),
      };
    }),
  );
  const eligible = items.filter(
    (item) => item.storyExists && item.storySupportNow >= MIN_SUPPORT_TO_HOST_MEETING,
  );
  eligible.sort((a, b) => {
    if (b.storySupportNow !== a.storySupportNow) {
      return b.storySupportNow - a.storySupportNow;
    }
    return (
      new Date(b.meeting.createdAt).getTime() - new Date(a.meeting.createdAt).getTime()
    );
  });
  return eligible;
}
