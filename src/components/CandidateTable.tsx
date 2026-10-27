import type { Stage } from "@/lib/stages";
import type { CandidateDTO } from "@/lib/types";
import { StageSelect } from "./StageSelect";

type Props = {
  candidates: CandidateDTO[];
  pendingIds: ReadonlySet<number>;
  onStageChange: (id: number, stage: Stage) => void;
};

export function CandidateTable({ candidates, pendingIds, onStageChange }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">Name</th>
            <th scope="col" className="px-4 py-3 font-medium">Role</th>
            <th scope="col" className="px-4 py-3 font-medium">Stage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {candidates.map((candidate) => (
            <tr key={candidate.id}>
              <th scope="row" className="px-4 py-3 font-medium whitespace-nowrap">
                {candidate.name}
              </th>
              <td className="px-4 py-3 whitespace-nowrap text-slate-600">{candidate.role}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <StageSelect
                    name={candidate.name}
                    stage={candidate.stage}
                    disabled={pendingIds.has(candidate.id)}
                    onChange={(stage) => onStageChange(candidate.id, stage)}
                  />
                  {pendingIds.has(candidate.id) && (
                    <span className="animate-pulse text-xs text-slate-500">Saving…</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
