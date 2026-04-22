"use client";

import type { FormEvent } from "react";
import { useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { REPORT_REASON_OPTIONS } from "@/lib/constants/report-reasons";
import { cn } from "@/lib/utils/cn";

type StoryReportButtonProps = {
  storyId: string;
  storyTitle: string;
};

export function StoryReportButton({ storyId, storyTitle }: StoryReportButtonProps) {
  const dialogId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [submitted, setSubmitted] = useState(false);

  function open() {
    setSubmitted(false);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    // Demo only — wire to POST /api/reports later
    setTimeout(() => {
      close();
      setSubmitted(false);
    }, 1200);
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className={cn(
          "text-sm font-medium text-mist underline-offset-4 transition-colors",
          "hover:text-alert hover:underline",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal rounded-md",
        )}
      >
        Report post
      </button>

      <dialog
        ref={dialogRef}
        id={dialogId}
        className={cn(
          "w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-rule bg-panel p-6 text-paper shadow-2xl",
          "backdrop:bg-ink/75 backdrop:backdrop-blur-sm",
        )}
        aria-labelledby={`${dialogId}-title`}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <h2 id={`${dialogId}-title`} className="text-lg font-semibold text-paper">
              Report this post
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-steel">
              Tell moderators what worries you. Reports are reviewed in line with our community
              guidelines. Knowingly false or abusive reporting may limit your account.
            </p>
            <p className="mt-2 text-xs text-mist line-clamp-2" title={storyTitle}>
              Post: <span className="text-paper">{storyTitle}</span>
            </p>
            <p className="mt-1 font-mono text-[10px] text-steel">ID: {storyId}</p>
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-paper">Reason for report</legend>
            <p className="text-xs text-steel">Choose the closest match. You can add context below.</p>
            <div className="mt-2 space-y-2">
              {REPORT_REASON_OPTIONS.filter((r) => r.value !== "other").map((r, idx) => (
                <label
                  key={r.value}
                  className="flex cursor-pointer gap-3 rounded-xl border border-rule bg-ink/40 px-3 py-2.5 text-sm has-[:checked]:border-signal/50 has-[:checked]:bg-signal/10"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r.value}
                    required={idx === 0}
                    className="mt-0.5 size-4 shrink-0 border-rule text-signal focus:ring-signal"
                  />
                  <span>
                    <span className="font-medium text-paper">{r.label}</span>
                    <span className="mt-0.5 block text-xs text-steel">{r.description}</span>
                  </span>
                </label>
              ))}
              <label className="flex cursor-pointer gap-3 rounded-xl border border-rule bg-ink/40 px-3 py-2.5 text-sm has-[:checked]:border-signal/50 has-[:checked]:bg-signal/10">
                <input
                  type="radio"
                  name="reason"
                  value="other"
                  className="mt-0.5 size-4 shrink-0 border-rule text-signal focus:ring-signal"
                />
                <span>
                  <span className="font-medium text-paper">Other</span>
                  <span className="mt-0.5 block text-xs text-steel">
                    Something else covered in the guidelines—please explain below.
                  </span>
                </span>
              </label>
            </div>
          </fieldset>

          <div className="space-y-2">
            <label htmlFor={`${dialogId}-details`} className="text-sm font-medium text-paper">
              Additional context (optional)
            </label>
            <textarea
              id={`${dialogId}-details`}
              name="details"
              rows={4}
              maxLength={2000}
              placeholder="What should moderators review? Do not paste private information about third parties."
              className="w-full resize-y rounded-xl border border-rule bg-ink px-3 py-2.5 text-sm text-paper placeholder:text-steel focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/30"
            />
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={close}
              className="rounded-xl border border-rule px-4 py-2.5 text-sm font-medium text-mist transition-colors hover:bg-panel hover:text-paper"
            >
              Cancel
            </button>
            <Button type="submit" disabled={submitted}>
              {submitted ? "Sent (demo)" : "Submit report"}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
