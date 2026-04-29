import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { allLessonMetas } from "@/features/lessons/lessonMetas";
import { getMongoDb } from "@/lib/mongodb";
import { readTeacherFromSessionToken, TEACHER_SESSION_COOKIE } from "@/lib/teacherSession";

export async function GET() {
  const store = await cookies();
  const auth = Boolean(readTeacherFromSessionToken(store.get(TEACHER_SESSION_COOKIE)?.value ?? ""));
  if (!auth) return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });

  const totalLessons = allLessonMetas.length;

  const db = await getMongoDb();
  if (!db) {
    return NextResponse.json({
      ok: true,
      data: { totalLessons, totalStudents: 0, averageProgress: 0 },
    });
  }

  const totalStudents = await db.collection("students").countDocuments();
  const completedCount = await db.collection("lesson_responses").countDocuments({ completed: true });

  const denom = totalStudents > 0 && totalLessons > 0 ? totalStudents * totalLessons : 0;
  const averageProgress = denom > 0 ? Math.max(0, Math.min(1, completedCount / denom)) : 0;

  return NextResponse.json({
    ok: true,
    data: { totalLessons, totalStudents, averageProgress },
  });
}
