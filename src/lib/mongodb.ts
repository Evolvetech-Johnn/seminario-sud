import { MongoClient } from "mongodb";

let cachedClientPromise: Promise<MongoClient | null> | null = null;
let cachedUri: string | null = null;
let cachedLastError: string | null = null;

function asErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

function validateMongoUri(uri: string) {
  if (!uri.trim()) return { ok: false as const, error: "MONGODB_URI vazio" };
  if (uri.includes(" ")) return { ok: false as const, error: "MONGODB_URI contém espaços" };
  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    return {
      ok: false as const,
      error: "MONGODB_URI inválido (use mongodb:// ou mongodb+srv://)",
    };
  }
  return { ok: true as const, error: null as string | null };
}

export async function getMongoClient(): Promise<MongoClient | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  if (cachedUri && cachedUri !== uri) {
    cachedClientPromise = null;
    cachedLastError = null;
  }
  cachedUri = uri;

  if (!cachedClientPromise) {
    const validation = validateMongoUri(uri);
    if (!validation.ok) {
      cachedLastError = validation.error;
      return null;
    }

    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    cachedClientPromise = client
      .connect()
      .then((c) => {
        cachedLastError = null;
        return c;
      })
      .catch((err) => {
        cachedLastError = asErrorMessage(err);
        cachedClientPromise = null;
        return null;
      });
  }

  return cachedClientPromise;
}

export async function getMongoDb() {
  const client = await getMongoClient();
  if (!client) return null;
  const dbName = process.env.MONGODB_DB || "seminario-sud";
  return client.db(dbName);
}

export async function getMongoDiagnostics() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "seminario-sud";
  if (!uri) {
    return { configured: false, connected: false, dbName, error: "MONGODB_URI não definido" };
  }

  const client = await getMongoClient();
  if (!client) {
    return {
      configured: true,
      connected: false,
      dbName,
      error: cachedLastError ?? "Falha ao conectar no MongoDB",
    };
  }

  return { configured: true, connected: true, dbName, error: null as string | null };
}
