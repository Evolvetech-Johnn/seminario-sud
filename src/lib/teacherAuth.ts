import { cookies } from "next/headers";

export async function isTeacherAuthenticated() {
  const c = (await cookies()).get("teacherAuth")?.value;
  return c === "1";
}

export function teacherCookieOptions() {
  return {
    name: "teacherAuth",
    value: "1",
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  };
}
