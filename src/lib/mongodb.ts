import { MongoClient } from "mongodb";

let cachedClientPromise: Promise<MongoClient | null> | null = null;

export async function getMongoClient(): Promise<MongoClient | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  if (!cachedClientPromise) {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    cachedClientPromise = client.connect().catch(() => {
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
