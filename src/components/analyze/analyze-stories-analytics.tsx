"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AnalyzeLiveChartDemos } from "@/components/analyze/analyze-live-chart-demos";
import { storiesFromApiJson } from "@/lib/analyze/normalize-api-stories";
import {
  buildAnalyzeStorySearchIndex,
  storyMatchesSearchForStory,
} from "@/lib/analyze/story-search-index";
import { computeCategoryDistribution } from "@/lib/analytics/category-distribution";
import type { Story } from "@/types/story";
import { cn } from "@/lib/utils/cn";

/** Recharts + ResponsiveContainer differ between SSR and client — load charts only in the browser. */
const HomeAnalyticsSidebarClient = dynamic(
  () =>
    import("@/components/home/home-analytics-sidebar").then((m) => m.HomeAnalyticsSidebar),
  {
    ssr: false,
    loading: () => (
      <div
        className="space-y-8 animate-pulse"
        aria-busy="true"
        aria-label="Loading charts"
      >
        <div className="h-[280px] rounded-xl bg-panel/40" />
        <div className="h-[280px] rounded-xl bg-panel/40" />
        <div className="h-[300px] rounded-xl bg-panel/40" />
      </div>
    ),
  },
);

type ApiStoriesResponse = { stories?: unknown };

const POLL_MS = 45_000;

export type AnalyzeStoriesAnalyticsProps = {
  initialStories: Story[];
};

export function AnalyzeStoriesAnalytics({ initialStories }: AnalyzeStoriesAnalyticsProps) {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [query, setQuery] = useState("");
  const [fetchError, setFetchError] = useState<string | null>(null);
  /** Avoid `Date` / locale formatting during SSR — they often mismatch the client. */
  const [clientClockMs, setClientClockMs] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/stories", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as ApiStoriesResponse;
      const list = storiesFromApiJson(json.stories);
      setStories(list);
      setClientClockMs(Date.now());
      setFetchError(null);
    } catch {
      setFetchError("Could not refresh stories.");
    }
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setClientClockMs(Date.now()));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const t = window.setInterval(refresh, POLL_MS);
    const onVis = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(t);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [refresh]);

  const filteredStories = useMemo(() => {
    const q = query.trim();
    if (!q) return stories;
    return stories.filter((s) => storyMatchesSearchForStory(s, q));
  }, [stories, query]);

  const filteredRecords = useMemo(
    () => buildAnalyzeStorySearchIndex(filteredStories),
    [filteredStories],
  );

  const chartInput = useMemo(
    () => filteredStories.map((s) => ({ category: s.category })),
    [filteredStories],
  );

  const { data, total, topLabel } = useMemo(
    () => computeCategoryDistribution(chartInput),
    [chartInput],
  );

  const shown = useMemo(() => filteredRecords.slice(0, 20), [filteredRecords]);
  const isFiltered = query.trim().length > 0;

  return (
    <>
      <section
        className="border-b border-rule pb-8"
        aria-labelledby="analyze-search-heading"
      >
        <h2 id="analyze-search-heading" className="sr-only">
          Search stories
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <label className="block min-w-0 flex-1">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-steel">
              Search stories
            </span>
            <span className="relative flex">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-steel"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.75}
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Title, body, category, company / organization, tags…"
                autoComplete="off"
                className={cn(
                  "w-full rounded-lg border border-rule bg-panel py-2.5 pl-10 pr-3 text-sm text-paper",
                  "placeholder:text-steel/80",
                  "focus:border-signal/50 focus:outline-none focus:ring-2 focus:ring-signal/25",
                )}
              />
            </span>
            <p className="mt-2 text-[11px] leading-relaxed text-steel">
              Type <span className="text-mist">company</span>,{" "}
              <span className="text-mist">organization</span>, or{" "}
              <span className="text-mist">org</span> alone to list stories that named an organization.
              Charts below follow your search.
            </p>
          </label>
          <div className="flex shrink-0 flex-col items-start gap-1 text-xs text-steel sm:items-end">
            <span className="tabular-nums text-mist">
              {stories.length} stor{stories.length === 1 ? "y" : "ies"}
              {isFiltered
                ? ` · ${filteredStories.length} in charts${filteredStories.length !== stories.length ? " (filtered)" : ""}`
                : ""}
            </span>
            <span
              className="text-[11px] text-steel/90"
              title={clientClockMs != null ? new Date(clientClockMs).toISOString() : undefined}
            >
              {clientClockMs != null ? (
                <>
                  Updated{" "}
                  {new Date(clientClockMs).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </>
              ) : (
                <>Updated —</>
              )}
            </span>
            {fetchError ? <span className="text-watch">{fetchError}</span> : null}
          </div>
        </div>

        {isFiltered ? (
          <div
            className="mt-4 max-h-[min(50vh,22rem)] overflow-y-auto rounded-lg border border-rule bg-panel/50"
            aria-label="Matching stories"
          >
            {shown.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-steel">
                No stories match that search.
              </p>
            ) : (
              <ul className="divide-y divide-rule/70">
                {shown.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/stories/${r.id}`}
                      className="block px-4 py-3 transition-colors hover:bg-ink/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-signal"
                    >
                      <span className="line-clamp-1 font-medium text-paper">{r.title}</span>
                      {r.company ? (
                        <span className="mt-0.5 block text-xs text-signal/90">{r.company}</span>
                      ) : null}
                      <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-steel">
                        <span>{r.categoryLabel}</span>
                        <span aria-hidden>·</span>
                        <time dateTime={r.createdAt}>
                          {new Date(r.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {filteredRecords.length > shown.length ? (
              <p className="border-t border-rule/70 px-4 py-2 text-center text-[11px] text-steel">
                Showing {shown.length} of {filteredRecords.length} matches. Refine your search to
                narrow results.
              </p>
            ) : null}
          </div>
        ) : null}
      </section>

      <div className="pt-10">
        {isFiltered ? (
          <p
            className="mb-6 rounded-lg border border-signal/25 bg-signal/5 px-3 py-2 text-xs text-mist"
            role="status"
          >
            Charts reflect <strong className="font-semibold text-paper">{total}</strong> stor
            {total === 1 ? "y" : "ies"} matching your search
            {total === 0 ? " — counts are zero until something matches." : "."}
          </p>
        ) : null}
        <HomeAnalyticsSidebarClient
          data={data}
          total={total}
          topLabel={topLabel}
          showIntroAndCaptions={false}
        />
      </div>

      <AnalyzeLiveChartDemos stories={filteredStories} />
    </>
  );
}
