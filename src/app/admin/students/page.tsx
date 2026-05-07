"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/cn";
import { useStudents, useUpdateStudent } from "@/modules/users/users.api";

export default function AdminStudentsPage() {
  const [alaFilter, setAlaFilter] = useState<"ala1" | "ala2" | "ala3" | "all">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const [draftLogin, setDraftLogin] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [createRole, setCreateRole] = useState<"student" | "teacher">("student");
  const [createName, setCreateName] = useState("");
  const [createTeacherEmail, setCreateTeacherEmail] = useState("");
  const [createAla, setCreateAla] = useState<"ala1" | "ala2" | "ala3">("ala1");
  const [createTurma, setCreateTurma] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [resetPasswordMsg, setResetPasswordMsg] = useState<string | null>(null);
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(null);
  const [resetPending, setResetPending] = useState(false);
  const [createSuccess, setCreateSuccess] = useState<
    | null
    | {
        role: "student" | "teacher";
        name: string;
        email?: string;
        login?: string;
        tempPassword?: string;
      }
  >(null);

  const students = useStudents();
  const update = useUpdateStudent();

  const items = useMemo(() => {
    const list = students.data?.data ?? [];
    let filtered = list;

    if (alaFilter !== "all") {
      filtered = filtered.filter((u) => u.ala === alaFilter);
    }

    const q = query.trim().toLowerCase();
    if (!q) return filtered;
    return filtered.filter((u) => `${u.name} ${u.login ?? ""} ${u.email ?? ""} ${u.ala} ${u.turma}`.toLowerCase().includes(q));
  }, [students.data?.data, query, alaFilter]);

  return (
    <div className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Alunos</h1>
          <div className="mt-2 text-sm text-slate-600">Gerenciar alunos por ala e turma.</div>
        </div>
        <button
          type="button"
          onClick={() => {
            setCreateError(null);
            setCreateSuccess(null);
            setCreateRole("student");
            setCreateName("");
            setCreateTeacherEmail("");
            setCreateStudentLogin("");
            setCreateOpen(true);
          }}
          className="rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90"
        >
          Criar usuário
        </button>
      </div>

      {!createOpen && createError ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          {createError}
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
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">Criar aluno ou professor</h2>
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

              <div className="grid gap-2">
                <div className="text-sm font-semibold text-slate-800">Tipo</div>
                <div className="inline-flex rounded-full bg-sud-gray p-1 ring-1 ring-slate-200">
                  <button
                    type="button"
                    onClick={() => setCreateRole("student")}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-bold transition",
                      createRole === "student" ? "bg-white text-slate-900 shadow-sm" : "text-slate-700 hover:bg-white/70",
                    )}
                  >
                    Aluno
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateRole("teacher")}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-bold transition",
                      createRole === "teacher" ? "bg-white text-slate-900 shadow-sm" : "text-slate-700 hover:bg-white/70",
                    )}
                  >
                    Professor
                  </button>
                </div>
              </div>

              {createRole === "student" && (
                <>
                  <div className="grid gap-2">
                    <div className="text-sm font-semibold text-slate-800">Ala</div>
                    <div className="inline-flex rounded-full bg-sud-gray p-1 ring-1 ring-slate-200">
                      {(["ala1", "ala2", "ala3"] as const).map((ala) => (
                        <button
                          key={ala}
                          type="button"
                          onClick={() => setCreateAla(ala)}
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-bold transition",
                            createAla === ala ? "bg-white text-slate-900 shadow-sm" : "text-slate-700 hover:bg-white/70",
                          )}
                        >
                          {ala.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="text-sm font-semibold text-slate-800">Turma</div>
                    <input
                      value={createTurma}
                      onChange={(e) => setCreateTurma(e.target.value.toUpperCase())}
                      placeholder="Ex: A, B, C"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-slate-300"
                    />
                  </div>
                </>
              )}

              {createRole === "teacher" ? (
                <label className="grid gap-2">
                  <div className="text-sm font-semibold text-slate-800">Email (opcional)</div>
                  <input
                    value={createTeacherEmail}
                    onChange={(e) => setCreateTeacherEmail(e.target.value)}
                    placeholder="Ex: professor@seminario.local"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-slate-300"
                  />
                  <div className="text-xs font-semibold text-slate-500">
                    Se você deixar vazio, o sistema vai gerar um email e uma senha temporária.
                  </div>
                </label>
              ) : null}

              {createRole === "student" ? (
                <label className="grid gap-2">
                  <div className="text-sm font-semibold text-slate-800">Usuário (opcional)</div>
                  <input
                    value={createStudentLogin}
                    onChange={(e) => setCreateStudentLogin(e.target.value)}
                    placeholder="Ex: joao.silva"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-slate-300"
                  />
                  <div className="text-xs font-semibold text-slate-500">
                    Se você deixar vazio, o sistema vai gerar um usuário e uma senha temporária.
                  </div>
                </label>
              ) : null}

              {createError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
                  {createError}
                </div>
              ) : null}

              {createSuccess ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
                  {createSuccess.role === "student" ? (
                    <div className="grid gap-2">
                      <div>Aluno criado: {createSuccess.name}</div>
                      {createSuccess.login ? <div>Usuário: {createSuccess.login}</div> : null}
                      {createSuccess.tempPassword ? (
                        <div>Senha temporária: {createSuccess.tempPassword}</div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      <div>Professor criado: {createSuccess.name}</div>
                      {createSuccess.email ? <div>Email: {createSuccess.email}</div> : null}
                      {createSuccess.tempPassword ? (
                        <div>Senha temporária: {createSuccess.tempPassword}</div>
                      ) : null}
                    </div>
                  )}
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
                  setCreateError(null);
                  setCreateSuccess(null);
                  const name = createName.trim();
                  if (name.length < 2) {
                    setCreateError("Informe o nome completo.");
                    return;
                  }
                  if (createRole === "student" && !createTurma.trim()) {
                    setCreateError("Informe a turma do aluno.");
                    return;
                  }

                  setCreatePending(true);
                  try {
                    if (createRole === "student") {
                      const res = await fetch("/api/admin/students", {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({
                          name,
                          login: createStudentLogin.trim() || undefined,
                          ala: createAla,
                          turma: createTurma.trim() || "A",
                        }),
                      });
                      const json = (await res.json().catch(() => null)) as any;
                      if (!res.ok) throw new Error(json?.error ?? "Erro ao criar aluno");
                      setCreateSuccess({
                        role: "student",
                        name: json?.data?.name ?? name,
                        login: json?.data?.login,
                        tempPassword: json?.data?.tempPassword,
                      });
                      await students.refetch().catch(() => null);
                      return;
                    }

                    const res = await fetch("/api/admin/teachers", {
                      method: "POST",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify({
                        name,
                        email: createTeacherEmail.trim() || undefined,
                      }),
                    });
                    const json = (await res.json().catch(() => null)) as any;
                    if (!res.ok) throw new Error(json?.error ?? "Erro ao criar professor");
                    setCreateSuccess({
                      role: "teacher",
                      name: json?.data?.name ?? name,
                      email: json?.data?.email,
                      tempPassword: json?.data?.tempPassword,
                    });
                  } catch (err) {
                    const msg = err instanceof Error ? err.message : "Erro ao criar";
                    setCreateError(msg);
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
        <div className="mb-4">
          <div className="inline-flex rounded-full bg-sud-gray p-1 ring-1 ring-slate-200">
            {(["all", "ala1", "ala2", "ala3"] as const).map((ala) => (
              <button
                key={ala}
                type="button"
                onClick={() => setAlaFilter(ala)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-bold transition",
                  alaFilter === ala ? "bg-white text-slate-900 shadow-sm" : "text-slate-700 hover:bg-white/70",
                )}
              >
                {ala === "all" ? "Todas as Alas" : ala.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <input
          id="search"
          name="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome, usuário, email, ala ou turma…"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-slate-300"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid grid-cols-[1fr_120px_80px_120px_160px] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-600">
          <div>Aluno</div>
          <div>Ala</div>
          <div>Turma</div>
          <div>Usuário</div>
          <div>Ações</div>
        </div>
          <div>Usuário</div>
          <div>Email</div>
          <div>Ações</div>
        </div>

        {students.isLoading ? <div className="px-4 py-6 text-sm text-slate-600">Carregando…</div> : null}
        {students.isError ? <div className="px-4 py-6 text-sm text-rose-700">Falha ao carregar.</div> : null}

        {items.map((u) => {
          const isEditing = editingId === u.id;
          return (
            <div key={u.id} className="grid grid-cols-[1fr_120px_80px_120px_160px] gap-4 border-b border-slate-100 px-4 py-4">
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-slate-900">{u.name}</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">ID: {u.id}</div>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-800">{u.ala?.toUpperCase() ?? "ALA1"}</div>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-800">{u.turma ?? "A"}</div>
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-800">{u.login ?? "—"}</div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(u.id);
                    setDraftName(u.name);
                    setDraftEmail(u.email ?? "");
                    setDraftLogin(u.login ?? "");
                    setResetPasswordMsg(null);
                    setResetPasswordError(null);
                    setCreateError(null);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 transition hover:bg-slate-50"
                >
                  Editar
                </button>
              </div>

              {isEditing ? (
                <div className="col-span-4 mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-slate-700">Nome</label>
                      <input
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-slate-300"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-slate-700">Usuário</label>
                      <input
                        value={draftLogin}
                        onChange={(e) => setDraftLogin(e.target.value)}
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

                  {resetPasswordError ? (
                    <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
                      {resetPasswordError}
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      disabled={update.isPending || resetPending}
                      onClick={async () => {
                        setCreateError(null);
                        setResetPasswordMsg(null);
                        setResetPasswordError(null);
                        setResetPending(true);
                        try {
                          const res = await fetch(
                            `/api/admin/students/${encodeURIComponent(u.id)}/reset-password`,
                            { method: "POST" },
                          );
                          const json = (await res.json().catch(() => null)) as any;
                          if (!res.ok) throw new Error(json?.error ?? "Erro ao resetar senha");
                          const pwd = json?.data?.tempPassword;
                          const login = json?.data?.login;
                          setResetPasswordMsg(
                            `Senha temporária gerada${login ? ` para ${login}` : ""}: ${pwd}`,
                          );
                        } catch (err) {
                          setResetPasswordError(err instanceof Error ? err.message : "Erro ao resetar senha");
                        }
                        setResetPending(false);
                      }}
                      className={cn(
                        "rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50 disabled:opacity-60",
                      )}
                    >
                      {resetPending ? "Resetando..." : "Resetar senha"}
                    </button>
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
                            login: draftLogin,
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
