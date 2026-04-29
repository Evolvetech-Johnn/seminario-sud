import { Router } from "express";
import { z } from "zod";

import { requireAuth, requireRole, type AuthenticatedRequest } from "../auth/auth.middleware";
import {
  confirmAttendance,
  createAttendanceSession,
  getAttendanceSession,
  listAttendanceSessions,
} from "./attendance.service";

export const attendanceRouter = Router();

attendanceRouter.get("/sessions", requireAuth, requireRole(["admin", "teacher"]), async (req, res) => {
  const dateRaw = typeof req.query.date === "string" ? req.query.date : null;
  const date = dateRaw ? new Date(`${dateRaw}T00:00:00.000Z`) : null;

  const sessions = await listAttendanceSessions({ date: date && !Number.isNaN(date.getTime()) ? date : null });
  const mapped = sessions.map((s) => {
    const presentCount = s.records.filter((r) => r.present).length;
    return {
      id: s.id,
      date: s.date,
      createdAt: s.createdAt,
      lessonId: s.lessonId,
      totalStudents: s._count.records,
      presentCount,
      absentCount: s._count.records - presentCount,
    };
  });
  return res.json({ sessions: mapped });
});

attendanceRouter.post(
  "/sessions",
  requireAuth,
  requireRole(["admin", "teacher"]),
  async (req: AuthenticatedRequest, res) => {
    const bodySchema = z.object({
      date: z.string().min(10),
      lessonId: z.string().min(1).optional().nullable(),
    });
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT" });

    const date = new Date(`${parsed.data.date.slice(0, 10)}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime())) return res.status(400).json({ error: "INVALID_DATE" });

    const createdById = req.user?.id ?? null;
    if (!createdById) return res.status(401).json({ error: "UNAUTHORIZED" });

    const { session, records } = await createAttendanceSession({
      date,
      lessonId: parsed.data.lessonId ?? null,
      createdById,
    });

    return res.status(201).json({ session, records });
  },
);

attendanceRouter.get(
  "/sessions/:sessionId",
  requireAuth,
  requireRole(["admin", "teacher"]),
  async (req, res) => {
    const sessionId = String(req.params.sessionId);
    const session = await getAttendanceSession({ sessionId });
    if (!session) return res.status(404).json({ error: "NOT_FOUND" });
    return res.json({ session });
  },
);

attendanceRouter.post(
  "/confirm",
  requireAuth,
  requireRole(["student"]),
  async (req: AuthenticatedRequest, res) => {
    const bodySchema = z.object({
      sessionId: z.string().min(1),
      code: z.string().min(4),
    });
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT" });

    const studentId = req.user?.id ?? null;
    if (!studentId) return res.status(401).json({ error: "UNAUTHORIZED" });

    const result = await confirmAttendance({
      sessionId: parsed.data.sessionId,
      studentId,
      code: parsed.data.code.trim().toUpperCase(),
    });

    if (!result.ok) {
      if (result.error === "INVALID_CODE") return res.status(401).json({ error: "INVALID_CODE" });
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    return res.json(result);
  },
);

