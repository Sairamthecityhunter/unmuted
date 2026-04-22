import { CategoriesSection } from "@/components/home/categories-section";
import { CtaBand } from "@/components/home/cta-band";
import { FeaturedStoriesSection } from "@/components/home/featured-stories-section";
import { HeroSection } from "@/components/home/hero-section";
import { HomeAnalyticsSidebar } from "@/components/home/home-analytics-sidebar";
import { MissionSection } from "@/components/home/mission-section";
import { computeCategoryDistribution } from "@/lib/analytics/category-distribution";
import { getAllStories } from "@/lib/stories-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const stories = await getAllStories();
  const { data, total, topLabel } = computeCategoryDistribution(stories);

  return (
    <main>
      <HeroSection />
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_min(20rem,100%)] xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="min-w-0">
          <MissionSection />
          <CategoriesSection />
          <FeaturedStoriesSection stories={stories} />
          <CtaBand />
        </div>
        <aside
          className="border-t border-rule bg-panel/25 px-4 py-10 sm:px-6 lg:border-t-0 lg:border-l lg:border-rule lg:px-5 lg:py-12 xl:px-6 xl:py-14"
          aria-label="Story category analytics"
        >
          <div className="lg:sticky lg:top-[5.5rem] lg:max-h-[calc(100dvh-5.5rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
            <HomeAnalyticsSidebar data={data} total={total} topLabel={topLabel} />
          </div>
        </aside>
      </div>
    </main>
  );
}
