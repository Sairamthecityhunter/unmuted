"use client";

import dynamic from "next/dynamic";
import type { TooltipIndex } from "recharts";
import { Pie, PieChart, Tooltip } from "recharts";

import type { NestedPieSlice } from "@/lib/analyze/derive-live-chart-data";

const RechartsDevtools = dynamic(
  () => import("@recharts/devtools").then((mod) => mod.RechartsDevtools),
  { ssr: false },
);

export type AnalyzeNestedPieChartDemoProps = {
  outer: NestedPieSlice[];
  inner: NestedPieSlice[];
  isAnimationActive?: boolean;
  defaultIndex?: TooltipIndex;
};

export function AnalyzeNestedPieChartDemo({
  outer,
  inner,
  isAnimationActive = true,
  defaultIndex,
}: AnalyzeNestedPieChartDemoProps) {
  const empty = inner.length === 0 || outer.length === 0;

  return (
    <section
      id="recharts-nested-pie"
      className="mt-14 scroll-mt-[5.5rem] border-t border-rule pt-10"
      aria-labelledby="analyze-nested-pie-heading"
    >
      <header className="mb-6">
        <h2 id="analyze-nested-pie-heading" className="text-sm font-semibold text-paper">
          Nested pie chart
        </h2>
        <p className="mt-1 text-xs text-steel">
          Outer ring: broad groupings. Inner ring: story themes in your current view.
        </p>
      </header>
      {empty ? (
        <p className="rounded-xl border border-dashed border-rule bg-panel/30 px-6 py-10 text-center text-sm text-mist">
          No stories in this view yet — try clearing search or check back after new posts.
        </p>
      ) : (
        <div className="flex min-h-[min(80vh,520px)] min-w-0 justify-center rounded-xl border border-rule bg-panel/40 p-4">
          <PieChart
            style={{
              width: "100%",
              height: "100%",
              maxWidth: "500px",
              maxHeight: "80vh",
              aspectRatio: 1,
            }}
            responsive
          >
            <Pie
              data={outer}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius="50%"
              fill="#8884d8"
              isAnimationActive={isAnimationActive}
            />
            <Pie
              data={inner}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              fill="#82ca9d"
              label
              isAnimationActive={isAnimationActive}
            />
            <Tooltip defaultIndex={defaultIndex} />
            {process.env.NODE_ENV === "development" ? <RechartsDevtools /> : null}
          </PieChart>
        </div>
      )}
    </section>
  );
}
