"use client";

import dynamic from "next/dynamic";
import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";

const RechartsDevtools = dynamic(
  () => import("@recharts/devtools").then((mod) => mod.RechartsDevtools),
  { ssr: false },
);

const SAMPLE_DATA = [
  { subject: "Math", A: 120, B: 110, fullMark: 150 },
  { subject: "Chinese", A: 98, B: 130, fullMark: 150 },
  { subject: "English", A: 86, B: 130, fullMark: 150 },
  { subject: "Geography", A: 99, B: 100, fullMark: 150 },
  { subject: "Physics", A: 85, B: 90, fullMark: 150 },
  { subject: "History", A: 65, B: 85, fullMark: 150 },
] as const;

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
          Two series (A / B) by subject. Devtools load in development only.
        </p>
      </header>
      <div className="flex min-h-[min(70vh,480px)] min-w-0 justify-center rounded-xl border border-rule bg-panel/40 p-4">
        <RadarChart
          style={{ width: "100%", maxWidth: "500px", maxHeight: "70vh", aspectRatio: 1 }}
          responsive
          data={[...SAMPLE_DATA]}
        >
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 150]} />
          <Radar
            name="Mike"
            dataKey="A"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
            isAnimationActive={isAnimationActive}
          />
          <Radar
            name="Lily"
            dataKey="B"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.6}
            isAnimationActive={isAnimationActive}
          />
          <Legend />
          {process.env.NODE_ENV === "development" ? <RechartsDevtools /> : null}
        </RadarChart>
      </div>
    </section>
  );
}
