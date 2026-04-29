"use client";

import Link from "next/link";

import { Card } from "@/components/seminario/Card";
import { useDashboardOverview } from "@/modules/dashboard/dashboard.api";

function formatPercent(value: number) {
  const clamped = Math.max(0, Math.min(1, value));
  return new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 0 }).format(
    clamped,
  );
}

export function DashboardClient() {
  const overview = useDashboardOverview();
  const data = overview.data?.data ?? null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Dashboard do professor
        </h1>
        <div className="text-sm text-slate-600">Visão geral do sistema.</div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          title="Total de aulas"
          description={data ? String(data.totalLessons) : overview.isLoading ? "..." : "—"}
        />
        <Card
          title="Total de alunos"
          description={data ? String(data.totalStudents) : overview.isLoading ? "..." : "—"}
        />
        <Card
          title="Progresso médio"
          description={data ? formatPercent(data.averageProgress) : overview.isLoading ? "..." : "—"}
        />
      </div>

      {overview.isError ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          Falha ao carregar métricas. Faça login em{" "}
          <Link href="/professor/login" className="font-bold underline">
            /professor/login
          </Link>
          .
        </div>
      ) : null}
    </div>
  );
}
