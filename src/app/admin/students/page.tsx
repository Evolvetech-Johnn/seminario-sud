"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/cn";
import { useStudents, useUpdateStudent } from "@/modules/users/users.api";

export default function AdminStudentsPage() {
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const [seedMsg, setSeedMsg] = useState<string | null>(null);

  const students = useStudents();
  const update = useUpdateStudent();

  const items = useMemo(() => {
    const list = students.data?.data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((u) => `${u.name} ${u.email ?? ""}`.toLowerCase().includes(q));
  }, [students.data?.data, query]);

  return (
    <div className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Alunos</h1>
          <div className="mt-2 text-sm text-slate-600">Editar nome e email dos alunos.</div>
        </div>
        <button
          type="button"
          onClick={async () => {
            setSeedMsg(null);
            const res = await fetch("/api/admin/seed-users", { method: "POST" }).catch(() => null);
            if (!res || !res.ok) {
              setSeedMsg("Não foi possível criar Arthur/Lyncoln (verifique login de professor e MongoDB Atlas).");
              return;
            }
            setSeedMsg("Arthur (professor) e Lyncoln (aluno) criados/garantidos no banco.");
            await students.refetch().catch(() => null);
          }}
          className="rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90"
        >
          Criar Arthur/Lyncoln
        </button>
      </div>

      {seedMsg ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800">
          {seedMsg}
        </div>
      ) : null}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
        <input
          id="search"
          name="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome ou email…"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-slate-300"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid grid-cols-[1fr_220px_160px] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-600">
          <div>Aluno</div>
          <div>Email</div>
          <div>Ações</div>
        </div>

        {students.isLoading ? <div className="px-4 py-6 text-sm text-slate-600">Carregando…</div> : null}
        {students.isError ? <div className="px-4 py-6 text-sm text-rose-700">Falha ao carregar.</div> : null}

        {items.map((u) => {
          const isEditing = editingId === u.id;
          return (
            <div key={u.id} className="grid grid-cols-[1fr_220px_160px] gap-4 border-b border-slate-100 px-4 py-4">
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-slate-900">{u.name}</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">ID: {u.id}</div>
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-700">{u.email ?? "—"}</div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(u.id);
                    setDraftName(u.name);
                    setDraftEmail(u.email ?? "");
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 transition hover:bg-slate-50"
                >
                  Editar
                </button>
              </div>

              {isEditing ? (
                <div className="col-span-3 mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-slate-700">Nome</label>
                      <input
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-slate-300"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-slate-700">Email</label>
                      <input
                        value={draftEmail}
                        onChange={(e) => setDraftEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      disabled={update.isPending}
                      onClick={async () => {
                        await update
                          .mutateAsync({
                            id: u.id,
                            name: draftName,
                            email: draftEmail,
                          })
                          .catch(() => null);
                        setEditingId(null);
                      }}
                      className={cn(
                        "rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90 disabled:opacity-60",
                      )}
                    >
                      {update.isPending ? "Salvando..." : "Salvar"}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}

        {!students.isLoading && items.length === 0 ? (
          <div className="px-4 py-6 text-sm text-slate-600">Nenhum aluno encontrado.</div>
        ) : null}
      </div>
    </div>
  );
}
