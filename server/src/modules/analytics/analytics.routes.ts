import { Router } from "express";

import { requireAuth, requireRole } from "../auth/auth.middleware";

export const analyticsRouter = Router();

analyticsRouter.get("/summary", requireAuth, requireRole(["admin", "teacher"]), async (_req, res) => {
  return res.json({ message: "TODO" });
});

