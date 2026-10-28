import { sql } from "drizzle-orm";
import type { Db } from "./client";
import { candidates, type NewCandidate } from "./schema";

export const SEED_CANDIDATES: ReadonlyArray<Pick<NewCandidate, "name" | "role" | "stage">> = [
  { name: "Ama Owusu", role: "Frontend Engineer", stage: "Interview" },
  { name: "Kwame Mensah", role: "Backend Engineer", stage: "Screening" },
  { name: "Sofia Martinez", role: "Product Designer", stage: "Sourced" },
  { name: "Daniel Okafor", role: "Data Analyst", stage: "Hired" },
  { name: "Priya Raman", role: "DevOps Engineer", stage: "Sourced" },
  { name: "Liam Chen", role: "Full-Stack Engineer", stage: "Screening" },
  { name: "Efua Asante", role: "Product Manager", stage: "Interview" },
  { name: "Noah Williams", role: "QA Engineer", stage: "Sourced" },
  { name: "Zainab Bello", role: "Mobile Engineer", stage: "Interview" },
  { name: "Yaw Boateng", role: "Engineering Manager", stage: "Screening" },
];

/** Replace all candidates with the sample set.*/
export async function seed(db: Db) {
  await db.transaction(async (tx) => {
    await tx.delete(candidates);
    await tx.run(sql`DELETE FROM sqlite_sequence WHERE name = 'candidates'`);
    const now = new Date();
    await tx.insert(candidates).values(SEED_CANDIDATES.map((c) => ({ ...c, updatedAt: now })));
  });
}
