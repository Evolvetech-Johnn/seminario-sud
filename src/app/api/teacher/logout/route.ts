import { NextResponse } from "next/server";

function safeNextUrl(value: string | null) {
  if (!value) return "/professor/login";
  if (!value.startsWith("/")) return "/professor/login";
  if (value.startsWith("//")) return "/professor/login";
  if (!value.startsWith("/professor/")) return "/professor/login";
  return value;
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const nextUrl = safeNextUrl(url.searchParams.get("next"));
  const accept = req.headers.get("accept") ?? "";
  const wantsJson = accept.includes("application/json");

  const res = wantsJson
    ? NextResponse.json({ ok: true })
    : NextResponse.redirect(new URL(nextUrl, url.origin), 303);

  res.cookies.set({
    name: "teacherAuth",
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
