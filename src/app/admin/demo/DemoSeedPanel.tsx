import { Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import type { StudentDoc } from "./demo.types";
import { DemoChecklistRow } from "./DemoChecklist";
import { adminFetch, formatPercent } from "./demo.utils";

export function DemoSeedPanel(props: {
  pending: boolean;
  setPending: (v: boolean) => void;
  message: string | null;
  setMessage: (v: string | null) => void;
  error: string | null;
  setError: (v: string | null) => void;
  onSeedCompleted: () => Promise<void>;
  checklist: {
    totalStudents: number | null;
    sessionCount: number | null;
    avgProgress: number | null;
    hasStudents: boolean | null;
    hasSessions: boolean | null;
    hasResponses: boolean;
    hasProgress: boolean | null;
    completedCount: number;
  };
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-xs font-bold uppercase tracking-wide text-slate-600">Seed para apresentação</div>
      <div className="mt-1 text-lg font-extrabold text-slate-900">Criar dados realistas</div>
      <div className="mt-2 text-sm text-slate-600">
        Cria 5 alunos + presenças + respostas para alimentar o dashboard.
      </div>

      {props.message ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
          {props.message}
        </div>
      ) : null}
      {props.error ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          {props.error}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={props.pending}
          onClick={async () => {
            props.setPending(true);
            props.setError(null);
            props.setMessage(null);
            try {
              const res = await adminFetch<{
                ok: true;
                data: { teacher: { email: string; password: string }; students: StudentDoc[] };
              }>("/api/admin/demo/seed", { method: "POST" });

              props.setMessage(
                `Seed concluído. Professor: ${res.data.teacher.email} (senha: ${res.data.teacher.password}).`,
              );
              await props.onSeedCompleted();
            } catch (err) {
              props.setError(err instanceof Error ? err.message : "Falha ao seedar");
            }
            props.setPending(false);
          }}
          className={cn(
            "inline-flex items-center gap-2 rounded-2xl bg-sud-navy px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sud-navy/90 disabled:opacity-60",
          )}
        >
          <Sparkles className="h-4 w-4" />
          {props.pending ? "Seedando..." : "Rodar seed demo"}
        </button>
        <div className="text-xs font-semibold text-slate-600">Use antes da apresentação.</div>
      </div>

      <div className="mt-6 grid gap-3">
        <DemoChecklistRow
          label="5 alunos cadastrados"
          ok={props.checklist.hasStudents}
          detail={props.checklist.totalStudents === null ? "" : `Atual: ${props.checklist.totalStudents}`}
        />
        <DemoChecklistRow
          label=">= 6 sessões de chamada"
          ok={props.checklist.hasSessions}
          detail={props.checklist.sessionCount === null ? "" : `Atual: ${props.checklist.sessionCount}`}
        />
        <DemoChecklistRow
          label=">= 40 respostas completas"
          ok={props.checklist.hasResponses}
          detail={`Atual: ${props.checklist.completedCount}`}
        />
        <DemoChecklistRow
          label="Progresso médio > 0%"
          ok={props.checklist.hasProgress}
          detail={props.checklist.avgProgress === null ? "" : `Atual: ${formatPercent(props.checklist.avgProgress)}`}
        />
      </div>
    </div>
  );
}

