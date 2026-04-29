import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";

export type AccessTokenPayload = {
  sub: string;
  role: "admin" | "teacher" | "student";
};

export function signAccessToken(payload: AccessTokenPayload) {
  const secret: Secret = env.JWT_ACCESS_SECRET;
  const options: SignOptions = { expiresIn: env.JWT_ACCESS_EXPIRES_IN as any };
  return jwt.sign(payload, secret, options);
}

export function signRefreshToken(payload: AccessTokenPayload) {
  const secret: Secret = env.JWT_REFRESH_SECRET;
  const options: SignOptions = { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any };
  return jwt.sign(payload, secret, options);
}

export function verifyAccessToken(token: string) {
  const secret: Secret = env.JWT_ACCESS_SECRET;
  return jwt.verify(token, secret) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string) {
  const secret: Secret = env.JWT_REFRESH_SECRET;
  return jwt.verify(token, secret) as AccessTokenPayload;
}
