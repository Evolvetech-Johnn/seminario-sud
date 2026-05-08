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

export async function GET(req: Request) {
  const db = await getMongoDb();
  if (!db) return NextResponse.json({ ok: false, error: "MongoDB não configurado" }, { status: 500 });

  const url = new URL(req.url);
  const ala = url.searchParams.get("ala");
  if (!ala || !["ala1", "ala2", "ala3"].includes(ala)) {
    return NextResponse.json({ ok: false, error: "Ala inválida" }, { status: 400 });
  }

  const docs = await db
    .collection("ala_lessons")
    .find({ ala }, { projection: { _id: 0 } })
    .sort({ order: 1 })
    .toArray();

  return NextResponse.json({ ok: true, data: docs, lessons: docs });
}

export async function POST(req: Request) {
  const sameOrigin = requireSameOrigin(req);
  if (!sameOrigin.ok) return NextResponse.json({ ok: false, error: sameOrigin.error }, { status: 403 });
  const rl = rateLimit(req, "admin_ala_lesson_create", { windowMs: 60_000, max: 30 });
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
  const ala = asString(body?.ala, 10).toLowerCase();
  const title = asString(body?.title, 200);
  const subtitle = asString(body?.subtitle, 500);
  const content = body?.content; // JSON structure for lesson content

  if (!["ala1", "ala2", "ala3"].includes(ala)) return NextResponse.json({ ok: false, error: "Ala inválida" }, { status: 400 });
  if (title.length < 2) return NextResponse.json({ ok: false, error: "Título inválido" }, { status: 400 });

  const now = new Date().toISOString();
  const doc = {
    id: `ala_lesson:${crypto.randomUUID()}`,
    ala,
    title,
    subtitle,
    content,
    order: 0, // Will be set by update
    createdAt: now,
    updatedAt: now,
  };

  await db.collection("ala_lessons").insertOne(doc as any);
  return NextResponse.json({ ok: true, data: doc }, { status: 201 });
}

export async function PUT(req: Request) {
  const sameOrigin = requireSameOrigin(req);
  if (!sameOrigin.ok) return NextResponse.json({ ok: false, error: sameOrigin.error }, { status: 403 });

  const auth = await requireTeacherAuth();
  if (!auth) return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });

  const db = await getMongoDb();
  if (!db) return NextResponse.json({ ok: false, error: "MongoDB não configurado" }, { status: 500 });

  const body = (await req.json().catch(() => null)) as any;
  const id = asString(body?.id, 100);
  const updates: any = {};

  if (body?.title !== undefined) updates.title = asString(body.title, 200);
  if (body?.subtitle !== undefined) updates.subtitle = asString(body.subtitle, 500);
  if (body?.content !== undefined) updates.content = body.content;
  if (body?.order !== undefined) updates.order = Number(body.order) || 0;
  if (body?.isToday !== undefined) updates.isToday = Boolean(body.isToday);

  updates.updatedAt = new Date().toISOString();

  const result = await db.collection("ala_lessons").updateOne({ id }, { $set: updates });
  if (result.matchedCount === 0) return NextResponse.json({ ok: false, error: "Aula não encontrada" }, { status: 404 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const sameOrigin = requireSameOrigin(req);
  if (!sameOrigin.ok) return NextResponse.json({ ok: false, error: sameOrigin.error }, { status: 403 });

  const auth = await requireTeacherAuth();
  if (!auth) return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });

  const db = await getMongoDb();
  if (!db) return NextResponse.json({ ok: false, error: "MongoDB não configurado" }, { status: 500 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });

  const result = await db.collection("ala_lessons").deleteOne({ id });
  if (result.deletedCount === 0) return NextResponse.json({ ok: false, error: "Aula não encontrada" }, { status: 404 });

  return NextResponse.json({ ok: true });
}