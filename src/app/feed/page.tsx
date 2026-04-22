import type { Metadata } from "next";

import { FeedBrowse } from "@/components/feed/feed-browse";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/container";
import { getAllStories } from "@/lib/stories-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stories",
  description: "Browse community stories about work, companies, and society.",
};

export default async function FeedPage() {
  const stories = await getAllStories();

  return (
    <main className="py-10 sm:py-12 lg:py-14">
      <Container maxWidth="lg" className="space-y-8">
        <PageHeader
          title="Stories"
          description="First-person experiences from the community—open to readers everywhere. Filter by theme. New posts from the Share form appear here for everyone once published (demo seed stories plus live submissions on this server)."
        />
        <FeedBrowse stories={stories} />
      </Container>
    </main>
  );
}
