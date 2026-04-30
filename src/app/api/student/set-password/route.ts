import { NextResponse } from "next/server";

import { getMongoDb } from "@/lib/mongodb";
import { createPasswordHash, verifyPassword } from "@/lib/password";
import { requireSameOrigin, rateLimit } from "@/lib/server/security";

function asString(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export async function POST(req: Request) {
  const sameOrigin = requireSameOrigin(req);
  if (!sameOrigin.ok) return NextResponse.json({ ok: false, error: sameOrigin.error }, { status: 403 });
  const rl = rateLimit(req, "student_set_password", { windowMs: 60_000, max: 60 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Muitas tentativas. Tente novamente em instantes." },
      { status: 429, headers: { "retry-after": String(rl.retryAfterSeconds) } },
    );
  }

  const db = await getMongoDb();
  if (!db) return NextResponse.json({ ok: false, error: "MongoDB não configurado" }, { status: 500 });

  const body = (await req.json().catch(() => null)) as any;
  const login = asString(body?.login, 80).toLowerCase();
  const tempPassword = asString(body?.tempPassword, 200);
  const newPassword = asString(body?.newPassword, 200);

  if (login.length < 2 || tempPassword.length < 4 || newPassword.length < 6) {
    return NextResponse.json({ ok: false, error: "Dados inválidos" }, { status: 400 });
  }

  const query = login.includes("@") ? { email: login } : { login };
  const student = await db.collection("students").findOne(query, { projection: { _id: 0, id: 1, salt: 1, hash: 1 } });
  if (!student || !student.salt || !student.hash) {
    return NextResponse.json({ ok: false, error: "Credenciais inválidas" }, { status: 401 });
  }

  const ok = verifyPassword(tempPassword, String(student.salt), String(student.hash));
  if (!ok) return NextResponse.json({ ok: false, error: "Senha temporária incorreta" }, { status: 401 });

  const { salt, hash } = createPasswordHash(newPassword);
  const updatedAt = new Date().toISOString();
  await db.collection("students").updateOne({ id: String(student.id) }, { $set: { salt, hash, updatedAt } });

  return NextResponse.json({ ok: true });
}

