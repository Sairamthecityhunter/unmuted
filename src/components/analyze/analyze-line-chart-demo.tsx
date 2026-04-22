"use client";

import dynamic from "next/dynamic";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RechartsDevtools = dynamic(
  () => import("@recharts/devtools").then((mod) => mod.RechartsDevtools),
  { ssr: false },
);

const SAMPLE_DATA = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
] as const;

export type AnalyzeLineChartDemoProps = {
  isAnimationActive?: boolean;
};

/**
 * Recharts LineChart sample (Page A–G) on `/analyze`; Charts menu links to `#recharts-linechart`.
 */
export function AnalyzeLineChartDemo({ isAnimationActive = true }: AnalyzeLineChartDemoProps) {
  return (
    <section
      id="recharts-linechart"
      className="mt-14 scroll-mt-[5.5rem] border-t border-rule pt-10"
      aria-labelledby="analyze-line-demo-heading"
    >
      <header className="mb-6">
        <h2 id="analyze-line-demo-heading" className="text-sm font-semibold text-paper">
          Line chart (sample)
        </h2>
        <p className="mt-1 text-xs text-steel">
          Recharts demo data — <span className="text-mist">pv</span> and <span className="text-mist">uv</span>{" "}
          series. Devtools load in development only.
        </p>
      </header>
      <div className="min-w-0 rounded-xl border border-rule bg-panel/40 p-4">
        <LineChart
          style={{ width: "100%", maxWidth: "700px", maxHeight: "70vh", aspectRatio: 1.618 }}
          responsive
          data={[...SAMPLE_DATA]}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width="auto" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="pv"
            stroke="#8884d8"
            isAnimationActive={isAnimationActive}
          />
          <Line
            type="monotone"
            dataKey="uv"
            stroke="#82ca9d"
            isAnimationActive={isAnimationActive}
          />
          {process.env.NODE_ENV === "development" ? <RechartsDevtools /> : null}
        </LineChart>
      </div>
    </section>
  );
}
