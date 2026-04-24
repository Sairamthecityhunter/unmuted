import type { StoryCategoryId } from "@/lib/taxonomy/categories";

/**
 * Illustrative numbers for Recharts demos on `/analyze`.
 * Not tied to live stories — labels and shape match how Unmuted talks about posts and reactions.
 */

export const UNMUTED_MONTHLY_ENGAGEMENT = [
  { name: "Jan", submissions: 14, support: 920, relate: 310 },
  { name: "Feb", submissions: 18, support: 1180, relate: 420 },
  { name: "Mar", submissions: 12, support: 890, relate: 360 },
  { name: "Apr", submissions: 22, support: 1520, relate: 510 },
  { name: "May", submissions: 16, support: 1210, relate: 440 },
  { name: "Jun", submissions: 20, support: 1380, relate: 490 },
  { name: "Jul", submissions: 24, support: 1650, relate: 550 },
] as const;

/** Theme fill colors aligned with `HomeAnalyticsSidebar` category palette. */
export const CATEGORY_FILL: Record<StoryCategoryId, string> = {
  workplace: "#4da3ff",
  "company-culture": "#5ec8d3",
  "job-issues": "#a78bfa",
  society: "#7dd3a0",
  harassment: "#fb7185",
  discrimination: "#f2c14e",
  "mental-pressure": "#c084fc",
  "unfair-treatment": "#94a3b8",
};

/** Nested pie — outer ring: coarse groupings readers recognize on Unmuted. */
export const UNMUTED_PIE_OUTER = [
  { name: "Work & roles", value: 36 },
  { name: "Culture & pressure", value: 28 },
  { name: "Bias & misconduct", value: 22 },
  { name: "Society & institutions", value: 14 },
] as const;

/** Inner ring: story themes (illustrative split). */
export const UNMUTED_PIE_INNER = [
  { name: "Workplace", value: 20 },
  { name: "Job issues", value: 16 },
  { name: "Company culture", value: 15 },
  { name: "Mental pressure", value: 13 },
  { name: "Harassment", value: 12 },
  { name: "Discrimination", value: 10 },
  { name: "Unfair treatment", value: 8 },
  { name: "Society", value: 14 },
] as const;

/** Radar — relative story activity by theme (two time windows, illustrative). */
export const UNMUTED_RADAR_BY_THEME = [
  { subject: "Workplace", recent: 118, prior: 96, fullMark: 150 },
  { subject: "Culture", recent: 92, prior: 88, fullMark: 150 },
  { subject: "Job issues", recent: 78, prior: 70, fullMark: 150 },
  { subject: "Harassment", recent: 64, prior: 72, fullMark: 150 },
  { subject: "Discrimination", recent: 58, prior: 52, fullMark: 150 },
  { subject: "Society", recent: 72, prior: 68, fullMark: 150 },
] as const;

/** Radial bars — share of Support reactions by theme (percent-style, demo only). */
export const UNMUTED_RADIAL_SUPPORT_SHARE = [
  { name: "Workplace", share: 26, fill: CATEGORY_FILL.workplace },
  { name: "Culture", share: 18, fill: CATEGORY_FILL["company-culture"] },
  { name: "Job issues", share: 14, fill: CATEGORY_FILL["job-issues"] },
  { name: "Mental pressure", share: 12, fill: CATEGORY_FILL["mental-pressure"] },
  { name: "Harassment", share: 10, fill: CATEGORY_FILL.harassment },
  { name: "Discrimination", share: 9, fill: CATEGORY_FILL.discrimination },
  { name: "Other themes", share: 11, fill: CATEGORY_FILL["unfair-treatment"] },
] as const;

/** Scatter — submissions vs Support vs Relate (two illustrative cohorts). */
export const UNMUTED_SCATTER_COMMUNITY = [
  { x: 12, y: 420, z: 150 },
  { x: 18, y: 610, z: 220 },
  { x: 15, y: 530, z: 190 },
  { x: 22, y: 780, z: 260 },
  { x: 10, y: 380, z: 130 },
  { x: 20, y: 690, z: 240 },
] as const;

export const UNMUTED_SCATTER_FEATURED = [
  { x: 8, y: 920, z: 310 },
  { x: 6, y: 740, z: 280 },
  { x: 11, y: 1050, z: 340 },
  { x: 9, y: 880, z: 300 },
  { x: 7, y: 690, z: 250 },
  { x: 10, y: 990, z: 320 },
] as const;
