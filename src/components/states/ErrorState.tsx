type Props = {
  message?: string;
  onRetry: () => void;
};

export function ErrorState({ message, onRetry }: Props) {
  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-center">
      <p className="font-medium text-red-800">Couldn&apos;t load candidates.</p>
      {message && <p className="mt-1 text-sm text-red-700">{message}</p>}
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 rounded-md bg-red-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
      >
        Try again
      </button>
    </div>
  );
}
