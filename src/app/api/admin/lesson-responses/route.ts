import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getMongoDb } from "@/lib/mongodb";
import { getTeacherSession } from "@/lib/server/teacherAuth";

export async function GET(req: Request) {
  await cookies();
  const auth = Boolean(await getTeacherSession());
  if (!auth) {
    return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
  }

  const url = new URL(req.url);
  const lessonSlug = url.searchParams.get("lessonSlug") ?? undefined;
  const limitParsed = Number(url.searchParams.get("limit"));
  const limit = Number.isFinite(limitParsed) && limitParsed > 0 ? Math.min(500, Math.floor(limitParsed)) : 200;

  const db = await getMongoDb();
  if (!db) {
    return NextResponse.json({ ok: true, storage: "local", data: [] });
  }

  const query: Record<string, unknown> = {};
  if (lessonSlug) query.lessonSlug = lessonSlug;

  const docs = await db
    .collection("lesson_responses")
    .find(query, { projection: { _id: 0 } })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .toArray();

  return NextResponse.json({ ok: true, storage: "mongo", data: docs });
}
