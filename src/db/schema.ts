import { sql } from "drizzle-orm";
import { check, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { STAGES } from "../lib/stages";

const stageList = sql.raw(STAGES.map((stage) => `'${stage}'`).join(", "));

export const candidates = sqliteTable(
  "candidates",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    role: text("role").notNull(),
    stage: text("stage", { enum: STAGES }).notNull().default("Sourced"),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [check("candidates_stage_check", sql`${table.stage} IN (${stageList})`)],
);

export type Candidate = typeof candidates.$inferSelect;
export type NewCandidate = typeof candidates.$inferInsert;
