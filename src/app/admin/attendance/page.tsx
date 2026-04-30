"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/cn";
import {
  useAttendanceSession,
  useAttendanceSessions,
  useCreateAttendanceSession,
  useUpdateAttendanceRecord,
} from "@/modules/attendance/attendance.api";

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export default function AttendanceAdminPage() {
  const [selectedDate, setSelectedDate] = useState(todayIsoDate());
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const sessions = useAttendanceSessions(selectedDate);
  const createSession = useCreateAttendanceSession();
  const sessionDetails = useAttendanceSession(selectedSessionId);
  const updateRecord = useUpdateAttendanceRecord();

  const items = useMemo(() => sessions.data?.data ?? [], [sessions.data?.data]);

  const selected = useMemo(() => {
    const id = selectedSessionId ?? items[0]?.id ?? null;
    return id;
  }, [items, selectedSessionId]);

  return (
    <div className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lista de chamada</h1>
          <div className="mt-2 text-sm text-slate-600">
            Gere códigos individuais por aluno e confirme presença pelo código.
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-3">
        <div className="grid gap-2 sm:col-span-1">
          <label htmlFor="date" className="text-sm font-semibold text-slate-700">
            Dia da aula (chamada)
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedSessionId(null);
            }}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-400"
          />
        </div>

        <div className="flex items-end sm:col-span-2">
          <button
            type="button"
            disabled={createSession.isPending}
            onClick={async () => {
              const created = await createSession.mutateAsync({ dateIso: selectedDate }).catch(() => null);
              const id = (created as any)?.data?.session?.id ?? null;
              if (id) setSelectedSessionId(id);
            }}
            className="w-full rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90 disabled:opacity-60"
          >
            {createSession.isPending ? "Gerando..." : "Gerar códigos da chamada"}
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-600">
            Chamadas do dia
          </div>

          {sessions.isLoading ? <div className="px-4 py-4 text-sm text-slate-600">Carregando…</div> : null}
          {sessions.isError ? <div className="px-4 py-4 text-sm text-rose-700">Falha ao carregar.</div> : null}

          <div className="divide-y divide-slate-100">
            {items.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSessionId(s.id)}
                className={cn(
                  "w-full px-4 py-4 text-left transition hover:bg-slate-50",
                  selected === s.id && "bg-slate-50",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900">{formatDate(s.dateIso)}</div>
                    <div className="mt-1 text-xs font-semibold text-slate-600">
                      {s.presentCount} presentes • {s.absentCount} faltas
                    </div>
                  </div>
                  <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-700 ring-1 ring-slate-200">
                    {s.totalStudents}
                  </div>
                </div>
              </button>
            ))}

            {!sessions.isLoading && items.length === 0 ? (
              <div className="px-4 py-6 text-sm text-slate-600">Nenhuma chamada criada nesse dia.</div>
            ) : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-600">Detalhes</div>
            <div className="mt-1 text-sm font-bold text-slate-900">
              {selected ? `Sessão: ${selected}` : "Selecione uma sessão"}
            </div>
          </div>

          {selected ? (
            <>
              {sessionDetails.isLoading ? (
                <div className="px-4 py-6 text-sm text-slate-600">Carregando…</div>
              ) : null}
              {sessionDetails.isError ? (
                <div className="px-4 py-6 text-sm text-rose-700">Falha ao carregar detalhes.</div>
              ) : null}

              {sessionDetails.data?.data ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-white">
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
                          Aluno
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
                          Código (individual)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessionDetails.data.data.records.map((r) => (
                        <tr key={r.id} className="border-b border-slate-100">
                          <td className="px-4 py-4">
                            <div className="text-sm font-bold text-slate-900">{r.studentName}</div>
                            <div className="mt-1 text-xs font-semibold text-slate-600">{r.studentEmail ?? "—"}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="inline-flex rounded-xl bg-slate-900 px-3 py-1.5 font-mono text-sm font-extrabold text-white">
                              {r.code}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div
                              className={cn(
                                "inline-flex rounded-full px-3 py-1 text-xs font-extrabold ring-1",
                                r.present
                                  ? "bg-sud-green/10 text-sud-green ring-sud-green/20"
                                  : "bg-rose-50 text-rose-800 ring-rose-200",
                              )}
                            >
                              {r.present ? "Presente" : "Falta"}
                            </div>
                            <div className="mt-2">
                              <button
                                type="button"
                                disabled={updateRecord.isPending}
                                onClick={async () => {
                                  await updateRecord
                                    .mutateAsync({
                                      recordId: r.id,
                                      present: !r.present,
                                      sessionId: sessionDetails.data?.data?.session?.id ?? "",
                                    })
                                    .catch(() => null);
                                }}
                                className={cn(
                                  "rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 transition hover:bg-slate-50 disabled:opacity-60",
                                )}
                              >
                                {updateRecord.isPending
                                  ? "Salvando..."
                                  : r.present
                                    ? "Marcar falta"
                                    : "Marcar presente"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </>
          ) : (
            <div className="px-4 py-6 text-sm text-slate-600">Crie/seleciona uma chamada.</div>
          )}
        </div>
      </div>
    </div>
  );
}
