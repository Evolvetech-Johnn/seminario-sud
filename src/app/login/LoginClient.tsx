"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AppHeader } from "@/components/seminario/AppHeader";
import { cn } from "@/lib/cn";
import { useStudentSession } from "@/hooks/useStudentSession";

export function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, isHydrated, login } = useStudentSession();

  const nextUrl = useMemo(() => {
    const raw = searchParams.get("next");
    if (!raw) return "/aulas/exodo-16";
    if (!raw.startsWith("/")) return "/aulas/exodo-16";
    return raw;
  }, [searchParams]);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "error">("idle");

  useEffect(() => {
    if (isHydrated && session) {
      router.replace(nextUrl);
    }
  }, [isHydrated, session, nextUrl, router]);

  return (
    <div className="min-h-dvh bg-white">
      <AppHeader />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-3xl border border-slate-200 bg-sud-gray p-6 shadow-sm sm:p-10">
          <div className="text-sm font-semibold text-slate-700">
            Login do aluno
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Entre com seu nome
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
            Assim suas respostas ficam separadas por aluno. Se quiser acessar em outro
            dispositivo, use um código simples (ex: 1234).
          </p>

          <div className="mt-6">
            <label className="block">
              <div className="text-sm font-semibold text-slate-900">Nome</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João Pedro"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sud-blue/60 focus:ring-4 focus:ring-sud-blue/15"
              />
            </label>

            <label className="mt-4 block">
              <div className="text-sm font-semibold text-slate-900">
                Código (opcional)
              </div>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex: 1234"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sud-blue/60 focus:ring-4 focus:ring-sud-blue/15"
              />
            </label>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div
                className={cn(
                  "text-sm font-semibold text-red-600 transition-opacity",
                  status === "error" ? "opacity-100" : "opacity-0",
                )}
              >
                Digite seu nome para continuar.
              </div>
              <button
                type="button"
                onClick={() => {
                  const result = login(name, code);
                  if (!result.ok) {
                    setStatus("error");
                    return;
                  }
                  router.replace(nextUrl);
                }}
                className="inline-flex items-center justify-center rounded-2xl bg-sud-blue px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sud-navy focus:outline-none focus:ring-4 focus:ring-sud-blue/25"
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
