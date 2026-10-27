import { STAGES } from "@/lib/stages";
import type { StageCounts } from "@/lib/types";
import { STAGE_STYLES } from "./stage-styles";

type Props = {
  counts?: StageCounts;
};

export function StageSummary({ counts }: Props) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {STAGES.map((stage) => (
        <li key={stage} className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <span aria-hidden className={`size-2 rounded-full ${STAGE_STYLES[stage].dot}`} />
            {stage}
          </div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">{counts?.[stage] ?? "–"}</div>
        </li>
      ))}
    </ul>
  );
}
