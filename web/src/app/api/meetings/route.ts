import { NextResponse } from "next/server";

import { createCommunityMeeting, type CreateMeetingPayload } from "@/lib/meetings-data";

export const runtime = "nodejs";

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
  const payload: CreateMeetingPayload = {
    storyId: String(b.storyId ?? ""),
    meetingUrl: String(b.meetingUrl ?? ""),
    title: String(b.title ?? ""),
    schedule: String(b.schedule ?? ""),
    description: String(b.description ?? ""),
    anonymous: Boolean(b.anonymous),
    hostDisplayName: b.hostDisplayName != null ? String(b.hostDisplayName) : undefined,
  };

  const result = await createCommunityMeeting(payload);
  if (!result.ok) {
    const status =
      result.code === "NOT_FOUND"
        ? 404
        : result.code === "STORAGE_ERROR"
          ? 503
          : result.code === "NOT_ENOUGH_SUPPORT" || result.code === "LIMIT"
            ? 403
            : 400;
    return NextResponse.json(
      { error: result.error, code: result.code },
      { status },
    );
  }

  return NextResponse.json({ ok: true, meeting: result.meeting }, { status: 201 });
}
