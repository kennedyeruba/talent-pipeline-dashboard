import type { Stage } from "./stages";
import type { CandidateDTO, ListCandidatesResponse } from "./types";

export type CandidateQuery = {
  q?: string;
  stage?: Stage;
};

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function errorMessage(response: Response) {
  try {
    const body = await response.json();
    if (typeof body?.error === "string") return body.error;
  } catch {
    // Fall through: the body was empty or not JSON.
  }
  return `Request failed (${response.status})`;
}

export async function fetchCandidates(
  { q, stage }: CandidateQuery,
  signal?: AbortSignal,
): Promise<ListCandidatesResponse> {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (stage) params.set("stage", stage);

  const response = await fetch(`/api/candidates?${params}`, { signal });
  if (!response.ok) throw new ApiError(response.status, await errorMessage(response));
  return response.json();
}

export async function updateCandidateStage(id: number, stage: Stage): Promise<CandidateDTO> {
  const response = await fetch(`/api/candidates/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stage }),
  });
  if (!response.ok) throw new ApiError(response.status, await errorMessage(response));
  return response.json();
}
