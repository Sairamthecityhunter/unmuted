import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

const MAX_WIDTH = {
  /** Prose / forms (e.g. submit, legal copy) */
  sm: "max-w-2xl",
  /** Default reading width */
  md: "max-w-3xl",
  /** Feed, wider articles */
  lg: "max-w-4xl",
  /** Hero, marketing bands */
  xl: "max-w-5xl",
  /** Nav, footer, category grids */
  "2xl": "max-w-6xl",
} as const;

export type ContainerMaxWidth = keyof typeof MAX_WIDTH;

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "main" | "section";
  /** Max content width; default `md` (max-w-3xl). Override with `className` if needed. */
  maxWidth?: ContainerMaxWidth;
};

export function Container({
  as: Component = "div",
  maxWidth = "md",
  className,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        MAX_WIDTH[maxWidth],
        className,
      )}
      {...props}
    />
  );
}
