import { promises as fs } from "fs";
import path from "path";

import { Redis } from "@upstash/redis";

const DELTAS_FILE = path.join(process.cwd(), "data", "reaction-deltas.json");
const REDIS_KEY = "unmuted:reaction-deltas";

export type ReactionKind = "support" | "relate" | "important";

type StoryDelta = {
  support: number;
  relate: number;
  important: number;
};

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

function normalizeDeltas(raw: unknown): Record<string, StoryDelta> {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, StoryDelta> = {};
  for (const [storyId, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!v || typeof v !== "object") continue;
    const o = v as Record<string, unknown>;
    out[storyId] = {
      support: Math.max(0, Number(o.support) || 0),
      relate: Math.max(0, Number(o.relate) || 0),
      important: Math.max(0, Number(o.important) || 0),
    };
  }
  return out;
}

async function readRaw(): Promise<Record<string, StoryDelta>> {
  if (isRedisConfigured()) {
    try {
      const raw = await getRedis().get<string>(REDIS_KEY);
      if (!raw) return {};
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      return normalizeDeltas(parsed);
    } catch {
      return {};
    }
  }

  try {
    const text = await fs.readFile(DELTAS_FILE, "utf-8");
    const parsed = JSON.parse(text) as unknown;
    return normalizeDeltas(parsed);
  } catch {
    return {};
  }
}

async function writeRaw(data: Record<string, StoryDelta>): Promise<void> {
  const payload = JSON.stringify(data, null, 2);
  if (isRedisConfigured()) {
    await getRedis().set(REDIS_KEY, payload);
    return;
  }
  await fs.mkdir(path.dirname(DELTAS_FILE), { recursive: true });
  await fs.writeFile(DELTAS_FILE, payload, "utf-8");
}

export async function getReactionDeltas(): Promise<Record<string, StoryDelta>> {
  return readRaw();
}

export async function incrementStoryReaction(
  storyId: string,
  kind: ReactionKind,
): Promise<StoryDelta> {
  const all = await readRaw();
  const cur = all[storyId] ?? { support: 0, relate: 0, important: 0 };
  const next: StoryDelta = {
    ...cur,
    [kind]: cur[kind] + 1,
  };
  all[storyId] = next;
  await writeRaw(all);
  return next;
}
