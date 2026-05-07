import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getMongoDb } from "@/lib/mongodb";
import { getTeacherSession } from "@/lib/server/teacherAuth";
import { requireSameOrigin, rateLimit } from "@/lib/server/security";
import { createPasswordHash, generateTempPassword } from "@/lib/password";

function requireTeacherAuth() {
  return cookies().then(async () => Boolean(await getTeacherSession()));
}

function asString(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

function slugifyLogin(name: string) {
  const normalized = name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, ".")
    .replace(/\.+/g, ".")
    .slice(0, 32);
  return normalized || "aluno";
}

export async function GET() {
  const auth = await requireTeacherAuth();
  if (!auth) return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });

  const db = await getMongoDb();
  if (!db) return NextResponse.json({ ok: false, error: "MongoDB não configurado" }, { status: 500 });

  const docs = await db
    .collection("students")
    .find({}, { projection: { _id: 0 } })
    .sort({ name: 1 })
    .limit(500)
    .toArray();

  const sanitized = (docs as any[]).map((d) => ({
    id: d.id,
    name: d.name,
    email: d.email ?? null,
    login: d.login ?? null,
    ala: d.ala ?? "ala1",
    turma: d.turma ?? "A",
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  }));

  return NextResponse.json({ ok: true, data: sanitized });
}

export async function POST(req: Request) {
  const sameOrigin = requireSameOrigin(req);
  if (!sameOrigin.ok) return NextResponse.json({ ok: false, error: sameOrigin.error }, { status: 403 });
  const rl = rateLimit(req, "admin_student_create", { windowMs: 60_000, max: 30 });
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
  const email = asString(body?.email, 180) || null;
  const requestedLogin = asString(body?.login, 80).toLowerCase() || "";
  const ala = asString(body?.ala, 10).toLowerCase() || "ala1";
  const turma = asString(body?.turma, 10).toUpperCase() || "A";
  if (name.length < 2) return NextResponse.json({ ok: false, error: "Nome inválido" }, { status: 400 });
  if (!["ala1", "ala2", "ala3"].includes(ala)) return NextResponse.json({ ok: false, error: "Ala inválida" }, { status: 400 });

  const tempPassword = generateTempPassword();
  const { salt, hash } = createPasswordHash(tempPassword);

  const loginBase = slugifyLogin(name);
  let login = requestedLogin || loginBase;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const candidate = attempt === 0 ? login : `${loginBase}.${Math.random().toString(16).slice(2, 6)}`;
    const exists = await db.collection("students").findOne({ login: candidate }, { projection: { _id: 0, id: 1 } });
    if (!exists) {
      login = candidate;
      break;
    }
  }
  if (!login) return NextResponse.json({ ok: false, error: "Não foi possível gerar usuário" }, { status: 500 });

  const now = new Date().toISOString();
  const doc = {
    id: `student:${crypto.randomUUID()}`,
    name,
    email,
    login,
    ala,
    turma,
    salt,
    hash,
    createdAt: now,
    updatedAt: now,
  };

  if (email) {
    const existing = await db.collection("students").findOne({ email }, { projection: { _id: 0, id: 1 } });
    if (existing) return NextResponse.json({ ok: false, error: "Email já existe" }, { status: 409 });
  }

  const existingLogin = await db.collection("students").findOne({ login }, { projection: { _id: 0, id: 1 } });
  if (existingLogin) return NextResponse.json({ ok: false, error: "Usuário já existe" }, { status: 409 });

  await db.collection("students").insertOne(doc as any);
  return NextResponse.json(
    {
      ok: true,
      data: {
        id: doc.id,
        name: doc.name,
        email: doc.email,
        login: doc.login,
        ala: doc.ala,
        turma: doc.turma,
        tempPassword,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
    },
    { status: 201 },
  );
}
