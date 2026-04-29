import crypto from "crypto";

import { prisma } from "../../lib/prisma";

function generateCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(6);
  let out = "";
  for (let i = 0; i < bytes.length; i += 1) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return out;
}

export async function createAttendanceSession(input: {
  date: Date;
  lessonId?: string | null;
  createdById: string;
}) {
  const students = await prisma.user.findMany({
    where: { role: "student" },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  const session = await prisma.attendanceSession.create({
    data: {
      date: input.date,
      lessonId: input.lessonId ?? null,
      createdById: input.createdById,
    },
  });

  const recordsData = students.map((s) => ({
    sessionId: session.id,
    studentId: s.id,
    code: generateCode(),
    present: false,
  }));

  await prisma.attendanceRecord.createMany({ data: recordsData });

  const records = await prisma.attendanceRecord.findMany({
    where: { sessionId: session.id },
    select: {
      id: true,
      studentId: true,
      code: true,
      present: true,
      confirmedAt: true,
      student: { select: { name: true, email: true } },
    },
    orderBy: { student: { name: "asc" } },
  });

  return { session, records };
}

export async function listAttendanceSessions(input: { date?: Date | null }) {
  return prisma.attendanceSession.findMany({
    where: input.date
      ? {
          date: {
            gte: new Date(input.date.toISOString().slice(0, 10) + "T00:00:00.000Z"),
            lt: new Date(input.date.toISOString().slice(0, 10) + "T23:59:59.999Z"),
          },
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      date: true,
      lessonId: true,
      createdAt: true,
      _count: { select: { records: true } },
      records: { select: { present: true } },
    },
  });
}

export async function getAttendanceSession(input: { sessionId: string }) {
  return prisma.attendanceSession.findUnique({
    where: { id: input.sessionId },
    include: {
      lesson: { select: { id: true, lessonNumber: true, title: true, date: true } },
      records: {
        select: {
          id: true,
          studentId: true,
          code: true,
          present: true,
          confirmedAt: true,
          student: { select: { name: true, email: true } },
        },
        orderBy: { student: { name: "asc" } },
      },
    },
  });
}

export async function confirmAttendance(input: { sessionId: string; studentId: string; code: string }) {
  const record = await prisma.attendanceRecord.findUnique({
    where: { sessionId_studentId: { sessionId: input.sessionId, studentId: input.studentId } },
  });

  if (!record) return { ok: false as const, error: "NOT_FOUND" as const };
  if (record.present) return { ok: true as const, alreadyConfirmed: true as const };
  if (record.code !== input.code) return { ok: false as const, error: "INVALID_CODE" as const };

  await prisma.attendanceRecord.update({
    where: { id: record.id },
    data: { present: true, confirmedAt: new Date() },
  });

  return { ok: true as const, alreadyConfirmed: false as const };
}

