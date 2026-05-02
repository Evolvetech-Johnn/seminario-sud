import { cn } from "@/lib/cn";

export type BarDatum = { label: string; value: number };

function clamp01(v: number) {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

function clampInt(v: number) {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.floor(v));
}

export function SimpleBarChart(props: {
  data: BarDatum[];
  height?: number;
  valueFormat?: (v: number) => string;
  barClassName?: string;
}) {
  const h = clampInt(props.height ?? 160);
  const max = Math.max(1, ...props.data.map((d) => d.value));

  return (
    <div className="w-full">
      <div className="grid grid-cols-12 items-end gap-2" style={{ height: `${h}px` }}>
        {props.data.map((d, idx) => {
          const ratio = clamp01(d.value / max);
          const label = d.label;
          const val = props.valueFormat ? props.valueFormat(d.value) : String(d.value);
          return (
            <div key={`${label}-${idx}`} className="col-span-3 sm:col-span-2 lg:col-span-1">
              <div
                className={cn(
                  "w-full rounded-xl bg-sud-navy/90 ring-1 ring-slate-200",
                  props.barClassName,
                )}
                style={{ height: `${Math.max(6, Math.round(ratio * h))}px` }}
                title={`${label}: ${val}`}
              />
              <div className="mt-2 truncate text-center text-[11px] font-semibold text-slate-600" title={label}>
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

