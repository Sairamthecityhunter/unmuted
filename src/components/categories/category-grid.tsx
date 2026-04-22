import Link from "next/link";

import { Card } from "@/components/ui/card";
import { STORY_CATEGORIES } from "@/lib/constants/categories";
import { CATEGORY_TAGLINES } from "@/lib/content/home";

export function CategoryGrid() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {STORY_CATEGORIES.map((cat) => (
        <li key={cat.id}>
          <Link
            href="/feed"
            className="group block h-full rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
          >
            <Card className="h-full transition-colors group-hover:border-mist/60 group-hover:bg-panel/80">
              <p className="font-medium text-paper group-hover:text-signal-hover">
                {cat.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-mist">
                {CATEGORY_TAGLINES[cat.id]}
              </p>
              <p className="mt-3 text-xs font-medium text-signal opacity-90 group-hover:opacity-100">
                View in feed →
              </p>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
