import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getMongoDb } from "@/lib/mongodb";

export async function GET(req: Request) {
  const auth = (await cookies()).get("teacherAuth")?.value === "1";
  if (!auth) {
    return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
  }

  const url = new URL(req.url);
  const lessonSlug = url.searchParams.get("lessonSlug") ?? undefined;

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
    .toArray();

  return NextResponse.json({ ok: true, storage: "mongo", data: docs });
}
