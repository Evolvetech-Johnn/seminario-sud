import crypto from "node:crypto";
import { NextResponse } from "next/server";

import { getMongoDb, getMongoDiagnostics } from "@/lib/mongodb";

type Body = {
  username?: unknown;
  password?: unknown;
  confirmPassword?: unknown;
};

function asString(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.slice(0, maxLen);
}

function normalizeUsername(raw: string) {
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
    const password = asString(body?.password, 200);
    const confirmPassword = asString(body?.confirmPassword, 200);

    if (username !== "johnathan") {
      return NextResponse.json({ ok: false, error: "Usuário inválido" }, { status: 401 });
    }

    const diag = await getMongoDiagnostics();
    if (!diag.configured || !diag.connected) {
      return NextResponse.json(
        { ok: false, error: diag.error ?? "MongoDB não configurado no ambiente" },
        { status: 500 },
      );
    }

    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json(
        { ok: false, error: "MongoDB não configurado no ambiente" },
        { status: 500 },
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
          { status: 400 },
        );
      }
      if (password.length < 4) {
        return NextResponse.json(
          { ok: false, error: "A senha precisa ter pelo menos 4 caracteres" },
          { status: 400 },
        );
      }
      if (!confirmPassword) {
        return NextResponse.json(
          { ok: false, error: "Confirme sua senha" },
          { status: 400 },
        );
      }
      if (confirmPassword !== password) {
        return NextResponse.json(
          { ok: false, error: "As senhas não conferem" },
          { status: 400 },
        );
      }

      const salt = crypto.randomBytes(16).toString("base64");
      const hash = hashPassword(password, salt);
      await authCol.insertOne({
        username: "johnathan",
        salt,
        hash,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      if (!password) {
        return NextResponse.json({ ok: false, error: "Informe sua senha" }, { status: 400 });
      }
      const hash = hashPassword(password, existing.salt);
      const ok = crypto.timingSafeEqual(
        Buffer.from(hash, "base64"),
        Buffer.from(existing.hash, "base64"),
      );
      if (!ok) {
        return NextResponse.json({ ok: false, error: "Senha incorreta" }, { status: 401 });
      }
      await authCol.updateOne({ username: "johnathan" }, { $set: { updatedAt: now } });
    }

    const res = NextResponse.json({ ok: true });
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
      { status: 500 },
    );
  }
}
