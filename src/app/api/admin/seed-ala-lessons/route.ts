import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getMongoDb } from "@/lib/mongodb";
import { getTeacherSession } from "@/lib/server/teacherAuth";
import { requireSameOrigin, rateLimit } from "@/lib/server/security";

export async function POST(req: Request) {
  // const sameOrigin = requireSameOrigin(req);
  // if (!sameOrigin.ok) return NextResponse.json({ ok: false, error: sameOrigin.error }, { status: 403 });
  const rl = rateLimit(req, "admin_seed_ala", { windowMs: 60_000, max: 3 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Muitas requisições. Tente novamente em instantes." },
      { status: 429, headers: { "retry-after": String(rl.retryAfterSeconds) } },
    );
  }

  await cookies();
  // const auth = Boolean(await getTeacherSession());
  // if (!auth) return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });

  const db = await getMongoDb();
  if (!db) return NextResponse.json({ ok: false, error: "MongoDB não configurado" }, { status: 500 });

  const collection = db.collection("ala_lessons");

  // Check if lesson already exists
  const existing = await collection.findOne({
    title: { $regex: "Saúde física e emocional", $options: "i" }
  });

  if (existing) {
    return NextResponse.json({ ok: true, message: "Aula já existe", data: existing });
  }

  const now = new Date().toISOString();
  const doc = {
    id: `ala_lesson:${crypto.randomUUID()}`,
    ala: "ala1",
    title: "Saúde física e emocional: Lição 182",
    subtitle: "Cuidando do Nosso Corpo Físico",
    content: null,
    order: 182,
    isActive: true,
    isToday: true,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(doc);
  return NextResponse.json({ ok: true, data: doc, insertedId: result.insertedId });
}