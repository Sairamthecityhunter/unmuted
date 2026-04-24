"use client";

import dynamic from "next/dynamic";
import type { TooltipIndex } from "recharts";
import { Pie, PieChart, Tooltip } from "recharts";

import { UNMUTED_PIE_INNER, UNMUTED_PIE_OUTER } from "@/lib/analyze/unmuted-chart-demo-data";

const RechartsDevtools = dynamic(
  () => import("@recharts/devtools").then((mod) => mod.RechartsDevtools),
  { ssr: false },
);

export type AnalyzeNestedPieChartDemoProps = {
  isAnimationActive?: boolean;
  defaultIndex?: TooltipIndex;
};

/**
 * Two-level (nested) PieChart sample on `/analyze`; Charts menu links to `#recharts-nested-pie`.
 */
export function AnalyzeNestedPieChartDemo({
  isAnimationActive = true,
  defaultIndex,
}: AnalyzeNestedPieChartDemoProps) {
  return (
    <section
      id="recharts-nested-pie"
      className="mt-14 scroll-mt-[5.5rem] border-t border-rule pt-10"
      aria-labelledby="analyze-nested-pie-heading"
    >
      <header className="mb-6">
        <h2 id="analyze-nested-pie-heading" className="text-sm font-semibold text-paper">
          Nested pie chart (sample)
        </h2>
        <p className="mt-1 text-xs text-steel">
          Outer ring: broad story groupings on Unmuted. Inner ring: themes (illustrative counts).
          Devtools load in development only.
        </p>
      </header>
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
            data={[...UNMUTED_PIE_OUTER]}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius="50%"
            fill="#8884d8"
            isAnimationActive={isAnimationActive}
          />
          <Pie
            data={[...UNMUTED_PIE_INNER]}
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
    </section>
  );
}
