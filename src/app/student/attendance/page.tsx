"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/cn";
import { useAuthStore } from "@/modules/auth/auth.store";
import {
  useAttendanceSession,
  useAttendanceSessions,
  useConfirmAttendance,
} from "@/modules/attendance/attendance.api";

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export default function StudentAttendancePage() {
  const router = useRouter();

  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);

  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const sessions = useAttendanceSessions(accessToken, todayIsoDate());
  const sessionId = useMemo(() => sessions.data?.sessions?.[0]?.id ?? null, [sessions.data?.sessions]);
  const sessionDetails = useAttendanceSession(accessToken, sessionId);
  const confirm = useConfirmAttendance(accessToken);

  const myRecord = useMemo(() => {
    const records = sessionDetails.data?.session.records ?? [];
    const id = user?.id ?? null;
    if (!id) return null;
    return records.find((r) => r.studentId === id) ?? null;
  }, [sessionDetails.data?.session.records, user?.id]);

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-sud-gray">
        <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="text-sm font-bold text-slate-900">Você precisa fazer login.</div>
            <div className="mt-3">
              <Link
                href="/student/login"
                className="inline-flex rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90"
              >
                Ir para login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sud-gray">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wide text-sud-navy">
              Seminário SUD
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Confirmar presença</h1>
            <div className="mt-2 text-sm text-slate-600">
              {user ? `Aluno: ${user.name}` : null}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              clearSession();
              router.push("/student/login");
            }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
          >
            Sair
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-bold text-slate-900">Chamada de hoje</div>
          <div className="mt-1 text-sm text-slate-600">{formatDate(todayIsoDate())}</div>

          {sessions.isLoading || sessionDetails.isLoading ? (
            <div className="mt-4 text-sm text-slate-600">Carregando…</div>
          ) : null}

          {!sessionId ? (
            <div className="mt-4 text-sm text-slate-600">Ainda não há chamada criada para hoje.</div>
          ) : null}

          {sessionId && myRecord?.present ? (
            <div className="mt-4 inline-flex rounded-full bg-sud-green/10 px-4 py-2 text-sm font-extrabold text-sud-green ring-1 ring-sud-green/20">
              Presença confirmada
            </div>
          ) : null}

          {sessionId && myRecord && !myRecord.present ? (
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
                  const result = await confirm.mutateAsync({ sessionId, code }).catch(() => null);
                  if (!result || (result as any).ok !== true) {
                    setMessage("Código inválido. Confirme com o professor.");
                    return;
                  }
                  setMessage("Presença confirmada.");
                  await sessionDetails.refetch().catch(() => null);
                }}
                className={cn(
                  "rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90 disabled:opacity-60",
                )}
              >
                {confirm.isPending ? "Confirmando..." : "Confirmar presença"}
              </button>
            </div>
          ) : null}

          {sessionId && !myRecord ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
              Seu usuário não está na lista da chamada. Peça para o professor te cadastrar.
            </div>
          ) : null}

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

