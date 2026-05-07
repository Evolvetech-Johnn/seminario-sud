import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getMongoDb } from "@/lib/mongodb";
import { getTeacherSession } from "@/lib/server/teacherAuth";
import { requireSameOrigin, rateLimit } from "@/lib/server/security";

export async function POST(req: Request) {
  const sameOrigin = requireSameOrigin(req);
  if (!sameOrigin.ok) return NextResponse.json({ ok: false, error: sameOrigin.error }, { status: 403 });
  const rl = rateLimit(req, "admin_migrate_students", { windowMs: 60_000, max: 3 });
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

  const studentsCol = db.collection("students");

  // Add ala and turma to students that don't have them
  const result = await studentsCol.updateMany(
    { ala: { $exists: false } },
    {
      $set: {
        ala: "ala1",
        turma: "A",
        updatedAt: new Date().toISOString(),
      },
    },
  );

  return NextResponse.json({
    ok: true,
    data: {
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
    },
  });
}