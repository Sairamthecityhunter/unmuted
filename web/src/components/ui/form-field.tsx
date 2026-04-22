import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type FormFieldProps = {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
};

/**
 * Groups a label, optional hint, and control with consistent spacing.
 */
export function FormField({ id, label, hint, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="text-sm font-medium text-paper">
        {label}
      </label>
      {hint ? (
        <div className="text-xs leading-relaxed text-steel">{hint}</div>
      ) : null}
      {children}
    </div>
  );
}
