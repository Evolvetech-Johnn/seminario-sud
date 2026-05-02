"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpenCheck,
  Gauge,
  GraduationCap,
  ListChecks,
  RefreshCw,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";

import { allLessonMetas } from "@/features/lessons/lessonMetas";

import { DemoLinkCard } from "./DemoLinkCard";
import { DemoKpiCard } from "./DemoKpis";
import { DemoSeedPanel } from "./DemoSeedPanel";
import { DemoGuidedActions } from "./DemoGuidedActions";
import { DemoAttendancePanel, DemoResponsesPanel } from "./DemoPanels";
import { DemoAnalytics } from "./DemoAnalytics";
import type { AttendanceSessionListItem, LessonResponseDoc, Overview, StudentDoc } from "./demo.types";
import { adminFetch, formatPercent } from "./demo.utils";
import {
  computeCompletionRate,
  computeOverallAttendanceRate,
  computeReflectionRate,
} from "./demo.metrics";

export function DemoClient() {
  const qc = useQueryClient();
  const lessonForDemo = allLessonMetas[0]?.slug ?? "aula-1-010-overview";

  const overview = useQuery({
    queryKey: ["demo", "overview"],
    queryFn: async () => adminFetch<{ ok: true; data: Overview }>("/api/admin/dashboard/overview"),
  });

  const students = useQuery({
    queryKey: ["demo", "students"],
    queryFn: async () => adminFetch<{ ok: true; data: StudentDoc[] }>("/api/admin/students"),
  });

  const sessions = useQuery({
    queryKey: ["demo", "attendance", "sessions"],
    queryFn: async () =>
      adminFetch<{ ok: true; data: AttendanceSessionListItem[] }>(
        "/api/admin/attendance/sessions?limit=60",
      ),
  });

  const responses = useQuery({
    queryKey: ["demo", "lessonResponses"],
    queryFn: async () =>
      adminFetch<{ ok: true; storage: string; data: LessonResponseDoc[] }>(
        "/api/admin/lesson-responses?limit=800",
      ),
  });

  const completedCount = useMemo(() => {
    const docs = responses.data?.data ?? [];
    return docs.filter((d) => Boolean(d?.completed)).length;
  }, [responses.data?.data]);

  const completion = useMemo(() => computeCompletionRate(responses.data?.data ?? []), [responses.data?.data]);
  const reflection = useMemo(() => computeReflectionRate(responses.data?.data ?? []), [responses.data?.data]);
  const overallAttendance = useMemo(
    () => computeOverallAttendanceRate(sessions.data?.data ?? []),
    [sessions.data?.data],
  );

  const checklist = useMemo(() => {
    const totalStudents = students.data?.data?.length ?? null;
    const sessionCount = sessions.data?.data?.length ?? null;
    const avgProgress = overview.data?.data?.averageProgress ?? null;

    const hasStudents = totalStudents === null ? null : totalStudents >= 5;
    const hasSessions = sessionCount === null ? null : sessionCount >= 6;
    const hasResponses = completedCount >= 40;
    const hasProgress = avgProgress === null ? null : avgProgress > 0;

    return { totalStudents, sessionCount, avgProgress, hasStudents, hasSessions, hasResponses, hasProgress };
  }, [completedCount, overview.data?.data?.averageProgress, sessions.data?.data?.length, students.data?.data?.length]);

  const [seedPending, setSeedPending] = useState(false);
  const [seedMsg, setSeedMsg] = useState<string | null>(null);
  const [seedError, setSeedError] = useState<string | null>(null);

  const refreshAll = async () => {
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["demo", "overview"] }),
      qc.invalidateQueries({ queryKey: ["demo", "students"] }),
      qc.invalidateQueries({ queryKey: ["demo", "attendance", "sessions"] }),
      qc.invalidateQueries({ queryKey: ["demo", "lessonResponses"] }),
    ]);
  };

  const storageLabel = responses.data?.storage ? String((responses.data as any).storage) : "";

  return (
    <div className="py-10">
      <div className="relative overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-sud-navy/10 via-white to-white" />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-600">
              <Sparkles className="h-4 w-4" />
              Página demo (Professor)
            </div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  Demo do sistema
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  Um painel visual para apresentar o produto e apoiar decisões com presença, entrega e engajamento.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-extrabold text-slate-800 ring-1 ring-slate-200">
                    Acesso: professor
                  </span>
                  {storageLabel ? (
                    <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-extrabold text-slate-800 ring-1 ring-slate-200">
                      Storage: {storageLabel}
                    </span>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={refreshAll}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50"
              >
                <RefreshCw className="h-4 w-4" />
                Recarregar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DemoLinkCard
          href="/admin/dashboard"
          title="Dashboard"
          description="Métricas gerais do professor"
          icon={<Gauge className="h-5 w-5" />}
        />
        <DemoLinkCard
          href="/professor/respostas"
          title="Respostas"
          description="Respostas recentes e histórico"
          icon={<ListChecks className="h-5 w-5" />}
        />
        <DemoLinkCard
          href="/admin/attendance"
          title="Chamada"
          description="Códigos e presença por aula"
          icon={<Users className="h-5 w-5" />}
        />
        <DemoLinkCard
          href="/admin/students"
          title="Alunos"
          description="Cadastro e reset de acesso"
          icon={<UserRound className="h-5 w-5" />}
        />
        <DemoLinkCard
          href={`/aulas/${encodeURIComponent(lessonForDemo)}`}
          title="Abrir uma aula"
          description="Tela do aluno para responder"
          icon={<GraduationCap className="h-5 w-5" />}
        />
        <DemoLinkCard
          href="/student/attendance"
          title="Confirmar presença"
          description="Aluno confirma usando código"
          icon={<Users className="h-5 w-5" />}
        />
        <DemoLinkCard
          href="/login"
          title="Login do aluno"
          description="Criar senha e entrar"
          icon={<UserRound className="h-5 w-5" />}
        />
        <DemoLinkCard
          href="/admin/lessons"
          title="Aulas"
          description="Conteúdo e editor"
          icon={<GraduationCap className="h-5 w-5" />}
        />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DemoKpiCard
          label="Alunos ativos"
          value={overview.data?.data ? String(overview.data.data.totalStudents) : overview.isLoading ? "..." : "—"}
          hint="Base: alunos cadastrados"
          icon={<Users className="h-6 w-6 text-sud-navy" />}
          accent="navy"
        />
        <DemoKpiCard
          label="Presença média"
          value={sessions.isLoading ? "..." : formatPercent(overallAttendance)}
          hint="Sinal de participação"
          icon={<Users className="h-6 w-6 text-sud-blue" />}
          accent="blue"
        />
        <DemoKpiCard
          label="Taxa de completude"
          value={responses.isLoading ? "..." : formatPercent(completion.rate)}
          hint={responses.isLoading ? "" : `${completion.completed}/${completion.total} completas`}
          icon={<BookOpenCheck className="h-6 w-6 text-emerald-700" />}
          accent="emerald"
        />
        <DemoKpiCard
          label="Reflexões"
          value={responses.isLoading ? "..." : formatPercent(reflection.rate)}
          hint={responses.isLoading ? "" : `${reflection.withReflection}/${reflection.total} com notas`}
          icon={<ListChecks className="h-6 w-6 text-amber-700" />}
          accent="amber"
        />
      </div>

      <DemoAnalytics
        students={students.data?.data ?? []}
        sessions={sessions.data?.data ?? []}
        responses={responses.data?.data ?? []}
        loading={overview.isLoading || students.isLoading || sessions.isLoading || responses.isLoading}
      />

      {overview.isError ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
          Falha ao carregar métricas. Faça login em{" "}
          <Link href="/professor/login" className="font-bold underline">
            /professor/login
          </Link>
          .
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <DemoResponsesPanel items={(responses.data?.data ?? []).slice(0, 20)} loading={responses.isLoading} />
        <DemoAttendancePanel items={(sessions.data?.data ?? []).slice(0, 6)} loading={sessions.isLoading} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <DemoSeedPanel
          pending={seedPending}
          setPending={setSeedPending}
          message={seedMsg}
          setMessage={setSeedMsg}
          error={seedError}
          setError={setSeedError}
          onSeedCompleted={refreshAll}
          checklist={{
            totalStudents: checklist.totalStudents,
            sessionCount: checklist.sessionCount,
            avgProgress: checklist.avgProgress,
            hasStudents: checklist.hasStudents,
            hasSessions: checklist.hasSessions,
            hasResponses: checklist.hasResponses,
            hasProgress: checklist.hasProgress,
            completedCount,
          }}
        />
        <DemoGuidedActions
          onSessionChanged={async () => {
            await qc.invalidateQueries({ queryKey: ["demo", "attendance", "sessions"] });
          }}
        />
      </div>
    </div>
  );
}
