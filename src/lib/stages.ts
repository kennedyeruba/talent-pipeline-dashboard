/**
 * The hiring pipeline, in order. This is the single source of truth:
 * the database constraint, request validation, and UI options all derive from it.
 */
export const STAGES = ["Sourced", "Screening", "Interview", "Hired"] as const;

export type Stage = (typeof STAGES)[number];

export function isStage(value: unknown): value is Stage {
  return typeof value === "string" && (STAGES as readonly string[]).includes(value);
}
