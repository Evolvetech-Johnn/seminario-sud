import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getMongoDb } from "@/lib/mongodb";
import { getTeacherSession } from "@/lib/server/teacherAuth";
import { requireSameOrigin, rateLimit } from "@/lib/server/security";

function requireTeacherAuth() {
  return cookies().then(async () => Boolean(await getTeacherSession()));
}

function asString(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

function normalizeEmail(raw: string) {
  return raw.trim().toLowerCase();
}

function hashPassword(password: string, salt: string) {
  const buf = crypto.scryptSync(password, salt, 64);
  return buf.toString("base64");
}

function slugifyName(name: string) {
  const normalized = name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, ".")
    .replace(/\.+/g, ".")
    .slice(0, 40);
  return normalized || "professor";
}

function generateTempPassword() {
  return crypto.randomBytes(9).toString("base64url");
}

export async function POST(req: Request) {
  const sameOrigin = requireSameOrigin(req);
  if (!sameOrigin.ok) return NextResponse.json({ ok: false, error: sameOrigin.error }, { status: 403 });
  const rl = rateLimit(req, "admin_teacher_create", { windowMs: 60_000, max: 10 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Muitas requisições. Tente novamente em instantes." },
      { status: 429, headers: { "retry-after": String(rl.retryAfterSeconds) } },
    );
  }

  const auth = await requireTeacherAuth();
  if (!auth) return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });

  const db = await getMongoDb();
  if (!db) return NextResponse.json({ ok: false, error: "MongoDB não configurado" }, { status: 500 });

  const body = (await req.json().catch(() => null)) as any;
  const name = asString(body?.name, 120);
  const emailRaw = asString(body?.email, 180);
  if (name.length < 2) return NextResponse.json({ ok: false, error: "Nome inválido" }, { status: 400 });

  const suffix = crypto.randomBytes(3).toString("hex");
  const generatedEmail = `${slugifyName(name)}.${suffix}@seminario.local`;
  const email = normalizeEmail(emailRaw || generatedEmail);
  if (!email.includes("@") || email.startsWith("@") || email.endsWith("@")) {
    return NextResponse.json({ ok: false, error: "Email inválido" }, { status: 400 });
  }

  const authCol = db.collection("teacher_auth");
  const existing = await authCol.findOne({ email }, { projection: { _id: 0, email: 1 } });
  if (existing) return NextResponse.json({ ok: false, error: "Email já existe" }, { status: 409 });

  const password = generateTempPassword();
  const salt = crypto.randomBytes(16).toString("base64");
  const hash = hashPassword(password, salt);
  const now = new Date();

  await authCol.insertOne({
    email,
    name,
    salt,
    hash,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json(
    {
      ok: true,
      data: {
        email,
        name,
        tempPassword: password,
      },
    },
    { status: 201 },
  );
}
