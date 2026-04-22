"use client";

import dynamic from "next/dynamic";
import { useId } from "react";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

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

export type AnalyzeAreaChartDemoProps = {
  isAnimationActive?: boolean;
};

/**
 * Recharts AreaChart sample (Page A–G, uv / pv gradients) on `/analyze`.
 * Charts menu: **AreaChart · sample** → `#recharts-areachart-sample` (live **AreaChart** → sidebar).
 */
export function AnalyzeAreaChartDemo({ isAnimationActive = true }: AnalyzeAreaChartDemoProps) {
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const colorUv = `colorUv-${rawId}`;
  const colorPv = `colorPv-${rawId}`;

  return (
    <section
      id="recharts-areachart-sample"
      className="mt-14 scroll-mt-[5.5rem] border-t border-rule pt-10"
      aria-labelledby="analyze-area-demo-heading"
    >
      <header className="mb-6">
        <h2 id="analyze-area-demo-heading" className="text-sm font-semibold text-paper">
          Area chart (sample)
        </h2>
        <p className="mt-1 text-xs text-steel">
          Recharts demo — <span className="text-mist">uv</span> and <span className="text-mist">pv</span>{" "}
          with gradients. Devtools load in development only.
        </p>
      </header>
      <div className="min-w-0 rounded-xl border border-rule bg-panel/40 p-4">
        <AreaChart
          style={{ width: "100%", maxWidth: "700px", maxHeight: "70vh", aspectRatio: 1.618 }}
          responsive
          data={[...SAMPLE_DATA]}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={colorUv} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id={colorPv} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width="auto" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="uv"
            stroke="#8884d8"
            fillOpacity={1}
            fill={`url(#${colorUv})`}
            isAnimationActive={isAnimationActive}
          />
          <Area
            type="monotone"
            dataKey="pv"
            stroke="#82ca9d"
            fillOpacity={1}
            fill={`url(#${colorPv})`}
            isAnimationActive={isAnimationActive}
          />
          {process.env.NODE_ENV === "development" ? <RechartsDevtools /> : null}
        </AreaChart>
      </div>
    </section>
  );
}
