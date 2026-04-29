import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getTeacherSession } from "@/lib/server/teacherAuth";

export async function GET() {
  await cookies();
  const authenticated = Boolean(await getTeacherSession());
  return NextResponse.json({ authenticated });
}
