"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { AppHeader } from "@/components/seminario/AppHeader";
import { cn } from "@/lib/cn";
import { useStudentSession } from "@/hooks/useStudentSession";

export function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, isHydrated, login } = useStudentSession();

  const nextUrl = useMemo(() => {
    const raw = searchParams.get("next");
    if (!raw) return "/aulas/exodo-20-1-11";
    if (!raw.startsWith("/")) return "/aulas/exodo-20-1-11";
    return raw;
  }, [searchParams]);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isHydrated && session) {
      router.replace(nextUrl);
    }
  }, [isHydrated, session, nextUrl, router]);

  return (
    <div className="min-h-dvh bg-white">
      <AppHeader />

      <main className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-sud-navy via-white to-white" />
        <div className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-white/60 backdrop-blur transition hover:bg-white"
            >
              Voltar para a aula
            </Link>
            <div className="text-xs font-semibold text-white/85">
              Login
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/80 shadow-xl ring-1 ring-slate-200/50 backdrop-blur">
            <div className="border-b border-slate-200/70 bg-white px-6 py-6 sm:px-10">
              <div className="text-sm font-semibold text-slate-700">
                Identificação do aluno
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Entre para registrar suas respostas
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                As respostas ficam separadas por aluno. Para entrar no ranking, use login e senha
                (obrigatórios) para manter sua identificação consistente.
              </p>
            </div>

            <div className="px-6 py-6 sm:px-10 sm:py-8">
              <div className="grid gap-4">
                <label className="block">
                  <div className="text-sm font-semibold text-slate-900">Login</div>
                  <input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Ex: João Pedro"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sud-blue/60 focus:ring-4 focus:ring-sud-blue/15"
                  />
                </label>

                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-900">Senha</div>
                    <button
                      type="button"
                      onClick={() => setShowCode((v) => !v)}
                      className="rounded-full bg-sud-gray px-3 py-1 text-xs font-bold text-slate-800 ring-1 ring-slate-200 transition hover:bg-white"
                    >
                      {showCode ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                  <input
                    type={showCode ? "text" : "password"}
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Mínimo 4 caracteres"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sud-blue/60 focus:ring-4 focus:ring-sud-blue/15"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div
                  className={cn(
                    "text-sm font-semibold text-red-600 transition-opacity",
                    error ? "opacity-100" : "opacity-0",
                  )}
                >
                  {error ?? " "}
                </div>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => {
                      const result = login(name, code);
                      if (!result.ok) {
                        setError(result.error ?? "Não foi possível entrar");
                        return;
                      }
                      router.replace(nextUrl);
                    }}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-sud-blue px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sud-navy focus:outline-none focus:ring-4 focus:ring-sud-blue/25 sm:w-auto"
                  >
                    Entrar
                  </button>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <div className="text-sm font-semibold text-slate-900">
                  Login premium (Google)
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Use para acessar áreas protegidas por sessão (ex: dashboard).
                </div>
                <button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-sud-gray focus:outline-none focus:ring-4 focus:ring-slate-200/60"
                >
                  Entrar com Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
