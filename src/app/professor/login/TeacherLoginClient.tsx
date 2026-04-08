"use client";

import { useMemo, useState } from "react";
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

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    const res = await fetch("/api/teacher/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode: code }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => null);
      setError(j?.error ?? "Erro ao autenticar");
      return;
    }
    router.replace(nextUrl);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 sm:py-16">
      <div className="rounded-3xl border border-slate-200 bg-sud-gray p-6 shadow-sm sm:p-10">
        <div className="text-sm font-semibold text-slate-700">Acesso do professor</div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Informe a chave de acesso
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
          Apenas professores têm acesso às respostas dos alunos.
        </p>
        <label className="mt-6 block">
          <div className="text-sm font-semibold text-slate-900">Chave</div>
          <input
            type="password"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError(null);
            }}
            placeholder="********"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sud-blue/60 focus:ring-4 focus:ring-sud-blue/15"
          />
        </label>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm font-semibold text-red-600">{error ?? "\u00A0"}</div>
          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex items-center justify-center rounded-2xl bg-sud-blue px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sud-navy focus:outline-none focus:ring-4 focus:ring-sud-blue/25"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
