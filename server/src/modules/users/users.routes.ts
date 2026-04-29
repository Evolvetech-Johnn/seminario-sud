import { Router } from "express";

import { prisma } from "../../lib/prisma";
import { requireAuth, type AuthenticatedRequest } from "../auth/auth.middleware";

export const usersRouter = Router();

usersRouter.get("/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id ?? null;
  if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  if (!user) return res.status(404).json({ error: "NOT_FOUND" });
  return res.json({ user });
});

