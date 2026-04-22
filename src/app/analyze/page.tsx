import type { Metadata } from "next";

import { AnalyzeAreaChartDemo } from "@/components/analyze/analyze-area-chart-demo";
import { AnalyzeBarChartDemo } from "@/components/analyze/analyze-bar-chart-demo";
import { AnalyzeChartsMenu } from "@/components/analyze/analyze-charts-menu";
import { AnalyzeComposedChartDemo } from "@/components/analyze/analyze-composed-chart-demo";
import { AnalyzeLineChartDemo } from "@/components/analyze/analyze-line-chart-demo";
import { AnalyzeNestedPieChartDemo } from "@/components/analyze/analyze-nested-pie-chart-demo";
import { AnalyzeRadialBarChartDemo } from "@/components/analyze/analyze-radial-bar-chart-demo";
import { AnalyzeRadarChartDemo } from "@/components/analyze/analyze-radar-chart-demo";
import { AnalyzeScatterChartDemo } from "@/components/analyze/analyze-scatter-chart-demo";
import { AnalyzeStoriesAnalytics } from "@/components/analyze/analyze-stories-analytics";
import { buildAnalyzeStorySearchIndex } from "@/lib/analyze/story-search-index";
import { getAllStories } from "@/lib/stories-data";

export const metadata: Metadata = {
  title: "Analyze",
  description: "Category mix and share of stories on Unmuted — live counts from community posts.",
};

export const dynamic = "force-dynamic";

export default async function AnalyzePage() {
  const stories = await getAllStories();
  const searchIndex = buildAnalyzeStorySearchIndex(stories);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:max-w-4xl lg:py-14">
      <header className="flex flex-col gap-6 border-b border-rule pb-8 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-paper sm:text-3xl">Analyze</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist">
            Explore how stories cluster by theme. Counts update as people share — same snapshot as
            the home page sidebar, expanded for focus.
          </p>
        </div>
        <AnalyzeChartsMenu />
      </header>
      <div className="pt-8">
        <AnalyzeStoriesAnalytics initialRecords={searchIndex} />
      </div>
      <AnalyzeBarChartDemo />
      <AnalyzeLineChartDemo />
      <AnalyzeAreaChartDemo />
      <AnalyzeComposedChartDemo />
      <AnalyzeNestedPieChartDemo />
      <AnalyzeRadarChartDemo />
      <AnalyzeRadialBarChartDemo />
      <AnalyzeScatterChartDemo />
    </main>
  );
}
