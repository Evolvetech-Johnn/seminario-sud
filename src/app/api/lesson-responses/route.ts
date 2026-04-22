import { NextResponse } from "next/server";

import { getMongoDb } from "@/lib/mongodb";

type LessonResponsesPayload = {
  lessonSlug?: unknown;
  studentId?: unknown;
  studentName?: unknown;
  answers?: {
    icebreaker?: unknown;
    discussionNotes?: unknown;
    actionBefore?: unknown;
    actionDuring?: unknown;
    actionAfter?: unknown;
  };
};

function asLimitedString(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  return value.slice(0, maxLen);
}

function normalizeText(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function scoreAnswers(answers: LessonResponsesPayload["answers"]) {
  const fields = [
    { key: "icebreaker", base: 10, bonusCap: 10 },
    { key: "discussionNotes", base: 10, bonusCap: 20 },
    { key: "actionBefore", base: 10, bonusCap: 10 },
    { key: "actionDuring", base: 10, bonusCap: 10 },
    { key: "actionAfter", base: 10, bonusCap: 10 },
  ] as const;

  let points = 0;
  let filled = 0;

  for (const f of fields) {
    const raw = (answers as any)?.[f.key];
    const text = normalizeText(raw);
    if (!text) continue;
    filled += 1;
    points += f.base;
    const bonus = Math.min(f.bonusCap, Math.floor(text.length / 120) * 2);
    points += bonus;
  }

  const completionBonus = filled === fields.length ? 25 : 0;
  const multiplier =
    filled === fields.length ? 1.2 : filled === fields.length - 1 ? 1.1 : filled >= 3 ? 1.05 : 1;
  const total = Math.round((points + completionBonus) * multiplier);

  return { points: total, filled };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const lessonSlug = url.searchParams.get("lessonSlug");
  const studentId = url.searchParams.get("studentId");
  const view = url.searchParams.get("view");
  const limitRaw = url.searchParams.get("limit");

  if (!lessonSlug) {
    return NextResponse.json({ ok: false, error: "lessonSlug obrigatório" }, { status: 400 });
  }

  const db = await getMongoDb();
  if (!db) {
    if (!studentId && view === "ranking") {
      return NextResponse.json({ ok: true, storage: "local", data: { items: [] } });
    }
    return NextResponse.json({ ok: true, storage: "local", data: null });
  }

  if (!studentId && view === "ranking") {
    const limitParsed = Number(limitRaw);
    const limit =
      Number.isFinite(limitParsed) && limitParsed > 0 ? Math.min(50, Math.floor(limitParsed)) : 12;

    const docs = await db
      .collection("lesson_responses")
      .find(
        { lessonSlug },
        {
          projection: {
            _id: 0,
            studentId: 1,
            studentName: 1,
            answers: 1,
            updatedAt: 1,
          },
        },
      )
      .sort({ updatedAt: -1 })
      .toArray();

    const byStudentId = new Map<
      string,
      { studentId: string; studentName: string; points: number; filledFields: number; updatedAt: any }
    >();

    for (const d of docs as any[]) {
      const studentId = String(d?.studentId ?? "").trim();
      const studentName = String(d?.studentName ?? "").trim();
      if (!studentId) continue;
      if (studentId === "anon") continue;
      if (!studentName) continue;
      const { points, filled } = scoreAnswers(d?.answers);
      if (points <= 0) continue;

      const current = byStudentId.get(studentId);
      if (!current) {
        byStudentId.set(studentId, {
          studentId,
          studentName,
          points,
          filledFields: filled,
          updatedAt: d?.updatedAt ?? null,
        });
        continue;
      }

      const existingTime = current.updatedAt ? new Date(current.updatedAt).getTime() : 0;
      const incomingTime = d?.updatedAt ? new Date(d.updatedAt).getTime() : 0;
      if (incomingTime > existingTime) {
        byStudentId.set(studentId, {
          studentId,
          studentName,
          points,
          filledFields: filled,
          updatedAt: d?.updatedAt ?? null,
        });
      }
    }

    const items = Array.from(byStudentId.values())
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        const at = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const bt = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return bt - at;
      })
      .slice(0, limit);

    return NextResponse.json({ ok: true, storage: "mongo", data: { items } });
  }

  if (!studentId) {
    return NextResponse.json(
      { ok: false, error: "studentId obrigatório" },
      { status: 400 },
    );
  }

  const doc = await db.collection("lesson_responses").findOne({
    lessonSlug,
    studentId,
  });

  return NextResponse.json({ ok: true, storage: "mongo", data: doc ?? null });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as LessonResponsesPayload | null;
  const lessonSlug =
    body && typeof body.lessonSlug === "string" ? body.lessonSlug : null;
  const studentId = asLimitedString(body?.studentId, 120) || null;
  const studentName = asLimitedString(body?.studentName, 120) || null;

  if (!lessonSlug || !studentId || !studentName) {
    return NextResponse.json(
      { ok: false, error: "lessonSlug, studentId e studentName obrigatórios" },
      { status: 400 },
    );
  }

  const answers = {
    icebreaker: asLimitedString(body?.answers?.icebreaker, 4000),
    discussionNotes: asLimitedString(body?.answers?.discussionNotes, 8000),
    actionBefore: asLimitedString(body?.answers?.actionBefore, 2000),
    actionDuring: asLimitedString(body?.answers?.actionDuring, 2000),
    actionAfter: asLimitedString(body?.answers?.actionAfter, 2000),
  };

  const db = await getMongoDb();
  if (!db) {
    return NextResponse.json({ ok: true, storage: "local", savedAt: new Date().toISOString() });
  }

  const now = new Date();
  await db.collection("lesson_responses").updateOne(
    { lessonSlug, studentId },
    {
      $set: { lessonSlug, studentId, studentName, answers, updatedAt: now },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );

  return NextResponse.json({ ok: true, storage: "mongo", savedAt: now.toISOString() });
}
