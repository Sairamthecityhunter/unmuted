import { NextResponse } from "next/server";

import {
  createCommunityStory,
  getAllStories,
  type CreateStoryPayload,
} from "@/lib/stories-data";

export const runtime = "nodejs";

export async function GET() {
  const stories = await getAllStories();
  return NextResponse.json({ stories });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Expected a JSON object." }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const payload: CreateStoryPayload = {
    title: String(b.title ?? ""),
    body: String(b.body ?? ""),
    category: String(b.category ?? ""),
    postType: String(b.postType ?? ""),
    tags: String(b.tags ?? ""),
    company: b.company != null ? String(b.company) : undefined,
    anonymous: Boolean(b.anonymous),
    consent: Boolean(b.consent),
  };

  const result = await createCommunityStory(payload);
  if (!result.ok) {
    const status = result.code === "STORAGE_ERROR" ? 503 : 400;
    return NextResponse.json(
      { error: result.error, code: result.code },
      { status },
    );
  }

  return NextResponse.json({ ok: true, story: result.story }, { status: 201 });
}
