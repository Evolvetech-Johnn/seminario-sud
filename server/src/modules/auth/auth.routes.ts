import { Router } from "express";
import { z } from "zod";

import { loginUser, logoutSession, refreshSession, registerUser } from "./auth.service";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const bodySchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["admin", "teacher", "student"]).optional(),
  });

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT" });

  const result = await registerUser(parsed.data);
  if (!result.ok) return res.status(409).json({ error: result.error });
  return res.json(result);
});

authRouter.post("/login", async (req, res) => {
  const bodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT" });

  const result = await loginUser(parsed.data);
  if (!result.ok) return res.status(401).json({ error: result.error });
  return res.json(result);
});

authRouter.post("/refresh", async (req, res) => {
  const bodySchema = z.object({ refreshToken: z.string().min(1) });
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT" });

  const result = await refreshSession(parsed.data);
  if (!result.ok) return res.status(401).json({ error: result.error });
  return res.json(result);
});

authRouter.post("/logout", async (req, res) => {
  const bodySchema = z.object({ refreshToken: z.string().min(1) });
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT" });

  const result = await logoutSession(parsed.data);
  return res.json(result);
});
