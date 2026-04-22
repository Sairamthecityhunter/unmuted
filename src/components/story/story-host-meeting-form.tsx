"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type StoryHostMeetingFormProps = {
  storyId: string;
  storyTitle: string;
};

export function StoryHostMeetingForm({ storyId, storyTitle }: StoryHostMeetingFormProps) {
  const router = useRouter();
  const [anonymous, setAnonymous] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setDone(false);
    const form = e.currentTarget;
    const meetingUrl = (form.elements.namedItem("meetingUrl") as HTMLInputElement)?.value?.trim() ?? "";
    const title =
      (form.elements.namedItem("meetingTitle") as HTMLInputElement)?.value?.trim() ?? "";
    const schedule =
      (form.elements.namedItem("schedule") as HTMLInputElement)?.value?.trim() ?? "";
    const description =
      (form.elements.namedItem("description") as HTMLTextAreaElement)?.value?.trim() ?? "";
    const hostDisplayName =
      (form.elements.namedItem("hostName") as HTMLInputElement)?.value?.trim() ?? "";

    if (!anonymous && hostDisplayName.length === 0) {
      setError("Add a host display name or keep “Host anonymously” checked.");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyId,
          meetingUrl,
          title,
          schedule,
          description,
          anonymous,
          hostDisplayName: anonymous ? undefined : hostDisplayName,
        }),
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Could not publish the meeting.");
        return;
      }

      form.reset();
      setAnonymous(true);
      setDone(true);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section
      className="rounded-xl border border-signal/30 bg-signal/5 px-5 py-6"
      aria-labelledby={`host-meeting-${storyId}`}
    >
      <h2 id={`host-meeting-${storyId}`} className="text-sm font-semibold text-paper">
        Host a follow-up discussion
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-mist">
        This story has enough community support to add a public meeting link (Zoom, Google Meet,
        Teams, etc.). It will appear on the{" "}
        <Link href="/events" className="font-medium text-signal hover:text-signal-hover">
          Events
        </Link>{" "}
        page. Only share links you control; never post passwords here.
      </p>
      <p className="mt-1 text-xs text-steel">
        Related story: <span className="text-mist">{storyTitle}</span>
      </p>

      <form onSubmit={onSubmit} className="mt-4 space-y-4" noValidate>
        <div>
          <label htmlFor={`meetingUrl-${storyId}`} className="text-xs font-medium text-mist">
            Meeting link (https only)
          </label>
          <Input
            id={`meetingUrl-${storyId}`}
            name="meetingUrl"
            type="url"
            required
            placeholder="https://zoom.us/j/… or https://meet.google.com/…"
            autoComplete="off"
            className="mt-1.5"
          />
        </div>
        <div>
          <label htmlFor={`meetingTitle-${storyId}`} className="text-xs font-medium text-mist">
            Short title
          </label>
          <Input
            id={`meetingTitle-${storyId}`}
            name="meetingTitle"
            required
            maxLength={120}
            placeholder="e.g. Open chat — scheduling & documentation"
            className="mt-1.5"
          />
        </div>
        <div>
          <label htmlFor={`schedule-${storyId}`} className="text-xs font-medium text-mist">
            When
          </label>
          <Input
            id={`schedule-${storyId}`}
            name="schedule"
            required
            maxLength={200}
            placeholder="e.g. Saturday Apr 26, 4:00–5:00 p.m. ET"
            className="mt-1.5"
          />
        </div>
        <div>
          <label htmlFor={`desc-${storyId}`} className="text-xs font-medium text-mist">
            What to expect (optional)
          </label>
          <Textarea
            id={`desc-${storyId}`}
            name="description"
            rows={3}
            maxLength={2000}
            placeholder="Ground rules, who should join, listening-only welcome, etc."
            className="mt-1.5"
          />
        </div>

        <CheckboxField
          id={`host-anon-${storyId}`}
          checked={anonymous}
          onChange={(ev) => setAnonymous(ev.target.checked)}
          title="Host anonymously"
          description="Your name won’t show on the Events listing."
        />

        {!anonymous ? (
          <div>
            <label htmlFor={`hostName-${storyId}`} className="text-xs font-medium text-mist">
              Your display name as host
            </label>
            <Input
              id={`hostName-${storyId}`}
              name="hostName"
              maxLength={80}
              className="mt-1.5"
            />
          </div>
        ) : null}

        {error ? (
          <p className="text-sm text-alert" role="alert">
            {error}
          </p>
        ) : null}
        {done ? (
          <p className="text-sm text-emerald-200/95" role="status">
            Posted. See it on{" "}
            <Link href="/events" className="font-semibold text-signal hover:text-signal-hover">
              Events
            </Link>
            .
          </p>
        ) : null}

        <Button type="submit" disabled={pending}>
          {pending ? "Publishing…" : "Post meeting to Events"}
        </Button>
      </form>
    </section>
  );
}
