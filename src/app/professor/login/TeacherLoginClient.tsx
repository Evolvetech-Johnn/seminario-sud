"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/cn";

export function TeacherLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = useMemo(() => {
    const raw = searchParams.get("next");
    if (!raw) return "/professor/respostas";
    if (!raw.startsWith("/")) return "/professor/respostas";
    return raw;
  }, [searchParams]);

  const [username] = useState("johnathan");
  const [initialized, setInitialized] = useState<boolean | null>(null);
  const [ready, setReady] = useState<boolean>(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/teacher/status", { cache: "no-store" })
      .then(async (res) => {
        const j = await res.json().catch(() => null);
        if (cancelled) return;
        if (!res.ok) {
          setReady(false);
          setError(j?.error ?? "Não foi possível verificar o acesso do professor");
          setInitialized(false);
          return;
        }
        setReady(Boolean(j?.ready ?? true));
        setInitialized(Boolean(j?.initialized));
        if (j?.error) setError(String(j.error));
      })
      .catch(() => {
        if (cancelled) return;
        setReady(false);
        setError("Não foi possível verificar o acesso do professor");
        setInitialized(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const canSubmit = useMemo(() => {
    if (initialized === null) return false;
    if (isSubmitting) return false;
    if (!password) return false;
    if (initialized === false && !confirmPassword) return false;
    return true;
  }, [confirmPassword, initialized, isSubmitting, password]);

  const onSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/teacher/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          initialized
            ? { username, password }
            : { username, password, confirmPassword },
        ),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        setError(j?.error ?? "Erro ao autenticar");
        return;
      }
      router.replace(nextUrl);
    } catch {
      setError("Falha de rede ao tentar salvar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-sud-navy via-white to-white" />
      <div className="relative mx-auto max-w-md px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-white/60 backdrop-blur transition hover:bg-white"
          >
            Voltar para o site público
          </Link>
          <div className="text-xs font-semibold text-white/85">Professor</div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/80 shadow-xl ring-1 ring-slate-200/50 backdrop-blur">
          <div className="border-b border-slate-200/70 bg-white px-6 py-6 sm:px-10">
            <div className="text-sm font-semibold text-slate-700">Acesso do professor</div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {initialized === false ? "Crie sua senha" : "Entre com sua senha"}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
              Apenas professores têm acesso às respostas dos alunos.
            </p>
          </div>

          <div className="px-6 py-6 sm:px-10 sm:py-8">
            {!ready ? (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error ?? "Não foi possível verificar o acesso do professor"}
              </div>
            ) : null}

            <label className="block">
              <div className="text-sm font-semibold text-slate-900">Usuário</div>
              <input
                value={username}
                readOnly
                className="mt-2 w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none"
              />
            </label>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-900">Senha</div>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="rounded-full bg-sud-gray px-3 py-1 text-xs font-bold text-slate-800 ring-1 ring-slate-200 transition hover:bg-white"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="********"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sud-blue/60 focus:ring-4 focus:ring-sud-blue/15"
              />
            </div>

            {initialized === false ? (
              <div className="mt-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-900">Confirmar senha</div>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="rounded-full bg-sud-gray px-3 py-1 text-xs font-bold text-slate-800 ring-1 ring-slate-200 transition hover:bg-white"
                  >
                    {showConfirmPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="********"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sud-blue/60 focus:ring-4 focus:ring-sud-blue/15"
                />
              </div>
            ) : null}

            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="min-h-5 text-sm font-semibold text-red-600">
                {error ?? "\u00A0"}
              </div>
              <button
                type="button"
                onClick={onSubmit}
                disabled={!canSubmit}
                className={cn(
                  "inline-flex items-center justify-center rounded-2xl bg-sud-blue px-5 py-3 text-sm font-bold text-white shadow-sm transition focus:outline-none focus:ring-4 focus:ring-sud-blue/25",
                  canSubmit ? "hover:bg-sud-navy" : "cursor-not-allowed opacity-70",
                )}
              >
                {isSubmitting ? "Salvando..." : initialized === false ? "Criar" : "Entrar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
