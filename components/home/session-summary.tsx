import type { SessionSummary as SessionSummaryType } from "@/types/home";

type Props = {
  summary: SessionSummaryType;
};

function getSessionTypeClasses(sessionType: string) {
  switch (sessionType.toLowerCase()) {
    case "race":
      return "border-red-500/20 bg-red-500/10 text-red-300";
    case "qualifying":
      return "border-purple-500/20 bg-purple-500/10 text-purple-300";
    case "fp1":
    case "fp2":
    case "fp3":
      return "border-sky-500/20 bg-sky-500/10 text-sky-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

type InfoCardProps = {
  label: string;
  value: string;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="mt-3 text-base font-medium text-white">{value}</p>
    </div>
  );
}

export function SessionSummary({ summary }: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="border-b border-white/10 bg-gradient-to-r from-red-500/12 via-red-500/6 to-transparent p-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
          Última sesión disponible
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
          {summary.grandPrixName}
        </h1>

        <p className="mt-2 text-sm text-zinc-400">
          {summary.circuitName} · {summary.location}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getSessionTypeClasses(
              summary.sessionType
            )}`}
          >
            {summary.sessionType}
          </span>

          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300">
            {summary.date}
          </span>

          <span className="inline-flex rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
            {summary.weatherSummary}
          </span>
        </div>
      </div>

      <div className="grid gap-3 p-6 sm:grid-cols-3">
        <InfoCard label="Fecha y hora" value={summary.date} />
        <InfoCard label="Circuito" value={summary.circuitName} />
        <InfoCard label="Clima" value={summary.weatherSummary} />
      </div>
    </section>
  );
}