"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/modules/auth/auth.api";
import { useAuthStore } from "@/modules/auth/auth.store";

export function StudentLoginClient() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
            Faça login para confirmar presença com seu código.
          </div>

          <form
            className="mt-8 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setIsSubmitting(true);
              try {
                const result = await login({ email, password });
                if (!result.ok) {
                  setError("Credenciais inválidas.");
                  return;
                }
                setSession({
                  accessToken: result.accessToken,
                  refreshToken: result.refreshToken,
                  user: result.user,
                });
                router.push("/student/attendance");
              } catch {
                setError("Falha ao conectar com a API.");
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-400"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-400"
                autoComplete="current-password"
              />
            </div>

            {error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90 disabled:opacity-60"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

