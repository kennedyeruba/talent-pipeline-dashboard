type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: Props) {
  return (
    <div>
      <label htmlFor="candidate-search" className="block text-sm font-medium text-slate-700">
        Search candidates by name
      </label>
      <div className="relative mt-1">
        <input
          id="candidate-search"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={100}
          placeholder="e.g. Ama"
          className="w-full rounded-md border border-slate-300 bg-white py-2 pr-20 pl-3 text-sm focus:outline-2 focus:outline-offset-1 focus:outline-indigo-600"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute inset-y-0 right-0 rounded-md px-3 text-sm font-medium text-indigo-700 hover:text-indigo-900 focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
