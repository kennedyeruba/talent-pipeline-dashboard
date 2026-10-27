const ROW_COUNT = 5;

export function LoadingRows() {
  return (
    <div
      role="status"
      aria-label="Loading candidates"
      className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white"
    >
      {Array.from({ length: ROW_COUNT }, (_, index) => (
        <div key={index} className="flex animate-pulse items-center gap-4 px-4 py-4">
          <div className="h-4 w-1/4 rounded bg-slate-200" />
          <div className="h-4 w-1/3 rounded bg-slate-200" />
          <div className="ml-auto h-7 w-24 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}
