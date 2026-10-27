import { and, asc, count, eq, sql } from "drizzle-orm";
import { STAGES, type Stage } from "../lib/stages";
import type { CandidateDTO, StageCounts } from "../lib/types";
import { db } from "./client";
import { candidates, type Candidate } from "./schema";

export type CandidateFilters = {
  q?: string;
  stage?: Stage;
};

export function toCandidateDTO(candidate: Candidate): CandidateDTO {
  return { ...candidate, updatedAt: candidate.updatedAt.toISOString() };
}

// Escape LIKE wildcards so a search for "50%" matches the literal text.
function nameMatches(q: string) {
  const escaped = q.replace(/[\\%_]/g, "\\$&");
  return sql`${candidates.name} LIKE ${`%${escaped}%`} ESCAPE '\\'`;
}

export async function listCandidates({ q, stage }: CandidateFilters): Promise<Candidate[]> {
  return db
    .select()
    .from(candidates)
    .where(and(q ? nameMatches(q) : undefined, stage ? eq(candidates.stage, stage) : undefined))
    .orderBy(asc(candidates.name));
}

/** Candidates per stage for a search. Every stage is present, even when empty. */
export async function countByStage(q?: string): Promise<StageCounts> {
  const rows = await db
    .select({ stage: candidates.stage, total: count() })
    .from(candidates)
    .where(q ? nameMatches(q) : undefined)
    .groupBy(candidates.stage);

  const counts = Object.fromEntries(STAGES.map((stage) => [stage, 0])) as StageCounts;
  for (const row of rows) counts[row.stage] = row.total;
  return counts;
}

/** Returns the updated candidate, or undefined when the id does not exist. */
export async function updateCandidateStage(
  id: number,
  stage: Stage,
): Promise<Candidate | undefined> {
  const [updated] = await db
    .update(candidates)
    .set({ stage, updatedAt: new Date() })
    .where(eq(candidates.id, id))
    .returning();
  return updated;
}
