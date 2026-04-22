"use client";

import dynamic from "next/dynamic";
import { useId, useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { CategoryDatum } from "@/lib/analytics/category-distribution";
import { sortDataForBarChart } from "@/lib/analytics/category-distribution";
import type { StoryCategoryId } from "@/lib/taxonomy/categories";
import { cn } from "@/lib/utils/cn";

const RechartsDevtools = dynamic(
  () => import("@recharts/devtools").then((mod) => mod.RechartsDevtools),
  { ssr: false },
);

const FILL: Record<StoryCategoryId, string> = {
  workplace: "#4da3ff",
  "company-culture": "#5ec8d3",
  "job-issues": "#a78bfa",
  society: "#7dd3a0",
  harassment: "#fb7185",
  discrimination: "#f2c14e",
  "mental-pressure": "#c084fc",
  "unfair-treatment": "#94a3b8",
};

type HomeAnalyticsSidebarProps = {
  data: CategoryDatum[];
  total: number;
  topLabel: string | null;
  /** Set false on `/analyze` to show only charts (no snapshot copy or section titles). @default true */
  showIntroAndCaptions?: boolean;
};

export function HomeAnalyticsSidebar({
  data,
  total,
  topLabel,
  showIntroAndCaptions = true,
}: HomeAnalyticsSidebarProps) {
  const gradientId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const countGrad = `areaCount-${gradientId}`;
  const shareGrad = `areaShare-${gradientId}`;

  const areaData = useMemo(
    () =>
      data.map((d) => ({
        name: d.shortLabel,
        count: d.count,
        share: d.share,
        fullLabel: d.label,
      })),
    [data],
  );

  const barSorted = sortDataForBarChart(data);
  const pieRows = data
    .filter((d) => d.count > 0)
    .map((d) => ({
      name: d.shortLabel,
      value: d.count,
      fill: FILL[d.id],
      share: d.share,
    }));

  return (
    <div className="space-y-8">
      {showIntroAndCaptions ? (
        <header>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">
            Data snapshot
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-mist">
            Live mix of stories on this site (demo seeds + community posts). Counts by theme help
            spot where people are posting most—<strong className="font-medium text-paper">not</strong>{" "}
            proof of how common issues are in the wider world.
          </p>
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between gap-4 border-b border-rule/60 pb-2">
              <dt className="text-steel">Stories in view</dt>
              <dd className="tabular-nums font-semibold text-paper">{total}</dd>
            </div>
            {topLabel ? (
              <div className="flex justify-between gap-4">
                <dt className="text-steel">Largest theme</dt>
                <dd className="text-right font-medium text-mist">{topLabel}</dd>
              </div>
            ) : null}
          </dl>
        </header>
      ) : null}

      <section
        id="recharts-barchart"
        className="scroll-mt-[5.5rem]"
        aria-label={showIntroAndCaptions ? undefined : "Stories by category"}
        aria-labelledby={showIntroAndCaptions ? "viz-bar-heading" : undefined}
      >
        {showIntroAndCaptions ? (
          <>
            <h3 id="viz-bar-heading" className="text-sm font-semibold text-paper">
              Stories by category
            </h3>
            <p className="mt-1 text-xs text-steel">Sorted by count (highest first).</p>
          </>
        ) : null}
        <div className={cn("h-[280px] w-full min-w-0", showIntroAndCaptions ? "mt-4" : "mt-0")}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barSorted}
              layout="vertical"
              margin={{ left: 4, right: 12, top: 4, bottom: 4 }}
            >
              <XAxis
                type="number"
                stroke="#6b7785"
                tick={{ fill: "#9aa7b6", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#243044" }}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="shortLabel"
                width={76}
                stroke="#6b7785"
                tick={{ fill: "#9aa7b6", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#243044" }}
              />
              <Tooltip
                cursor={{ fill: "rgba(77, 163, 255, 0.06)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  const row = payload[0].payload as CategoryDatum;
                  return (
                    <div className="rounded-lg border border-rule bg-panel px-3 py-2 text-xs shadow-lg">
                      <p className="font-semibold text-paper">{row.label}</p>
                      <p className="mt-1 text-mist">
                        <span className="tabular-nums text-paper">{row.count}</span> stories ·{" "}
                        <span className="tabular-nums">{row.share}%</span> of total
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={20}>
                {barSorted.map((row) => (
                  <Cell key={row.id} fill={FILL[row.id]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section
        id="recharts-areachart"
        className="scroll-mt-[5.5rem]"
        aria-label={showIntroAndCaptions ? undefined : "Trend across themes"}
        aria-labelledby={showIntroAndCaptions ? "viz-area-heading" : undefined}
      >
        {showIntroAndCaptions ? (
          <>
            <h3 id="viz-area-heading" className="text-sm font-semibold text-paper">
              Trend across themes
            </h3>
            <p className="mt-1 text-xs text-steel">
              Category order matches the site taxonomy (left → right). Blue: story count. Teal: % of
              all stories (right axis).
            </p>
          </>
        ) : null}
        <div className={cn("h-[280px] w-full min-w-0", showIntroAndCaptions ? "mt-4" : "mt-0")}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={areaData}
              margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
            >
              <defs>
                <linearGradient id={countGrad} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4da3ff" stopOpacity={0.85} />
                  <stop offset="95%" stopColor="#4da3ff" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id={shareGrad} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5ec8d3" stopOpacity={0.75} />
                  <stop offset="95%" stopColor="#5ec8d3" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#243044" />
              <XAxis
                dataKey="name"
                stroke="#6b7785"
                tick={{ fill: "#9aa7b6", fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "#243044" }}
                interval={0}
                angle={-35}
                textAnchor="end"
                height={56}
              />
              <YAxis
                yAxisId="left"
                stroke="#6b7785"
                tick={{ fill: "#9aa7b6", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#243044" }}
                allowDecimals={false}
                width={36}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#6b7785"
                tick={{ fill: "#9aa7b6", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#243044" }}
                domain={[0, "auto"]}
                width={36}
                label={{ value: "%", position: "insideTopRight", fill: "#6b7785", fontSize: 10 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  const row = payload[0].payload as {
                    fullLabel: string;
                    count: number;
                    share: number;
                  };
                  return (
                    <div className="rounded-lg border border-rule bg-panel px-3 py-2 text-xs shadow-lg">
                      <p className="font-semibold text-paper">{row.fullLabel}</p>
                      <p className="mt-1 text-mist">
                        <span className="tabular-nums text-paper">{row.count}</span> stories ·{" "}
                        <span className="tabular-nums">{row.share}%</span>
                      </p>
                    </div>
                  );
                }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="count"
                stroke="#4da3ff"
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#${countGrad})`}
                isAnimationActive
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="share"
                stroke="#5ec8d3"
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#${shareGrad})`}
                isAnimationActive
              />
              {process.env.NODE_ENV === "development" ? <RechartsDevtools /> : null}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section
        id="recharts-piechart"
        className="scroll-mt-[5.5rem]"
        aria-label={showIntroAndCaptions ? undefined : "Share of posts"}
        aria-labelledby={showIntroAndCaptions ? "viz-pie-heading" : undefined}
      >
        {showIntroAndCaptions ? (
          <>
            <h3 id="viz-pie-heading" className="text-sm font-semibold text-paper">
              Share of posts
            </h3>
            <p className="mt-1 text-xs text-steel">Only themes with at least one story.</p>
          </>
        ) : null}
        <div className={cn("h-[300px] w-full min-w-0", showIntroAndCaptions ? "mt-4" : "mt-0")}>
          {pieRows.length === 0 ? (
            <p className="flex h-full items-center justify-center text-sm text-steel">
              No stories to chart yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieRows}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="46%"
                  innerRadius={48}
                  outerRadius={76}
                  paddingAngle={1}
                  label={false}
                >
                  {pieRows.map((row) => (
                    <Cell key={row.name} fill={row.fill} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const p = payload[0].payload as {
                      name: string;
                      value: number;
                      share: number;
                    };
                    return (
                      <div className="rounded-lg border border-rule bg-panel px-3 py-2 text-xs shadow-lg">
                        <p className="font-semibold text-paper">{p.name}</p>
                        <p className="mt-1 text-mist">
                          <span className="tabular-nums text-paper">{p.value}</span> stories ·{" "}
                          <span className="tabular-nums">{p.share}%</span>
                        </p>
                      </div>
                    );
                  }}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }}
                  formatter={(value) => <span className="text-mist">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>
    </div>
  );
}
