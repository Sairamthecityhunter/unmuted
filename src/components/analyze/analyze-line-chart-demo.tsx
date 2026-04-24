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

import { UNMUTED_MONTHLY_ENGAGEMENT } from "@/lib/analyze/unmuted-chart-demo-data";

const RechartsDevtools = dynamic(
  () => import("@recharts/devtools").then((mod) => mod.RechartsDevtools),
  { ssr: false },
);

export type AnalyzeLineChartDemoProps = {
  isAnimationActive?: boolean;
};

/**
 * Recharts LineChart sample (monthly submissions vs Support) on `/analyze`.
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
          Same illustrative series as the bar sample —{" "}
          <span className="text-mist">submissions</span> and{" "}
          <span className="text-mist">Support</span> reactions. Devtools load in development only.
        </p>
      </header>
      <div className="min-w-0 rounded-xl border border-rule bg-panel/40 p-4">
        <LineChart
          style={{ width: "100%", maxWidth: "700px", maxHeight: "70vh", aspectRatio: 1.618 }}
          responsive
          data={[...UNMUTED_MONTHLY_ENGAGEMENT]}
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
            dataKey="submissions"
            name="Submissions"
            stroke="#5ec8d3"
            isAnimationActive={isAnimationActive}
          />
          <Line
            type="monotone"
            dataKey="support"
            name="Support reactions"
            stroke="#4da3ff"
            isAnimationActive={isAnimationActive}
          />
          {process.env.NODE_ENV === "development" ? <RechartsDevtools /> : null}
        </LineChart>
      </div>
    </section>
  );
}
