import type { SessionSummary as SessionSummaryType } from "@/types/home";

type Props = {
  summary: SessionSummaryType;
};

export function SessionSummary({ summary }: Props) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
      <div className="border-b border-white/10 bg-gradient-to-r from-red-600/15 via-red-500/5 to-transparent px-5 py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-400">
              Última sesión disponible
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
              {summary.grandPrixName}
            </h2>
            <p className="mt-2 text-sm text-zinc-300">
              {summary.circuitName} · {summary.location}
            </p>
          </div>

          <div className="inline-flex w-fit rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300">
            {summary.sessionType}
          </div>
        </div>
      </div>

      <div className="grid gap-4 px-5 py-5 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-zinc-950/40 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Fecha y hora
          </p>
          <p className="mt-2 text-sm font-medium text-white">{summary.date}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-zinc-950/40 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Circuito
          </p>
          <p className="mt-2 text-sm font-medium text-white">
            {summary.circuitName}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-zinc-950/40 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Clima
          </p>
          <p className="mt-2 text-sm font-medium text-white">
            {summary.weatherSummary}
          </p>
        </div>
      </div>
    </section>
  );
}