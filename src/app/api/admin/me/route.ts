import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getTeacherSession } from "@/lib/server/teacherAuth";

export async function GET() {
  await cookies();
  const teacher = await getTeacherSession();
  if (!teacher) {
    return NextResponse.json({ authenticated: false, teacher: null }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, teacher }, { status: 200 });
}
