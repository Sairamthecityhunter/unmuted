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

import type { MonthlyEngagementRow } from "@/lib/analyze/derive-live-chart-data";

const RechartsDevtools = dynamic(
  () => import("@recharts/devtools").then((mod) => mod.RechartsDevtools),
  { ssr: false },
);

export type AnalyzeComposedChartDemoProps = {
  data: MonthlyEngagementRow[];
  isAnimationActive?: boolean;
};

export function AnalyzeComposedChartDemo({
  data,
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
          Composed chart
        </h2>
        <p className="mt-1 text-xs text-steel">
          Area <span className="text-mist">Relate</span>, bar{" "}
          <span className="text-mist">submissions</span>, line{" "}
          <span className="text-mist">Support</span> — monthly totals for stories posted that month.
        </p>
      </header>
      <div className="min-w-0 rounded-xl border border-rule bg-panel/40 p-4">
        <ComposedChart
          style={{ width: "100%", maxWidth: "700px", maxHeight: "70vh", aspectRatio: 1.618 }}
          responsive
          data={data}
        >
          <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width="auto" />
          <Legend />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="relate"
            name="Relate reactions"
            fill="#a78bfa"
            stroke="#a78bfa"
            isAnimationActive={isAnimationActive}
          />
          <Bar
            dataKey="submissions"
            name="Submissions"
            barSize={20}
            fill="#5ec8d3"
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
        </ComposedChart>
      </div>
    </section>
  );
}
