"use client";

import dynamic from "next/dynamic";
import type { TooltipIndex } from "recharts";
import { Pie, PieChart, Tooltip } from "recharts";

const RechartsDevtools = dynamic(
  () => import("@recharts/devtools").then((mod) => mod.RechartsDevtools),
  { ssr: false },
);

const DATA_OUTER = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
] as const;

const DATA_INNER = [
  { name: "A1", value: 100 },
  { name: "A2", value: 300 },
  { name: "B1", value: 100 },
  { name: "B2", value: 80 },
  { name: "B3", value: 40 },
  { name: "B4", value: 30 },
  { name: "B5", value: 50 },
  { name: "C1", value: 100 },
  { name: "C2", value: 200 },
  { name: "D1", value: 150 },
  { name: "D2", value: 50 },
] as const;

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
          Outer ring (groups) and inner ring (breakdown). Devtools load in development only.
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
            data={[...DATA_OUTER]}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius="50%"
            fill="#8884d8"
            isAnimationActive={isAnimationActive}
          />
          <Pie
            data={[...DATA_INNER]}
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
