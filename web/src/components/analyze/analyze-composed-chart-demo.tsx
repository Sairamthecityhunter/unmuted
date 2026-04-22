"use client";

import dynamic from "next/dynamic";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
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

export type AnalyzeComposedChartDemoProps = {
  isAnimationActive?: boolean;
};

/**
 * Recharts ComposedChart sample on `/analyze`; Charts menu links to `#recharts-composedchart`.
 */
export function AnalyzeComposedChartDemo({
  isAnimationActive = true,
}: AnalyzeComposedChartDemoProps) {
  return (
    <section
      id="recharts-composedchart"
      className="mt-14 scroll-mt-[5.5rem] border-t border-rule pt-10"
      aria-labelledby="analyze-composed-demo-heading"
    >
      <header className="mb-6">
        <h2 id="analyze-composed-demo-heading" className="text-sm font-semibold text-paper">
          Composed chart (sample)
        </h2>
        <p className="mt-1 text-xs text-steel">
          Area (<span className="text-mist">amt</span>), bar (<span className="text-mist">pv</span>
          ), and line (<span className="text-mist">uv</span>). Devtools load in development only.
        </p>
      </header>
      <div className="min-w-0 rounded-xl border border-rule bg-panel/40 p-4">
        <ComposedChart
          style={{ width: "100%", maxWidth: "700px", maxHeight: "70vh", aspectRatio: 1.618 }}
          responsive
          data={[...SAMPLE_DATA]}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" />
          <YAxis width="auto" />
          <Legend />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="amt"
            fill="#8884d8"
            stroke="#8884d8"
            isAnimationActive={isAnimationActive}
          />
          <Bar dataKey="pv" barSize={20} fill="#413ea0" isAnimationActive={isAnimationActive} />
          <Line
            type="monotone"
            dataKey="uv"
            stroke="#ff7300"
            isAnimationActive={isAnimationActive}
          />
          {process.env.NODE_ENV === "development" ? <RechartsDevtools /> : null}
        </ComposedChart>
      </div>
    </section>
  );
}
