"use client";

import Link from "next/link";

export function StudentLoginClient() {
  return (
    <div className="min-h-screen bg-sud-gray">
      <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-extrabold uppercase tracking-wide text-sud-navy">
            Seminário SUD
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Chamada do aluno
          </h1>
          <div className="mt-2 text-sm text-slate-600">
            Para confirmar presença, informe o código individual.
          </div>

          <div className="mt-6">
            <Link
              href="/student/attendance"
              className="inline-flex w-full items-center justify-center rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90"
            >
              Ir para chamada
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

