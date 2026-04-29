import crypto from "node:crypto";

function base64UrlEncode(input: string | Buffer) {
  const buf = typeof input === "string" ? Buffer.from(input) : input;
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecodeToBuffer(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${pad}`, "base64");
}

export function signJwt(payload: Record<string, unknown>, secret: string, expiresInSeconds: number) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + expiresInSeconds };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const sig = crypto.createHmac("sha256", secret).update(data).digest();
  return `${data}.${base64UrlEncode(sig)}`;
}

export function verifyJwt(token: string, secret: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false as const, payload: null as any };
  const [h, p, s] = parts;
  const data = `${h}.${p}`;
  const expected = crypto.createHmac("sha256", secret).update(data).digest();
  const actual = base64UrlDecodeToBuffer(s);
  if (expected.length !== actual.length) return { ok: false as const, payload: null as any };
  if (!crypto.timingSafeEqual(expected, actual)) return { ok: false as const, payload: null as any };
  const payloadRaw = base64UrlDecodeToBuffer(p).toString("utf8");
  const payload = JSON.parse(payloadRaw) as any;
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload?.exp === "number" && now > payload.exp) {
    return { ok: false as const, payload: null as any };
  }
  return { ok: true as const, payload };
}

