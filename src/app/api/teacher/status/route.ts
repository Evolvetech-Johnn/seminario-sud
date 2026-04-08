import { NextResponse } from "next/server";

import { getMongoDb } from "@/lib/mongodb";

export async function GET() {
  const db = await getMongoDb();
  if (!db) {
    return NextResponse.json({
      ok: true,
      username: "johnathan",
      initialized: false,
      ready: false,
      error: "MongoDB não configurado no ambiente",
    });
  }

  const existing = await db
    .collection("teacher_auth")
    .findOne({ username: "johnathan" }, { projection: { _id: 0, username: 1 } });

  return NextResponse.json({
    ok: true,
    username: "johnathan",
    initialized: Boolean(existing),
    ready: true,
  });
}
