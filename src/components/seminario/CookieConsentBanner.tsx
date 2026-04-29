"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { cn } from "@/lib/cn";
import type { LgpdConsentValue } from "@/lib/lgpd";

type Props = {
  initialConsent: LgpdConsentValue | null;
};

export function CookieConsentBanner({ initialConsent }: Props) {
  const [consent, setConsent] = useState<LgpdConsentValue | null>(initialConsent);
  const [pending, setPending] = useState(false);
  const visible = useMemo(() => consent === null, [consent]);

  const send = useCallback(
    async (value: LgpdConsentValue) => {
      if (pending) return;
      setPending(true);
      try {
        const res = await fetch("/api/lgpd/consent", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ value }),
        });
        if (!res.ok) throw new Error("Falha ao salvar preferências");
        setConsent(value);
      } catch {
        setPending(false);
      } finally {
        setPending(false);
      }
    },
    [pending],
  );

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5">
        <div className="grid gap-3 px-5 py-4 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:px-6">
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900">Cookies e LGPD</div>
            <div className="mt-1 text-sm leading-relaxed text-slate-700">
              Usamos cookies essenciais para o funcionamento do sistema. Cookies não essenciais só serão
              usados com sua autorização. Leia em{" "}
              <Link href="/lgpd" className="font-bold text-sud-navy underline">
                LGPD
              </Link>
              .
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => send("rejected")}
              className={cn(
                "rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50 disabled:opacity-60",
              )}
            >
              Rejeitar
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => send("accepted")}
              className={cn(
                "rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90 disabled:opacity-60",
              )}
            >
              Aceitar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

