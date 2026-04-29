import { signJwt, verifyJwt } from "@/lib/teacherJwt";

export type TeacherSessionTeacher = {
  id: string;
  name: string;
  email: string;
};

export const TEACHER_SESSION_COOKIE = "teacherSession";

export function getTeacherJwtSecret() {
  const secret = process.env.TEACHER_JWT_SECRET || process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") return "dev-teacher-jwt-secret";
  return "";
}

export function createTeacherSessionToken(teacher: TeacherSessionTeacher, expiresInSeconds: number) {
  const secret = getTeacherJwtSecret();
  if (!secret) return "";
  return signJwt({ teacher }, secret, expiresInSeconds);
}

export function readTeacherFromSessionToken(token: string) {
  const secret = getTeacherJwtSecret();
  if (!secret) return null;
  const verified = verifyJwt(token, secret);
  if (!verified.ok) return null;
  const teacher = verified.payload?.teacher;
  if (!teacher || typeof teacher !== "object") return null;

  const id = typeof (teacher as any).id === "string" ? (teacher as any).id.trim() : "";
  const name = typeof (teacher as any).name === "string" ? (teacher as any).name.trim() : "";
  const email = typeof (teacher as any).email === "string" ? (teacher as any).email.trim() : "";
  if (!id || !name || !email) return null;
  return { id, name, email } satisfies TeacherSessionTeacher;
}

