import Link from "next/link";
import { cn } from "@/lib/cn";
import type { AttendanceSessionListItem, LessonResponseDoc } from "./demo.types";
import { formatDate, safeString } from "./demo.utils";

export function DemoResponsesPanel(props: {
  items: LessonResponseDoc[];
  loading: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-600">Respostas recentes</div>
        <div className="mt-1 text-sm font-semibold text-slate-900">Últimas 20</div>
      </div>
      <div className="divide-y divide-slate-100">
        {props.items.map((d, idx) => (
          <div key={`${safeString(d.studentId)}-${safeString(d.lessonSlug)}-${idx}`} className="px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-slate-900">
                  {safeString(d.studentName) || safeString(d.studentId) || "Aluno"}
                </div>
                <div className="mt-1 text-xs font-semibold text-slate-600">
                  {safeString(d.lessonSlug) || "—"}
                  {d.completed ? " • completa" : " • parcial"}
                </div>
              </div>
              <div
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-xs font-extrabold ring-1",
                  d.completed
                    ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                    : "bg-slate-50 text-slate-700 ring-slate-200",
                )}
              >
                {d.completed ? "OK" : "—"}
              </div>
            </div>
          </div>
        ))}
        {!props.loading && props.items.length === 0 ? (
          <div className="px-5 py-6 text-sm text-slate-600">Nenhuma resposta ainda.</div>
        ) : null}
      </div>
      <div className="border-t border-slate-200 bg-white px-5 py-4">
        <Link href="/professor/respostas" className="text-sm font-bold text-sud-navy underline">
          Ver tudo
        </Link>
      </div>
    </div>
  );
}

export function DemoAttendancePanel(props: {
  items: AttendanceSessionListItem[];
  loading: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-600">Chamada (últimas sessões)</div>
        <div className="mt-1 text-sm font-semibold text-slate-900">Últimas 6</div>
      </div>
      <div className="divide-y divide-slate-100">
        {props.items.map((s) => (
          <div key={s.id} className="px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900">{formatDate(s.dateIso)}</div>
                <div className="mt-1 truncate text-xs font-semibold text-slate-600">
                  {s.lessonSlug ?? "(sem lição)"}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-xs font-extrabold text-slate-900">{s.presentCount} presentes</div>
                <div className="mt-1 text-xs font-semibold text-slate-600">{s.absentCount} faltas</div>
              </div>
            </div>
          </div>
        ))}
        {!props.loading && props.items.length === 0 ? (
          <div className="px-5 py-6 text-sm text-slate-600">Nenhuma sessão de chamada ainda.</div>
        ) : null}
      </div>
      <div className="border-t border-slate-200 bg-white px-5 py-4">
        <Link href="/admin/attendance" className="text-sm font-bold text-sud-navy underline">
          Abrir chamada
        </Link>
      </div>
    </div>
  );
}

