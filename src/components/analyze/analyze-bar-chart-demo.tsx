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

import { UNMUTED_MONTHLY_ENGAGEMENT } from "@/lib/analyze/unmuted-chart-demo-data";

const RechartsDevtools = dynamic(
  () => import("@recharts/devtools").then((mod) => mod.RechartsDevtools),
  { ssr: false },
);

export type AnalyzeBarChartDemoProps = {
  isAnimationActive?: boolean;
};

/**
 * Vertical BarChart sample (monthly submissions vs Support reactions) on `/analyze`.
 * Charts menu live category bar: `#recharts-barchart`.
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
          Illustrative snapshot — <span className="text-mist">new submissions</span> per month and{" "}
          <span className="text-mist">Support</span> reactions (not live data). Devtools load in
          development only.
        </p>
      </header>
      <div className="min-w-0 rounded-xl border border-rule bg-panel/40 p-4">
        <BarChart
          style={{ width: "100%", maxWidth: "700px", maxHeight: "70vh", aspectRatio: 1.618 }}
          responsive
          data={[...UNMUTED_MONTHLY_ENGAGEMENT]}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width="auto" />
          <Tooltip />
          <Legend />
          <Bar dataKey="submissions" name="Submissions" fill="#5ec8d3" isAnimationActive={isAnimationActive} />
          <Bar dataKey="support" name="Support reactions" fill="#4da3ff" isAnimationActive={isAnimationActive} />
          {process.env.NODE_ENV === "development" ? <RechartsDevtools /> : null}
        </BarChart>
      </div>
    </section>
  );
}
