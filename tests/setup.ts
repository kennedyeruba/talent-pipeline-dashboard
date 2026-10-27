import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach } from "vitest";
import { runMigrations } from "@/db/migrate";
import { seed } from "@/db/seed";

// Point the app at a throwaway database before anything imports the client.
const dir = mkdtempSync(join(tmpdir(), "talent-pipeline-test-"));
process.env.DATABASE_URL = `file:${join(dir, "test.db")}`;

const { db } = await import("@/db/client");
await runMigrations(db);

// Every test starts from the same sample data.
beforeEach(async () => {
  await seed(db);
});
