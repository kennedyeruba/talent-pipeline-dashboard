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
            <th scope="col" className="px-3 py-3 sm:px-4 font-medium">Name</th>
            <th scope="col" className="px-3 py-3 sm:px-4 font-medium">Role</th>
            <th scope="col" className="px-3 py-3 sm:px-4 font-medium">Stage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {candidates.map((candidate) => {
            const isPending = pendingIds.has(candidate.id);
            return (
              <tr key={candidate.id}>
                <th scope="row" className="px-3 py-3 font-medium sm:px-4">
                  {candidate.name}
                </th>
                <td className="px-3 py-3 text-slate-600 sm:px-4">{candidate.role}</td>
                <td className="px-3 py-3 sm:px-4">
                  <div className="flex items-center gap-1.5">
                    <StageSelect
                      name={candidate.name}
                      stage={candidate.stage}
                      disabled={isPending}
                      onChange={(stage) => onStageChange(candidate.id, stage)}
                    />
                    
                    <span
                      aria-hidden
                      className={`size-3 animate-spin rounded-full border-2 border-slate-400 border-t-transparent ${isPending ? "" : "invisible"}`}
                    />
                    {isPending && <span className="sr-only">Saving…</span>}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
