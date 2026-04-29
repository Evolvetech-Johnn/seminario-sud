import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getMongoDb } from "@/lib/mongodb";
import { getTeacherSession } from "@/lib/server/teacherAuth";
import { requireSameOrigin, rateLimit } from "@/lib/server/security";

function asString(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const sameOrigin = requireSameOrigin(req);
  if (!sameOrigin.ok) return NextResponse.json({ ok: false, error: sameOrigin.error }, { status: 403 });
  const rl = rateLimit(req, "admin_student_update", { windowMs: 60_000, max: 60 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Muitas requisições. Tente novamente em instantes." },
      { status: 429, headers: { "retry-after": String(rl.retryAfterSeconds) } },
    );
  }

  await cookies();
  const auth = Boolean(await getTeacherSession());
  if (!auth) return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });

  const { id } = await context.params;
  const studentId = asString(id, 80);
  if (!studentId) return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });

  const db = await getMongoDb();
  if (!db) return NextResponse.json({ ok: false, error: "MongoDB não configurado" }, { status: 500 });

  const body = (await req.json().catch(() => null)) as any;
  const name = body?.name === undefined ? undefined : asString(body?.name, 120);
  const email = body?.email === undefined ? undefined : asString(body?.email, 180) || null;
  const login = body?.login === undefined ? undefined : asString(body?.login, 80).toLowerCase();

  if (name !== undefined && name.length < 2) {
    return NextResponse.json({ ok: false, error: "Nome inválido" }, { status: 400 });
  }

  if (email) {
    const existing = await db.collection("students").findOne(
      { email, id: { $ne: studentId } },
      { projection: { _id: 0, id: 1 } },
    );
    if (existing) return NextResponse.json({ ok: false, error: "Email já existe" }, { status: 409 });
  }

  if (login) {
    const existingLogin = await db.collection("students").findOne(
      { login, id: { $ne: studentId } },
      { projection: { _id: 0, id: 1 } },
    );
    if (existingLogin) return NextResponse.json({ ok: false, error: "Usuário já existe" }, { status: 409 });
  }

  const update: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  if (name !== undefined) update.name = name;
  if (email !== undefined) update.email = email;
  if (login !== undefined) update.login = login;

  const res = await db.collection("students").findOneAndUpdate(
    { id: studentId },
    { $set: update },
    { returnDocument: "after", projection: { _id: 0 } },
  );

  const doc = res?.value ?? null;
  if (!doc) return NextResponse.json({ ok: false, error: "Não encontrado" }, { status: 404 });

  const sanitized = {
    id: doc.id,
    name: doc.name,
    email: doc.email ?? null,
    login: doc.login ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  return NextResponse.json({ ok: true, data: sanitized });
}
