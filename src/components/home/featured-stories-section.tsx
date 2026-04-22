import { StoryCard } from "@/components/story/story-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { Story } from "@/types/story";

type FeaturedStoriesSectionProps = {
  stories: Story[];
};

export function FeaturedStoriesSection({ stories }: FeaturedStoriesSectionProps) {
  const featured = stories.slice(0, 3);

  return (
    <section className="border-t border-rule bg-panel/20 py-16 sm:py-24">
      <Container maxWidth="2xl" className="space-y-10">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">
              Featured stories
            </h2>
            <p className="text-2xl font-semibold tracking-tight text-paper sm:text-3xl">
              Voices from the community
            </p>
            <p className="text-sm leading-relaxed text-mist">
              A mix of curated examples and real posts from the Share form on this site—visible
              to anyone who visits, wherever they are.
            </p>
          </div>
          <ButtonLink href="/feed" variant="secondary" className="shrink-0 self-start sm:self-auto">
            Explore Stories
          </ButtonLink>
        </div>

        <ul className="grid gap-6 lg:grid-cols-3">
          {featured.map((story) => (
            <li key={story.id}>
              <StoryCard story={story} className="h-full" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
