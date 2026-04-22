"use client";

import dynamic from "next/dynamic";
import { Legend, RadialBar, RadialBarChart, Tooltip } from "recharts";

const RechartsDevtools = dynamic(
  () => import("@recharts/devtools").then((mod) => mod.RechartsDevtools),
  { ssr: false },
);

const SAMPLE_DATA = [
  { name: "18-24", uv: 31.47, pv: 2400, fill: "#8884d8" },
  { name: "25-29", uv: 26.69, pv: 4567, fill: "#83a6ed" },
  { name: "30-34", uv: -15.69, pv: 1398, fill: "#8dd1e1" },
  { name: "35-39", uv: 8.22, pv: 9800, fill: "#82ca9d" },
  { name: "40-49", uv: -8.63, pv: 3908, fill: "#a4de6c" },
  { name: "50+", uv: -2.63, pv: 4800, fill: "#d0ed57" },
  { name: "unknown", uv: 6.67, pv: 4800, fill: "#ffc658" },
] as const;

export type AnalyzeRadialBarChartDemoProps = {
  isAnimationActive?: boolean;
};

/**
 * Recharts RadialBarChart sample on `/analyze`; Charts menu links to `#recharts-radialbarchart`.
 */
export function AnalyzeRadialBarChartDemo({
  isAnimationActive = true,
}: AnalyzeRadialBarChartDemoProps) {
  return (
    <section
      id="recharts-radialbarchart"
      className="mt-14 scroll-mt-[5.5rem] border-t border-rule pt-10"
      aria-labelledby="analyze-radial-bar-heading"
    >
      <header className="mb-6">
        <h2 id="analyze-radial-bar-heading" className="text-sm font-semibold text-paper">
          Radial bar chart (sample)
        </h2>
        <p className="mt-1 text-xs text-steel">
          Age-style bands, semicircle layout. Devtools load in development only.
        </p>
      </header>
      <div className="flex min-h-[min(70vh,380px)] min-w-0 justify-center rounded-xl border border-rule bg-panel/40 p-4">
        <RadialBarChart
          style={{ width: "100%", maxWidth: "500px", aspectRatio: 2 }}
          responsive
          innerRadius="10%"
          outerRadius="100%"
          cx="30%"
          cy="75%"
          data={[...SAMPLE_DATA]}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            label={{ fill: "#666", position: "insideStart" }}
            background
            dataKey="uv"
            isAnimationActive={isAnimationActive}
          />
          <Legend
            iconSize={10}
            width={120}
            height={140}
            layout="vertical"
            verticalAlign="middle"
            align="right"
          />
          <Tooltip />
          {process.env.NODE_ENV === "development" ? <RechartsDevtools /> : null}
        </RadialBarChart>
      </div>
    </section>
  );
}
