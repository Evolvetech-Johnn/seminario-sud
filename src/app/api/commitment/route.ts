import { NextResponse } from "next/server";

import { getMongoDb } from "@/lib/mongodb";

type CommitmentPayload = {
  lessonSlug?: unknown;
  studentId?: unknown;
  studentName?: unknown;
  plan?: {
    before?: unknown;
    during?: unknown;
    after?: unknown;
  };
};

function asLimitedString(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  return value.slice(0, maxLen);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as CommitmentPayload | null;
  const lessonSlug =
    body && typeof body.lessonSlug === "string" ? body.lessonSlug : null;

  if (!lessonSlug) {
    return NextResponse.json(
      { ok: false, error: "lessonSlug obrigatório" },
      { status: 400 },
    );
  }

  const plan = {
    before: asLimitedString(body?.plan?.before, 2000),
    during: asLimitedString(body?.plan?.during, 2000),
    after: asLimitedString(body?.plan?.after, 2000),
  };

  const studentId = asLimitedString(body?.studentId, 80) || null;
  const studentName = asLimitedString(body?.studentName, 80) || null;

  const db = await getMongoDb();
  if (db && studentId) {
    const now = new Date();
    await db.collection("commitments").updateOne(
      { lessonSlug, studentId },
      {
        $set: { lessonSlug, studentId, studentName, plan, updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    );

    return NextResponse.json({
      ok: true,
      lessonSlug,
      studentId,
      studentName,
      plan,
      savedAt: now.toISOString(),
      storage: "mongo",
    });
  }

  return NextResponse.json({
    ok: true,
    lessonSlug,
    studentId,
    studentName,
    plan,
    savedAt: new Date().toISOString(),
    storage: db ? "mongo" : "local",
  });
}
