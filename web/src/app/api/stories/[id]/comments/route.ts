import { NextResponse } from "next/server";

import { createStoryComment, deleteStoryComment } from "@/lib/comments-data";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { id: storyId } = await context.params;

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
  const result = await createStoryComment(storyId, {
    body: String(b.body ?? ""),
    anonymous: Boolean(b.anonymous),
    displayName: b.displayName != null ? String(b.displayName) : undefined,
  });

  if (!result.ok) {
    const status =
      result.code === "NOT_FOUND" ? 404 : result.code === "STORAGE_ERROR" ? 503 : 400;
    return NextResponse.json(
      { error: result.error, code: result.code },
      { status },
    );
  }

  return NextResponse.json(
    { ok: true, comment: result.comment, deleteToken: result.deleteToken },
    { status: 201 },
  );
}

export async function DELETE(request: Request, context: RouteContext) {
  const { id: storyId } = await context.params;

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
  const commentId = String(b.commentId ?? "");
  const deleteToken = String(b.deleteToken ?? "");

  const result = await deleteStoryComment(storyId, commentId, deleteToken);
  if (!result.ok) {
    const status =
      result.code === "NOT_FOUND"
        ? 404
        : result.code === "STORAGE_ERROR"
          ? 503
          : 403;
    return NextResponse.json(
      { error: result.error, code: result.code },
      { status },
    );
  }

  return NextResponse.json({ ok: true });
}
