import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getMongoDb } from "@/lib/mongodb";
import { getTeacherSession } from "@/lib/server/teacherAuth";
import { requireSameOrigin, rateLimit } from "@/lib/server/security";
import { allLessonMetas } from "@/features/lessons/lessonMetas";
import { createPasswordHash } from "@/lib/password";

const DEMO_SEED_TAG = "demo_v1";

function normalizeEmail(raw: string) {
  return raw.trim().toLowerCase();
}

function asString(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

function slugifyLogin(name: string) {
  const normalized = name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, ".")
    .replace(/\.+/g, ".")
    .slice(0, 32);
  return normalized || "aluno";
}

function hashTeacherPassword(password: string, salt: string) {
  return crypto.scryptSync(password, salt, 64).toString("base64");
}

function stableCode(seed: string) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const hash = crypto.createHash("sha256").update(seed).digest();
  let out = "";
  for (let i = 0; i < 6; i += 1) {
    out += alphabet[hash[i] % alphabet.length];
  }
  return out;
}

function atTime(dateIso: string, hour: number, minute: number) {
  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  const d = new Date(`${dateIso}T${hh}:${mm}:00.000Z`);
  return d.toISOString();
}

function pickLessonSlugs(limit: number) {
  return allLessonMetas.slice(0, Math.max(0, limit)).map((m) => m.slug);
}

function makeText(prefix: string, variant: number) {
  const pieces = [
    "Hoje eu percebi como Deus trabalha com ordem e propósito.",
    "Fiquei pensando em como aplicar isso nas minhas escolhas.",
    "Uma coisa que eu quero melhorar é ser mais consistente.",
    "Achei forte a ideia de lembrar do convênio em decisões pequenas.",
    "Vou tentar anotar 1 princípio e aplicar durante a semana.",
    "Isso me ajudou a entender melhor o contexto da lição.",
  ];
  const a = pieces[variant % pieces.length];
  const b = pieces[(variant + 2) % pieces.length];
  return `${prefix} ${a} ${b}`.trim();
}

function makeAnswers(kind: "full" | "partial", variant: number) {
  const icebreaker = [
    "Meu destaque foi perceber como Deus organiza as coisas com propósito.",
    "Gostei da ideia de que escolhas pequenas constroem fé.",
    "O que mais me marcou foi ver o plano com mais clareza.",
    "Aprendi que devo ser mais intencional nas minhas ações.",
  ][variant % 4];

  if (kind === "partial") {
    return {
      icebreaker,
      discussionNotes: "",
      actionBefore: "",
      actionDuring: "",
      actionAfter: "",
    };
  }

  return {
    icebreaker,
    discussionNotes: makeText("Notas:", variant),
    actionBefore: "Antes: reler 5 min.",
    actionDuring: "Durante: fazer 1 anotação.",
    actionAfter: "Depois: compartilhar 1 ideia com alguém.",
  };
}

export async function POST(req: Request) {
  const sameOrigin = requireSameOrigin(req);
  if (!sameOrigin.ok) return NextResponse.json({ ok: false, error: sameOrigin.error }, { status: 403 });

  const rl = rateLimit(req, "admin_demo_seed", { windowMs: 60_000, max: 3 });
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

  const studentsInput = [
    { name: "Maria Eduarda Nunes", email: "maria.nunes@seminario.local" },
    { name: "João Pedro Lima", email: "joao.lima@seminario.local" },
    { name: "Ana Clara Ribeiro", email: "ana.ribeiro@seminario.local" },
    { name: "Lucas Henrique Santos", email: "lucas.santos@seminario.local" },
    { name: "Beatriz Almeida", email: "bia.almeida@seminario.local" },
  ].map((s) => ({ ...s, email: normalizeEmail(s.email) }));

  const now = new Date();

  const teacherAuthCol = db.collection("teacher_auth");
  const existingTeacher = await teacherAuthCol.findOne(
    { email: teacherEmail },
    { projection: { _id: 0, salt: 1 } },
  );
  const teacherSalt = existingTeacher?.salt ? String(existingTeacher.salt) : crypto.randomBytes(16).toString("base64");
  const teacherHash = hashTeacherPassword(teacherPassword, teacherSalt);
  await teacherAuthCol.updateOne(
    { email: teacherEmail },
    {
      $set: {
        username: "arthur",
        email: teacherEmail,
        name: teacherName,
        salt: teacherSalt,
        hash: teacherHash,
        updatedAt: now,
        seedTag: DEMO_SEED_TAG,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );

  const studentsCol = db.collection("students");
  const demoStudentPassword = "Aluno@123456";

  const createdStudents: Array<{ id: string; name: string; email: string; login: string | null }> = [];
  for (const input of studentsInput) {
    const existing = await studentsCol.findOne(
      { email: input.email },
      { projection: { _id: 0, id: 1, login: 1 } },
    );

    const baseLogin = slugifyLogin(input.name);
    let login = existing?.login ? String(existing.login) : baseLogin;
    if (!login) login = baseLogin;

    if (!existing?.login) {
      for (let attempt = 0; attempt < 6; attempt += 1) {
        const candidate = attempt === 0 ? login : `${baseLogin}.${crypto.randomBytes(2).toString("hex")}`;
        const conflict = await studentsCol.findOne(
          { login: candidate, email: { $ne: input.email } },
          { projection: { _id: 0, id: 1 } },
        );
        if (!conflict) {
          login = candidate;
          break;
        }
      }
    }

    const { salt, hash } = createPasswordHash(demoStudentPassword);
    const id = existing?.id ? String(existing.id) : `student:${crypto.randomUUID()}`;

    await studentsCol.updateOne(
      { email: input.email },
      {
        $set: {
          id,
          name: input.name,
          email: input.email,
          login,
          salt,
          hash,
          updatedAt: now.toISOString(),
          seedTag: DEMO_SEED_TAG,
        },
        $setOnInsert: { createdAt: now.toISOString() },
      },
      { upsert: true },
    );

    createdStudents.push({ id, name: input.name, email: input.email, login });
  }

  const slugByDate: Array<{ dateIso: string; lessonSlug: string; presentNames: string[] }> = [
    { dateIso: "2026-02-19", lessonSlug: "aula-1-010-overview", presentNames: ["Maria", "João", "Ana", "Lucas"] },
    { dateIso: "2026-02-20", lessonSlug: "aula-2-011-introduction", presentNames: ["Maria", "João", "Ana", "Lucas", "Beatriz"] },
    { dateIso: "2026-02-24", lessonSlug: "aula-3-012-the-plan-of-salvation", presentNames: ["Maria", "João", "Ana", "Beatriz"] },
    { dateIso: "2026-02-25", lessonSlug: "aula-4-020-overview", presentNames: ["Maria", "João", "Lucas"] },
    { dateIso: "2026-02-26", lessonSlug: "aula-5-021-abraham-3", presentNames: ["Maria", "João", "Ana", "Lucas"] },
    { dateIso: "2026-02-27", lessonSlug: "aula-6-022-moses-1", presentNames: ["Maria", "João"] },
  ];

  const sessionsCol = db.collection("attendance_sessions");
  const recordsCol = db.collection("attendance_records");

  for (const item of slugByDate) {
    const existingSession = await sessionsCol.findOne(
      { dateIso: item.dateIso },
      { projection: { _id: 0, id: 1 } },
    );

    const sessionId = existingSession?.id ? String(existingSession.id) : `att:demo:${item.dateIso}`;

    await sessionsCol.updateOne(
      { dateIso: item.dateIso },
      {
        $set: {
          id: sessionId,
          dateIso: item.dateIso,
          lessonSlug: item.lessonSlug,
          seedTag: DEMO_SEED_TAG,
        },
        $setOnInsert: { createdAt: now.toISOString() },
      },
      { upsert: true },
    );

    for (let i = 0; i < createdStudents.length; i += 1) {
      const s = createdStudents[i];
      const firstName = asString(s.name.split(" ")[0], 50);
      const present = item.presentNames.includes(firstName);
      const code = stableCode(`${sessionId}|${s.id}`);
      const confirmedAt = present ? atTime(item.dateIso, 19, 5 + ((i * 3) % 16)) : null;

      await recordsCol.updateOne(
        { sessionId, studentId: s.id },
        {
          $set: {
            id: `attrec:demo:${item.dateIso}:${s.id.replace(/[^a-zA-Z0-9]/g, "_")}`,
            sessionId,
            studentId: s.id,
            studentName: s.name,
            studentEmail: s.email,
            code,
            present,
            confirmedAt,
            updatedAt: now.toISOString(),
            seedTag: DEMO_SEED_TAG,
          },
          $setOnInsert: { createdAt: now.toISOString() },
        },
        { upsert: true },
      );
    }
  }

  const lessonSlugs = pickLessonSlugs(20);
  const responsesCol = db.collection("lesson_responses");
  const studentByEmail = new Map(createdStudents.map((s) => [s.email, s]));

  const profiles = [
    { email: "maria.nunes@seminario.local", total: 18, completed: 16 },
    { email: "joao.lima@seminario.local", total: 14, completed: 12 },
    { email: "ana.ribeiro@seminario.local", total: 10, completed: 7 },
    { email: "lucas.santos@seminario.local", total: 7, completed: 4 },
    { email: "bia.almeida@seminario.local", total: 3, completed: 1 },
  ];

  for (let p = 0; p < profiles.length; p += 1) {
    const profile = profiles[p];
    const student = studentByEmail.get(profile.email);
    if (!student) continue;

    const selectedLessons = lessonSlugs.slice(0, profile.total);
    for (let i = 0; i < selectedLessons.length; i += 1) {
      const lessonSlug = selectedLessons[i];
      const completed = i < profile.completed;
      const kind: "full" | "partial" = completed ? "full" : "partial";
      const updatedAt = new Date(now.getTime() - (p * 8 + i) * 36 * 60 * 60 * 1000);

      await responsesCol.updateOne(
        { lessonSlug, studentId: student.id },
        {
          $set: {
            lessonSlug,
            studentId: student.id,
            studentName: student.name,
            completed,
            answers: makeAnswers(kind, p * 100 + i),
            updatedAt,
            seedTag: DEMO_SEED_TAG,
          },
          $setOnInsert: { createdAt: updatedAt },
        },
        { upsert: true },
      );
    }
  }

  return NextResponse.json({
    ok: true,
    data: {
      teacher: { email: teacherEmail, password: teacherPassword, name: teacherName },
      students: createdStudents.map((s) => ({ id: s.id, name: s.name, email: s.email, login: s.login })),
    },
  });
}
