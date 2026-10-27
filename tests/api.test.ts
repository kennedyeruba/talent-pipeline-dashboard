import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/candidates/route";
import { PATCH } from "@/app/api/candidates/[id]/route";
import type { CandidateDTO, ListCandidatesResponse } from "@/lib/types";

async function list(query = "") {
  const response = await GET(new Request(`http://localhost/api/candidates${query}`));
  return { response, body: (await response.json()) as ListCandidatesResponse };
}

function patch(id: string, body: string) {
  return PATCH(
    new Request(`http://localhost/api/candidates/${id}`, { method: "PATCH", body }),
    { params: Promise.resolve({ id }) },
  );
}

describe("GET /api/candidates", () => {
  it("returns all candidates sorted by name, with counts for every stage", async () => {
    const { response, body } = await list();

    expect(response.status).toBe(200);
    expect(body.candidates).toHaveLength(10);
    const names = body.candidates.map((c) => c.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    expect(body.counts).toEqual({ Sourced: 3, Screening: 3, Interview: 3, Hired: 1 });
  });

  it("filters by stage but still counts every stage", async () => {
    const { body } = await list("?stage=Interview");

    expect(body.candidates).toHaveLength(3);
    expect(body.candidates.every((c) => c.stage === "Interview")).toBe(true);
    expect(body.counts).toEqual({ Sourced: 3, Screening: 3, Interview: 3, Hired: 1 });
  });

  it("searches names case-insensitively and applies the search to counts", async () => {
    const { body } = await list("?q=AMA");

    expect(body.candidates.map((c) => c.name)).toContain("Ama Owusu");
    const total = Object.values(body.counts).reduce((sum, n) => sum + n, 0);
    expect(total).toBe(body.candidates.length);
  });

  it("rejects an unknown stage", async () => {
    const { response, body } = await list("?stage=Bogus");

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: expect.any(String) });
  });
});

describe("PATCH /api/candidates/[id]", () => {
  it("updates the stage and persists it", async () => {
    const response = await patch("1", JSON.stringify({ stage: "Hired" }));
    const updated = (await response.json()) as CandidateDTO;

    expect(response.status).toBe(200);
    expect(updated).toMatchObject({ id: 1, stage: "Hired" });

    const { body } = await list();
    expect(body.candidates.find((c) => c.id === 1)?.stage).toBe("Hired");
    expect(body.counts.Hired).toBe(2);
  });

  it("rejects an invalid stage and leaves the candidate unchanged", async () => {
    const before = (await list()).body.candidates.find((c) => c.id === 1);

    const response = await patch("1", JSON.stringify({ stage: "Nope" }));

    expect(response.status).toBe(400);
    const after = (await list()).body.candidates.find((c) => c.id === 1);
    expect(after).toEqual(before);
  });

  it("returns 404 for an unknown id", async () => {
    const response = await patch("999", JSON.stringify({ stage: "Hired" }));

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Candidate not found" });
  });

  it("rejects a malformed JSON body", async () => {
    const response = await patch("1", "{not json");

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Request body must be valid JSON" });
  });
});
