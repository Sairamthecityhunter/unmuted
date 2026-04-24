"use client";

import dynamic from "next/dynamic";
import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";

import { UNMUTED_RADAR_BY_THEME } from "@/lib/analyze/unmuted-chart-demo-data";

const RechartsDevtools = dynamic(
  () => import("@recharts/devtools").then((mod) => mod.RechartsDevtools),
  { ssr: false },
);

export type AnalyzeRadarChartDemoProps = {
  isAnimationActive?: boolean;
};

/**
 * Recharts RadarChart sample on `/analyze`; Charts menu links to `#recharts-radarchart`.
 */
export function AnalyzeRadarChartDemo({ isAnimationActive = true }: AnalyzeRadarChartDemoProps) {
  return (
    <section
      id="recharts-radarchart"
      className="mt-14 scroll-mt-[5.5rem] border-t border-rule pt-10"
      aria-labelledby="analyze-radar-heading"
    >
      <header className="mb-6">
        <h2 id="analyze-radar-heading" className="text-sm font-semibold text-paper">
          Radar chart (sample)
        </h2>
        <p className="mt-1 text-xs text-steel">
          Story activity by theme — <span className="text-mist">last 30 days</span> vs{" "}
          <span className="text-mist">prior 30 days</span> (illustrative). Devtools load in
          development only.
        </p>
      </header>
      <div className="flex min-h-[min(70vh,480px)] min-w-0 justify-center rounded-xl border border-rule bg-panel/40 p-4">
        <RadarChart
          style={{ width: "100%", maxWidth: "500px", maxHeight: "70vh", aspectRatio: 1 }}
          responsive
          data={[...UNMUTED_RADAR_BY_THEME]}
        >
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 150]} />
          <Radar
            name="Last 30 days"
            dataKey="recent"
            stroke="#4da3ff"
            fill="#4da3ff"
            fillOpacity={0.55}
            isAnimationActive={isAnimationActive}
          />
          <Radar
            name="Prior 30 days"
            dataKey="prior"
            stroke="#5ec8d3"
            fill="#5ec8d3"
            fillOpacity={0.45}
            isAnimationActive={isAnimationActive}
          />
          <Legend />
          {process.env.NODE_ENV === "development" ? <RechartsDevtools /> : null}
        </RadarChart>
      </div>
    </section>
  );
}
