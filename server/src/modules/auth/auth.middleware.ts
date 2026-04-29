import type { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "./auth.tokens";

export type AuthUser = {
  id: string;
  role: "admin" | "teacher" | "student";
};

export type AuthenticatedRequest = Request & { user?: AuthUser };

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.header("authorization") ?? "";
  const [, token] = header.split(" ");
  if (!token) return res.status(401).json({ error: "UNAUTHORIZED" });

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }
}

export function requireRole(roles: Array<AuthUser["role"]>) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role ?? null;
    if (!role || !roles.includes(role)) return res.status(403).json({ error: "FORBIDDEN" });
    return next();
  };
}

