import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getMongoDb } from "@/lib/mongodb";
import { getTeacherSession } from "@/lib/server/teacherAuth";

function asString(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  await cookies();
  const auth = Boolean(await getTeacherSession());
  if (!auth) return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });

  const { id } = await context.params;
  const sessionId = asString(id, 120);
  if (!sessionId) return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });

  const db = await getMongoDb();
  if (!db) return NextResponse.json({ ok: false, error: "MongoDB não configurado" }, { status: 500 });

  const session = await db
    .collection("attendance_sessions")
    .findOne({ id: sessionId }, { projection: { _id: 0 } });

  if (!session) return NextResponse.json({ ok: false, error: "Não encontrado" }, { status: 404 });

  const records = await db
    .collection("attendance_records")
    .find({ sessionId }, { projection: { _id: 0 } })
    .sort({ studentName: 1 })
    .toArray();

  return NextResponse.json({ ok: true, data: { session, records } });
}
