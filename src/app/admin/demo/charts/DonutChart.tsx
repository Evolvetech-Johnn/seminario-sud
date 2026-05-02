import { formatPercent } from "../demo.utils";

function clamp01(v: number) {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

export function DonutChart(props: { value01: number; label: string; sublabel?: string }) {
  const v = clamp01(props.value01);
  const size = 160;
  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = v * c;
  const gap = c - dash;

  return (
    <div className="flex items-center gap-5">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-40 w-40" role="img">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className="stroke-slate-100"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className="stroke-sud-blue"
          fill="none"
          strokeDasharray={`${dash} ${gap}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        >
          <title>{`${props.label}: ${formatPercent(v)}`}</title>
        </circle>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-slate-900"
          fontSize="22"
          fontWeight="800"
        >
          {formatPercent(v)}
        </text>
      </svg>
      <div>
        <div className="text-sm font-extrabold text-slate-900">{props.label}</div>
        {props.sublabel ? <div className="mt-1 text-sm text-slate-600">{props.sublabel}</div> : null}
      </div>
    </div>
  );
}

