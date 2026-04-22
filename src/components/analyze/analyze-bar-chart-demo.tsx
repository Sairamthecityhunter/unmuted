"use client";

import dynamic from "next/dynamic";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RechartsDevtools = dynamic(
  () => import("@recharts/devtools").then((mod) => mod.RechartsDevtools),
  { ssr: false },
);

const SAMPLE_DATA = [
  { name: "Page A", uv: 4000, pv: 2400 },
  { name: "Page B", uv: 3000, pv: 1398 },
  { name: "Page C", uv: 2000, pv: 9800 },
  { name: "Page D", uv: 2780, pv: 3908 },
  { name: "Page E", uv: 1890, pv: 4800 },
  { name: "Page F", uv: 2390, pv: 3800 },
  { name: "Page G", uv: 3490, pv: 4300 },
] as const;

export type AnalyzeBarChartDemoProps = {
  isAnimationActive?: boolean;
};

/**
 * Vertical BarChart sample (Page A–G, pv / uv) on `/analyze`.
 * Charts menu: **BarChart · sample** → `#recharts-barchart-sample` (live **BarChart** → sidebar).
 */
export function AnalyzeBarChartDemo({ isAnimationActive = true }: AnalyzeBarChartDemoProps) {
  return (
    <section
      id="recharts-barchart-sample"
      className="mt-14 scroll-mt-[5.5rem] border-t border-rule pt-10"
      aria-labelledby="analyze-bar-demo-heading"
    >
      <header className="mb-6">
        <h2 id="analyze-bar-demo-heading" className="text-sm font-semibold text-paper">
          Bar chart (sample)
        </h2>
        <p className="mt-1 text-xs text-steel">
          Recharts demo — <span className="text-mist">pv</span> and <span className="text-mist">uv</span>{" "}
          by page. Devtools load in development only.
        </p>
      </header>
      <div className="min-w-0 rounded-xl border border-rule bg-panel/40 p-4">
        <BarChart
          style={{ width: "100%", maxWidth: "700px", maxHeight: "70vh", aspectRatio: 1.618 }}
          responsive
          data={[...SAMPLE_DATA]}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width="auto" />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#8884d8" isAnimationActive={isAnimationActive} />
          <Bar dataKey="uv" fill="#82ca9d" isAnimationActive={isAnimationActive} />
          {process.env.NODE_ENV === "development" ? <RechartsDevtools /> : null}
        </BarChart>
      </div>
    </section>
  );
}
