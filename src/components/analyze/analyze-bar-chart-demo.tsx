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

import type { MonthlyEngagementRow } from "@/lib/analyze/derive-live-chart-data";

const RechartsDevtools = dynamic(
  () => import("@recharts/devtools").then((mod) => mod.RechartsDevtools),
  { ssr: false },
);

export type AnalyzeBarChartDemoProps = {
  data: MonthlyEngagementRow[];
  isAnimationActive?: boolean;
};

/**
 * Vertical bar chart — monthly submissions vs Support totals (`/analyze` live demos).
 */
export function AnalyzeBarChartDemo({ data, isAnimationActive = true }: AnalyzeBarChartDemoProps) {
  return (
    <section
      id="recharts-barchart-sample"
      className="mt-14 scroll-mt-[5.5rem] border-t border-rule pt-10"
      aria-labelledby="analyze-bar-demo-heading"
    >
      <header className="mb-6">
        <h2 id="analyze-bar-demo-heading" className="text-sm font-semibold text-paper">
          Bar chart
        </h2>
        <p className="mt-1 text-xs text-steel">
          <span className="text-mist">Submissions</span> per month and total{" "}
          <span className="text-mist">Support</span> on stories first published that month.
        </p>
      </header>
      <div className="min-w-0 rounded-xl border border-rule bg-panel/40 p-4">
        <BarChart
          style={{ width: "100%", maxWidth: "700px", maxHeight: "70vh", aspectRatio: 1.618 }}
          responsive
          data={data}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width="auto" />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="submissions"
            name="Submissions"
            fill="#5ec8d3"
            isAnimationActive={isAnimationActive}
          />
          <Bar
            dataKey="support"
            name="Support reactions"
            fill="#4da3ff"
            isAnimationActive={isAnimationActive}
          />
          {process.env.NODE_ENV === "development" ? <RechartsDevtools /> : null}
        </BarChart>
      </div>
    </section>
  );
}
