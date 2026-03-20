import type { ReactNode } from "react";

type Tone =
  | "neutral"
  | "muted"
  | "success"
  | "danger"
  | "race"
  | "qualifying"
  | "sprint"
  | "shootout"
  | "practice";

type Props = {
  children: ReactNode;
  tone?: Tone;
  mono?: boolean;
  uppercase?: boolean;
};

function getToneClasses(tone: Tone) {
  switch (tone) {
    case "success":
      return "border-[#00D2BE]/30 bg-[#00D2BE]/10 text-[#00D2BE]";
    case "danger":
      return "border-[#E10600]/30 bg-[#E10600]/10 text-[#E10600]";
    case "race":
      return "border-[#E10600]/30 bg-[linear-gradient(90deg,rgba(225,6,0,0.18)_0%,rgba(142,4,0,0.18)_100%)] text-white";
    case "qualifying":
      return "border-purple-500/30 bg-purple-500/10 text-purple-300";
    case "sprint":
      return "border-orange-500/30 bg-orange-500/10 text-orange-300";
    case "shootout":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "practice":
      return "border-sky-500/30 bg-sky-500/10 text-sky-300";
    case "muted":
      return "border-white/10 bg-white/[0.03] text-[#949498]";
    default:
      return "border-white/10 bg-black/20 text-white/80";
  }
}

export function StatChip({
  children,
  tone = "neutral",
  mono = false,
  uppercase = false,
}: Props) {
  return (
    <span
      className={`inline-flex rounded-[4px] border px-2.5 py-1 text-[11px] ${
        mono ? "font-mono" : "font-semibold"
      } ${uppercase ? "uppercase tracking-[0.12em]" : ""} ${getToneClasses(
        tone
      )}`}
    >
      {children}
    </span>
  );
}