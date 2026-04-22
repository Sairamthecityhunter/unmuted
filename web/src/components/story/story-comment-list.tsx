"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { commentDeleteStorageKey } from "@/lib/constants/comment-client";
import type { StoryComment } from "@/types/comment";

function formatCommentDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

type StoryCommentListProps = {
  storyId: string;
  comments: StoryComment[];
};

export function StoryCommentList({ storyId, comments }: StoryCommentListProps) {
  const router = useRouter();
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setClientReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  function getStoredToken(commentId: string): string | null {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(commentDeleteStorageKey(commentId));
    } catch {
      return null;
    }
  }

  async function removeComment(commentId: string) {
    const token = getStoredToken(commentId);
    if (!token) return;
    if (
      !window.confirm(
        "Delete this comment permanently? This cannot be undone on other people’s screens until they refresh.",
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/stories/${encodeURIComponent(storyId)}/comments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, deleteToken: token }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        window.alert(data.error ?? "Could not delete.");
        return;
      }
      try {
        localStorage.removeItem(commentDeleteStorageKey(commentId));
      } catch {
        /* ignore */
      }
      router.refresh();
    } catch {
      window.alert("Network error. Try again.");
    }
  }

  if (comments.length === 0) {
    return (
      <p className="mt-6 rounded-xl border border-dashed border-rule bg-panel/30 px-4 py-8 text-center text-sm text-mist">
        No replies yet. Be the first to leave a supportive comment below.
      </p>
    );
  }

  return (
    <ul className="mt-6 space-y-4">
      {comments.map((c) => {
        const name = c.isAnonymous
          ? "Community member"
          : (c.authorDisplayName ?? "Member");
        const canDelete = clientReady && Boolean(getStoredToken(c.id));
        return (
          <li key={c.id}>
            <Card className="border-rule/80 bg-panel/40 py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-paper">{name}</span>
                <div className="flex flex-wrap items-center gap-2">
                  <time className="text-xs text-steel" dateTime={c.createdAt}>
                    {formatCommentDate(c.createdAt)}
                  </time>
                  {canDelete ? (
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-auto px-2 py-1 text-xs font-medium text-alert hover:text-alert"
                      onClick={() => void removeComment(c.id)}
                    >
                      Delete my comment
                    </Button>
                  ) : null}
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-mist">{c.body}</p>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
