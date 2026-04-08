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

export async function GET(req: Request) {
  const url = new URL(req.url);
  const lessonSlug = url.searchParams.get("lessonSlug");
  const studentId = url.searchParams.get("studentId");

  if (!lessonSlug || !studentId) {
    return NextResponse.json(
      { ok: false, error: "lessonSlug e studentId obrigatórios" },
      { status: 400 },
    );
  }

  const db = await getMongoDb();
  if (!db) {
    return NextResponse.json({ ok: true, storage: "local", data: null });
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

  if (!lessonSlug || !studentId) {
    return NextResponse.json(
      { ok: false, error: "lessonSlug e studentId obrigatórios" },
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

