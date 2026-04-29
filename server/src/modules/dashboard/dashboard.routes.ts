import { Router } from "express";

import { prisma } from "../../lib/prisma";
import { requireAuth, requireRole } from "../auth/auth.middleware";

export const dashboardRouter = Router();

dashboardRouter.get("/overview", requireAuth, requireRole(["admin", "teacher"]), async (_req, res) => {
  const [lessonsCount, studentsCount, progressTotal, progressCompleted] = await Promise.all([
    prisma.lesson.count(),
    prisma.user.count({ where: { role: "student" } }),
    prisma.progress.count(),
    prisma.progress.count({ where: { completed: true } }),
  ]);

  const averageProgress = progressTotal > 0 ? progressCompleted / progressTotal : 0;

  return res.json({
    totalLessons: lessonsCount,
    totalStudents: studentsCount,
    averageProgress,
  });
});

