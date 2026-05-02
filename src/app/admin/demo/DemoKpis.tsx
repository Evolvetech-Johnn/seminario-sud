import type { ReactNode } from "react";

export function DemoKpiCard(props: {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
  accent?: "navy" | "blue" | "emerald" | "amber";
}) {
  const accent =
    props.accent === "emerald"
      ? "from-emerald-600/10 via-white to-white"
      : props.accent === "amber"
        ? "from-amber-500/10 via-white to-white"
        : props.accent === "navy"
          ? "from-sud-navy/10 via-white to-white"
          : "from-sud-blue/10 via-white to-white";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent}`} />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-wide text-slate-600">{props.label}</div>
          <div className="mt-2 truncate text-2xl font-extrabold tracking-tight text-slate-900">
            {props.value}
          </div>
          {props.hint ? <div className="mt-2 text-sm font-semibold text-slate-600">{props.hint}</div> : null}
        </div>
        <div className="shrink-0 rounded-2xl bg-white/70 p-3 ring-1 ring-slate-200">
          {props.icon}
        </div>
      </div>
    </div>
  );
}

