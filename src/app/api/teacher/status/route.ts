import crypto from "node:crypto";
import { NextResponse } from "next/server";

import { getMongoClient, getMongoDb, getMongoDiagnostics } from "@/lib/mongodb";

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

function getJwtSecret() {
  const secret = process.env.TEACHER_JWT_SECRET || process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") return "dev-teacher-jwt-secret";
  return "";
}

function verifyJwt(token: string, secret: string) {
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

function corsHeaders() {
  const origin = process.env.CORS_ORIGIN || "*";
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "authorization,content-type",
    "access-control-max-age": "86400",
  } as const;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function GET(req: Request) {
  try {
    const headers = corsHeaders();
    const auth = req.headers.get("authorization");
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const token = auth.slice("bearer ".length).trim();
      const secret = getJwtSecret();
      if (!secret) {
        return NextResponse.json(
          { error: "JWT_SECRET não configurado" },
          { status: 500, headers },
        );
      }
      const verified = verifyJwt(token, secret);
      if (!verified.ok) {
        return NextResponse.json(
          { authenticated: false, error: "Token inválido" },
          { status: 401, headers },
        );
      }
      const teacher = verified.payload?.teacher;
      if (!teacher || typeof teacher !== "object") {
        return NextResponse.json(
          { authenticated: false, error: "Token inválido" },
          { status: 401, headers },
        );
      }
      return NextResponse.json(
        { authenticated: true, teacher },
        { status: 200, headers },
      );
    }

    const diag = await getMongoDiagnostics();
    if (!diag.configured || !diag.connected) {
      return NextResponse.json({
        ok: true,
        username: "johnathan",
        initialized: false,
        ready: false,
        error: diag.error ?? "MongoDB não configurado no ambiente",
      }, { headers });
    }

    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json({
        ok: true,
        username: "johnathan",
        initialized: false,
        ready: false,
        error: "MongoDB não configurado no ambiente",
      }, { headers });
    }

    const client = await getMongoClient();
    if (client) {
      await db.command({ ping: 1 });
    }

    const existing = await db
      .collection("teacher_auth")
      .findOne({ username: "johnathan" }, { projection: { _id: 0, username: 1 } });

    return NextResponse.json({
      ok: true,
      username: "johnathan",
      initialized: Boolean(existing),
      ready: true,
    }, { headers });
  } catch (err) {
    return NextResponse.json({
      ok: true,
      username: "johnathan",
      initialized: false,
      ready: false,
      error: err instanceof Error ? err.message : "Falha ao conectar no MongoDB",
    }, { headers: corsHeaders() });
  }
}
