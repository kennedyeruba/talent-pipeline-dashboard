import { describe, expect, it } from "vitest";
import { db } from "@/db/client";
import { candidates } from "@/db/schema";
import { SEED_CANDIDATES } from "@/db/seed";
import { STAGES } from "@/lib/stages";

describe("seed data", () => {
  it("loads every sample candidate", async () => {
    const rows = await db.select().from(candidates);
    expect(rows).toHaveLength(SEED_CANDIDATES.length);
  });

  it("covers every pipeline stage", async () => {
    const rows = await db.select().from(candidates);
    expect(new Set(rows.map((row) => row.stage))).toEqual(new Set(STAGES));
  });
});
