import type { SessionSummary as SessionSummaryType } from "@/types/home";
import { StatChip } from '../ui/stat-chip';

type Props = {
  summary: SessionSummaryType;
};

function getSessionTypeClasses(sessionType: string) {
  switch (sessionType.toLowerCase()) {
    case "race":
      return "border-[#E10600]/30 bg-[linear-gradient(90deg,rgba(225,6,0,0.18)_0%,rgba(142,4,0,0.18)_100%)] text-white";
    case "qualifying":
      return "border-purple-500/30 bg-purple-500/10 text-purple-300";
    case "sprint":
      return "border-orange-500/30 bg-orange-500/10 text-orange-300";
    case "sprint shootout":
    case "sprint qualifying":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "fp1":
    case "fp2":
    case "fp3":
    case "practice 1":
    case "practice 2":
    case "practice 3":
      return "border-sky-500/30 bg-sky-500/10 text-sky-300";
    default:
      return "border-white/10 bg-white/[0.04] text-[#949498]";
  }
}

type InfoCardProps = {
  label: string;
  value: string;
  mono?: boolean;
};

function InfoCard({ label, value, mono = false }: InfoCardProps) {
  return (
    <div className="rounded-[8px] border border-white/10 bg-[#0F1014] p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#949498]">
        {label}
      </p>
      <p
        className={`mt-3 text-base font-semibold text-white ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function SessionSummary({ summary }: Props) {
  return (
    <section className="relative overflow-hidden rounded-[8px] border border-white/10 bg-[#15151E]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(225,6,0,0.10),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.00)_40%)]" />
      </div>

      <div className="relative border-b border-white/10 px-6 py-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] italic text-[#949498]">
          Última sesión disponible
        </p>

        <h1 className="mt-3 font-['Rajdhani',sans-serif] text-4xl font-semibold uppercase leading-none tracking-[0.02em] text-white sm:text-5xl">
          {summary.grandPrixName}
        </h1>

        <p className="mt-3 text-sm text-[#949498]">
          {summary.circuitName} · {summary.location}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <StatChip tone="race" uppercase>
            {summary.sessionType}
          </StatChip>

          <StatChip tone="neutral" mono>
            {summary.date}
          </StatChip>

          <StatChip tone="practice" uppercase>
            {summary.weatherSummary}
          </StatChip>
        </div>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-3">
        <InfoCard label="Fecha y hora" value={summary.date} mono />
        <InfoCard label="Circuito" value={summary.circuitName} />
        <InfoCard label="Clima" value={summary.weatherSummary} />
      </div>
    </section>
  );
}