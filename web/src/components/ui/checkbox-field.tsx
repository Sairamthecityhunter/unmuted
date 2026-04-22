import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type CheckboxFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  title: ReactNode;
  description?: ReactNode;
};

export function CheckboxField({
  title,
  description,
  className,
  id,
  ...props
}: CheckboxFieldProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border border-rule bg-panel p-4",
        className,
      )}
    >
      <input
        id={id}
        type="checkbox"
        className="mt-1 size-4 shrink-0 rounded border-rule text-signal focus-visible:ring-2 focus-visible:ring-signal/40"
        {...props}
      />
      <span className="text-sm text-mist">
        <span className="font-medium text-paper">{title}</span>
        {description ? <span className="mt-1 block">{description}</span> : null}
      </span>
    </label>
  );
}
