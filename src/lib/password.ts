import crypto from "node:crypto";

export function createPasswordHash(password: string) {
  const salt = crypto.randomBytes(16).toString("base64");
  const hash = crypto.scryptSync(password, salt, 64).toString("base64");
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, hash: string) {
  const computed = crypto.scryptSync(password, salt, 64).toString("base64");
  try {
    return crypto.timingSafeEqual(Buffer.from(computed, "base64"), Buffer.from(hash, "base64"));
  } catch {
    return false;
  }
}

export function generateTempPassword() {
  return crypto.randomBytes(9).toString("base64url");
}

