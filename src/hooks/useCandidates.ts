"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ApiError,
  fetchCandidates,
  updateCandidateStage,
  type CandidateQuery,
} from "@/lib/api-client";
import type { Stage } from "@/lib/stages";
import type { CandidateDTO, ListCandidatesResponse } from "@/lib/types";

type Status = "loading" | "success" | "error";

export type UpdateStageResult = { ok: true; candidate: CandidateDTO } | { ok: false; error: string };

const UPDATE_FAILED_MESSAGE = "Couldn't update stage. Please try again.";

export function useCandidates({ q, stage }: CandidateQuery) {
  const [data, setData] = useState<ListCandidatesResponse>();
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pendingIds, setPendingIds] = useState<ReadonlySet<number>>(new Set());
  const controllerRef = useRef<AbortController | null>(null);

  const refetch = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setIsRefreshing(true);
    // Retrying after a failure goes back to the loading state; otherwise keep showing old rows.
    setStatus((current) => (current === "error" ? "loading" : current));

    try {
      setData(await fetchCandidates({ q, stage }, controller.signal));
      setError(undefined);
      setStatus("success");
    } catch (err) {
      if (controller.signal.aborted) return;
      setError(err instanceof Error ? err.message : "Couldn't load candidates.");
      setStatus("error");
    } finally {
      if (!controller.signal.aborted) setIsRefreshing(false);
    }
  }, [q, stage]);

  useEffect(() => {
    refetch();
    return () => controllerRef.current?.abort();
  }, [refetch]);

  const setLocalStage = useCallback((id: number, stage: Stage) => {
    setData((current) =>
      current && {
        ...current,
        candidates: current.candidates.map((c) => (c.id === id ? { ...c, stage } : c)),
      },
    );
  }, []);

  const setPending = useCallback((id: number, isPending: boolean) => {
    setPendingIds((current) => {
      const next = new Set(current);
      if (isPending) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const updateStage = useCallback(
    async (id: number, stage: Stage): Promise<UpdateStageResult> => {
      const previous = data?.candidates.find((c) => c.id === id)?.stage;
      if (!previous) return { ok: false, error: UPDATE_FAILED_MESSAGE };

      setLocalStage(id, stage);
      setPending(id, true);
      try {
        const candidate = await updateCandidateStage(id, stage);
        // Reconcile counts and filter membership with the server.
        await refetch();
        return { ok: true, candidate };
      } catch (err) {
        setLocalStage(id, previous);
        return { ok: false, error: err instanceof ApiError ? err.message : UPDATE_FAILED_MESSAGE };
      } finally {
        setPending(id, false);
      }
    },
    [data, refetch, setLocalStage, setPending],
  );

  return {
    candidates: data?.candidates ?? [],
    counts: data?.counts,
    status,
    error,
    isRefreshing,
    pendingIds,
    refetch,
    updateStage,
  };
}
