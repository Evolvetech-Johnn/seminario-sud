import { NextResponse } from "next/server";

import { LGPD_CONSENT_COOKIE, parseLgpdConsentCookie } from "@/lib/lgpd";
import { requireSameOrigin, rateLimit } from "@/lib/server/security";

export async function POST(req: Request) {
  const sameOrigin = requireSameOrigin(req);
  if (!sameOrigin.ok) return NextResponse.json({ ok: false, error: sameOrigin.error }, { status: 403 });
  const rl = rateLimit(req, "lgpd_consent", { windowMs: 60_000, max: 30 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Muitas requisições. Tente novamente em instantes." },
      { status: 429, headers: { "retry-after": String(rl.retryAfterSeconds) } },
    );
  }

  const body = (await req.json().catch(() => null)) as any;
  const value = parseLgpdConsentCookie(body?.value);
  if (!value) return NextResponse.json({ ok: false, error: "Valor inválido" }, { status: 400 });

  const res = NextResponse.json({ ok: true, data: { value } });

  res.cookies.set({
    name: LGPD_CONSENT_COOKIE,
    value,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });

  if (value === "rejected") {
    const deletions = [
      "_ga",
      "_gid",
      "_gat",
      "_gcl_au",
      "_fbp",
    ];
    for (const name of deletions) {
      res.cookies.set({
        name,
        value: "",
        httpOnly: false,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
      });
    }
  }

  return res;
}
