"use client";

import { useCandidates } from "@/hooks/useCandidates";
import { CandidateTable } from "./CandidateTable";
import { StageSummary } from "./StageSummary";

export function Dashboard() {
  const { candidates, counts, status, error } = useCandidates({});

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Talent Pipeline</h1>
        <p className="mt-1 text-sm text-slate-600">Track candidates from sourcing to hire.</p>
      </header>

      <StageSummary counts={counts} />

      {status === "loading" && <p className="text-sm text-slate-600">Loading…</p>}
      {status === "error" && <p className="text-sm text-red-700">{error}</p>}
      {status === "success" && <CandidateTable candidates={candidates} />}
    </main>
  );
}
