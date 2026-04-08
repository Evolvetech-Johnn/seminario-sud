import { NextResponse } from "next/server";

function safeNextUrl(value: string | null) {
  if (!value) return "/professor/respostas";
  if (!value.startsWith("/")) return "/professor/respostas";
  if (value.startsWith("//")) return "/professor/respostas";
  if (!value.startsWith("/professor/")) return "/professor/respostas";
  return value;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const nextUrl = safeNextUrl(url.searchParams.get("next"));

  if (process.env.TEACHER_AUTOLOGIN !== "1") {
    return NextResponse.redirect(
      new URL(`/professor/login?next=${encodeURIComponent(nextUrl)}`, url.origin),
    );
  }

  const res = NextResponse.redirect(new URL(nextUrl, url.origin));
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
