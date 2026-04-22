"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { commentDeleteStorageKey } from "@/lib/constants/comment-client";
import {
  MAX_COMMENT_BODY_LENGTH,
  MAX_COMMENT_DISPLAY_NAME_LENGTH,
  MIN_COMMENT_BODY_LENGTH,
} from "@/lib/constants/comment-submission";

type StoryCommentComposerProps = {
  storyId: string;
};

export function StoryCommentComposer({ storyId }: StoryCommentComposerProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [justPosted, setJustPosted] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setJustPosted(false);

    const trimmed = body.trim();
    if (trimmed.length < MIN_COMMENT_BODY_LENGTH) {
      setError(`Comments need at least ${MIN_COMMENT_BODY_LENGTH} characters.`);
      return;
    }
    if (trimmed.length > MAX_COMMENT_BODY_LENGTH) {
      setError("Comment is too long.");
      return;
    }
    if (!anonymous && displayName.trim().length === 0) {
      setError("Add a display name, or check “Post anonymously”.");
      return;
    }

    setPending(true);
    try {
      const res = await fetch(`/api/stories/${encodeURIComponent(storyId)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: trimmed,
          anonymous,
          displayName: anonymous ? undefined : displayName.trim(),
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        comment?: { id: string };
        deleteToken?: string;
      };

      if (!res.ok) {
        setError(data.error ?? "Could not post your comment.");
        return;
      }

      if (data.comment?.id && data.deleteToken) {
        try {
          localStorage.setItem(commentDeleteStorageKey(data.comment.id), data.deleteToken);
        } catch {
          /* private mode / blocked storage */
        }
      }

      setBody("");
      setDisplayName("");
      setAnonymous(true);
      setJustPosted(true);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-rule bg-panel/30 p-4"
      noValidate
    >
      <label htmlFor={`comment-body-${storyId}`} className="text-sm font-medium text-paper">
        Add a supportive comment
      </label>
      <Textarea
        id={`comment-body-${storyId}`}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        maxLength={MAX_COMMENT_BODY_LENGTH}
        placeholder="Share empathy, a related experience, or something that helped—without demanding proof or private details."
        className="mt-2 w-full resize-y rounded-xl border border-rule bg-ink/50 px-3 py-2.5 text-sm text-paper placeholder:text-steel"
        aria-describedby={`comment-hint-${storyId}`}
      />
      <p id={`comment-hint-${storyId}`} className="mt-2 text-xs leading-relaxed text-steel">
        Aim for empathy and clarity. Disagree without demeaning anyone. Do not ask for names,
        workplaces, or documents that could dox someone. Reports go to moderators.
      </p>
      <p className="mt-1 text-xs text-steel">
        {body.trim().length} / {MIN_COMMENT_BODY_LENGTH}–{MAX_COMMENT_BODY_LENGTH} characters
      </p>

      <div className="mt-4 space-y-3">
        <CheckboxField
          id={`comment-anon-${storyId}`}
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          title="Post anonymously"
          description="Your name won’t show on this comment. Be kind—anonymous isn’t permission to harass."
        />
        {!anonymous ? (
          <div>
            <label
              htmlFor={`comment-name-${storyId}`}
              className="text-xs font-medium text-mist"
            >
              Display name
            </label>
            <Input
              id={`comment-name-${storyId}`}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={MAX_COMMENT_DISPLAY_NAME_LENGTH}
              placeholder="First name or initials"
              autoComplete="nickname"
              className="mt-1.5"
            />
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="mt-3 text-sm text-alert" role="alert">
          {error}
        </p>
      ) : null}
      {justPosted ? (
        <p className="mt-3 text-sm text-emerald-200/95" role="status">
          Thanks—your comment is visible below. You can delete it with{" "}
          <strong className="font-medium text-paper">Delete my comment</strong> on this device
          (your browser saves a private key—clearing site data removes it).
        </p>
      ) : null}

      <div className="mt-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Posting…" : "Post comment"}
        </Button>
      </div>
    </form>
  );
}
