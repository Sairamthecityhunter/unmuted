import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StoryDetailView } from "@/components/story/story-detail-view";
import { Container } from "@/components/ui/container";
import { getCommentsForStory } from "@/lib/comments-data";
import { getStoryById } from "@/lib/stories-data";

export const dynamic = "force-dynamic";

type StoryDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: StoryDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const story = await getStoryById(id);
  if (!story) {
    return { title: "Story not found" };
  }
  return {
    title: story.title,
    description:
      story.body.slice(0, 155).replace(/\s+/g, " ").trim() + (story.body.length > 155 ? "…" : ""),
  };
}

export default async function StoryDetailPage({ params }: StoryDetailPageProps) {
  const { id } = await params;
  const story = await getStoryById(id);

  if (!story) {
    notFound();
  }

  const comments = await getCommentsForStory(story.id);

  return (
    <main className="py-10 sm:py-12 lg:py-14">
      <Container>
        <StoryDetailView story={story} comments={comments} />
      </Container>
    </main>
  );
}
