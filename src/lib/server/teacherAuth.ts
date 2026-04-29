import { cookies } from "next/headers";
import crypto from "node:crypto";

import { getMongoDb } from "@/lib/mongodb";
import { signJwt, verifyJwt } from "@/lib/teacherJwt";
import { TEACHER_SESSION_COOKIE, type TeacherSessionTeacher } from "@/lib/teacherSession";

async function getTeacherSigningSecret() {
  const envSecret = process.env.TEACHER_JWT_SECRET || process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
  if (envSecret) return envSecret;

  if (process.env.NODE_ENV !== "production") return "dev-teacher-jwt-secret";

  const db = await getMongoDb();
  if (!db) return "";

  const key = "teacher_jwt_secret";
  const col = db.collection("system_config");
  const existing = await col.findOne<{ key: string; value: string }>(
    { key },
    { projection: { _id: 0, value: 1 } },
  );
  if (existing?.value) return String(existing.value);

  const value = crypto.randomBytes(32).toString("base64");
  const upserted = await col.findOneAndUpdate(
    { key },
    { $setOnInsert: { key, value, createdAt: new Date().toISOString() } },
    { upsert: true, returnDocument: "after", projection: { _id: 0, value: 1 } },
  );
  return String((upserted as any)?.value?.value ?? value);
}

function parseTeacher(payload: any): TeacherSessionTeacher | null {
  const teacher = payload?.teacher;
  if (!teacher || typeof teacher !== "object") return null;
  const id = typeof teacher.id === "string" ? teacher.id.trim() : "";
  const name = typeof teacher.name === "string" ? teacher.name.trim() : "";
  const email = typeof teacher.email === "string" ? teacher.email.trim() : "";
  if (!id || !name || !email) return null;
  return { id, name, email };
}

export async function createTeacherSessionToken(teacher: TeacherSessionTeacher, expiresInSeconds: number) {
  const secret = await getTeacherSigningSecret();
  if (!secret) return "";
  return signJwt({ teacher }, secret, expiresInSeconds);
}

export async function getTeacherSession() {
  const store = await cookies();
  const token = store.get(TEACHER_SESSION_COOKIE)?.value ?? "";
  if (!token) return null;

  const secret = await getTeacherSigningSecret();
  if (!secret) return null;

  const verified = verifyJwt(token, secret);
  if (!verified.ok) return null;
  return parseTeacher(verified.payload);
}
