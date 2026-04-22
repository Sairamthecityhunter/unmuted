import { Container } from "@/components/ui/container";
import { HOME_MISSION } from "@/lib/content/home";

export function MissionSection() {
  return (
    <section className="border-b border-rule bg-panel/30 py-16 sm:py-20">
      <Container>
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">
          Mission
        </h2>
        <p className="mt-4 text-xl font-medium leading-snug tracking-tight text-paper sm:text-2xl sm:leading-snug">
          {HOME_MISSION}
        </p>
      </Container>
    </section>
  );
}
