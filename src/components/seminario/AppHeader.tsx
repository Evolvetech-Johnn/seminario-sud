"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { allLessonMetas } from "@/features/lessons/lessonMetas";
import { useStudentSession } from "@/hooks/useStudentSession";

const ALA_LINKS = [
  { label: "Ala 1", href: "/ala/ala1" },
  { label: "Ala 2", href: "/ala/ala2" },
  { label: "Ala 3", href: "/ala/ala3" },
];

type AppHeaderProps = {
  activeHref?: string;
  studentName?: string | null;
  onLogout?: () => void;
  className?: string;
};

type LessonItem = {
  slug: string;
  title: string;
  theme: string;
  isoDate?: string;
  lessonNumber?: number | null;
};

function formatLessonDatePtBr(iso?: string) {
  if (!iso) return null;
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatMonthLabelPtBr(iso?: string) {
  if (!iso) return "Sem data";
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Sem data";
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(date);
}

function parseLessonNumberFromSlug(slug: string) {
  const match = /^aula-(\d+)-/.exec(slug);
  if (!match) return null;
  const n = Number(match[1]);
  if (!Number.isFinite(n)) return null;
  return n;
}

function pickTodayLessonSlug(items: LessonItem[]) {
  if (!items.length) return null;
  const todayIso = new Date().toISOString().slice(0, 10);
  const sorted = [...items].sort((a, b) => (a.isoDate ?? "").localeCompare(b.isoDate ?? ""));
  const lastOnOrBeforeToday = [...sorted].reverse().find((l) => (l.isoDate ?? "") <= todayIso) ?? null;
  return (lastOnOrBeforeToday ?? sorted[0])?.slug ?? null;
}

export function AppHeader({
  activeHref,
  studentName,
  onLogout,
  className,
}: AppHeaderProps) {
  const pathname = usePathname() ?? "/";
  const { session, logout: sessionLogout } = useStudentSession();
  const currentStudentName = studentName ?? session?.name ?? null;
  const handleLogout = onLogout ?? sessionLogout;
  const loginHref = `/login?next=${encodeURIComponent(pathname)}`;
  const forgotHref = "/login?mode=setPassword";
  const [query, setQuery] = useState("");

  const lessonItems = useMemo<LessonItem[]>(
    () =>
      allLessonMetas.map((lesson) => ({
        slug: lesson.slug,
        title: lesson.title,
        theme: lesson.subtitle,
        isoDate: lesson.date,
        lessonNumber: parseLessonNumberFromSlug(lesson.slug),
      })),
    [],
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const sorted = [...lessonItems].sort((a, b) => {
      const byDate = (a.isoDate ?? "").localeCompare(b.isoDate ?? "");
      if (byDate !== 0) return byDate;
      return (a.lessonNumber ?? 0) - (b.lessonNumber ?? 0);
    });

    if (!normalizedQuery) return sorted;
    return sorted.filter((item) => {
      const haystack = `${item.lessonNumber ?? ""} ${item.title} ${item.theme} ${item.slug}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [lessonItems, query]);

  const todayLessonSlug =
    lessonItems.find((item) => item.lessonNumber === 70)?.slug ?? pickTodayLessonSlug(lessonItems);
  const todayHref = todayLessonSlug ? `/aulas/${todayLessonSlug}` : "/";

  const groupedItems = useMemo(() => {
    const groups = new Map<string, LessonItem[]>();
    for (const item of filteredItems) {
      const key = formatMonthLabelPtBr(item.isoDate);
      const current = groups.get(key);
      if (current) current.push(item);
      else groups.set(key, [item]);
    }
    return Array.from(groups.entries());
  }, [filteredItems]);

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
            Aulas do primeiro semestre
          </div>
        </div>

        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href={todayHref}
              prefetch={false}
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
                  <div className="mt-3">
                    <input
                      id="lesson-search"
                      name="lesson-search"
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Buscar por aula, tema ou número…"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/90 placeholder:text-white/50 outline-none ring-0 transition focus:border-white/20 focus:bg-white/10"
                    />
                  </div>
                </div>
                <div className="max-h-[70vh] overflow-y-auto p-2">
                  {groupedItems.map(([groupLabel, items]) => (
                    <div key={groupLabel} className="pb-2">
                      <div className="px-3 pb-2 pt-3 text-[11px] font-bold capitalize tracking-wide text-white/60">
                        {groupLabel}
                      </div>
                      <div className="grid gap-1">
                        {items.map((item) => {
                          const href = `/aulas/${item.slug}`;
                          const isActive = activeHref === href;
                          const isToday = item.slug === todayLessonSlug;
                          const dateLabel = formatLessonDatePtBr(item.isoDate);

                          return (
                            <Link
                              key={item.slug}
                              href={href}
                              prefetch={false}
                              className={cn(
                                "rounded-3xl px-4 py-3 transition hover:bg-white/10",
                                isActive && "bg-white/10 ring-1 ring-white/15",
                                isToday && "ring-1 ring-sud-green/40",
                              )}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    {typeof item.lessonNumber === "number" ? (
                                      <div className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/80 ring-1 ring-white/10">
                                        Aula {item.lessonNumber}
                                      </div>
                                    ) : null}
                                    <div className="truncate text-sm font-bold text-white">{item.title}</div>
                                  </div>
                                  {dateLabel ? (
                                    <div className="mt-1 text-xs font-semibold text-white/80">
                                      {dateLabel}
                                    </div>
                                  ) : null}
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
                  ))}
                </div>
              </div>
            </details>

            {ALA_LINKS.map((ala) => (
              <Link
                key={ala.href}
                href={ala.href}
                prefetch={false}
                className="inline-flex items-center rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white/90 transition hover:bg-white/15 sm:text-sm"
              >
                {ala.label}
              </Link>
            ))}
          </nav>

          {currentStudentName ? (
            <div className="hidden items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white/90 ring-1 ring-white/10 sm:flex">
              <span className="max-w-40 truncate">{currentStudentName}</span>
              <Link
                href={forgotHref}
                className="rounded-full bg-white/10 px-2 py-1 text-xs font-bold text-white/90 transition hover:bg-white/10"
              >
                Esqueci a senha
              </Link>
              {handleLogout ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full px-2 py-1 text-xs font-bold text-white/90 transition hover:bg-white/10"
                >
                  Sair
                </button>
              ) : null}
            </div>
          ) : (
            <Link
              href={loginHref}
              className="inline-flex items-center rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white/90 transition hover:bg-white/15 sm:text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
