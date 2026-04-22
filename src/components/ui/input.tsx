import type { InputHTMLAttributes } from "react";

import { FORM_CONTROL_CLASS } from "@/lib/ui/form-control";
import { cn } from "@/lib/utils/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return <input className={cn(FORM_CONTROL_CLASS, className)} {...props} />;
}
