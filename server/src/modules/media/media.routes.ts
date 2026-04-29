import { Router } from "express";
import multer from "multer";
import { z } from "zod";

import { prisma } from "../../lib/prisma";
import { requireAuth, requireRole } from "../auth/auth.middleware";
import { uploadImage } from "./cloudinary.service";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 6 * 1024 * 1024 } });

export const mediaRouter = Router();

mediaRouter.post(
  "/upload",
  requireAuth,
  requireRole(["admin", "teacher"]),
  upload.single("file"),
  async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "MISSING_FILE" });

    const bodySchema = z.object({
      lessonId: z.string().min(1).optional(),
      type: z.enum(["image", "thumbnail"]).default("image"),
      folder: z.string().min(1).optional(),
    });
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT" });

    try {
      const uploaded = await uploadImage({
        buffer: file.buffer,
        folder: parsed.data.folder,
      });

      const media = await prisma.media.create({
        data: {
          lessonId: parsed.data.lessonId ?? null,
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
          type: parsed.data.type,
        },
      });

      return res.status(201).json({ media });
    } catch (e) {
      const message = e instanceof Error ? e.message : "UPLOAD_FAILED";
      if (message === "CLOUDINARY_NOT_CONFIGURED") {
        return res.status(500).json({ error: "CLOUDINARY_NOT_CONFIGURED" });
      }
      return res.status(500).json({ error: "UPLOAD_FAILED" });
    }
  },
);

