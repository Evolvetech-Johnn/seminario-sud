import bcrypt from "bcryptjs";

import { env } from "../../config/env";
import { prisma } from "../../lib/prisma";
import { sha256 } from "./auth.hash";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  type AccessTokenPayload,
} from "./auth.tokens";

function mapRole(role: string): "admin" | "teacher" | "student" {
  if (role === "admin" || role === "teacher" || role === "student") return role;
  return "student";
}

export async function registerUser(input: { name: string; email: string; password: string; role?: string }) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    return { ok: false as const, error: "EMAIL_IN_USE" as const };
  }

  const role = env.NODE_ENV === "development" ? mapRole(input.role ?? "student") : "student";

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role,
    },
    select: { id: true, name: true, email: true, role: true },
  });

  const payload: AccessTokenPayload = { sub: user.id, role: mapRole(user.role) };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: sha256(refreshToken),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });

  return { ok: true as const, user, accessToken, refreshToken };
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) return { ok: false as const, error: "INVALID_CREDENTIALS" as const };

  const match = await bcrypt.compare(input.password, user.passwordHash);
  if (!match) return { ok: false as const, error: "INVALID_CREDENTIALS" as const };

  const payload: AccessTokenPayload = { sub: user.id, role: mapRole(user.role) };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: sha256(refreshToken),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });

  return {
    ok: true as const,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  };
}

export async function refreshSession(input: { refreshToken: string }) {
  let payload: AccessTokenPayload;
  try {
    payload = verifyRefreshToken(input.refreshToken);
  } catch {
    return { ok: false as const, error: "INVALID_REFRESH_TOKEN" as const };
  }

  const tokenHash = sha256(input.refreshToken);
  const existing = await prisma.refreshToken.findFirst({
    where: { userId: payload.sub, tokenHash, revoked: false, expiresAt: { gt: new Date() } },
  });

  if (!existing) return { ok: false as const, error: "INVALID_REFRESH_TOKEN" as const };

  await prisma.refreshToken.update({ where: { id: existing.id }, data: { revoked: true } });

  const accessToken = signAccessToken(payload);
  const nextRefreshToken = signRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      userId: payload.sub,
      tokenHash: sha256(nextRefreshToken),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });

  return { ok: true as const, accessToken, refreshToken: nextRefreshToken };
}

export async function logoutSession(input: { refreshToken: string }) {
  const tokenHash = sha256(input.refreshToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { revoked: true },
  });
  return { ok: true as const };
}
