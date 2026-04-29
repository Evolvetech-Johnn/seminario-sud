import { Router } from "express";
import { z } from "zod";

import { prisma } from "../../lib/prisma";
import { requireAuth, requireRole } from "../auth/auth.middleware";

export const lessonsRouter = Router();

lessonsRouter.get("/", async (req, res) => {
  const publishedOnly = String(req.query.published ?? "true") === "true";

  const lessons = await prisma.lesson.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: [{ date: "asc" }, { lessonNumber: "asc" }],
    select: {
      id: true,
      lessonNumber: true,
      slug: true,
      title: true,
      subtitle: true,
      date: true,
      reference: true,
      published: true,
    },
  });

  return res.json({ lessons });
});

lessonsRouter.get("/:id", async (req, res) => {
  const id = String(req.params.id);
  const lesson = await prisma.lesson.findUnique({ where: { id } });
  if (!lesson) return res.status(404).json({ error: "NOT_FOUND" });
  return res.json({ lesson });
});

lessonsRouter.post("/", requireAuth, requireRole(["admin", "teacher"]), async (req, res) => {
  const bodySchema = z.object({
    lessonNumber: z.number().int().positive(),
    slug: z.string().min(3),
    title: z.string().min(2),
    subtitle: z.string().min(2),
    date: z.string().datetime().optional(),
    reference: z.string().optional(),
    content: z.unknown(),
    published: z.boolean().optional(),
  });

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT" });

  const lesson = await prisma.lesson.create({
    data: {
      lessonNumber: parsed.data.lessonNumber,
      slug: parsed.data.slug,
      title: parsed.data.title,
      subtitle: parsed.data.subtitle,
      date: parsed.data.date ? new Date(parsed.data.date) : null,
      reference: parsed.data.reference ?? null,
      content: parsed.data.content as any,
      published: parsed.data.published ?? false,
    },
  });

  return res.status(201).json({ lesson });
});

lessonsRouter.put("/:id", requireAuth, requireRole(["admin", "teacher"]), async (req, res) => {
  const id = String(req.params.id);

  const bodySchema = z.object({
    lessonNumber: z.number().int().positive().optional(),
    slug: z.string().min(3).optional(),
    title: z.string().min(2).optional(),
    subtitle: z.string().min(2).optional(),
    date: z.string().datetime().nullable().optional(),
    reference: z.string().nullable().optional(),
    content: z.unknown().optional(),
    published: z.boolean().optional(),
  });

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT" });

  const lesson = await prisma.lesson.update({
    where: { id },
    data: {
      lessonNumber: parsed.data.lessonNumber,
      slug: parsed.data.slug,
      title: parsed.data.title,
      subtitle: parsed.data.subtitle,
      date: parsed.data.date === undefined ? undefined : parsed.data.date ? new Date(parsed.data.date) : null,
      reference: parsed.data.reference === undefined ? undefined : parsed.data.reference,
      content: parsed.data.content === undefined ? undefined : (parsed.data.content as any),
      published: parsed.data.published,
    },
  });

  return res.json({ lesson });
});

lessonsRouter.delete("/:id", requireAuth, requireRole(["admin", "teacher"]), async (req, res) => {
  const id = String(req.params.id);
  await prisma.lesson.delete({ where: { id } });
  return res.status(204).send();
});
