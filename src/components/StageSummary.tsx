import { STAGES, type Stage } from "@/lib/stages";
import type { StageCounts } from "@/lib/types";
import { STAGE_STYLES } from "./stage-styles";

type Props = {
  counts?: StageCounts;
  activeStage?: Stage;
  onSelect: (stage: Stage | undefined) => void;
};

export function StageSummary({ counts, activeStage, onSelect }: Props) {
  return (
    <section aria-label="Filter by stage">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STAGES.map((stage) => {
          const isActive = stage === activeStage;
          return (
            <li key={stage}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelect(isActive ? undefined : stage)}
                className={`w-full rounded-lg border p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                  isActive ? STAGE_STYLES[stage].tileActive : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <span aria-hidden className={`size-2 rounded-full ${STAGE_STYLES[stage].dot}`} />
                  {stage}
                </span>
                <span className="mt-1 block text-2xl font-semibold tabular-nums">
                  {counts?.[stage] ?? "–"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-xs text-slate-500">
        {activeStage ? `Showing ${activeStage} only. Select it again to show all stages.` : "Showing all stages"}
      </p>
    </section>
  );
}
