"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/cn";
import { useTeachers, useUpdateTeacher } from "@/modules/users/users.api";

export default function AdminTeachersPage() {
  const [query, setQuery] = useState("");
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPending, setCreatePending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<null | { name: string; email: string; tempPassword?: string }>(
    null,
  );
  const [resetPasswordMsg, setResetPasswordMsg] = useState<string | null>(null);

  const teachers = useTeachers();
  const update = useUpdateTeacher();

  const items = useMemo(() => {
    const list = teachers.data?.data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((t) => `${t.name} ${t.email}`.toLowerCase().includes(q));
  }, [teachers.data?.data, query]);

  return (
    <div className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Professores</h1>
          <div className="mt-2 text-sm text-slate-600">Editar nome e email dos professores.</div>
        </div>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setCreateSuccess(null);
            setCreateName("");
            setCreateEmail("");
            setCreateOpen(true);
          }}
          className="rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90"
        >
          Criar professor
        </button>
      </div>

      {!createOpen && error ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          {error}
        </div>
      ) : null}

      {createOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setCreateOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/10">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
              <div className="text-sm font-semibold text-slate-700">Cadastro</div>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">Criar professor</h2>
            </div>

            <div className="grid gap-4 px-6 py-6">
              <label className="grid gap-2">
                <div className="text-sm font-semibold text-slate-800">Nome completo</div>
                <input
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="Ex: Maria Aparecida Silva"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-slate-300"
                />
              </label>

              <label className="grid gap-2">
                <div className="text-sm font-semibold text-slate-800">Email (opcional)</div>
                <input
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  placeholder="Ex: professor@seminario.local"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-slate-300"
                />
                <div className="text-xs font-semibold text-slate-500">
                  Se você deixar vazio, o sistema vai gerar um email e uma senha temporária.
                </div>
              </label>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
                  {error}
                </div>
              ) : null}

              {createSuccess ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
                  <div className="grid gap-2">
                    <div>Professor criado: {createSuccess.name}</div>
                    <div>Email: {createSuccess.email}</div>
                    {createSuccess.tempPassword ? (
                      <div>Senha temporária: {createSuccess.tempPassword}</div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 bg-white px-6 py-4">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
              >
                Fechar
              </button>
              <button
                type="button"
                disabled={createPending}
                onClick={async () => {
                  setError(null);
                  setCreateSuccess(null);
                  const name = createName.trim();
                  if (name.length < 2) {
                    setError("Informe o nome completo.");
                    return;
                  }
                  setCreatePending(true);
                  try {
                    const res = await fetch("/api/admin/teachers", {
                      method: "POST",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify({ name, email: createEmail.trim() || undefined }),
                    });
                    const json = (await res.json().catch(() => null)) as any;
                    if (!res.ok) throw new Error(json?.error ?? "Erro ao criar professor");
                    setCreateSuccess({
                      name: String(json?.data?.name ?? name),
                      email: String(json?.data?.email ?? ""),
                      tempPassword: json?.data?.tempPassword ? String(json.data.tempPassword) : undefined,
                    });
                    await teachers.refetch().catch(() => null);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Erro ao criar");
                  } finally {
                    setCreatePending(false);
                  }
                }}
                className={cn(
                  "rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90 disabled:opacity-60",
                )}
              >
                {createPending ? "Criando..." : "Criar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
        <input
          id="search"
          name="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome ou email..."
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-slate-300"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid grid-cols-[1fr_260px_160px] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-600">
          <div>Professor</div>
          <div>Email</div>
          <div>Ações</div>
        </div>

        {teachers.isLoading ? <div className="px-4 py-6 text-sm text-slate-600">Carregando…</div> : null}
        {teachers.isError ? <div className="px-4 py-6 text-sm text-rose-700">Falha ao carregar.</div> : null}

        {items.map((t) => {
          const isEditing = editingEmail === t.email;
          return (
            <div key={t.email} className="grid grid-cols-[1fr_260px_160px] gap-4 border-b border-slate-100 px-4 py-4">
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-slate-900">{t.name}</div>
                {t.id ? <div className="mt-1 text-xs font-semibold text-slate-500">ID: {t.id}</div> : null}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-700">{t.email}</div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingEmail(t.email);
                    setDraftName(t.name);
                    setDraftEmail(t.email);
                    setError(null);
                    setResetPasswordMsg(null);
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

                  {resetPasswordMsg ? (
                    <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
                      {resetPasswordMsg}
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      disabled={update.isPending}
                      onClick={async () => {
                        setError(null);
                        setResetPasswordMsg(null);
                        try {
                          const res = await fetch(
                            `/api/admin/teachers/${encodeURIComponent(t.email)}/reset-password`,
                            { method: "POST" },
                          );
                          const json = (await res.json().catch(() => null)) as any;
                          if (!res.ok) throw new Error(json?.error ?? "Erro ao resetar senha");
                          const pwd = json?.data?.tempPassword;
                          setResetPasswordMsg(`Senha temporária gerada: ${pwd}`);
                        } catch (err) {
                          setError(err instanceof Error ? err.message : "Erro ao resetar senha");
                        }
                      }}
                      className={cn(
                        "rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50 disabled:opacity-60",
                      )}
                    >
                      Resetar senha
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingEmail(null)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      disabled={update.isPending}
                      onClick={async () => {
                        setError(null);
                        setResetPasswordMsg(null);
                        await update
                          .mutateAsync({
                            currentEmail: t.email,
                            name: draftName,
                            email: draftEmail,
                          })
                          .catch(() => null);
                        setEditingEmail(null);
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

        {!teachers.isLoading && items.length === 0 ? (
          <div className="px-4 py-6 text-sm text-slate-600">Nenhum professor encontrado.</div>
        ) : null}
      </div>
    </div>
  );
}
