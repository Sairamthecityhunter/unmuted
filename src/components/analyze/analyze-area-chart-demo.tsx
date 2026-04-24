"use client";

import dynamic from "next/dynamic";
import { useId } from "react";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

import { UNMUTED_MONTHLY_ENGAGEMENT } from "@/lib/analyze/unmuted-chart-demo-data";

const RechartsDevtools = dynamic(
  () => import("@recharts/devtools").then((mod) => mod.RechartsDevtools),
  { ssr: false },
);

export type AnalyzeAreaChartDemoProps = {
  isAnimationActive?: boolean;
};

/**
 * Recharts AreaChart sample (monthly Support vs submissions, gradients) on `/analyze`.
 */
export function AnalyzeAreaChartDemo({ isAnimationActive = true }: AnalyzeAreaChartDemoProps) {
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const colorSupport = `colorSupport-${rawId}`;
  const colorSubmissions = `colorSubmissions-${rawId}`;

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
          <span className="text-mist">Support</span> and{" "}
          <span className="text-mist">submissions</span> with gradients (illustrative). Devtools load
          in development only.
        </p>
      </header>
      <div className="min-w-0 rounded-xl border border-rule bg-panel/40 p-4">
        <AreaChart
          style={{ width: "100%", maxWidth: "700px", maxHeight: "70vh", aspectRatio: 1.618 }}
          responsive
          data={[...UNMUTED_MONTHLY_ENGAGEMENT]}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={colorSupport} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4da3ff" stopOpacity={0.85} />
              <stop offset="95%" stopColor="#4da3ff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id={colorSubmissions} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5ec8d3" stopOpacity={0.85} />
              <stop offset="95%" stopColor="#5ec8d3" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width="auto" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="support"
            name="Support reactions"
            stroke="#4da3ff"
            fillOpacity={1}
            fill={`url(#${colorSupport})`}
            isAnimationActive={isAnimationActive}
          />
          <Area
            type="monotone"
            dataKey="submissions"
            name="Submissions"
            stroke="#5ec8d3"
            fillOpacity={1}
            fill={`url(#${colorSubmissions})`}
            isAnimationActive={isAnimationActive}
          />
          {process.env.NODE_ENV === "development" ? <RechartsDevtools /> : null}
        </AreaChart>
      </div>
    </section>
  );
}
