import type { ReactNode } from "react";

export function ChartCard(props: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-slate-600">{props.title}</div>
          {props.subtitle ? <div className="mt-1 text-sm font-semibold text-slate-900">{props.subtitle}</div> : null}
        </div>
        {props.right ? <div className="shrink-0">{props.right}</div> : null}
      </div>
      <div className="p-5">{props.children}</div>
    </div>
  );
}

