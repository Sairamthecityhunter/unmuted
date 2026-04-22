import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import type { ReportStatus } from "@/domain/enums";
import { getReportReasonLabel } from "@/lib/constants/report-reasons";
import { MOCK_MODERATION_REPORTS } from "@/lib/mock/reports";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "Moderation",
  description: "Review reported posts (demo queue).",
  robots: { index: false, follow: false },
};

function formatDt(iso: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const label: Record<ReportStatus, string> = {
    open: "Open",
    in_review: "In review",
    resolved: "Resolved",
    dismissed: "Dismissed",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold",
        status === "open" && "border-watch/45 bg-watch/15 text-watch",
        status === "in_review" && "border-signal/50 bg-signal/15 text-signal-hover",
        status === "resolved" && "border-emerald-500/35 bg-emerald-500/10 text-emerald-200/95",
        status === "dismissed" && "border-rule bg-panel/80 text-steel",
      )}
    >
      {label[status]}
    </span>
  );
}

export default function AdminModerationPage() {
  const sorted = [...MOCK_MODERATION_REPORTS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <main className="py-10 sm:py-12 lg:py-14">
      <Container maxWidth="xl" className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PageHeader
            title="Moderation queue"
            description="Reported posts and current status. This is a static demo—there is no authentication or live database. In production, restrict this route to moderators only."
          />
          <Link
            href="/feed"
            className="shrink-0 text-sm font-medium text-signal hover:text-signal-hover"
          >
            ← Back to stories
          </Link>
        </div>

        <Card className="border-watch/25 bg-watch/5 p-4">
          <p className="text-sm text-mist">
            <strong className="text-watch">Demo only:</strong> Actions (resolve, dismiss, open story) are not wired.
            Data is loaded from <code className="rounded bg-panel px-1 text-xs text-paper">MOCK_MODERATION_REPORTS</code>.
          </p>
        </Card>

        {/* Mobile: cards */}
        <ul className="space-y-4 md:hidden">
          {sorted.map((row) => (
            <li key={row.id}>
              <Card className="space-y-3 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="muted">{getReportReasonLabel(row.reason)}</Badge>
                  <ReportStatusBadge status={row.status} />
                </div>
                <p className="font-medium text-paper">
                  <Link
                    href={`/stories/${row.storyId}`}
                    className="hover:text-signal-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal rounded-sm"
                  >
                    {row.storyTitle}
                  </Link>
                </p>
                <p className="text-xs text-steel">
                  Report <span className="font-mono text-mist">{row.id}</span> ·{" "}
                  {formatDt(row.createdAt)}
                </p>
                {row.detailsPreview ? (
                  <p className="text-sm text-mist">{row.detailsPreview}</p>
                ) : null}
                <p className="text-xs text-steel">{row.reporterLabel}</p>
              </Card>
            </li>
          ))}
        </ul>

        {/* Desktop: table */}
        <div className="hidden overflow-x-auto rounded-xl border border-rule md:block">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-rule bg-panel/80 text-xs font-semibold uppercase tracking-wide text-steel">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Report
                </th>
                <th scope="col" className="px-4 py-3">
                  Post
                </th>
                <th scope="col" className="px-4 py-3">
                  Reason
                </th>
                <th scope="col" className="px-4 py-3">
                  Status
                </th>
                <th scope="col" className="px-4 py-3">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {sorted.map((row) => (
                <tr key={row.id} className="bg-panel/30 hover:bg-panel/50">
                  <td className="px-4 py-3 align-top">
                    <span className="font-mono text-xs text-mist">{row.id}</span>
                    <p className="mt-1 text-xs text-steel">{formatDt(row.createdAt)}</p>
                    <p className="mt-1 text-xs text-steel">{row.reporterLabel}</p>
                  </td>
                  <td className="max-w-[240px] px-4 py-3 align-top">
                    <Link
                      href={`/stories/${row.storyId}`}
                      className="font-medium text-paper hover:text-signal-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal rounded-sm"
                    >
                      {row.storyTitle}
                    </Link>
                    {row.detailsPreview ? (
                      <p className="mt-2 line-clamp-2 text-xs text-mist">{row.detailsPreview}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 align-top text-mist">
                    {getReportReasonLabel(row.reason)}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <ReportStatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3 align-top text-xs text-steel">
                    {formatDt(row.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </main>
  );
}
