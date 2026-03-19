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
    return "border-yellow-500/20 bg-yellow-500/15 text-yellow-300";
  }

  if (position === 2) {
    return "border-zinc-200/10 bg-zinc-200/10 text-zinc-200";
  }

  if (position === 3) {
    return "border-amber-700/20 bg-amber-700/15 text-amber-300";
  }

  return "border-white/10 bg-white/5 text-zinc-300";
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
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Clasificación
          </p>
          <h2 className="mt-2 text-lg font-semibold text-white">Resultados</h2>
        </div>

        <p className="text-sm text-zinc-500">
          Vista resumida de la sesión seleccionada
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20">
        <table className="w-full min-w-[920px] text-left text-sm text-zinc-300">
          <thead className="bg-white/5 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Pos</th>
              <th className="min-w-[160px] px-4 py-3 font-medium">Piloto</th>
              <th className="min-w-[140px] px-4 py-3 font-medium">Equipo</th>

              {showGrid && <th className="px-4 py-3 font-medium">Grid</th>}
              {showDelta && <th className="px-4 py-3 font-medium">Δ</th>}

              <th className="px-4 py-3 font-medium">Vueltas</th>

              {showPits && <th className="px-4 py-3 font-medium">Pits</th>}
              {showTyres && (
                <th className="min-w-[120px] px-4 py-3 font-medium">
                  Neumáticos
                </th>
              )}

              <th className="min-w-[110px] px-4 py-3 font-medium">
                Top speed
              </th>
              <th className="min-w-[120px] px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {results.map((driver) => (
              <tr
                key={`${driver.position}-${driver.driverName}`}
                className="transition hover:bg-white/5"
              >
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex min-w-9 items-center justify-center rounded-full border px-2 py-1 text-xs font-semibold ${getPositionBadgeClass(
                      driver.position
                    )}`}
                  >
                    {driver.position}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="font-medium text-white">{driver.driverName}</div>
                </td>

                <td className="px-4 py-3 text-zinc-400">{driver.teamName}</td>

                {showGrid && (
                  <td className="px-4 py-3 text-zinc-300">
                    {formatStartPosition(driver.startPosition)}
                  </td>
                )}

                {showDelta && (
                  <td
                    className={`px-4 py-3 font-medium ${getDeltaClass(
                      driver.deltaPositions
                    )}`}
                  >
                    {formatDeltaPositions(driver.deltaPositions)}
                  </td>
                )}

                <td className="px-4 py-3 text-zinc-300">
                  {driver.lapsCompleted}
                </td>

                {showPits && (
                  <td className="px-4 py-3 text-zinc-300">{driver.pitStops}</td>
                )}

                {showTyres && (
                  <td className="px-4 py-3 font-medium text-zinc-200">
                    {driver.tyres}
                  </td>
                )}

                <td className="px-4 py-3 text-zinc-400">{driver.topSpeed}</td>
                <td className="px-4 py-3 font-medium text-zinc-200">
                  {driver.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}