export type ToastMessage = {
  tone: "success" | "error";
  text: string;
};

type Props = {
  toast?: ToastMessage;
};

const TONE_CLASSES: Record<ToastMessage["tone"], string> = {
  success: "bg-slate-900 text-white",
  error: "bg-red-700 text-white",
};

// The live region stays mounted so screen readers announce text that appears inside it.
export function Toast({ toast }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 flex justify-center"
    >
      {toast && (
        <p className={`rounded-md px-4 py-2 text-sm shadow-lg ${TONE_CLASSES[toast.tone]}`}>
          {toast.text}
        </p>
      )}
    </div>
  );
}
