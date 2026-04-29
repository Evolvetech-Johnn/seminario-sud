"use client";

import Link from "next/link";

export function LoginClient() {
  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Login Admin</h1>
      <p className="mt-2 text-sm text-slate-600">
        O projeto está usando MongoDB Atlas. O acesso do professor é feito em:
      </p>
      <div className="mt-6">
        <Link
          href="/professor/login"
          className="inline-flex w-full items-center justify-center rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90"
        >
          Ir para login do professor
        </Link>
      </div>
    </div>
  );
}
