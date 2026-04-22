import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "active" | "muted";
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium",
        variant === "default" &&
          "border-rule bg-panel text-mist",
        variant === "active" &&
          "border-signal/50 bg-signal/15 text-signal-hover",
        variant === "muted" && "border-transparent bg-panel/40 text-steel",
        className,
      )}
      {...props}
    />
  );
}
