import type { DriverResult, SessionType } from "@/types/home";

type Props = {
  results: DriverResult[];
  sessionType: SessionType;
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

function isPracticeSession(sessionType: SessionType) {
  return sessionType === "fp1" || sessionType === "fp2" || sessionType === "fp3";
}

function getPositionBadgeClass(position: number) {
  if (position === 1) {
    return "bg-yellow-500/15 text-yellow-300 border-yellow-500/20";
  }

  if (position === 2) {
    return "bg-zinc-200/10 text-zinc-200 border-zinc-200/10";
  }

  if (position === 3) {
    return "bg-amber-700/15 text-amber-300 border-amber-700/20";
  }

  return "bg-zinc-800 text-zinc-300 border-white/5";
}

function getDeltaClass(value: number) {
  if (value === -999 || value === 0) {
    return "text-zinc-400";
  }

  if (value > 0) {
    return "text-emerald-400";
  }

  return "text-red-400";
}

export function ResultsTable({ results, sessionType }: Props) {
  const showGrid = !isPracticeSession(sessionType);
  const showDelta = !isPracticeSession(sessionType);
  const showPits = sessionType === "race";
  const showTyres = sessionType === "race" || sessionType === "qualifying";

  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Clasificación
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">Resultados</h2>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-full text-left text-sm text-zinc-300">
          <thead className="bg-zinc-950/70 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-3 py-3">Pos</th>
              <th className="px-3 py-3">Piloto</th>
              <th className="px-3 py-3">Equipo</th>

              {showGrid && <th className="px-3 py-3">Grid</th>}
              {showDelta && <th className="px-3 py-3">Δ</th>}

              <th className="px-3 py-3">Vueltas</th>

              {showPits && <th className="px-3 py-3">Pits</th>}
              {showTyres && <th className="px-3 py-3">Neumáticos</th>}

              <th className="px-3 py-3">Top speed</th>
              <th className="px-3 py-3">Estado</th>
            </tr>
          </thead>

          <tbody>
            {results.map((driver) => (
              <tr
                key={`${driver.position}-${driver.driverName}`}
                className="border-t border-white/5 transition hover:bg-white/[0.03]"
              >
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex min-w-9 items-center justify-center rounded-full border px-2 py-1 text-xs font-semibold ${getPositionBadgeClass(
                      driver.position
                    )}`}
                  >
                    {driver.position}
                  </span>
                </td>

                <td className="px-3 py-3">
                  <div className="font-medium text-white">{driver.driverName}</div>
                </td>

                <td className="px-3 py-3 text-zinc-400">{driver.teamName}</td>

                {showGrid && (
                  <td className="px-3 py-3 text-zinc-300">
                    {formatStartPosition(driver.startPosition)}
                  </td>
                )}

                {showDelta && (
                  <td className={`px-3 py-3 font-medium ${getDeltaClass(driver.deltaPositions)}`}>
                    {formatDeltaPositions(driver.deltaPositions)}
                  </td>
                )}

                <td className="px-3 py-3 text-zinc-300">{driver.lapsCompleted}</td>

                {showPits && (
                  <td className="px-3 py-3 text-zinc-300">{driver.pitStops}</td>
                )}

                {showTyres && (
                  <td className="px-3 py-3 font-medium text-zinc-200">
                    {driver.tyres}
                  </td>
                )}

                <td className="px-3 py-3 text-zinc-400">{driver.topSpeed}</td>
                <td className="px-3 py-3 font-medium text-zinc-200">{driver.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}