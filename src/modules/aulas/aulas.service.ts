import { prisma } from "@/lib/prisma";

export function getAulas() {
  return prisma.aula.findMany({ orderBy: { createdAt: "desc" } });
}

export function getAulaBySlug(slug: string) {
  return prisma.aula.findUnique({ where: { slug } });
}

