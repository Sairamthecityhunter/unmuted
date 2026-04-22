import type { ReportReason } from "@/domain/enums";

/**
 * Report form options — keep aligned with {@link ReportReason} for DB enums.
 */
export const REPORT_REASON_OPTIONS: {
  value: ReportReason;
  label: string;
  description: string;
}[] = [
  {
    value: "harassment",
    label: "Harassment",
    description: "Targeting, intimidation, or abusive behavior toward a person or group.",
  },
  {
    value: "personal_information",
    label: "Personal information",
    description: "Private addresses, phone numbers, IDs, or other identifying details.",
  },
  {
    value: "hate_speech",
    label: "Hate speech",
    description: "Slurs, dehumanizing language, or attacks based on identity.",
  },
  {
    value: "false_information",
    label: "False information",
    description: "Claims that appear knowingly false and could cause serious harm.",
  },
  {
    value: "spam",
    label: "Spam",
    description: "Scams, ads, or repetitive promotional content.",
  },
  {
    value: "other",
    label: "Other",
    description: "Another guidelines issue—describe below.",
  },
];

export function getReportReasonLabel(reason: ReportReason): string {
  return REPORT_REASON_OPTIONS.find((o) => o.value === reason)?.label ?? reason;
}
