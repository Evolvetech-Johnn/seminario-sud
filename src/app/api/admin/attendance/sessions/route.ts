import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getMongoDb } from "@/lib/mongodb";
import { getTeacherSession } from "@/lib/server/teacherAuth";
import { requireSameOrigin, rateLimit } from "@/lib/server/security";

function generateCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(6);
  let out = "";
  for (let i = 0; i < bytes.length; i += 1) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return out;
}

function asString(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export async function GET(req: Request) {
  await cookies();
  const auth = Boolean(await getTeacherSession());
  if (!auth) return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });

  const url = new URL(req.url);
  const dateIso = asString(url.searchParams.get("date"), 20);
  const limitParsed = Number(url.searchParams.get("limit"));
  const limit = Number.isFinite(limitParsed) && limitParsed > 0 ? Math.min(60, Math.floor(limitParsed)) : 20;

  const db = await getMongoDb();
  if (!db) return NextResponse.json({ ok: false, error: "MongoDB não configurado" }, { status: 500 });

  const query: Record<string, unknown> = {};
  if (dateIso) query.dateIso = dateIso;

  const sessions = await db
    .collection("attendance_sessions")
    .find(query, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  const sessionIds = sessions.map((s: any) => String(s.id));
  const counts = new Map<string, { total: number; present: number }>();
  if (sessionIds.length) {
    const agg = await db
      .collection("attendance_records")
      .aggregate([
        { $match: { sessionId: { $in: sessionIds } } },
        {
          $group: {
            _id: "$sessionId",
            total: { $sum: 1 },
            present: {
              $sum: {
                $cond: ["$present", 1, 0],
              },
            },
          },
        },
      ])
      .toArray();

    for (const row of agg as any[]) {
      const id = String(row?._id ?? "");
      if (!id) continue;
      counts.set(id, {
        total: Number(row?.total ?? 0),
        present: Number(row?.present ?? 0),
      });
    }
  }

  const items = (sessions as any[]).map((s) => {
    const c = counts.get(String(s.id)) ?? { total: 0, present: 0 };
    return {
      id: String(s.id),
      dateIso: String(s.dateIso),
      lessonSlug: s.lessonSlug ?? null,
      createdAt: String(s.createdAt),
      totalStudents: c.total,
      presentCount: c.present,
      absentCount: Math.max(0, c.total - c.present),
    };
  });

  return NextResponse.json({ ok: true, data: items });
}

export async function POST(req: Request) {
  const sameOrigin = requireSameOrigin(req);
  if (!sameOrigin.ok) return NextResponse.json({ ok: false, error: sameOrigin.error }, { status: 403 });
  const rl = rateLimit(req, "admin_attendance_create", { windowMs: 60_000, max: 12 });
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

  const body = (await req.json().catch(() => null)) as any;
  const dateIso = asString(body?.dateIso, 20) || new Date().toISOString().slice(0, 10);
  const lessonSlug = asString(body?.lessonSlug, 120) || null;

  const students = await db
    .collection("students")
    .find({}, { projection: { _id: 0, id: 1, name: 1, email: 1 } })
    .sort({ name: 1 })
    .toArray();

  const now = new Date().toISOString();
  const session = {
    id: `att:${crypto.randomUUID()}`,
    dateIso,
    lessonSlug,
    createdAt: now,
  };

  await db.collection("attendance_sessions").insertOne(session as any);

  const records = (students as any[]).map((s) => ({
    id: `attrec:${crypto.randomUUID()}`,
    sessionId: session.id,
    studentId: String(s.id),
    studentName: String(s.name ?? ""),
    studentEmail: s.email ?? null,
    code: generateCode(),
    present: false,
    confirmedAt: null,
    createdAt: now,
  }));

  if (records.length) {
    await db.collection("attendance_records").insertMany(records as any[]);
  }

  return NextResponse.json({ ok: true, data: { session, records } }, { status: 201 });
}
