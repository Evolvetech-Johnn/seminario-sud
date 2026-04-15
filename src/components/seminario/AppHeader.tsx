"use client";

import Link from "next/link";

import { cn } from "@/lib/cn";

type AppHeaderProps = {
  activeHref?: string;
  studentName?: string | null;
  onLogout?: () => void;
  className?: string;
};

const navItems = [
  { href: "/aulas/exodo-16", label: "Aula atual" },
  { href: "/aulas/exodo-12-13", label: "Aulas anteriores" },
] as const;

export function AppHeader({
  activeHref,
  studentName,
  onLogout,
  className,
}: AppHeaderProps) {
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
            {navItems.map((item) => {
              const isActive = activeHref === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3 py-2 text-xs font-semibold text-white/85 transition hover:bg-white/10 hover:text-white sm:text-sm",
                    isActive && "bg-white/15 text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
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
