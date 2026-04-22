"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils/cn";

type ReactionKey = "support" | "relate" | "important";

const REACTIONS: { key: ReactionKey; label: string; hint: string }[] = [
  {
    key: "support",
    label: "Support",
    hint: "Show care for the person sharing— not a vote against anyone named in the story.",
  },
  {
    key: "relate",
    label: "I relate",
    hint: "A quiet signal that you have felt something similar. Avoid debating their facts here.",
  },
  {
    key: "important",
    label: "Important",
    hint: "This story taught you something or shifted how you see a problem.",
  },
];

type StoryReactionsClientProps = {
  storyId: string;
  initial: Record<ReactionKey, number>;
};

export function StoryReactionsClient({ storyId, initial }: StoryReactionsClientProps) {
  const router = useRouter();
  const [counts, setCounts] = useState(initial);

  async function bump(key: ReactionKey) {
    setCounts((c) => ({ ...c, [key]: c[key] + 1 }));
    try {
      const res = await fetch(`/api/stories/${encodeURIComponent(storyId)}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: key }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      /* offline — UI still shows local bump; refresh resyncs from server */
    }
  }

  return (
    <section
      className="rounded-xl border border-rule bg-panel/40 px-5 py-6"
      aria-label="Community reactions"
    >
      <h2 className="text-sm font-semibold text-paper">Community reactions</h2>
      <p className="mt-1 text-xs leading-relaxed text-steel">
        Taps are saved for this site so support can add up over time. In a full product, accounts
        would prevent brigading.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {REACTIONS.map(({ key, label, hint }) => (
          <button
            key={key}
            type="button"
            title={hint}
            onClick={() => void bump(key)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border border-rule bg-panel px-3 py-2.5 text-sm transition-colors",
              "hover:border-mist hover:bg-panel/90",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
            )}
          >
            <span className="font-medium text-paper">{label}</span>
            <span className="tabular-nums text-mist">{counts[key]}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
