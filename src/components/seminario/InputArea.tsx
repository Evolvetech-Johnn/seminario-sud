"use client";

import { cn } from "@/lib/cn";

type InputAreaProps = {
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
  placeholder?: string;
  rows?: number;
  tone?: "default" | "spiritual";
  className?: string;
};

export function InputArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  tone = "default",
  className,
}: InputAreaProps) {
  return (
    <label className={cn("block", className)}>
      <div className="text-sm font-semibold text-slate-900">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "mt-2 w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm leading-relaxed text-slate-900 shadow-sm outline-none transition focus:ring-4",
          tone === "spiritual"
            ? "border-sud-green/30 focus:border-sud-green/60 focus:ring-sud-green/15"
            : "border-slate-200 focus:border-sud-blue/60 focus:ring-sud-blue/15",
        )}
      />
    </label>
  );
}

