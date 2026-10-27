"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchCandidates, type CandidateQuery } from "@/lib/api-client";
import type { ListCandidatesResponse } from "@/lib/types";

type Status = "loading" | "success" | "error";

export function useCandidates({ q, stage }: CandidateQuery) {
  const [data, setData] = useState<ListCandidatesResponse>();
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string>();

  const refetch = useCallback(async () => {
    try {
      setData(await fetchCandidates({ q, stage }));
      setError(undefined);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load candidates.");
      setStatus("error");
    }
  }, [q, stage]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { candidates: data?.candidates ?? [], counts: data?.counts, status, error, refetch };
}
