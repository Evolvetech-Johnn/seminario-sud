import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readTeacherFromSessionToken, TEACHER_SESSION_COOKIE } from "@/lib/teacherSession";

export async function GET() {
  const store = await cookies();
  const authenticated = Boolean(readTeacherFromSessionToken(store.get(TEACHER_SESSION_COOKIE)?.value ?? ""));
  return NextResponse.json({ authenticated });
}
