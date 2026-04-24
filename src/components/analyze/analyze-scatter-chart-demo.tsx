"use client";

import dynamic from "next/dynamic";
import {
  CartesianGrid,
  Legend,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import { UNMUTED_SCATTER_COMMUNITY, UNMUTED_SCATTER_FEATURED } from "@/lib/analyze/unmuted-chart-demo-data";

const RechartsDevtools = dynamic(
  () => import("@recharts/devtools").then((mod) => mod.RechartsDevtools),
  { ssr: false },
);

export type AnalyzeScatterChartDemoProps = {
  isAnimationActive?: boolean;
};

/**
 * Recharts ScatterChart sample on `/analyze`; Charts menu links to `#recharts-scatterchart`.
 */
export function AnalyzeScatterChartDemo({ isAnimationActive = true }: AnalyzeScatterChartDemoProps) {
  return (
    <section
      id="recharts-scatterchart"
      className="mt-14 scroll-mt-[5.5rem] border-t border-rule pt-10"
      aria-labelledby="analyze-scatter-heading"
    >
      <header className="mb-6">
        <h2 id="analyze-scatter-heading" className="text-sm font-semibold text-paper">
          Scatter chart (sample)
        </h2>
        <p className="mt-1 text-xs text-steel">
          Each point: monthly <span className="text-mist">submissions</span>,{" "}
          <span className="text-mist">Support</span> reactions, and{" "}
          <span className="text-mist">Relate</span> (bubble size). Two illustrative cohorts. Devtools
          load in development only.
        </p>
      </header>
      <div className="min-w-0 rounded-xl border border-rule bg-panel/40 p-4">
        <ScatterChart
          style={{ width: "100%", maxWidth: "700px", maxHeight: "70vh", aspectRatio: 1.618 }}
          responsive
          margin={{
            top: 20,
            right: 20,
            bottom: 10,
            left: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" type="number" name="Submissions" unit=" posts" />
          <YAxis dataKey="y" type="number" name="Support" unit="" width="auto" />
          <ZAxis dataKey="z" type="number" range={[64, 144]} name="Relate" unit="" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Legend />
          <Scatter
            name="Community posts"
            data={[...UNMUTED_SCATTER_COMMUNITY]}
            fill="#4da3ff"
            isAnimationActive={isAnimationActive}
          />
          <Scatter
            name="Featured / seed stories"
            data={[...UNMUTED_SCATTER_FEATURED]}
            fill="#5ec8d3"
            isAnimationActive={isAnimationActive}
          />
          {process.env.NODE_ENV === "development" ? <RechartsDevtools /> : null}
        </ScatterChart>
      </div>
    </section>
  );
}
