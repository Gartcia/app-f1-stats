import type { CircuitSessionResult } from "@/types/circuit";

type Props = {
  results?: CircuitSessionResult[];
};

function getStatusClasses(status?: string) {
  switch (status) {
    case "Finished":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "DNF":
    case "DNS":
    case "DSQ":
      return "border-red-500/20 bg-red-500/10 text-red-300";
    case "Q3":
      return "border-sky-500/20 bg-sky-500/10 text-sky-300";
    case "Completed":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function getPositionClasses(position: number) {
  if (position === 1) {
    return "border-yellow-500/20 bg-yellow-500/10 text-yellow-300";
  }

  if (position === 2) {
    return "border-zinc-400/20 bg-zinc-400/10 text-zinc-200";
  }

  if (position === 3) {
    return "border-orange-500/20 bg-orange-500/10 text-orange-300";
  }

  return "border-white/10 bg-white/5 text-zinc-300";
}

export function SessionResultsTable({ results }: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-950/60 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            Resultados
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Clasificación de la sesión
          </h2>
        </div>

        <p className="text-sm text-zinc-500">
          {results?.length ? `${results.length} pilotos clasificados` : "Sin resultados"}
        </p>
      </div>

      {!results || results.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-black/20 p-6">
          <p className="text-sm text-zinc-400">
            No encontramos resultados para esta sesión.
          </p>
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-white/10 bg-white/[0.03] text-zinc-400">
                <tr>
                  <th className="w-20 px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.16em]">
                    Pos
                  </th>
                  <th className="min-w-[220px] px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.16em]">
                    Piloto
                  </th>
                  <th className="min-w-[180px] px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.16em]">
                    Equipo
                  </th>
                  <th className="w-28 px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.16em]">
                    Vueltas
                  </th>
                  <th className="min-w-[140px] px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.16em]">
                    Gap / Tiempo
                  </th>
                  <th className="w-36 px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.16em]">
                    Estado
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {results.map((result) => (
                  <tr
                    key={`${result.position}-${result.driver}`}
                    className="transition hover:bg-white/[0.03]"
                  >
                    <td className="px-5 py-4 align-middle">
                      <span
                        className={`inline-flex min-w-8 items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getPositionClasses(
                          result.position
                        )}`}
                      >
                        {result.position}
                      </span>
                    </td>

                    <td className="px-5 py-4 align-middle">
                      <div className="font-medium text-white">{result.driver}</div>
                    </td>

                    <td className="px-5 py-4 align-middle text-zinc-300">
                      {result.team}
                    </td>

                    <td className="px-5 py-4 align-middle text-zinc-300">
                      {result.laps ?? "—"}
                    </td>

                    <td className="px-5 py-4 align-middle text-zinc-300">
                      {result.gap ?? "—"}
                    </td>

                    <td className="px-5 py-4 align-middle">
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
        </div>
      )}
    </section>
  );
}