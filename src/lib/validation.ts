import { z } from "zod";
import { STAGES } from "./stages";

export const stageSchema = z.enum(STAGES);

/** Query string for GET /api/candidates. Blank values are treated as "not set". */
export const listCandidatesQuerySchema = z.object({
  q: z
    .string()
    .trim()
    .max(100, "Search must be 100 characters or fewer")
    .optional()
    .transform((value) => (value ? value : undefined)),
  stage: stageSchema.optional(),
});

/** Body for PATCH /api/candidates/[id]. Only the stage can be changed. */
export const updateStageBodySchema = z.strictObject({
  stage: stageSchema,
});

/** Route param for /api/candidates/[id]. */
export const candidateIdSchema = z.coerce.number().int().positive();

export type ListCandidatesQuery = z.infer<typeof listCandidatesQuerySchema>;
export type UpdateStageBody = z.infer<typeof updateStageBodySchema>;
