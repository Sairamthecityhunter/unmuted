import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function CtaBand() {
  return (
    <section className="border-t border-rule py-16 sm:py-20">
      <Container maxWidth="lg">
        <div className="rounded-2xl border border-rule bg-panel/60 px-8 py-12 text-center sm:px-12">
          <h2 className="text-xl font-semibold tracking-tight text-paper sm:text-2xl">
            Your experience can help someone feel less alone.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-mist">
            Share on your own terms—or read what others have documented first.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/submit" className="min-h-12 px-8">
              Share Your Story
            </ButtonLink>
            <ButtonLink href="/feed" variant="secondary" className="min-h-12 px-8">
              Explore Stories
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
