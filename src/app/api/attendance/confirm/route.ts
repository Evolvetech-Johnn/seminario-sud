import { NextResponse } from "next/server";

import { getMongoDb } from "@/lib/mongodb";

function asString(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export async function POST(req: Request) {
  const db = await getMongoDb();
  if (!db) return NextResponse.json({ ok: false, error: "MongoDB não configurado" }, { status: 500 });

  const body = (await req.json().catch(() => null)) as any;
  const code = asString(body?.code, 20).toUpperCase();
  const dateIso = asString(body?.dateIso, 20) || new Date().toISOString().slice(0, 10);

  if (code.length < 4) return NextResponse.json({ ok: false, error: "Código inválido" }, { status: 400 });

  const session = await db
    .collection("attendance_sessions")
    .find({ dateIso })
    .sort({ createdAt: -1 })
    .limit(1)
    .next();

  if (!session) return NextResponse.json({ ok: false, error: "Sem chamada hoje" }, { status: 404 });

  const record = await db.collection("attendance_records").findOne({ sessionId: session.id, code }, { projection: { _id: 0 } });
  if (!record) return NextResponse.json({ ok: false, error: "Código inválido" }, { status: 401 });

  if (!record.present) {
    await db.collection("attendance_records").updateOne(
      { id: record.id },
      { $set: { present: true, confirmedAt: new Date().toISOString() } },
    );
  }

  return NextResponse.json({
    ok: true,
    data: {
      studentName: record.studentName ?? null,
      alreadyConfirmed: Boolean(record.present),
    },
  });
}

