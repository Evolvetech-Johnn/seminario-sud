"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { cn } from "@/lib/cn";
import { useAuthStore } from "@/modules/auth/auth.store";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);

  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginRoute) return;
    if (!accessToken) router.replace("/admin/login");
  }, [accessToken, isLoginRoute, router]);

  if (!isLoginRoute && !accessToken) return null;

  return (
    <div className="min-h-screen bg-sud-gray">
      {!isLoginRoute ? (
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="text-sm font-extrabold tracking-wide text-sud-navy">
                Seminário SUD
              </div>
              <div className="hidden text-sm font-semibold text-slate-600 sm:block">
                Admin
              </div>
            </div>

            <nav className="flex items-center gap-2">
              <Link
                href="/admin/dashboard"
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100",
                  pathname === "/admin/dashboard" && "bg-slate-100 text-slate-900",
                )}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/lessons"
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100",
                  pathname?.startsWith("/admin/lessons") && "bg-slate-100 text-slate-900",
                )}
              >
                Aulas
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
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden text-xs font-semibold text-slate-600 sm:block">
                {user ? `${user.name} (${user.role})` : null}
              </div>
              <button
                type="button"
                onClick={() => {
                  clearSession();
                  router.push("/admin/login");
                }}
                className="rounded-xl bg-sud-navy px-3 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className={!isLoginRoute ? "mx-auto max-w-6xl px-4 sm:px-6" : ""}>
        {children}
      </div>
    </div>
  );
}
