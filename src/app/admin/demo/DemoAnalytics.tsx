import { ChartBarBig, ClipboardList, TrendingUp, Users } from "lucide-react";

import type { AttendanceSessionListItem, LessonResponseDoc, StudentDoc } from "./demo.types";
import { formatDate, formatPercent } from "./demo.utils";
import {
  computeAttendanceSeries,
  computeCompletionRate,
  computeEngagementByStudent,
  computeOverallAttendanceRate,
  computeReflectionRate,
  computeResponsesByLesson,
} from "./demo.metrics";
import { ChartCard } from "./charts/ChartCard";
import { DonutChart } from "./charts/DonutChart";
import { SimpleLineChart } from "./charts/SimpleLineChart";
import { SimpleBarChart } from "./charts/SimpleBarChart";

function shortLessonLabel(slug: string) {
  const m = slug.match(/aula-(\d+)-/);
  if (m?.[1]) return `A${m[1]}`;
  return slug.length > 10 ? `${slug.slice(0, 10)}…` : slug;
}

export function DemoAnalytics(props: {
  students: StudentDoc[];
  sessions: AttendanceSessionListItem[];
  responses: LessonResponseDoc[];
  loading: boolean;
}) {
  const attendanceSeries = computeAttendanceSeries(props.sessions);
  const overallAttendance = computeOverallAttendanceRate(props.sessions);
  const completion = computeCompletionRate(props.responses);
  const reflection = computeReflectionRate(props.responses);
  const byLesson = computeResponsesByLesson(props.responses, 12);
  const engagement = computeEngagementByStudent(props.students, props.responses).slice(0, 8);

  const attendanceLine = attendanceSeries.slice(-12).map((d) => ({
    label: formatDate(d.dateIso).slice(0, 5),
    value: Math.round(d.rate * 100),
  }));

  const barsByLesson = byLesson.map((x) => ({
    label: shortLessonLabel(x.lessonSlug),
    value: x.completed,
  }));

  const engagementBars = engagement.map((e) => ({
    label: e.name.split(" ")[0] || e.name,
    value: e.completed,
  }));

  return (
    <div className="mt-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-slate-600">Insights</div>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Métricas de ensino/aprendizagem
          </h2>
          <div className="mt-2 text-sm text-slate-600">
            Visão rápida para tomada de decisão: presença, entrega e engajamento.
          </div>
        </div>
        <div className="hidden items-center gap-2 text-xs font-bold text-slate-600 sm:flex">
          <TrendingUp className="h-4 w-4" />
          Atualize após rodar o seed
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Participação"
          subtitle="Taxa média de presença"
          right={
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-extrabold text-white">
              <Users className="h-4 w-4" />
              {formatPercent(overallAttendance)}
            </span>
          }
        >
          <DonutChart
            value01={overallAttendance}
            label="Presença média"
            sublabel={props.sessions.length ? `${props.sessions.length} sessões analisadas` : "Sem sessões"}
          />
        </ChartCard>

        <ChartCard
          title="Entrega"
          subtitle="Respostas completas"
          right={
            <span className="inline-flex items-center gap-2 rounded-full bg-sud-blue px-3 py-1 text-xs font-extrabold text-white">
              <ClipboardList className="h-4 w-4" />
              {completion.completed}/{completion.total}
            </span>
          }
        >
          <DonutChart
            value01={completion.rate}
            label="Taxa de completude"
            sublabel={completion.total ? "Quanto mais alto, melhor consistência" : "Sem respostas"}
          />
        </ChartCard>

        <ChartCard
          title="Profundidade"
          subtitle="Respostas com reflexão"
          right={
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-extrabold text-white">
              <ChartBarBig className="h-4 w-4" />
              {reflection.withReflection}/{reflection.total}
            </span>
          }
        >
          <DonutChart
            value01={reflection.rate}
            label="Taxa de reflexão"
            sublabel="Baseado em notas (discussionNotes) preenchidas"
          />
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Presença por dia"
          subtitle="Últimas 12 sessões (taxa %)"
          right={
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-800 ring-1 ring-slate-200">
              {props.sessions.length ? "Tendência" : "Sem dados"}
            </span>
          }
        >
          {props.loading ? (
            <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
          ) : (
            <SimpleLineChart data={attendanceLine} height={160} />
          )}
        </ChartCard>

        <ChartCard
          title="Respostas completas por aula"
          subtitle="Top 12 aulas por completude"
          right={
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-800 ring-1 ring-slate-200">
              {barsByLesson.length ? "Top" : "Sem dados"}
            </span>
          }
        >
          {props.loading ? (
            <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
          ) : (
            <SimpleBarChart data={barsByLesson} height={170} />
          )}
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Engajamento por aluno"
          subtitle="Top 8 por respostas completas"
          right={
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-800 ring-1 ring-slate-200">
              {engagementBars.length ? "Ranking" : "Sem dados"}
            </span>
          }
        >
          {props.loading ? (
            <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
          ) : (
            <SimpleBarChart data={engagementBars} height={170} barClassName="bg-slate-900" />
          )}
        </ChartCard>

        <ChartCard title="Ações sugeridas" subtitle="Próximos passos para decisões">
          <div className="grid gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <div className="text-sm font-extrabold text-slate-900">Acompanhar presença</div>
              <div className="mt-1 text-sm text-slate-600">
                Se a presença média cair abaixo de 70%, revise lembretes e dinâmica da chamada.
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <div className="text-sm font-extrabold text-slate-900">Estimular completude</div>
              <div className="mt-1 text-sm text-slate-600">
                Aulas com pouca entrega podem precisar de instruções mais claras ou exemplos.
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <div className="text-sm font-extrabold text-slate-900">Promover reflexão</div>
              <div className="mt-1 text-sm text-slate-600">
                Use perguntas-guia para aumentar a profundidade das respostas dos alunos.
              </div>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

