import Link from "next/link";

import { Card } from "@/components/ui/card";
import { DISCLAIMER_SHORT_LEDE } from "@/lib/content/disclaimer";
import { cn } from "@/lib/utils/cn";

type ExperienceDisclaimerProps = {
  /** compact: inline text; panel: bordered card for page headers; flow: emphasized block inside forms */
  variant?: "compact" | "panel" | "flow";
  className?: string;
};

/**
 * Reusable notice that content is unverified user experience—not a formal accusation.
 */
export function ExperienceDisclaimer({
  variant = "compact",
  className,
}: ExperienceDisclaimerProps) {
  const link = (
    <Link
      href="/disclaimer"
      className="font-medium text-signal hover:text-signal-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal rounded-sm"
    >
      Full disclaimer
    </Link>
  );

  if (variant === "panel") {
    return (
      <Card className={cn("border-rule/80 bg-panel/60", className)}>
        <p className="text-xs font-semibold uppercase tracking-wide text-steel">
          Disclaimer
        </p>
        <p className="mt-2 text-sm leading-relaxed text-mist">{DISCLAIMER_SHORT_LEDE}</p>
        <p className="mt-3 text-sm text-steel">{link}.</p>
      </Card>
    );
  }

  if (variant === "flow") {
    return (
      <div
        className={cn(
          "rounded-xl border border-rule bg-panel/40 px-4 py-4 sm:px-5",
          className,
        )}
        role="note"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-steel">
          Before you submit
        </p>
        <p className="mt-2 text-sm leading-relaxed text-mist">{DISCLAIMER_SHORT_LEDE}</p>
        <p className="mt-2 text-xs leading-relaxed text-steel">
          By continuing, you acknowledge readers may not treat your post as verified fact. {link}.
        </p>
      </div>
    );
  }

  return (
    <p className={cn("text-xs leading-relaxed text-steel", className)}>
      {DISCLAIMER_SHORT_LEDE} <span className="text-mist">{link}.</span>
    </p>
  );
}
