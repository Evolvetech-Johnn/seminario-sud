import { NextResponse } from "next/server";

import { getMongoClient, getMongoDb, getMongoDiagnostics } from "@/lib/mongodb";

export async function GET() {
  try {
    const diag = await getMongoDiagnostics();
    if (!diag.configured || !diag.connected) {
      return NextResponse.json({
        ok: true,
        username: "johnathan",
        initialized: false,
        ready: false,
        error: diag.error ?? "MongoDB não configurado no ambiente",
      });
    }

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
    });
  } catch (err) {
    return NextResponse.json({
      ok: true,
      username: "johnathan",
      initialized: false,
      ready: false,
      error: err instanceof Error ? err.message : "Falha ao conectar no MongoDB",
    });
  }
}
