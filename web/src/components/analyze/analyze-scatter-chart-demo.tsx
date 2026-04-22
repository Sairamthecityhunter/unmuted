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

const RechartsDevtools = dynamic(
  () => import("@recharts/devtools").then((mod) => mod.RechartsDevtools),
  { ssr: false },
);

const DATA_01 = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
] as const;

const DATA_02 = [
  { x: 200, y: 260, z: 240 },
  { x: 240, y: 290, z: 220 },
  { x: 190, y: 290, z: 250 },
  { x: 198, y: 250, z: 210 },
  { x: 180, y: 280, z: 260 },
  { x: 210, y: 220, z: 230 },
] as const;

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
          Two series (A school / B school). Devtools load in development only.
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
          <XAxis dataKey="x" type="number" name="stature" unit="cm" />
          <YAxis dataKey="y" type="number" name="weight" unit="kg" width="auto" />
          <ZAxis dataKey="z" type="number" range={[64, 144]} name="score" unit="km" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Legend />
          <Scatter
            name="A school"
            data={[...DATA_01]}
            fill="#8884d8"
            isAnimationActive={isAnimationActive}
          />
          <Scatter
            name="B school"
            data={[...DATA_02]}
            fill="#82ca9d"
            isAnimationActive={isAnimationActive}
          />
          {process.env.NODE_ENV === "development" ? <RechartsDevtools /> : null}
        </ScatterChart>
      </div>
    </section>
  );
}
