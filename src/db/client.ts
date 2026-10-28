import { mkdirSync } from "node:fs";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export const DEFAULT_DATABASE_URL = "file:./data/talent.db";

export function createDb(url: string = process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL) {
  if (url === DEFAULT_DATABASE_URL) mkdirSync("data", { recursive: true });
  return drizzle(createClient({ url }), { schema });
}

export type Db = ReturnType<typeof createDb>;

// Reuse one connection across hot reloads in development.
const globalForDb = globalThis as unknown as { db?: Db };

export const db = globalForDb.db ?? createDb();

if (process.env.NODE_ENV === "development") {
  globalForDb.db = db;
}
