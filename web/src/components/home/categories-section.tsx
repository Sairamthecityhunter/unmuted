import { CategoryGrid } from "@/components/categories/category-grid";
import { Container } from "@/components/ui/container";

export function CategoriesSection() {
  return (
    <section className="py-16 sm:py-24">
      <Container maxWidth="2xl" className="space-y-10">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">
            Categories
          </h2>
          <p className="text-2xl font-semibold tracking-tight text-paper sm:text-3xl">
            Explore by theme
          </p>
          <p className="text-mist">
            Stories are organized so patterns—across workplaces and society—are easier to
            see than isolated complaints.
          </p>
        </div>

        <CategoryGrid />
      </Container>
    </section>
  );
}
