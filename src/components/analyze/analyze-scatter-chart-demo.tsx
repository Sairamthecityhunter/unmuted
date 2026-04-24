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

import type { ScatterPoint } from "@/lib/analyze/derive-live-chart-data";

const RechartsDevtools = dynamic(
  () => import("@recharts/devtools").then((mod) => mod.RechartsDevtools),
  { ssr: false },
);

export type AnalyzeScatterChartDemoProps = {
  community: ScatterPoint[];
  featured: ScatterPoint[];
  isAnimationActive?: boolean;
};

export function AnalyzeScatterChartDemo({
  community,
  featured,
  isAnimationActive = true,
}: AnalyzeScatterChartDemoProps) {
  const empty = community.length === 0 && featured.length === 0;

  return (
    <section
      id="recharts-scatterchart"
      className="mt-14 scroll-mt-[5.5rem] border-t border-rule pt-10"
      aria-labelledby="analyze-scatter-heading"
    >
      <header className="mb-6">
        <h2 id="analyze-scatter-heading" className="text-sm font-semibold text-paper">
          Scatter chart
        </h2>
        <p className="mt-1 text-xs text-steel">
          Each point is one story: <span className="text-mist">Support</span> vs{" "}
          <span className="text-mist">Relate</span>; bubble size reflects Important + Relate
          engagement.
        </p>
      </header>
      {empty ? (
        <p className="rounded-xl border border-dashed border-rule bg-panel/30 px-6 py-10 text-center text-sm text-mist">
          No stories in this view yet.
        </p>
      ) : (
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
            <XAxis dataKey="x" type="number" name="Support" unit="" />
            <YAxis dataKey="y" type="number" name="Relate" unit="" width="auto" />
            <ZAxis dataKey="z" type="number" range={[64, 144]} name="Engagement" unit="" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend />
            {community.length > 0 ? (
              <Scatter
                name="Community posts"
                data={community}
                fill="#4da3ff"
                isAnimationActive={isAnimationActive}
              />
            ) : null}
            {featured.length > 0 ? (
              <Scatter
                name="Seed / featured"
                data={featured}
                fill="#5ec8d3"
                isAnimationActive={isAnimationActive}
              />
            ) : null}
            {process.env.NODE_ENV === "development" ? <RechartsDevtools /> : null}
          </ScatterChart>
        </div>
      )}
    </section>
  );
}
