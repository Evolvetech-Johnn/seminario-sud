import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getMongoDb } from "@/lib/mongodb";
import { getTeacherSession } from "@/lib/server/teacherAuth";
import { requireSameOrigin, rateLimit } from "@/lib/server/security";
import { createPasswordHash, generateTempPassword } from "@/lib/password";

export async function POST(req: Request, context: { params: Promise<{ email: string }> }) {
  const sameOrigin = requireSameOrigin(req);
  if (!sameOrigin.ok) return NextResponse.json({ ok: false, error: sameOrigin.error }, { status: 403 });
  const rl = rateLimit(req, "admin_teacher_reset_password", { windowMs: 60_000, max: 20 });
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

  const email = decodeURIComponent((await context.params).email).trim().toLowerCase();
  const tempPassword = generateTempPassword();
  const { salt, hash } = createPasswordHash(tempPassword);

  const updatedAt = new Date();
  const res = await db.collection("teacher_auth").findOneAndUpdate(
    { email },
    { $set: { salt, hash, updatedAt } },
    { returnDocument: "after", projection: { _id: 0, id: 1, email: 1, name: 1, updatedAt: 1 } },
  );

  const doc = res?.value as any;
  if (!doc) return NextResponse.json({ ok: false, error: "Professor não encontrado" }, { status: 404 });
  return NextResponse.json({ ok: true, data: { email: doc.email, name: doc.name, tempPassword } });
}

