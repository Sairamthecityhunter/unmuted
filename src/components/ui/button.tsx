import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ComponentProps,
} from "react";

import { cn } from "@/lib/utils/cn";

const baseClass =
  "inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary: "bg-signal text-ink hover:bg-signal-hover",
  secondary:
    "border border-rule bg-panel text-paper hover:border-mist hover:bg-panel/80",
  ghost: "text-mist hover:bg-panel hover:text-paper",
} as const;

export type ButtonVariant = keyof typeof variants;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(baseClass, variants[variant], className)}
      {...props}
    />
  );
}

export type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: ButtonVariant;
  className?: string;
};

export function ButtonLink({ variant = "primary", className, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn(baseClass, variants[variant], className)} {...props} />
  );
}

export type ButtonExternalLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "className"
> & {
  variant?: ButtonVariant;
  className?: string;
};

/** Same styles as {@link ButtonLink} for external URLs (e.g. Zoom / Meet). */
export function ButtonExternalLink({
  variant = "primary",
  className,
  ...props
}: ButtonExternalLinkProps) {
  return (
    <a className={cn(baseClass, variants[variant], className)} {...props} />
  );
}
