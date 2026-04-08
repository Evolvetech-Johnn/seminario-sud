import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { passcode?: string } | null;
  const passcode = body?.passcode ?? "";
  const expected = process.env.TEACHER_PASSCODE || "";

  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "TEACHER_PASSCODE não configurado no ambiente" },
      { status: 500 },
    );
  }

  if (passcode !== expected) {
    return NextResponse.json({ ok: false, error: "Código incorreto" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: "teacherAuth",
    value: "1",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}
