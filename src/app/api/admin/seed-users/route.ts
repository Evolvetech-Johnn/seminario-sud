import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getMongoDb } from "@/lib/mongodb";
import { getTeacherSession } from "@/lib/server/teacherAuth";
import { requireSameOrigin, rateLimit } from "@/lib/server/security";

function normalizeEmail(raw: string) {
  return raw.trim().toLowerCase();
}

function hashPassword(password: string, salt: string) {
  const buf = crypto.scryptSync(password, salt, 64);
  return buf.toString("base64");
}

export async function POST(req: Request) {
  const sameOrigin = requireSameOrigin(req);
  if (!sameOrigin.ok) return NextResponse.json({ ok: false, error: sameOrigin.error }, { status: 403 });
  const rl = rateLimit(req, "admin_seed", { windowMs: 60_000, max: 3 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Muitas requisições. Tente novamente em instantes." },
      { status: 429, headers: { "retry-after": String(rl.retryAfterSeconds) } },
    );
  }

  await cookies();
  const auth = Boolean(await getTeacherSession());
  if (!auth) return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });

  const db = await getMongoDb();
  if (!db) return NextResponse.json({ ok: false, error: "MongoDB não configurado" }, { status: 500 });

  const teacherEmail = normalizeEmail("arthur.souza@seminario.local");
  const teacherPassword = "Arthur@123456";
  const teacherName = "Arthur Souza Filho";

  const studentEmail = normalizeEmail("lyncoln.tiviroli@seminario.local");
  const studentName = "Lyncoln Tiviroli Mariano";

  const now = new Date();

  const teacherAuthCol = db.collection("teacher_auth");
  const existingTeacher = await teacherAuthCol.findOne(
    { email: teacherEmail },
    { projection: { _id: 0, email: 1 } },
  );

  if (!existingTeacher) {
    const salt = crypto.randomBytes(16).toString("base64");
    const hash = hashPassword(teacherPassword, salt);
    await teacherAuthCol.insertOne({
      username: "arthur",
      email: teacherEmail,
      name: teacherName,
      salt,
      hash,
      createdAt: now,
      updatedAt: now,
    } as any);
  }

  const studentsCol = db.collection("students");
  const existingStudent = await studentsCol.findOne(
    { email: studentEmail },
    { projection: { _id: 0, id: 1, email: 1 } },
  );

  if (!existingStudent) {
    await studentsCol.insertOne({
      id: `student:${crypto.randomUUID()}`,
      name: studentName,
      email: studentEmail,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    } as any);
  }

  return NextResponse.json({
    ok: true,
    data: {
      teacher: { email: teacherEmail, name: teacherName },
      student: { email: studentEmail, name: studentName },
    },
  });
}

