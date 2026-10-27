"use client";

import { useState } from "react";
import { useCandidates } from "@/hooks/useCandidates";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { Stage } from "@/lib/stages";
import { CandidateTable } from "./CandidateTable";
import { SearchBar } from "./SearchBar";
import { StageSummary } from "./StageSummary";

export function Dashboard() {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<Stage>();
  const q = useDebouncedValue(search.trim(), 300);

  const { candidates, counts, status, error, isRefreshing } = useCandidates({ q, stage });

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Talent Pipeline</h1>
        <p className="mt-1 text-sm text-slate-600">Track candidates from sourcing to hire.</p>
      </header>

      <SearchBar value={search} onChange={setSearch} />
      <StageSummary counts={counts} activeStage={stage} onSelect={setStage} />

      {status === "loading" && <p className="text-sm text-slate-600">Loading…</p>}
      {status === "error" && <p className="text-sm text-red-700">{error}</p>}
      {status === "success" && (
        <div aria-busy={isRefreshing} className={isRefreshing ? "opacity-70 transition-opacity" : undefined}>
          <CandidateTable candidates={candidates} />
        </div>
      )}
    </main>
  );
}
