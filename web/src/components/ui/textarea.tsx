import type { TextareaHTMLAttributes } from "react";

import { FORM_CONTROL_CLASS } from "@/lib/ui/form-control";
import { cn } from "@/lib/utils/cn";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, rows = 4, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(FORM_CONTROL_CLASS, "min-h-[6rem] resize-y", className)}
      {...props}
    />
  );
}
