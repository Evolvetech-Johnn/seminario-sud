import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getMongoDb } from "@/lib/mongodb";
import { getTeacherSession } from "@/lib/server/teacherAuth";
import { requireSameOrigin, rateLimit } from "@/lib/server/security";

function asBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const sameOrigin = requireSameOrigin(req);
  if (!sameOrigin.ok) return NextResponse.json({ ok: false, error: sameOrigin.error }, { status: 403 });
  const rl = rateLimit(req, "admin_attendance_toggle", { windowMs: 60_000, max: 200 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Muitas requisições. Tente novamente em instantes." },
      { status: 429, headers: { "retry-after": String(rl.retryAfterSeconds) } },
    );
  }

  await cookies();
  const auth = Boolean(await getTeacherSession());
  if (!auth) return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });

  const db = await getMongoDb();
  if (!db) return NextResponse.json({ ok: false, error: "MongoDB não configurado" }, { status: 500 });

  const recordId = decodeURIComponent((await context.params).id);
  const body = (await req.json().catch(() => null)) as any;
  const present = asBoolean(body?.present);
  if (present === null) {
    return NextResponse.json({ ok: false, error: "Valor inválido" }, { status: 400 });
  }

  const nowIso = new Date().toISOString();
  const update: Record<string, unknown> = {
    present,
    updatedAt: nowIso,
    confirmedAt: present ? nowIso : null,
    manualOverrideAt: nowIso,
  };

  const res = await db.collection("attendance_records").findOneAndUpdate(
    { id: recordId },
    { $set: update },
    { returnDocument: "after", projection: { _id: 0 } },
  );

  const doc = res?.value as any;
  if (!doc) return NextResponse.json({ ok: false, error: "Registro não encontrado" }, { status: 404 });

  return NextResponse.json({ ok: true, data: doc });
}

