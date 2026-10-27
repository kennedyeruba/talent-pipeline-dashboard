import type { Stage } from "@/lib/stages";

// Class names are written out in full so Tailwind can find them.
export const STAGE_STYLES: Record<Stage, { dot: string; tileActive: string; select: string }> = {
  Sourced: {
    dot: "bg-sky-500",
    tileActive: "border-sky-500 bg-sky-50 ring-1 ring-sky-500",
    select: "border-sky-300 bg-sky-50 text-sky-900",
  },
  Screening: {
    dot: "bg-amber-500",
    tileActive: "border-amber-500 bg-amber-50 ring-1 ring-amber-500",
    select: "border-amber-300 bg-amber-50 text-amber-900",
  },
  Interview: {
    dot: "bg-violet-500",
    tileActive: "border-violet-500 bg-violet-50 ring-1 ring-violet-500",
    select: "border-violet-300 bg-violet-50 text-violet-900",
  },
  Hired: {
    dot: "bg-emerald-500",
    tileActive: "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500",
    select: "border-emerald-300 bg-emerald-50 text-emerald-900",
  },
};
