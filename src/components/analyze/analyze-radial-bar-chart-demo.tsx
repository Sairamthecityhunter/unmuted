"use client";

import dynamic from "next/dynamic";
import { Legend, RadialBar, RadialBarChart, Tooltip } from "recharts";

import { UNMUTED_RADIAL_SUPPORT_SHARE } from "@/lib/analyze/unmuted-chart-demo-data";

const RechartsDevtools = dynamic(
  () => import("@recharts/devtools").then((mod) => mod.RechartsDevtools),
  { ssr: false },
);

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
          Share of <span className="text-mist">Support</span> reactions by story theme (demo
          percentages, semicircle layout). Devtools load in development only.
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
          data={[...UNMUTED_RADIAL_SUPPORT_SHARE]}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            label={{ fill: "#94a3b8", position: "insideStart" }}
            background={{ fill: "rgba(148, 163, 184, 0.12)" }}
            dataKey="share"
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
