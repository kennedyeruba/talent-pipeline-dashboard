import { STAGES, isStage, type Stage } from "@/lib/stages";
import { STAGE_STYLES } from "./stage-styles";

type Props = {
  name: string;
  stage: Stage;
  disabled?: boolean;
  onChange: (stage: Stage) => void;
};

export function StageSelect({ name, stage, disabled, onChange }: Props) {
  return (
    <span className="relative inline-block">
      <select
        aria-label={`Change stage for ${name}`}
        value={stage}
        disabled={disabled}
        onChange={(event) => {
          if (isStage(event.target.value)) onChange(event.target.value);
        }}
        className={`appearance-none rounded-md border py-1 pr-8 pl-2 text-sm font-medium focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 disabled:opacity-60 ${STAGE_STYLES[stage].select}`}
      >
        {STAGES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {/* The native arrow ignores padding, so draw one with a fixed gap from the edge. */}
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-slate-600"
      >
        <path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
