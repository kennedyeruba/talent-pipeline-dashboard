import { toCandidateDTO, updateCandidateStage } from "@/db/candidates";
import { jsonError, unexpectedError, validationError } from "@/lib/http";
import { candidateIdSchema, updateStageBodySchema } from "@/lib/validation";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const id = candidateIdSchema.safeParse((await params).id);
    if (!id.success) return jsonError("Candidate id must be a positive whole number", 400);

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return jsonError("Request body must be valid JSON", 400);
    }

    const body = updateStageBodySchema.safeParse(payload);
    if (!body.success) return validationError(body.error);

    const updated = await updateCandidateStage(id.data, body.data.stage);
    if (!updated) return jsonError("Candidate not found", 404);

    return Response.json(toCandidateDTO(updated));
  } catch (error) {
    return unexpectedError(error);
  }
}
