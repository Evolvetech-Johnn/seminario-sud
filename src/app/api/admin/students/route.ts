import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getMongoDb } from "@/lib/mongodb";

function requireTeacherAuth() {
  return cookies().then((c) => c.get("teacherAuth")?.value === "1");
}

function asString(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
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
    .toArray();

  return NextResponse.json({ ok: true, data: docs });
}

export async function POST(req: Request) {
  const auth = await requireTeacherAuth();
  if (!auth) return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });

  const db = await getMongoDb();
  if (!db) return NextResponse.json({ ok: false, error: "MongoDB não configurado" }, { status: 500 });

  const body = (await req.json().catch(() => null)) as any;
  const name = asString(body?.name, 120);
  const email = asString(body?.email, 180) || null;
  if (name.length < 2) return NextResponse.json({ ok: false, error: "Nome inválido" }, { status: 400 });

  const now = new Date().toISOString();
  const doc = {
    id: `student:${crypto.randomUUID()}`,
    name,
    email,
    createdAt: now,
    updatedAt: now,
  };

  if (email) {
    const existing = await db.collection("students").findOne({ email }, { projection: { _id: 0, id: 1 } });
    if (existing) return NextResponse.json({ ok: false, error: "Email já existe" }, { status: 409 });
  }

  await db.collection("students").insertOne(doc as any);
  return NextResponse.json({ ok: true, data: doc }, { status: 201 });
}

