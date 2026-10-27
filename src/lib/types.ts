import type { Stage } from "./stages";

export type CandidateDTO = {
  id: number;
  name: string;
  role: string;
  stage: Stage;
  updatedAt: string;
};

export type StageCounts = Record<Stage, number>;

export type ListCandidatesResponse = {
  candidates: CandidateDTO[];
  counts: StageCounts;
};
