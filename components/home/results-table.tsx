import type { DriverResult } from "@/types/home";

type Props = {
  results: DriverResult[];
};

function formatStartPosition(value: number) {
  return value > 0 ? String(value) : "-";
}

function formatDeltaPositions(value: number) {
  if (value === -999) {
    return "-";
  }

  if (value > 0) {
    return `+${value}`;
  }

  return String(value);
}

export function ResultsTable({ results }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900 p-4">
      <div className="mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
          Resultados
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-zinc-300">
          <thead className="border-b border-white/10 text-zinc-400">
            <tr>
              <th className="px-3 py-3">Pos</th>
              <th className="px-3 py-3">Piloto</th>
              <th className="px-3 py-3">Equipo</th>
              <th className="px-3 py-3">Grid</th>
              <th className="px-3 py-3">Δ</th>
              <th className="px-3 py-3">Vueltas</th>
              <th className="px-3 py-3">Pits</th>
              <th className="px-3 py-3">Neumáticos</th>
              <th className="px-3 py-3">Top speed</th>
              <th className="px-3 py-3">Estado</th>
            </tr>
          </thead>

          <tbody>
            {results.map((driver) => (
              <tr
                key={`${driver.position}-${driver.driverName}`}
                className="border-b border-white/5"
              >
                <td className="px-3 py-3">{driver.position}</td>
                <td className="px-3 py-3 font-medium text-white">
                  {driver.driverName}
                </td>
                <td className="px-3 py-3">{driver.teamName}</td>
                <td className="px-3 py-3">
                  {formatStartPosition(driver.startPosition)}
                </td>
                <td className="px-3 py-3">
                  {formatDeltaPositions(driver.deltaPositions)}
                </td>
                <td className="px-3 py-3">{driver.lapsCompleted}</td>
                <td className="px-3 py-3">{driver.pitStops}</td>
                <td className="px-3 py-3">{driver.tyres}</td>
                <td className="px-3 py-3">{driver.topSpeed}</td>
                <td className="px-3 py-3">{driver.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}