import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getMongoDb } from "@/lib/mongodb";
import { getTeacherSession } from "@/lib/server/teacherAuth";
import { requireSameOrigin, rateLimit } from "@/lib/server/security";

function asString(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

function normalizeEmail(raw: string) {
  return raw.trim().toLowerCase();
}

export async function PUT(req: Request, context: { params: Promise<{ email: string }> }) {
  const sameOrigin = requireSameOrigin(req);
  if (!sameOrigin.ok) return NextResponse.json({ ok: false, error: sameOrigin.error }, { status: 403 });
  const rl = rateLimit(req, "admin_teacher_update", { windowMs: 60_000, max: 60 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Muitas requisições. Tente novamente em instantes." },
      { status: 429, headers: { "retry-after": String(rl.retryAfterSeconds) } },
    );
  }

  const auth = await cookies().then(async () => Boolean(await getTeacherSession()));
  if (!auth) return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });

  const db = await getMongoDb();
  if (!db) return NextResponse.json({ ok: false, error: "MongoDB não configurado" }, { status: 500 });

  const currentEmail = decodeURIComponent((await context.params).email);
  const body = (await req.json().catch(() => null)) as any;

  const name = body?.name === undefined ? undefined : asString(body?.name, 120);
  const email = body?.email === undefined ? undefined : normalizeEmail(asString(body?.email, 180));
  if (name !== undefined && name.length < 2) {
    return NextResponse.json({ ok: false, error: "Nome inválido" }, { status: 400 });
  }
  if (email !== undefined) {
    if (!email.includes("@") || email.startsWith("@") || email.endsWith("@")) {
      return NextResponse.json({ ok: false, error: "Email inválido" }, { status: 400 });
    }
    if (email !== currentEmail) {
      const existing = await db.collection("teacher_auth").findOne({ email }, { projection: { _id: 0, email: 1 } });
      if (existing) return NextResponse.json({ ok: false, error: "Email já existe" }, { status: 409 });
    }
  }

  const update: Record<string, unknown> = { updatedAt: new Date() };
  if (name !== undefined) update.name = name;
  if (email !== undefined) update.email = email;

  const res = await db.collection("teacher_auth").findOneAndUpdate(
    { email: currentEmail },
    { $set: update },
    { returnDocument: "after", projection: { _id: 0, id: 1, email: 1, name: 1, createdAt: 1, updatedAt: 1 } },
  );

  const doc = res?.value as any;
  if (!doc) return NextResponse.json({ ok: false, error: "Professor não encontrado" }, { status: 404 });
  return NextResponse.json({ ok: true, data: doc });
}
