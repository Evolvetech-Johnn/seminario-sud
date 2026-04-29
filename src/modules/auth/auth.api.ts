import { apiFetch } from "../api/http";

import type { AuthUser } from "./auth.store";

export type LoginResponse =
  | { ok: true; user: AuthUser; accessToken: string; refreshToken: string }
  | { ok: false; error: string };

export async function login(input: { email: string; password: string }) {
  return apiFetch<LoginResponse>("/auth/login", { method: "POST", body: input });
}

