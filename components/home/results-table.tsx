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
    return "border-yellow-500/30 bg-yellow-500/12 text-yellow-300";
  }

  if (position === 2) {
    return "border-zinc-200/15 bg-zinc-200/8 text-zinc-200";
  }

  if (position === 3) {
    return "border-amber-700/30 bg-amber-700/12 text-amber-300";
  }

  return "border-white/10 bg-white/[0.04] text-white/80";
}

function getDeltaClass(value: number) {
  if (value === -999 || value === 0) {
    return "text-[#949498]";
  }

  if (value > 0) {
    return "text-[#00D2BE]";
  }

  return "text-[#E10600]";
}

export function ResultsTable({ results, sessionType }: Props) {
  const showGrid = !isPracticeSession(sessionType);
  const showDelta = !isPracticeSession(sessionType);
  const showPits = sessionType === "race";
  const showTyres = sessionType === "race" || sessionType === "qualifying";

  return (
    <section className="rounded-[8px] border border-white/10 bg-[#15151E] p-6">
      <div className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] italic text-[#949498]">
            Clasificación
          </p>
          <h2 className="mt-2 font-['Rajdhani',sans-serif] text-3xl font-semibold uppercase tracking-[0.02em] text-white">
            Resultados
          </h2>
        </div>

        <p className="text-sm text-[#949498]">
          Vista resumida de la sesión seleccionada
        </p>
      </div>

      <div className="overflow-x-auto rounded-[8px] border border-white/10 bg-[#0F1014]">
        <table className="w-full min-w-[920px] text-left text-sm text-white/80">
          <thead className="border-b border-white/10 bg-white/[0.03] font-mono text-[11px] uppercase tracking-[0.18em] text-[#949498]">
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
                className="transition hover:bg-white/[0.03]"
              >
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex min-w-9 items-center justify-center rounded-[4px] border px-2 py-1 font-mono text-xs font-semibold ${getPositionBadgeClass(
                      driver.position
                    )}`}
                  >
                    {driver.position}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="font-medium text-white">{driver.driverName}</div>
                </td>

                <td className="px-4 py-3 text-[#949498]">{driver.teamName}</td>

                {showGrid && (
                  <td className="px-4 py-3 font-mono text-white/85">
                    {formatStartPosition(driver.startPosition)}
                  </td>
                )}

                {showDelta && (
                  <td
                    className={`px-4 py-3 font-mono font-medium ${getDeltaClass(
                      driver.deltaPositions
                    )}`}
                  >
                    {formatDeltaPositions(driver.deltaPositions)}
                  </td>
                )}

                <td className="px-4 py-3 font-mono text-white/85">
                  {driver.lapsCompleted}
                </td>

                {showPits && (
                  <td className="px-4 py-3 font-mono text-white/85">
                    {driver.pitStops}
                  </td>
                )}

                {showTyres && (
                  <td className="px-4 py-3 font-medium text-white/90">
                    {driver.tyres}
                  </td>
                )}

                <td className="px-4 py-3 font-mono text-[#949498]">
                  {driver.topSpeed}
                </td>

                <td className="px-4 py-3">
                  <span className="font-medium text-white/90">{driver.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}