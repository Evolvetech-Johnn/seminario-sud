import { CheckCircle2, XCircle } from "lucide-react";

export function DemoChecklistRow(props: { label: string; ok: boolean | null; detail?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="min-w-0">
        <div className="text-sm font-bold text-slate-900">{props.label}</div>
        {props.detail ? <div className="mt-1 text-xs font-semibold text-slate-600">{props.detail}</div> : null}
      </div>
      <div className="shrink-0">
        {props.ok === null ? (
          <div className="h-7 w-7 animate-pulse rounded-full bg-slate-200" />
        ) : props.ok ? (
          <CheckCircle2 className="h-7 w-7 text-emerald-600" />
        ) : (
          <XCircle className="h-7 w-7 text-rose-600" />
        )}
      </div>
    </div>
  );
}

