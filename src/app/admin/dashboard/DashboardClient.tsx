"use client";

import Link from "next/link";

import { Card } from "@/components/seminario/Card";
import { useAuthStore } from "@/modules/auth/auth.store";
import { useDashboardOverview } from "@/modules/dashboard/dashboard.api";

function formatPercent(value: number) {
  const clamped = Math.max(0, Math.min(1, value));
  return new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 0 }).format(
    clamped,
  );
}

export function DashboardClient() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

  const overview = useDashboardOverview(accessToken);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Dashboard Admin
        </h1>
        <div className="text-sm text-slate-600">
          {user ? `Logado como ${user.name} (${user.role})` : "Faça login para ver métricas."}
        </div>
      </div>

      {accessToken ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            title="Total de aulas"
            description={
              overview.data ? String(overview.data.totalLessons) : overview.isLoading ? "..." : "—"
            }
          />
          <Card
            title="Total de alunos"
            description={
              overview.data ? String(overview.data.totalStudents) : overview.isLoading ? "..." : "—"
            }
          />
          <Card
            title="Progresso médio"
            description={
              overview.data ? formatPercent(overview.data.averageProgress) : overview.isLoading ? "..." : "—"
            }
          />
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700">
          Para acessar o dashboard, faça login.
          <div className="mt-3">
            <Link
              href="/admin/login"
              className="inline-flex rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90"
            >
              Ir para login
            </Link>
          </div>
        </div>
      )}

      {overview.isError ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          Falha ao carregar métricas.
        </div>
      ) : null}
    </div>
  );
}
