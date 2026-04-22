import type { SelectHTMLAttributes } from "react";

import { FORM_CONTROL_CLASS } from "@/lib/ui/form-control";
import { cn } from "@/lib/utils/cn";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select className={cn(FORM_CONTROL_CLASS, className)} {...props}>
      {children}
    </select>
  );
}
