"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ExperienceDisclaimer } from "@/components/legal/experience-disclaimer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { STORY_CATEGORIES } from "@/lib/constants/categories";
import { POST_TYPES } from "@/lib/constants/post-types";
import { MIN_STORY_BODY_LENGTH } from "@/lib/constants/story-submission";
import {
  getCategoryLabel,
  SUGGESTED_TAGS_BY_CATEGORY,
  parseStoryTagsInput,
  validateStoryTags,
  type StoryCategoryId,
} from "@/lib/taxonomy";

export function SubmitStoryForm() {
  const router = useRouter();
  const [consent, setConsent] = useState(false);
  const [storyLen, setStoryLen] = useState(0);
  const [postTypeId, setPostTypeId] = useState("");
  const [categoryId, setCategoryId] = useState<StoryCategoryId | "">("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);

  const postTypeDescription = POST_TYPES.find((p) => p.id === postTypeId)?.description;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPublishedId(null);
    const form = e.currentTarget;
    const body = (form.elements.namedItem("body") as HTMLTextAreaElement)?.value?.trim() ?? "";
    if (body.length < MIN_STORY_BODY_LENGTH) {
      setError(
        `Your story needs at least ${MIN_STORY_BODY_LENGTH} characters so readers have enough context.`,
      );
      return;
    }
    if (!consent) {
      setError("Please confirm the consent statement before submitting.");
      return;
    }
    const tagsRaw = (form.elements.namedItem("tags") as HTMLInputElement)?.value ?? "";
    const parsedTags = parseStoryTagsInput(tagsRaw);
    const tagCheck = validateStoryTags(parsedTags);
    if (!tagCheck.ok) {
      setError(tagCheck.error);
      return;
    }

    const title = (form.elements.namedItem("title") as HTMLInputElement)?.value?.trim() ?? "";
    const category = (form.elements.namedItem("category") as HTMLSelectElement)?.value ?? "";
    const postType = (form.elements.namedItem("postType") as HTMLSelectElement)?.value ?? "";
    const company = (form.elements.namedItem("company") as HTMLInputElement)?.value ?? "";
    const anonymous = (form.elements.namedItem("anonymous") as HTMLInputElement)?.checked ?? true;

    setPending(true);
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          category,
          postType,
          tags: tagsRaw,
          company,
          anonymous,
          consent: true,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; story?: { id: string }; error?: string };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      if (data.story?.id) {
        setPublishedId(data.story.id);
        form.reset();
        setConsent(false);
        setStoryLen(0);
        setPostTypeId("");
        setCategoryId("");
        router.refresh();
      }
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-8" onSubmit={onSubmit} noValidate>
      {publishedId ? (
        <p
          className="rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100/95"
          role="status"
        >
          Your story is live for everyone on this site.{" "}
          <Link
            href={`/stories/${publishedId}`}
            className="font-semibold text-signal hover:text-signal-hover"
          >
            View your post
          </Link>{" "}
          or{" "}
          <Link href="/feed" className="font-semibold text-signal hover:text-signal-hover">
            open the feed
          </Link>
          .
        </p>
      ) : null}

      {error ? (
        <p
          className="rounded-xl border border-alert/40 bg-alert/10 px-4 py-3 text-sm text-alert"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <FormField
        id="title"
        label="Title"
        hint={
          <>
            <strong className="font-medium text-mist">Prompt:</strong> Sum up the situation in one line, like a
            chapter title—neutral and specific enough that you’ll recognize it later.{" "}
            <span className="text-steel">Avoid real names, unique project codenames, or addresses.</span>
          </>
        }
      >
        <Input
          id="title"
          name="title"
          required
          maxLength={120}
          placeholder="e.g. Escalation after I questioned a staffing decision"
          autoComplete="off"
        />
      </FormField>

      <FormField
        id="category"
        label="Category"
        hint={
          <>
            <strong className="font-medium text-mist">Prompt:</strong> Pick the theme that best matches the{" "}
            <em>main</em> harm or topic—not every detail has to fit perfectly.
          </>
        }
      >
        <Select
          id="category"
          name="category"
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value as StoryCategoryId | "")}
        >
          <option value="" disabled>
            Select a category
          </option>
          {STORY_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField
        id="postType"
        label="Post type"
        hint={
          <>
            <strong className="font-medium text-mist">Prompt:</strong> This helps readers know whether you’re
            documenting an event, asking for input, or sharing something that worked. It doesn’t change our
            moderation standards.
          </>
        }
      >
        <Select
          id="postType"
          name="postType"
          required
          value={postTypeId}
          onChange={(e) => setPostTypeId(e.target.value)}
        >
          <option value="" disabled>
            Select post type
          </option>
          {POST_TYPES.map((pt) => (
            <option key={pt.id} value={pt.id}>
              {pt.label}
            </option>
          ))}
        </Select>
        {postTypeDescription ? (
          <p className="text-xs text-mist" aria-live="polite">
            {postTypeDescription}
          </p>
        ) : (
          <p className="text-xs text-steel" aria-live="polite">
            Choose a type—we’ll show a short explanation here.
          </p>
        )}
      </FormField>

      <div className="space-y-3">
        <FormField
          id="body"
          label="Your story"
          hint={
            <>
              <strong className="font-medium text-mist">Write in your own voice.</strong> You don’t need perfect
              grammar—you need enough context that someone else can understand what happened without exposing more
              than you choose.
            </>
          }
        >
          <Card className="mb-3 border-rule/80 bg-panel/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-steel">
              Suggested structure
            </p>
            <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-xs leading-relaxed text-mist">
              <li>
                <strong className="text-paper">Context:</strong> Your role and setting in general terms (industry,
                team size, remote/on-site—not full employer name unless you accept the risk).
              </li>
              <li>
                <strong className="text-paper">What happened:</strong> Events in order. Use job titles (“a
                director”) instead of names when you can.
              </li>
              <li>
                <strong className="text-paper">What you did:</strong> Conversations, emails, reports, or boundaries
                you set.
              </li>
              <li>
                <strong className="text-paper">Outcome:</strong> What changed, what didn’t, or what’s ongoing.
              </li>
              <li>
                <strong className="text-paper">Optional:</strong> What you wish you’d known, or what might help
                someone in a similar spot.
              </li>
            </ol>
          </Card>
          <Textarea
            id="body"
            name="body"
            required
            minLength={MIN_STORY_BODY_LENGTH}
            rows={14}
            placeholder={
              "Context:\n…\n\nWhat happened:\n…\n\nWhat I tried:\n…\n\nOutcome:\n…"
            }
            onChange={(ev) => setStoryLen(ev.target.value.length)}
          />
          <p className="text-xs text-steel">
            {storyLen} / minimum {MIN_STORY_BODY_LENGTH} characters
          </p>
        </FormField>
      </div>

      <FormField
        id="tags"
        label="Tags (optional)"
        hint={
          <>
            <strong className="font-medium text-mist">Prompt:</strong> Short keywords that help others find patterns
            (e.g. <span className="text-mist">retaliation</span>, <span className="text-mist">documentation</span>).
            Separate with commas. No hashtags needed—we normalize for you.{" "}
            <span className="text-steel">Do not use real names as tags.</span>
          </>
        }
      >
        <Input
          id="tags"
          name="tags"
          autoComplete="off"
          placeholder="retaliation, documentation, scheduling"
        />
        {categoryId ? (
          <p className="mt-2 text-xs text-steel">
            Ideas for <span className="font-medium text-mist">{getCategoryLabel(categoryId)}</span>:{" "}
            {SUGGESTED_TAGS_BY_CATEGORY[categoryId].join(", ")}
          </p>
        ) : (
          <p className="mt-2 text-xs text-steel">Select a category above to see suggested tags.</p>
        )}
      </FormField>

      <FormField
        id="company"
        label="Company or organization (optional)"
        hint={
          <>
            <strong className="font-medium text-mist">Prompt:</strong> Only add this if naming the organization is
            worth the risk to you. Many people use sector + size instead (“mid-size logistics firm”).{" "}
            <span className="text-steel">Never include personal employee IDs or internal URLs.</span>
          </>
        }
      >
        <Input
          id="company"
          name="company"
          maxLength={200}
          placeholder="e.g. Regional healthcare provider (optional)"
          autoComplete="organization"
        />
      </FormField>

      <CheckboxField
        id="anonymous"
        name="anonymous"
        defaultChecked
        title="Post anonymously"
        description="Your display name stays hidden on this post. Moderators may still use account signals to enforce rules and prevent abuse."
      />

      <section className="space-y-2" aria-labelledby="evidence-heading">
        <h2 id="evidence-heading" className="text-sm font-medium text-paper">
          Evidence (optional)
        </h2>
        <p className="text-xs leading-relaxed text-steel">
          <strong className="text-mist">Prompt:</strong> Files can strengthen a story but may increase legal and
          privacy risk. Redact names and IDs in screenshots when possible. Do not upload material you don’t have
          rights to share.
        </p>
        <div className="rounded-xl border border-dashed border-rule bg-panel/30 px-4 py-8 text-center">
          <label htmlFor="evidence-files" className="cursor-not-allowed text-sm text-mist">
            File upload (coming soon)
          </label>
          <input
            id="evidence-files"
            name="evidence"
            type="file"
            disabled
            multiple
            className="mt-3 block w-full cursor-not-allowed text-xs text-steel file:mr-3 file:rounded-lg file:border file:border-rule file:bg-panel file:px-3 file:py-2 file:text-mist"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
          />
          <p className="mt-3 text-xs text-steel">
            Placeholder: secure storage, virus scanning, and redaction tools will be added before uploads go live.
          </p>
        </div>
      </section>

      <ExperienceDisclaimer variant="flow" />

      <CheckboxField
        id="consent"
        name="consent"
        checked={consent}
        onChange={(e) => setConsent(e.target.checked)}
        title="Consent & accuracy"
        description={
          <>
            I confirm this submission is my own experience or good-faith account, I have read the{" "}
            <Link href="/guidelines" className="font-medium text-signal hover:text-signal-hover">
              community guidelines
            </Link>{" "}
            and{" "}
            <Link href="/disclaimer" className="font-medium text-signal hover:text-signal-hover">
              disclaimer
            </Link>
            , and I understand Unmuted does not provide legal advice and may remove content that violates rules or
            puts people at risk.
          </>
        }
      />

      <div className="flex flex-col gap-3 border-t border-rule pt-6 sm:flex-row sm:items-center">
        <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
          {pending ? "Publishing…" : "Publish story"}
        </Button>
        <p className="text-xs text-steel">
          No account required—posts are public on this deployment. Add moderation and accounts when you scale.
        </p>
      </div>
    </form>
  );
}
