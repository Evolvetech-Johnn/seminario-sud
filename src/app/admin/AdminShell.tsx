"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [teacher, setTeacher] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/me", { cache: "no-store" })
      .then(async (res) => {
        const json = (await res.json().catch(() => null)) as any;
        if (cancelled) return;
        setAuthenticated(Boolean(json?.authenticated));
        setTeacher(json?.teacher && typeof json.teacher === "object" ? { name: String(json.teacher.name ?? ""), email: String(json.teacher.email ?? "") } : null);
      })
      .catch(() => {
        if (cancelled) return;
        setAuthenticated(false);
        setTeacher(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-sud-gray">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="text-sm font-extrabold tracking-wide text-sud-navy">Seminário SUD</div>
            <div className="hidden text-sm font-semibold text-slate-600 sm:block">Professor</div>
          </div>

          <nav className="flex items-center gap-2">
            <Link
              href="/admin/dashboard"
              className={cn(
                "rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100",
                pathname?.startsWith("/admin/dashboard") && "bg-slate-100 text-slate-900",
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/attendance"
              className={cn(
                "rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100",
                pathname?.startsWith("/admin/attendance") && "bg-slate-100 text-slate-900",
              )}
            >
              Chamada
            </Link>
            <Link
              href="/admin/students"
              className={cn(
                "rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100",
                pathname?.startsWith("/admin/students") && "bg-slate-100 text-slate-900",
              )}
            >
              Alunos
            </Link>
            <Link
              href="/admin/teachers"
              className={cn(
                "rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100",
                pathname?.startsWith("/admin/teachers") && "bg-slate-100 text-slate-900",
              )}
            >
              Professores
            </Link>
            <Link
              href="/professor/respostas"
              className={cn(
                "rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100",
                pathname?.startsWith("/professor/respostas") && "bg-slate-100 text-slate-900",
              )}
            >
              Respostas
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {authenticated === true && teacher?.name ? (
              <div
                className="hidden max-w-[16rem] truncate rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-800 ring-1 ring-slate-200 sm:block"
                title={teacher.email ? `${teacher.name} (${teacher.email})` : teacher.name}
              >
                {teacher.name}
              </div>
            ) : null}
            {authenticated === false ? (
              <button
                type="button"
                onClick={() => router.push("/professor/login")}
                className="rounded-xl bg-sud-navy px-3 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90"
              >
                Entrar
              </button>
            ) : null}
            {authenticated === true ? (
              <button
                type="button"
                onClick={async () => {
                  await fetch("/api/teacher/logout?next=/professor/login", { method: "POST" }).catch(() => null);
                  router.push("/professor/login");
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
              >
                Sair
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {authenticated === false ? (
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm font-semibold text-slate-700 sm:px-6">
          Você precisa estar logado como professor para acessar essa área.
        </div>
      ) : null}

      <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>
    </div>
  );
}
