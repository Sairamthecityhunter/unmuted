import { NextResponse } from "next/server";

import type { ReactionKind } from "@/lib/reaction-deltas-data";
import { incrementStoryReaction } from "@/lib/reaction-deltas-data";
import { getStoryById } from "@/lib/stories-data";

export const runtime = "nodejs";

const KINDS: ReactionKind[] = ["support", "relate", "important"];

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { id: storyId } = await context.params;

  const story = await getStoryById(storyId);
  if (!story) {
    return NextResponse.json({ error: "Story not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const kind =
    body && typeof body === "object" && "type" in body
      ? String((body as { type: unknown }).type)
      : "";

  if (!KINDS.includes(kind as ReactionKind)) {
    return NextResponse.json(
      { error: 'Expected { "type": "support" | "relate" | "important" }.' },
      { status: 400 },
    );
  }

  try {
    const delta = await incrementStoryReaction(storyId, kind as ReactionKind);
    return NextResponse.json({ ok: true, delta });
  } catch {
    return NextResponse.json(
      { error: "Could not save reaction. Check storage (Redis) on serverless hosts." },
      { status: 503 },
    );
  }
}
