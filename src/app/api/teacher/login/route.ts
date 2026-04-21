import crypto from "node:crypto";
import { NextResponse } from "next/server";

import { getMongoDb, getMongoDiagnostics } from "@/lib/mongodb";

type Body = {
  username?: unknown;
  email?: unknown;
  name?: unknown;
  password?: unknown;
  confirmPassword?: unknown;
};

function asString(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.slice(0, maxLen);
}

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

function signJwt(payload: Record<string, unknown>, secret: string, expiresInSeconds: number) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + expiresInSeconds };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const sig = crypto.createHmac("sha256", secret).update(data).digest();
  return `${data}.${base64UrlEncode(sig)}`;
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

function normalizeUsername(raw: string) {
  return raw.trim().toLowerCase();
}

function normalizeEmail(raw: string) {
  return raw.trim().toLowerCase();
}

function hashPassword(password: string, salt: string) {
  const buf = crypto.scryptSync(password, salt, 64);
  return buf.toString("base64");
}

function mapMongoErrorToMessage(err: unknown) {
  const message = err instanceof Error ? err.message : String(err);

  const m = message.toLowerCase();
  if (m.includes("ssl routines") || m.includes("tlsv1 alert")) {
    return "Erro TLS/SSL ao conectar no MongoDB. Verifique se o MONGODB_URI do Atlas está correto e se a senha no URI está URL-encoded (caracteres especiais como @ : / ? # precisam ser codificados).";
  }
  if (m.includes("authentication failed") || m.includes("auth failed")) {
    return "Falha de autenticação no MongoDB (usuário/senha do Atlas)";
  }
  if (m.includes("not authorized") || m.includes("unauthorized")) {
    return "MongoDB sem permissão para salvar (verifique permissões do usuário no Atlas)";
  }
  if (m.includes("ip") && m.includes("not allowed")) {
    return "IP não autorizado no MongoDB Atlas (Network Access)";
  }
  if (m.includes("server selection timed out")) {
    return "Timeout ao conectar no MongoDB (rede/Atlas indisponível)";
  }

  return message || "Falha ao conectar no MongoDB";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Body | null;
    const username = normalizeUsername(asString(body?.username, 80));
    const email = normalizeEmail(asString(body?.email, 180));
    const name = asString(body?.name, 120);
    const password = asString(body?.password, 200);
    const confirmPassword = asString(body?.confirmPassword, 200);

    const headers = corsHeaders();

    if (email) {
      if (!password) {
        return NextResponse.json(
          { error: "Informe email e senha" },
          { status: 400, headers },
        );
      }

      const diag = await getMongoDiagnostics();
      if (!diag.configured || !diag.connected) {
        const fallbackEmail = process.env.TEACHER_EMAIL?.trim().toLowerCase() ?? "";
        const fallbackPassword = process.env.TEACHER_PASSWORD ?? "";
        if (fallbackEmail && fallbackPassword && email === fallbackEmail && password === fallbackPassword) {
          const teacher = {
            id: "teacher:env",
            name: process.env.TEACHER_NAME ?? "Professor",
            email,
          };
          const secret = getJwtSecret();
          if (!secret) {
            return NextResponse.json(
              { error: "JWT_SECRET não configurado" },
              { status: 500, headers },
            );
          }
          const token = signJwt({ teacher }, secret, 60 * 60 * 8);
          return NextResponse.json({ token, teacher }, { status: 200, headers });
        }

        return NextResponse.json(
          { error: diag.error ?? "MongoDB não configurado no ambiente" },
          { status: 500, headers },
        );
      }

      const db = await getMongoDb();
      if (!db) {
        return NextResponse.json(
          { error: "MongoDB não configurado no ambiente" },
          { status: 500, headers },
        );
      }

      const authCol = db.collection("teacher_auth");
      const existing = await authCol.findOne<{
        username?: string;
        email?: string;
        name?: string;
        salt: string;
        hash: string;
      }>(
        {
          $or: [
            { email },
            ...(email === "johnathan" || email.startsWith("johnathan@")
              ? [{ username: "johnathan" }]
              : []),
          ],
        },
        { projection: { _id: 0 } },
      );

      if (!existing) {
        return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401, headers });
      }

      const computed = hashPassword(password, existing.salt);
      const ok = crypto.timingSafeEqual(
        Buffer.from(computed, "base64"),
        Buffer.from(existing.hash, "base64"),
      );
      if (!ok) {
        return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401, headers });
      }

      const teacher = {
        id: existing.username ? `teacher:${existing.username}` : `teacher:${existing.email ?? email}`,
        name: existing.name ?? name ?? "Professor",
        email: existing.email ?? email,
      };

      const secret = getJwtSecret();
      if (!secret) {
        return NextResponse.json({ error: "JWT_SECRET não configurado" }, { status: 500, headers });
      }

      const token = signJwt({ teacher }, secret, 60 * 60 * 8);
      const res = NextResponse.json({ token, teacher }, { status: 200, headers });
      res.cookies.set({
        name: "teacherAuth",
        value: "1",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 8,
      });
      return res;
    }

    if (username !== "johnathan") {
      return NextResponse.json(
        { ok: false, error: "Usuário inválido" },
        { status: 401, headers },
      );
    }

    const diag = await getMongoDiagnostics();
    if (!diag.configured || !diag.connected) {
      return NextResponse.json(
        { ok: false, error: diag.error ?? "MongoDB não configurado no ambiente" },
        { status: 500, headers },
      );
    }

    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json(
        { ok: false, error: "MongoDB não configurado no ambiente" },
        { status: 500, headers },
      );
    }

    const authCol = db.collection("teacher_auth");
    const existing = await authCol.findOne<{ username: string; salt: string; hash: string }>(
      { username: "johnathan" },
      { projection: { _id: 0 } },
    );

    const now = new Date();

    if (!existing) {
      if (!password) {
        return NextResponse.json(
          { ok: false, error: "Informe uma senha para criar o primeiro acesso" },
          { status: 400, headers },
        );
      }
      if (password.length < 4) {
        return NextResponse.json(
          { ok: false, error: "A senha precisa ter pelo menos 4 caracteres" },
          { status: 400, headers },
        );
      }
      if (!confirmPassword) {
        return NextResponse.json(
          { ok: false, error: "Confirme sua senha" },
          { status: 400, headers },
        );
      }
      if (confirmPassword !== password) {
        return NextResponse.json(
          { ok: false, error: "As senhas não conferem" },
          { status: 400, headers },
        );
      }

      const salt = crypto.randomBytes(16).toString("base64");
      const hash = hashPassword(password, salt);
      await authCol.insertOne({
        username: "johnathan",
        email: "johnathan",
        name: "Professor",
        salt,
        hash,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      if (!password) {
        return NextResponse.json(
          { ok: false, error: "Informe sua senha" },
          { status: 400, headers },
        );
      }
      const hash = hashPassword(password, existing.salt);
      const ok = crypto.timingSafeEqual(
        Buffer.from(hash, "base64"),
        Buffer.from(existing.hash, "base64"),
      );
      if (!ok) {
        return NextResponse.json(
          { ok: false, error: "Senha incorreta" },
          { status: 401, headers },
        );
      }
      await authCol.updateOne({ username: "johnathan" }, { $set: { updatedAt: now } });
    }

    const res = NextResponse.json({ ok: true }, { headers });
    res.cookies.set({
      name: "teacherAuth",
      value: "1",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return res;
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: mapMongoErrorToMessage(err) },
      { status: 500, headers: corsHeaders() },
    );
  }
}
