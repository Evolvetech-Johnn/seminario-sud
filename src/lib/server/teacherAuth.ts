import { cookies } from "next/headers";

import { readTeacherFromSessionToken, TEACHER_SESSION_COOKIE } from "@/lib/teacherSession";

export async function getTeacherSession() {
  const store = await cookies();
  const token = store.get(TEACHER_SESSION_COOKIE)?.value ?? "";
  return readTeacherFromSessionToken(token);
}

