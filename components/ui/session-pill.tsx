import Link from "next/link";
import type { CircuitSessionType } from "@/types/circuit";

type Props = {
  sessionType: CircuitSessionType;
  href?: string;
  active?: boolean;
  disabled?: boolean;
};

function getSessionTypeClasses(sessionType: CircuitSessionType, active?: boolean) {
  if (active) {
    return "border-red-500/30 bg-red-600 text-white";
  }

  switch (sessionType) {
    case "Race":
      return "border-red-500/20 bg-red-500/10 text-red-300";
    case "Qualifying":
      return "border-purple-500/20 bg-purple-500/10 text-purple-300";
    case "Sprint":
      return "border-orange-500/20 bg-orange-500/10 text-orange-300";
    case "Sprint Shootout":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    case "FP1":
    case "FP2":
    case "FP3":
      return "border-sky-500/20 bg-sky-500/10 text-sky-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

export function SessionPill({
  sessionType,
  href,
  active = false,
  disabled = false,
}: Props) {
  const classes = `inline-flex rounded-full border px-3 py-2 text-sm font-medium transition ${getSessionTypeClasses(
    sessionType,
    active
  )}`;

  if (disabled || !href) {
    return <span className={`${classes} opacity-60`}>{sessionType}</span>;
  }

  return (
    <Link href={href} className={`${classes} hover:border-white/20 hover:opacity-90`}>
      {sessionType}
    </Link>
  );
}