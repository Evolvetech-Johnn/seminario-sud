import type { StudentSession } from "@/features/auth/types";

export function normalizeStudentName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export function normalizeStudentCode(raw: string): string {
  return raw.trim().replace(/\s+/g, "");
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function createStudentSession(
  name: string,
  options?: { code?: string },
): StudentSession {
  const normalized = normalizeStudentName(name);
  const base = slugify(normalized) || "aluno";
  const code = normalizeStudentCode(options?.code ?? "");
  const idSuffix = code.length > 0 ? code : Math.random().toString(36).slice(2, 8);
  return {
    id: `${base}-${idSuffix}`,
    name: normalized,
    createdAt: new Date().toISOString(),
  };
}
