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
    <select
      aria-label={`Change stage for ${name}`}
      value={stage}
      disabled={disabled}
      onChange={(event) => {
        if (isStage(event.target.value)) onChange(event.target.value);
      }}
      className={`rounded-md border px-2 py-1 text-sm font-medium focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 disabled:opacity-60 ${STAGE_STYLES[stage].select}`}
    >
      {STAGES.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
