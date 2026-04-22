import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { promises as fs } from "fs";
import path from "path";

import { Redis } from "@upstash/redis";

import {
  MAX_COMMENT_BODY_LENGTH,
  MAX_COMMENT_DISPLAY_NAME_LENGTH,
  MIN_COMMENT_BODY_LENGTH,
} from "@/lib/constants/comment-submission";
import { MOCK_COMMENTS } from "@/lib/mock/comments";
import { getStoryById } from "@/lib/stories-data";
import type { StoryComment, StoredCommunityComment } from "@/types/comment";

const COMMENTS_FILE = path.join(process.cwd(), "data", "community-comments.json");
const REDIS_KEY = "unmuted:community-comments";

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

function hashDeleteToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

function safeEqualHex(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, "hex");
    const bb = Buffer.from(b, "hex");
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

function toPublicComment(c: StoredCommunityComment): StoryComment {
  return {
    id: c.id,
    storyId: c.storyId,
    body: c.body,
    createdAt: c.createdAt,
    isAnonymous: c.isAnonymous,
    authorDisplayName: c.authorDisplayName,
  };
}

function normalizeStored(raw: unknown): StoredCommunityComment[] {
  if (!Array.isArray(raw)) return [];
  const out: StoredCommunityComment[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    if (
      typeof o.id !== "string" ||
      typeof o.storyId !== "string" ||
      typeof o.body !== "string" ||
      typeof o.createdAt !== "string" ||
      typeof o.isAnonymous !== "boolean"
    ) {
      continue;
    }
    const c: StoredCommunityComment = {
      id: o.id,
      storyId: o.storyId,
      body: o.body,
      createdAt: o.createdAt,
      isAnonymous: o.isAnonymous,
      authorDisplayName:
        typeof o.authorDisplayName === "string" ? o.authorDisplayName : undefined,
    };
    if (typeof o.deleteTokenHash === "string" && o.deleteTokenHash.length > 0) {
      c.deleteTokenHash = o.deleteTokenHash;
    }
    out.push(c);
  }
  return out;
}

async function readStoredComments(): Promise<StoredCommunityComment[]> {
  if (isRedisConfigured()) {
    try {
      const raw = await getRedis().get<string>(REDIS_KEY);
      if (!raw) return [];
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      return normalizeStored(parsed);
    } catch {
      return [];
    }
  }

  try {
    const text = await fs.readFile(COMMENTS_FILE, "utf-8");
    const parsed = JSON.parse(text) as unknown;
    return normalizeStored(parsed);
  } catch {
    return [];
  }
}

async function writeStoredComments(comments: StoredCommunityComment[]): Promise<void> {
  const payload = JSON.stringify(comments, null, 2);

  if (isRedisConfigured()) {
    await getRedis().set(REDIS_KEY, payload);
    return;
  }

  await fs.mkdir(path.dirname(COMMENTS_FILE), { recursive: true });
  await fs.writeFile(COMMENTS_FILE, payload, "utf-8");
}

/** Mock seed comments plus community-submitted replies for this story, oldest first (no secrets). */
export async function getCommentsForStory(storyId: string): Promise<StoryComment[]> {
  const stored = await readStoredComments();
  const mock = MOCK_COMMENTS.filter((c) => c.storyId === storyId);
  const community = stored
    .filter((c) => c.storyId === storyId)
    .map((c) => toPublicComment(c));
  const merged = [...mock, ...community];
  merged.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  return merged;
}

export type CreateCommentPayload = {
  body: string;
  anonymous: boolean;
  displayName?: string;
};

export type CreateCommentResult =
  | { ok: true; comment: StoryComment; deleteToken: string }
  | { ok: false; error: string; code?: string };

export async function createStoryComment(
  storyId: string,
  payload: CreateCommentPayload,
): Promise<CreateCommentResult> {
  const story = await getStoryById(storyId);
  if (!story) {
    return { ok: false, error: "Story not found.", code: "NOT_FOUND" };
  }

  const body = (payload.body ?? "").trim();
  if (body.length < MIN_COMMENT_BODY_LENGTH) {
    return {
      ok: false,
      error: `Please write at least ${MIN_COMMENT_BODY_LENGTH} characters.`,
    };
  }
  if (body.length > MAX_COMMENT_BODY_LENGTH) {
    return { ok: false, error: "Comment is too long." };
  }

  const isAnonymous = Boolean(payload.anonymous);
  let authorDisplayName: string | undefined;
  if (!isAnonymous) {
    const name = (payload.displayName ?? "").trim();
    if (name.length === 0) {
      return {
        ok: false,
        error: "Add a display name, or post anonymously.",
      };
    }
    if (name.length > MAX_COMMENT_DISPLAY_NAME_LENGTH) {
      return { ok: false, error: "Display name is too long." };
    }
    authorDisplayName = name;
  }

  const deleteToken = randomBytes(24).toString("hex");
  const deleteTokenHash = hashDeleteToken(deleteToken);

  const comment: StoredCommunityComment = {
    id: `cc-${Date.now()}-${randomBytes(4).toString("hex")}`,
    storyId,
    body,
    createdAt: new Date().toISOString(),
    isAnonymous,
    authorDisplayName,
    deleteTokenHash,
  };

  try {
    const existing = await readStoredComments();
    await writeStoredComments([...existing, comment]);
  } catch {
    return {
      ok: false,
      error:
        "Could not save your comment. On Vercel, connect Upstash Redis (see README) or use a host with a writable disk.",
      code: "STORAGE_ERROR",
    };
  }

  return { ok: true, comment: toPublicComment(comment), deleteToken };
}

export type DeleteCommentResult =
  | { ok: true }
  | { ok: false; error: string; code?: string };

export async function deleteStoryComment(
  storyId: string,
  commentId: string,
  deleteToken: string,
): Promise<DeleteCommentResult> {
  const token = (deleteToken ?? "").trim();
  if (token.length < 16) {
    return { ok: false, error: "Invalid delete token.", code: "FORBIDDEN" };
  }
  const tokenHash = hashDeleteToken(token);

  const existing = await readStoredComments();
  const idx = existing.findIndex((c) => c.id === commentId && c.storyId === storyId);
  if (idx === -1) {
    return { ok: false, error: "Comment not found.", code: "NOT_FOUND" };
  }

  const row = existing[idx];
  if (!row.deleteTokenHash) {
    return {
      ok: false,
      error: "This comment cannot be deleted from the app (legacy post).",
      code: "FORBIDDEN",
    };
  }

  if (!safeEqualHex(row.deleteTokenHash, tokenHash)) {
    return {
      ok: false,
      error: "You can only delete your own comment from this browser if you still have the saved key.",
      code: "FORBIDDEN",
    };
  }

  const next = [...existing.slice(0, idx), ...existing.slice(idx + 1)];
  try {
    await writeStoredComments(next);
  } catch {
    return {
      ok: false,
      error: "Could not delete. Check storage (Redis) on serverless hosts.",
      code: "STORAGE_ERROR",
    };
  }

  return { ok: true };
}
