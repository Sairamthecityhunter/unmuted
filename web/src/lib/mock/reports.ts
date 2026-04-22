import type { ReportReason, ReportStatus } from "@/domain/enums";

/**
 * Demo moderation rows — join story title for admin UI. Replace with DB queries later.
 */
export type ModerationReportRow = {
  id: string;
  storyId: string;
  storyTitle: string;
  reason: ReportReason;
  status: ReportStatus;
  detailsPreview: string | null;
  createdAt: string;
  updatedAt: string;
  reporterLabel: string;
};

export const MOCK_MODERATION_REPORTS: ModerationReportRow[] = [
  {
    id: "rep-001",
    storyId: "st-07",
    storyTitle: "Client messages that crossed a line—and a boss who shrugged",
    reason: "harassment",
    status: "in_review",
    detailsPreview: "Concern that real client could be identified from industry label…",
    createdAt: "2026-04-13T09:00:00.000Z",
    updatedAt: "2026-04-13T14:00:00.000Z",
    reporterLabel: "Reporter · account hidden",
  },
  {
    id: "rep-002",
    storyId: "st-11",
    storyTitle: "Salary transparency chat got shut down in sixty seconds",
    reason: "false_information",
    status: "open",
    detailsPreview: "Alleges HR policy violation—needs context check only.",
    createdAt: "2026-04-13T11:30:00.000Z",
    updatedAt: "2026-04-13T11:30:00.000Z",
    reporterLabel: "Reporter · account hidden",
  },
  {
    id: "rep-003",
    storyId: "st-04",
    storyTitle: "When “culture fit” tracked with who played golf",
    reason: "hate_speech",
    status: "dismissed",
    detailsPreview: "No slurs found; reporter disagrees with critique of culture.",
    createdAt: "2026-04-12T08:15:00.000Z",
    updatedAt: "2026-04-12T16:00:00.000Z",
    reporterLabel: "Reporter · account hidden",
  },
  {
    id: "rep-004",
    storyId: "st-02",
    storyTitle: "On-call expectations with no rotation or pay clarity",
    reason: "spam",
    status: "resolved",
    detailsPreview: "Duplicate report; merged with prior ticket.",
    createdAt: "2026-04-11T19:00:00.000Z",
    updatedAt: "2026-04-11T20:10:00.000Z",
    reporterLabel: "Reporter · account hidden",
  },
  {
    id: "rep-005",
    storyId: "st-14",
    storyTitle: "Performance plan timing right after parental leave",
    reason: "personal_information",
    status: "in_review",
    detailsPreview: "Asks mod to check if dates could identify a specific site.",
    createdAt: "2026-04-10T07:45:00.000Z",
    updatedAt: "2026-04-10T12:00:00.000Z",
    reporterLabel: "Reporter · account hidden",
  },
  {
    id: "rep-006",
    storyId: "st-13",
    storyTitle: "The group chat jokes that stopped being jokes",
    reason: "harassment",
    status: "open",
    detailsPreview: "Bystander story—flagging for tone toward junior roles.",
    createdAt: "2026-04-14T10:00:00.000Z",
    updatedAt: "2026-04-14T10:00:00.000Z",
    reporterLabel: "Reporter · account hidden",
  },
];
