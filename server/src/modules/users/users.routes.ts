import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "../../lib/prisma";
import { requireAuth, requireRole, type AuthenticatedRequest } from "../auth/auth.middleware";

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

usersRouter.get("/", requireAuth, requireRole(["admin", "teacher"]), async (req, res) => {
  const roleRaw = typeof req.query.role === "string" ? req.query.role : null;
  const role =
    roleRaw === "student" || roleRaw === "teacher" || roleRaw === "admin" ? roleRaw : null;

  const users = await prisma.user.findMany({
    where: role ? { role } : undefined,
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return res.json({ users });
});

usersRouter.post("/", requireAuth, requireRole(["admin", "teacher"]), async (req, res) => {
  const bodySchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["admin", "teacher", "student"]),
  });

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT" });

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return res.status(409).json({ error: "EMAIL_IN_USE" });

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: parsed.data.role,
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return res.status(201).json({ user });
});

usersRouter.put("/:id", requireAuth, requireRole(["admin", "teacher"]), async (req, res) => {
  const id = String(req.params.id);
  const bodySchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    role: z.enum(["admin", "teacher", "student"]).optional(),
    password: z.string().min(8).optional(),
  });

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT" });

  const passwordHash = parsed.data.password ? await bcrypt.hash(parsed.data.password, 12) : undefined;

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        role: parsed.data.role,
        passwordHash,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return res.json({ user });
  } catch {
    return res.status(404).json({ error: "NOT_FOUND" });
  }
});
