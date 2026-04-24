"use client";

import { useMemo } from "react";

import { AnalyzeAreaChartDemo } from "@/components/analyze/analyze-area-chart-demo";
import { AnalyzeBarChartDemo } from "@/components/analyze/analyze-bar-chart-demo";
import { AnalyzeComposedChartDemo } from "@/components/analyze/analyze-composed-chart-demo";
import { AnalyzeLineChartDemo } from "@/components/analyze/analyze-line-chart-demo";
import { AnalyzeNestedPieChartDemo } from "@/components/analyze/analyze-nested-pie-chart-demo";
import { AnalyzeRadialBarChartDemo } from "@/components/analyze/analyze-radial-bar-chart-demo";
import { AnalyzeRadarChartDemo } from "@/components/analyze/analyze-radar-chart-demo";
import { AnalyzeScatterChartDemo } from "@/components/analyze/analyze-scatter-chart-demo";
import {
  buildMonthlyEngagementSeries,
  buildNestedPieFromStories,
  buildRadarThemeComparison,
  buildRadialSupportShare,
  buildScatterByOrigin,
} from "@/lib/analyze/derive-live-chart-data";
import type { Story } from "@/types/story";

const POLL_SEC = 45;

export function AnalyzeLiveChartDemos({ stories }: { stories: Story[] }) {
  const monthly = useMemo(() => buildMonthlyEngagementSeries(stories), [stories]);
  const nested = useMemo(() => buildNestedPieFromStories(stories), [stories]);
  const radar = useMemo(() => buildRadarThemeComparison(stories), [stories]);
  const radial = useMemo(() => buildRadialSupportShare(stories), [stories]);
  const scatter = useMemo(() => buildScatterByOrigin(stories), [stories]);

  return (
    <div className="mt-12">
      <p className="max-w-2xl text-xs leading-relaxed text-steel">
        Additional chart views below use the{" "}
        <strong className="font-medium text-mist">same live stories</strong> as the category
        block — they follow your search and pick up new posts and reactions when this page
        refreshes (about every {POLL_SEC}s while the tab is open).
      </p>
      <AnalyzeBarChartDemo data={monthly} />
      <AnalyzeLineChartDemo data={monthly} />
      <AnalyzeAreaChartDemo data={monthly} />
      <AnalyzeComposedChartDemo data={monthly} />
      <AnalyzeNestedPieChartDemo outer={nested.outer} inner={nested.inner} />
      <AnalyzeRadarChartDemo data={radar} />
      <AnalyzeRadialBarChartDemo data={radial} />
      <AnalyzeScatterChartDemo community={scatter.community} featured={scatter.featured} />
    </div>
  );
}
