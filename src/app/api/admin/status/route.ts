import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const auth = (await cookies()).get("teacherAuth")?.value === "1";
  return NextResponse.json({ authenticated: auth });
}

