import type { Stage } from "@/lib/stages";

type Props = {
  q?: string;
  stage?: Stage;
  onClearFilters: () => void;
};

function filterMessage(q?: string, stage?: Stage) {
  if (q && stage) return `No candidates match "${q}" in ${stage}.`;
  if (q) return `No candidates match "${q}".`;
  return `No candidates in ${stage}.`;
}

export function EmptyState({ q, stage, onClearFilters }: Props) {
  const hasFilters = Boolean(q || stage);

  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
      {hasFilters ? (
        <>
          <p className="font-medium">{filterMessage(q, stage)}</p>
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-3 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Clear filters
          </button>
        </>
      ) : (
        <>
          <p className="font-medium">No candidates yet.</p>
          <p className="mt-1 text-sm text-slate-600">
            Run <code className="rounded bg-slate-100 px-1 py-0.5">npm run db:reset</code> to load
            sample data.
          </p>
        </>
      )}
    </div>
  );
}
