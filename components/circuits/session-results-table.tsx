import type { CircuitSessionResult } from "@/types/circuit";

type Props = {
  results?: CircuitSessionResult[];
};

function getStatusClasses(status?: string) {
  switch (status) {
    case "Finished":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "Q3":
      return "border-sky-500/20 bg-sky-500/10 text-sky-300";
    case "Completed":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

export function SessionResultsTable({ results }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            Resultados
          </p>
          <h2 className="mt-2 text-lg font-semibold text-white">
            Resultados destacados
          </h2>
        </div>

        <p className="text-sm text-zinc-500">
          Vista resumida de la sesión actual
        </p>
      </div>

      {!results || results.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-black/20 p-6">
          <p className="text-sm text-zinc-400">
            Todavía no cargamos resultados para esta sesión.
          </p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-black/20">
          <table className="min-w-[760px] divide-y divide-white/10 text-sm">
            <thead className="bg-white/5 text-left text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Pos</th>
                <th className="min-w-[180px] px-4 py-3 font-medium">Piloto</th>
                <th className="min-w-[160px] px-4 py-3 font-medium">Equipo</th>
                <th className="px-4 py-3 font-medium">Vueltas</th>
                <th className="min-w-[140px] px-4 py-3 font-medium">
                  Gap / Tiempo
                </th>
                <th className="min-w-[120px] px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {results.map((result) => (
                <tr
                  key={`${result.position}-${result.driver}`}
                  className="transition hover:bg-white/5"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {result.position}
                  </td>

                  <td className="px-4 py-3 text-white">{result.driver}</td>

                  <td className="px-4 py-3 text-zinc-300">{result.team}</td>

                  <td className="px-4 py-3 text-zinc-300">
                    {result.laps ?? "—"}
                  </td>

                  <td className="px-4 py-3 text-zinc-300">
                    {result.gap ?? "—"}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                        result.status
                      )}`}
                    >
                      {result.status ?? "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}