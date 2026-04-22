import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";

import { Redis } from "@upstash/redis";

import { POST_TYPES, type PostTypeId } from "@/lib/constants/post-types";
import { MIN_STORY_BODY_LENGTH } from "@/lib/constants/story-submission";
import { MOCK_STORIES } from "@/lib/mock/stories";
import { getReactionDeltas } from "@/lib/reaction-deltas-data";
import { isStoryCategoryId, parseStoryTagsInput, validateStoryTags } from "@/lib/taxonomy";
import type { Story } from "@/types/story";

const COMMUNITY_FILE = path.join(process.cwd(), "data", "community-stories.json");
const REDIS_KEY = "unmuted:community-stories";

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

async function readCommunityOnly(): Promise<Story[]> {
  if (isRedisConfigured()) {
    try {
      const raw = await getRedis().get<string>(REDIS_KEY);
      if (!raw) return [];
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      return Array.isArray(parsed) ? (parsed as Story[]) : [];
    } catch {
      return [];
    }
  }

  try {
    const text = await fs.readFile(COMMUNITY_FILE, "utf-8");
    const parsed = JSON.parse(text) as unknown;
    return Array.isArray(parsed) ? (parsed as Story[]) : [];
  } catch {
    return [];
  }
}

async function writeCommunityOnly(stories: Story[]): Promise<void> {
  const payload = JSON.stringify(stories, null, 2);

  if (isRedisConfigured()) {
    await getRedis().set(REDIS_KEY, payload);
    return;
  }

  await fs.mkdir(path.dirname(COMMUNITY_FILE), { recursive: true });
  await fs.writeFile(COMMUNITY_FILE, payload, "utf-8");
}

function mergeStoryReactionDeltas(
  story: Story,
  deltas: Record<string, { support: number; relate: number; important: number }>,
): Story {
  const d = deltas[story.id];
  if (!d) return story;
  return {
    ...story,
    supportCount: story.supportCount + d.support,
    relateCount: story.relateCount + d.relate,
    importantCount: story.importantCount + d.important,
  };
}

export async function getAllStories(): Promise<Story[]> {
  const [community, deltas] = await Promise.all([
    readCommunityOnly(),
    getReactionDeltas(),
  ]);
  const merged = [...MOCK_STORIES, ...community].map((s) =>
    mergeStoryReactionDeltas(s, deltas),
  );
  merged.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return merged;
}

export async function getStoryById(id: string): Promise<Story | undefined> {
  const deltas = await getReactionDeltas();
  const fromMock = MOCK_STORIES.find((s) => s.id === id);
  if (fromMock) return mergeStoryReactionDeltas(fromMock, deltas);
  const community = await readCommunityOnly();
  const found = community.find((s) => s.id === id);
  return found ? mergeStoryReactionDeltas(found, deltas) : undefined;
}

export type CreateStoryPayload = {
  title: string;
  body: string;
  category: string;
  postType: string;
  tags: string;
  company?: string;
  anonymous: boolean;
  consent: boolean;
};

export type CreateStoryResult =
  | { ok: true; story: Story }
  | { ok: false; error: string; code?: string };

export async function createCommunityStory(
  payload: CreateStoryPayload,
): Promise<CreateStoryResult> {
  if (!payload.consent) {
    return { ok: false, error: "Consent is required before publishing." };
  }

  const title = (payload.title ?? "").trim();
  const body = (payload.body ?? "").trim();

  if (title.length < 3) {
    return { ok: false, error: "Please add a clearer title (at least a few characters)." };
  }
  if (title.length > 120) {
    return { ok: false, error: "Title is too long." };
  }
  if (body.length < MIN_STORY_BODY_LENGTH) {
    return {
      ok: false,
      error: `Your story needs at least ${MIN_STORY_BODY_LENGTH} characters.`,
    };
  }

  if (!isStoryCategoryId(payload.category)) {
    return { ok: false, error: "Choose a valid category." };
  }

  const postOk = POST_TYPES.some((p) => p.id === payload.postType);
  if (!postOk) {
    return { ok: false, error: "Choose a valid post type." };
  }

  const tagCheck = validateStoryTags(parseStoryTagsInput(payload.tags ?? ""));
  if (!tagCheck.ok) {
    return { ok: false, error: tagCheck.error };
  }
  const tags = tagCheck.tags;

  const company = (payload.company ?? "").trim();
  const id = `cu-${Date.now()}-${randomBytes(5).toString("hex")}`;

  const story: Story = {
    id,
    title,
    body,
    category: payload.category,
    createdAt: new Date().toISOString(),
    isAnonymous: Boolean(payload.anonymous),
    supportCount: 0,
    importantCount: 0,
    relateCount: 0,
    tags,
    company: company.length > 0 ? company.slice(0, 200) : undefined,
    postType: payload.postType as PostTypeId,
    submittedByCommunity: true,
  };

  try {
    const existing = await readCommunityOnly();
    await writeCommunityOnly([story, ...existing]);
  } catch {
    return {
      ok: false,
      error:
        "Publishing failed. If you are on Vercel, connect Upstash Redis (see project README) or run the app on a host with a writable disk.",
      code: "STORAGE_ERROR",
    };
  }

  return { ok: true, story };
}
