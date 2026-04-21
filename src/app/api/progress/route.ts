import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Body = {
  aulaId?: unknown;
  reflection?: unknown;
  completed?: unknown;
};

function asString(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.slice(0, maxLen);
}

function asBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  return false;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as Body | null;
  const aulaId = asString(body?.aulaId, 80);
  if (!aulaId) return NextResponse.json({ error: "aulaId obrigatório" }, { status: 400 });

  const reflection = asString(body?.reflection, 4000) || null;
  const completed = asBoolean(body?.completed);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

  await prisma.progress.upsert({
    where: { userId_aulaId: { userId: user.id, aulaId } },
    update: { reflection, completed },
    create: { userId: user.id, aulaId, reflection, completed },
  });

  return NextResponse.json({ ok: true });
}

