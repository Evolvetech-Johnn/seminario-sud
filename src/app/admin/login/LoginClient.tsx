"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/modules/api/http";
import { login } from "@/modules/auth/auth.api";
import { useAuthStore } from "@/modules/auth/auth.store";

export function LoginClient() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Login Admin</h1>
      <p className="mt-2 text-sm text-slate-600">Autenticação via JWT + Refresh Token (Express).</p>

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
            router.push("/admin/dashboard");
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
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
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

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="text-sm font-bold text-slate-900">Atalho (dev)</div>
        <div className="mt-1 text-xs font-semibold text-slate-600">
          Cria um usuário admin para testes (somente em desenvolvimento).
        </div>
        <button
          type="button"
          disabled={isSeeding}
          onClick={async () => {
            setError(null);
            setIsSeeding(true);
            try {
              await apiFetch("/auth/register", {
                method: "POST",
                body: {
                  name: "Admin",
                  email: "admin@local.test",
                  password: "admin123456",
                  role: "admin",
                },
              });
              setEmail("admin@local.test");
              setPassword("admin123456");
            } catch {
              setError("Não foi possível criar o admin (talvez já exista).");
            } finally {
              setIsSeeding(false);
            }
          }}
          className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50 disabled:opacity-60"
        >
          {isSeeding ? "Criando..." : "Criar admin de teste"}
        </button>
      </div>
    </div>
  );
}
