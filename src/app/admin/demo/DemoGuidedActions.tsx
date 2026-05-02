import { ClipboardCopy, Users } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { adminFetch, safeString } from "./demo.utils";

export function DemoGuidedActions(props: {
  onSessionChanged: () => Promise<void>;
}) {
  const [todayIso, setTodayIso] = useState(new Date().toISOString().slice(0, 10));
  const [createdSession, setCreatedSession] = useState<any>(null);

  const [confirmCode, setConfirmCode] = useState("");
  const [confirmMsg, setConfirmMsg] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [confirmPending, setConfirmPending] = useState(false);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-xs font-bold uppercase tracking-wide text-slate-600">Ações guiadas</div>
      <div className="mt-1 text-lg font-extrabold text-slate-900">Demonstração ao vivo</div>
      <div className="mt-2 text-sm text-slate-600">Crie a chamada do dia, copie um código e simule uma confirmação.</div>

      <div className="mt-5 grid gap-4">
        <label className="block">
          <div className="text-sm font-semibold text-slate-800">Dia da chamada</div>
          <input
            type="date"
            value={todayIso}
            onChange={(e) => setTodayIso(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-300"
          />
        </label>

        <button
          type="button"
          onClick={async () => {
            setConfirmMsg(null);
            setConfirmError(null);
            try {
              const res = await adminFetch<{ ok: true; data: { session: any; records: any[]; reused?: boolean } }>(
                "/api/admin/attendance/sessions",
                {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ dateIso: todayIso }),
                },
              );
              setCreatedSession(res.data);
              await props.onSessionChanged();
            } catch (err) {
              setConfirmError(err instanceof Error ? err.message : "Falha ao criar chamada");
            }
          }}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sud-blue px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sud-navy"
        >
          <Users className="h-4 w-4" />
          Criar/abrir chamada do dia
        </button>

        {createdSession?.records?.length ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-bold text-slate-900">Códigos gerados</div>
            <div className="mt-1 text-xs font-semibold text-slate-600">
              Sessão: {safeString(createdSession?.session?.id)}
            </div>
            <div className="mt-3 grid gap-2">
              {createdSession.records.slice(0, 5).map((r: any) => (
                <div
                  key={safeString(r.id)}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200"
                >
                  <div className="min-w-0">
                    <div className="truncate text-xs font-bold text-slate-900">{safeString(r.studentName)}</div>
                    <div className="mt-1 font-mono text-sm font-extrabold text-slate-900">{safeString(r.code)}</div>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      const code = safeString(r.code).trim();
                      if (!code) return;
                      setConfirmCode(code);
                      try {
                        await navigator.clipboard.writeText(code);
                      } catch {
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 transition hover:bg-slate-50"
                  >
                    <ClipboardCopy className="h-4 w-4" />
                    Copiar
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs font-semibold text-slate-600">Mostrando 5 alunos. Use a tela de chamada para ver todos.</div>
          </div>
        ) : null}

        <label className="block">
          <div className="text-sm font-semibold text-slate-800">Simular confirmação</div>
          <div className="mt-1 text-xs font-semibold text-slate-600">Cole um código e confirme como aluno.</div>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              value={confirmCode}
              onChange={(e) => setConfirmCode(e.target.value)}
              placeholder="Ex: K7Q2MD"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold tracking-wider outline-none focus:border-slate-300"
            />
            <button
              type="button"
              disabled={confirmPending}
              onClick={async () => {
                setConfirmPending(true);
                setConfirmMsg(null);
                setConfirmError(null);
                try {
                  const res = await adminFetch<{ ok: true; data: { studentName: string | null; alreadyConfirmed: boolean } }>(
                    "/api/attendance/confirm",
                    {
                      method: "POST",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify({ code: confirmCode, dateIso: todayIso }),
                    },
                  );
                  setConfirmMsg(
                    `${res.data.studentName ?? "Aluno"} confirmado${res.data.alreadyConfirmed ? " (já estava)" : ""}.`,
                  );
                  await props.onSessionChanged();
                } catch (err) {
                  setConfirmError(err instanceof Error ? err.message : "Falha ao confirmar");
                }
                setConfirmPending(false);
              }}
              className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60",
              )}
            >
              {confirmPending ? "Confirmando..." : "Confirmar"}
            </button>
          </div>
        </label>

        {confirmMsg ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
            {confirmMsg}
          </div>
        ) : null}
        {confirmError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
            {confirmError}
          </div>
        ) : null}
      </div>
    </div>
  );
}

