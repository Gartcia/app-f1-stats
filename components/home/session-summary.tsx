import type { SessionSummary as SessionSummaryType } from "@/types/home";

type Props = {
  summary: SessionSummaryType;
};

export function SessionSummary({ summary }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900 p-4">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Resumen de sesión
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm text-zinc-400">GP</p>
          <p className="text-lg font-semibold text-white">
            {summary.grandPrixName}
          </p>
        </div>

        <div>
          <p className="text-sm text-zinc-400">Circuito</p>
          <p className="text-lg font-semibold text-white">
            {summary.circuitName}
          </p>
        </div>

        <div>
          <p className="text-sm text-zinc-400">Ubicación</p>
          <p className="text-white">{summary.location}</p>
        </div>

        <div>
          <p className="text-sm text-zinc-400">Fecha y hora</p>
          <p className="text-white">{summary.date}</p>
        </div>

        <div>
          <p className="text-sm text-zinc-400">Tipo de sesión</p>
          <p className="text-white">{summary.sessionType}</p>
        </div>

        <div>
          <p className="text-sm text-zinc-400">Clima</p>
          <p className="text-white">{summary.weatherSummary}</p>
        </div>
      </div>
    </section>
  );
}