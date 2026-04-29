"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { cn } from "@/lib/cn";
import { useAuthStore } from "@/modules/auth/auth.store";
import { useAdminLessons, useDeleteLesson } from "@/modules/lessons/lessons.api";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export default function AdminLessonsPage() {
  const accessToken = useAuthStore((s) => s.accessToken);

  const [query, setQuery] = useState("");
  const lessons = useAdminLessons(accessToken);
  const del = useDeleteLesson(accessToken);

  const filtered = useMemo(() => {
    const items = lessons.data?.lessons ?? [];
    const q = query.trim().toLowerCase();
    const sorted = [...items].sort((a, b) => a.lessonNumber - b.lessonNumber);
    if (!q) return sorted;
    return sorted.filter((l) =>
      `${l.lessonNumber} ${l.title} ${l.subtitle} ${l.slug}`.toLowerCase().includes(q),
    );
  }, [lessons.data?.lessons, query]);

  return (
    <div className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gerenciar aulas</h1>
          <div className="mt-2 text-sm text-slate-600">
            Crie, edite, publique e faça upload de imagens (Cloudinary).
          </div>
        </div>

        <Link
          href="/admin/lessons/new"
          className="rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90"
        >
          Nova aula
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
        <input
          id="search"
          name="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nº, título, slug…"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-slate-300"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid grid-cols-[110px_1fr_120px_110px] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-600">
          <div>Nº</div>
          <div>Título</div>
          <div>Data</div>
          <div>Status</div>
        </div>

        {lessons.isLoading ? (
          <div className="px-4 py-6 text-sm text-slate-600">Carregando…</div>
        ) : null}

        {lessons.isError ? (
          <div className="px-4 py-6 text-sm text-rose-700">Falha ao carregar aulas.</div>
        ) : null}

        {filtered.map((l) => (
          <div
            key={l.id}
            className="grid grid-cols-[110px_1fr_120px_110px] gap-4 border-b border-slate-100 px-4 py-4"
          >
            <div className="text-sm font-extrabold text-slate-900">Aula {l.lessonNumber}</div>
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-3">
                <Link
                  href={`/admin/lessons/${l.id}`}
                  className="truncate text-sm font-bold text-slate-900 hover:underline"
                >
                  {l.title}
                </Link>
                <button
                  type="button"
                  disabled={del.isPending}
                  onClick={async () => {
                    const ok = window.confirm(`Deletar a aula ${l.lessonNumber}?`);
                    if (!ok) return;
                    await del.mutateAsync(l.id).catch(() => null);
                  }}
                  className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  Deletar
                </button>
              </div>
              <div className="mt-1 truncate text-xs font-semibold text-slate-600">{l.subtitle}</div>
              <div className="mt-1 truncate text-xs font-semibold text-slate-500">{l.slug}</div>
            </div>
            <div className="text-sm font-semibold text-slate-700">{formatDate(l.date)}</div>
            <div>
              <div
                className={cn(
                  "inline-flex rounded-full px-3 py-1 text-xs font-extrabold ring-1",
                  l.published
                    ? "bg-sud-green/10 text-sud-green ring-sud-green/20"
                    : "bg-slate-100 text-slate-700 ring-slate-200",
                )}
              >
                {l.published ? "Publicada" : "Rascunho"}
              </div>
            </div>
          </div>
        ))}

        {!lessons.isLoading && filtered.length === 0 ? (
          <div className="px-4 py-6 text-sm text-slate-600">Nenhuma aula encontrada.</div>
        ) : null}
      </div>
    </div>
  );
}

