import { countByStage, listCandidates, toCandidateDTO } from "@/db/candidates";
import { unexpectedError, validationError } from "@/lib/http";
import type { ListCandidatesResponse } from "@/lib/types";
import { listCandidatesQuerySchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const query = listCandidatesQuerySchema.safeParse({
      q: params.get("q") || undefined,
      stage: params.get("stage") || undefined,
    });
    if (!query.success) return validationError(query.error);

    const { q, stage } = query.data;
    const [rows, counts] = await Promise.all([listCandidates({ q, stage }), countByStage(q)]);

    const body: ListCandidatesResponse = { candidates: rows.map(toCandidateDTO), counts };
    return Response.json(body);
  } catch (error) {
    return unexpectedError(error);
  }
}
