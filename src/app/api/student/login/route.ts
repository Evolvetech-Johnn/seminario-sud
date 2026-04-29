import { NextResponse } from "next/server";

import { getMongoDb } from "@/lib/mongodb";
import { verifyPassword } from "@/lib/password";
import { rateLimit } from "@/lib/server/security";

function asString(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export async function POST(req: Request) {
  const rl = rateLimit(req, "student_login", { windowMs: 60_000, max: 60 });
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
  const password = asString(body?.password, 200);
  if (login.length < 2 || password.length < 4) {
    return NextResponse.json({ ok: false, error: "Credenciais inválidas" }, { status: 400 });
  }

  const student = await db.collection("students").findOne(
    { login },
    { projection: { _id: 0, id: 1, name: 1, email: 1, login: 1, salt: 1, hash: 1 } },
  );

  if (!student || !student.salt || !student.hash) {
    return NextResponse.json({ ok: false, error: "Credenciais inválidas" }, { status: 401 });
  }

  const ok = verifyPassword(password, String(student.salt), String(student.hash));
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Credenciais inválidas" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    data: {
      student: {
        id: String(student.id),
        name: String(student.name ?? ""),
        email: student.email ? String(student.email) : null,
        login: String(student.login ?? login),
      },
    },
  });
}

