"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import { useConfirmAttendance } from "@/modules/attendance/attendance.api";

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export default function StudentAttendancePage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const confirm = useConfirmAttendance();

  return (
    <div className="min-h-screen bg-sud-gray">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wide text-sud-navy">Seminário SUD</div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Confirmar presença</h1>
          <div className="mt-2 text-sm text-slate-600">
            Digite o seu código individual gerado pelo professor.
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-bold text-slate-900">Chamada de hoje</div>
          <div className="mt-1 text-sm text-slate-600">{formatDate(todayIsoDate())}</div>

          <div className="mt-6 grid gap-3">
            <label htmlFor="code" className="text-sm font-semibold text-slate-700">
              Código individual
            </label>
            <input
              id="code"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ex: A1B2C3"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold uppercase tracking-wider outline-none focus:border-slate-400"
            />
            <button
              type="button"
              disabled={confirm.isPending}
              onClick={async () => {
                setMessage(null);
                const result = await confirm.mutateAsync({ code, dateIso: todayIsoDate() }).catch(() => null);
                if (!result || (result as any).ok !== true) {
                  setMessage("Código inválido ou não existe chamada hoje.");
                  return;
                }
                const name = (result as any)?.data?.studentName ?? null;
                setMessage(name ? `Presença confirmada: ${name}` : "Presença confirmada.");
              }}
              className={cn(
                "rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90 disabled:opacity-60",
              )}
            >
              {confirm.isPending ? "Confirmando..." : "Confirmar presença"}
            </button>
          </div>

          {message ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800">
              {message}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
