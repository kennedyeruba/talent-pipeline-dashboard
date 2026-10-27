"use client";

import { useEffect, useState } from "react";
import { useCandidates } from "@/hooks/useCandidates";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { Stage } from "@/lib/stages";
import { CandidateTable } from "./CandidateTable";
import { SearchBar } from "./SearchBar";
import { StageSummary } from "./StageSummary";
import { Toast, type ToastMessage } from "./Toast";

export function Dashboard() {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<Stage>();
  const q = useDebouncedValue(search.trim(), 300);

  const [toast, setToast] = useState<ToastMessage>();

  const { candidates, counts, status, error, isRefreshing, pendingIds, updateStage } =
    useCandidates({ q, stage });

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(undefined), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function handleStageChange(id: number, nextStage: Stage) {
    const result = await updateStage(id, nextStage);
    setToast(
      result.ok
        ? { tone: "success", text: `Moved ${result.candidate.name} to ${result.candidate.stage}` }
        : { tone: "error", text: result.error },
    );
  }

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
          <CandidateTable
            candidates={candidates}
            pendingIds={pendingIds}
            onStageChange={handleStageChange}
          />
        </div>
      )}

      <Toast toast={toast} />
    </main>
  );
}
