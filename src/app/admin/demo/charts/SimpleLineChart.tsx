import { cn } from "@/lib/cn";

export type LineDatum = { label: string; value: number };

function clamp01(v: number) {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

export function SimpleLineChart(props: {
  data: LineDatum[];
  height?: number;
  strokeClassName?: string;
  fillClassName?: string;
}) {
  const height = Math.max(80, Math.floor(props.height ?? 140));
  const width = 600;
  const pad = 8;

  if (props.data.length === 0) {
    return <div className="h-40 rounded-2xl bg-slate-50 ring-1 ring-slate-200" />;
  }

  const values = props.data.map((d) => d.value);
  const max = Math.max(1, ...values);
  const min = Math.min(0, ...values);
  const denom = Math.max(1e-9, max - min);

  const points = props.data.map((d, idx) => {
    const t = props.data.length <= 1 ? 0 : idx / (props.data.length - 1);
    const x = pad + t * (width - pad * 2);
    const yNorm = 1 - clamp01((d.value - min) / denom);
    const y = pad + yNorm * (height - pad * 2);
    return { x, y, label: d.label, value: d.value };
  });

  const dPath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const fillPath = `${dPath} L ${(pad + (width - pad * 2)).toFixed(1)} ${(height - pad).toFixed(1)} L ${pad.toFixed(1)} ${(height - pad).toFixed(1)} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img">
        <path
          d={fillPath}
          className={cn("fill-sud-blue/10", props.fillClassName)}
        />
        <path
          d={dPath}
          className={cn("stroke-sud-blue", props.strokeClassName)}
          fill="none"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {points.map((p, idx) => (
          <g key={`${p.label}-${idx}`}>
            <circle cx={p.x} cy={p.y} r="4" className="fill-white stroke-sud-blue" strokeWidth="2">
              <title>{`${p.label}: ${p.value}`}</title>
            </circle>
          </g>
        ))}
      </svg>
      <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] font-semibold text-slate-600 sm:grid-cols-6">
        {props.data.slice(-6).map((d, idx) => (
          <div key={`${d.label}-${idx}`} className="truncate" title={`${d.label}: ${d.value}`}>
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}
