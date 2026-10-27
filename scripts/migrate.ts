import { mkdirSync } from "node:fs";
import { createDb, DEFAULT_DATABASE_URL } from "../src/db/client";
import { runMigrations } from "../src/db/migrate";

async function main() {
  const url = process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL;
  if (url === DEFAULT_DATABASE_URL) mkdirSync("data", { recursive: true });

  await runMigrations(createDb(url));
  console.log(`Migrations applied to ${url}`);
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
