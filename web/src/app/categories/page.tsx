import type { Metadata } from "next";
import Link from "next/link";

import { CategoryGrid } from "@/components/categories/category-grid";
import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse themes for workplace and society stories on Unmuted.",
};

export default function CategoriesPage() {
  return (
    <main className="py-10 sm:py-12 lg:py-14">
      <Container maxWidth="2xl" className="space-y-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <PageHeader
            title="Categories"
            description="Each theme helps readers find patterns—not just single posts. Open the feed to browse all stories, or start with a category that fits your experience."
          />
          <ButtonLink href="/feed" variant="secondary" className="shrink-0 self-start sm:self-auto">
            Open stories feed
          </ButtonLink>
        </div>

        <CategoryGrid />

        <p className="text-sm text-steel">
          Category filters in the feed will respect these themes when the data layer is
          connected. For now, all links go to the{" "}
          <Link href="/feed" className="font-medium text-signal hover:text-signal-hover">
            main feed
          </Link>
          .
        </p>
      </Container>
    </main>
  );
}
