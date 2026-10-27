"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchCandidates, type CandidateQuery } from "@/lib/api-client";
import type { ListCandidatesResponse } from "@/lib/types";

type Status = "loading" | "success" | "error";

export function useCandidates({ q, stage }: CandidateQuery) {
  const [data, setData] = useState<ListCandidatesResponse>();
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string>();
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  return {
    candidates: data?.candidates ?? [],
    counts: data?.counts,
    status,
    error,
    isRefreshing,
    refetch,
  };
}
