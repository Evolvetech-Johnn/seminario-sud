"use client";

import Link from "next/link";

import { cn } from "@/lib/cn";

type AppHeaderProps = {
  activeHref?: string;
  studentName?: string | null;
  onLogout?: () => void;
  className?: string;
};

const todayLessonSlug = "fazer-comparacoes" as const;

const lessonItems = [
  {
    slug: "fazer-comparacoes",
    title: "Fazer Comparações",
    theme: "Habilidade de estudo: comparar para identificar verdades preciosas",
  },
  {
    slug: "exodo-20-1-11",
    title: "Deus em Primeiro Lugar",
    theme: "Êxodo 20:1–11 (Os Dez Mandamentos — amar a Deus acima de tudo)",
  },
  {
    slug: "exodo-16",
    title: "O Pão de Cada Dia",
    theme: "Êxodo 16 (Maná e confiar no Senhor diariamente)",
  },
  {
    slug: "exodo-12-13",
    title: "Memória Sagrada",
    theme: "Êxodo 12–13 (Páscoa e Sacramento)",
  },
] as const;

export function AppHeader({
  activeHref,
  studentName,
  onLogout,
  className,
}: AppHeaderProps) {
  const todayHref = `/aulas/${todayLessonSlug}`;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/10 bg-sud-navy/95 backdrop-blur supports-[backdrop-filter]:bg-sud-navy/80",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <div className="text-base font-bold tracking-wide text-white sm:text-lg">
            Seminário SUD
          </div>
          <div className="text-xs text-white/80 sm:text-sm">
            Aulas de Quarta-feira
          </div>
        </div>

        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href={todayHref}
              className={cn(
                "inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-white shadow-sm ring-1 ring-white/15 transition hover:bg-white/15 sm:text-sm",
                activeHref === todayHref && "bg-white/15 ring-white/25",
              )}
            >
              <span className="h-2 w-2 rounded-full bg-sud-green" />
              Aula de hoje
            </Link>

            <details className="relative">
              <summary
                className={cn(
                  "cursor-pointer list-none rounded-full px-3 py-2 text-xs font-semibold text-white/85 transition hover:bg-white/10 hover:text-white sm:text-sm",
                  activeHref && activeHref.startsWith("/aulas/") && "bg-white/10 text-white",
                )}
              >
                Sumário
              </summary>

              <div className="absolute right-0 top-full mt-2 w-[min(28rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-white/10 bg-sud-navy/95 shadow-xl ring-1 ring-white/10 backdrop-blur">
                <div className="border-b border-white/10 bg-white/5 px-4 py-3">
                  <div className="text-xs font-bold text-white/90">Aulas</div>
                  <div className="mt-1 text-xs text-white/70">
                    Selecione uma aula para abrir. A aula de hoje fica em destaque.
                  </div>
                </div>
                <div className="grid gap-1 p-2">
                  {lessonItems.map((item) => {
                    const href = `/aulas/${item.slug}`;
                    const isActive = activeHref === href;
                    const isToday = item.slug === todayLessonSlug;

                    return (
                      <Link
                        key={item.slug}
                        href={href}
                        className={cn(
                          "rounded-3xl px-4 py-3 transition hover:bg-white/10",
                          isActive && "bg-white/10 ring-1 ring-white/15",
                          isToday && "ring-1 ring-sud-green/40",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-bold text-white">{item.title}</div>
                            <div className="mt-1 text-xs leading-snug text-white/70">{item.theme}</div>
                          </div>
                          {isToday ? (
                            <div className="shrink-0 rounded-full bg-sud-green/15 px-3 py-1 text-[11px] font-bold text-sud-green ring-1 ring-sud-green/30">
                              Hoje
                            </div>
                          ) : null}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </details>
          </nav>

          {studentName ? (
            <div className="hidden items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white/90 ring-1 ring-white/10 sm:flex">
              <span className="max-w-40 truncate">{studentName}</span>
              {onLogout ? (
                <button
                  type="button"
                  onClick={onLogout}
                  className="rounded-full px-2 py-1 text-xs font-bold text-white/90 transition hover:bg-white/10"
                >
                  Sair
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
