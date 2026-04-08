"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 sm:py-16">
      <div className="rounded-3xl border border-slate-200 bg-sud-gray p-6 shadow-sm sm:p-10">
        <div className="text-sm font-semibold text-slate-700">Acesso do professor</div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {initialized === false ? "Crie sua senha" : "Entre com sua senha"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
          Apenas professores têm acesso às respostas dos alunos.
        </p>
        <label className="mt-6 block">
          <div className="text-sm font-semibold text-slate-900">Usuário</div>
          <input
            value={username}
            readOnly
            className="mt-2 w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none"
          />
        </label>
        <label className="mt-6 block">
          <div className="text-sm font-semibold text-slate-900">Senha</div>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            placeholder="********"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sud-blue/60 focus:ring-4 focus:ring-sud-blue/15"
          />
        </label>
        {initialized === false ? (
          <label className="mt-4 block">
            <div className="text-sm font-semibold text-slate-900">Confirmar senha</div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="********"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sud-blue/60 focus:ring-4 focus:ring-sud-blue/15"
            />
          </label>
        ) : null}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm font-semibold text-red-600">{error ?? "\u00A0"}</div>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="inline-flex items-center justify-center rounded-2xl bg-sud-blue px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sud-navy focus:outline-none focus:ring-4 focus:ring-sud-blue/25"
          >
            {isSubmitting ? "Salvando..." : initialized === false ? "Criar" : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
