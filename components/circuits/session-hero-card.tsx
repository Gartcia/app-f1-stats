import type { CircuitWeekendSession } from "@/types/circuit";

type Props = {
  circuitName: string;
  circuitLocation: string;
  sessionType: string;
  sessionDate: string;
  season: number;
  status?: CircuitWeekendSession["status"];
};

function getSessionTypeClasses(sessionType: string) {
  switch (sessionType) {
    case "Race":
      return "border-red-500/20 bg-red-500/10 text-red-300";
    case "Qualifying":
      return "border-purple-500/20 bg-purple-500/10 text-purple-300";
    case "Sprint":
      return "border-orange-500/20 bg-orange-500/10 text-orange-300";
    case "FP1":
    case "FP2":
    case "FP3":
      return "border-sky-500/20 bg-sky-500/10 text-sky-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function getStatusClasses(status?: string) {
  switch (status) {
    case "Latest":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "Completed":
      return "border-white/10 bg-white/5 text-zinc-200";
    case "Archived":
      return "border-zinc-500/20 bg-zinc-500/10 text-zinc-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

export function SessionHeroCard({
  circuitName,
  circuitLocation,
  sessionType,
  sessionDate,
  season,
  status,
}: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="border-b border-white/10 bg-linear-to-br from-white/10 to-transparent p-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
          Session detail
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
          {circuitName}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getSessionTypeClasses(
              sessionType
            )}`}
          >
            {sessionType}
          </span>

          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
              status
            )}`}
          >
            {status ?? "Completed"}
          </span>

          <span className="text-sm text-zinc-400">{sessionDate}</span>
        </div>
      </div>

      <div className="grid gap-3 p-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">
            Circuito
          </p>
          <p className="mt-2 text-base font-medium text-white">
            {circuitLocation}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">
            Sesión
          </p>
          <p className="mt-2 text-base font-medium text-white">{sessionType}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">
            Temporada
          </p>
          <p className="mt-2 text-base font-medium text-white">{season}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">
            Estado
          </p>
          <p className="mt-2 text-base font-medium text-white">
            {status ?? "Completed"}
          </p>
        </div>
      </div>
    </section>
  );
}