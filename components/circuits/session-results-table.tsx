type SessionResult = {
  position: number;
  driver: string;
  team: string;
  laps?: number;
  gap?: string;
  status?: string;
};

type Props = {
  results?: SessionResult[];
};

export function SessionResultsTable({ results }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            Resultados
          </p>
          <h2 className="mt-2 text-lg font-semibold text-white">
            Resultados destacados
          </h2>
        </div>
      </div>

      {!results || results.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-400">
          Todavía no cargamos resultados para esta sesión.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/5 text-left text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Pos</th>
                <th className="px-4 py-3 font-medium">Piloto</th>
                <th className="px-4 py-3 font-medium">Equipo</th>
                <th className="px-4 py-3 font-medium">Vueltas</th>
                <th className="px-4 py-3 font-medium">Gap / Tiempo</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {results.map((result) => (
                <tr key={`${result.position}-${result.driver}`}>
                  <td className="px-4 py-3 text-white">{result.position}</td>
                  <td className="px-4 py-3 text-white">{result.driver}</td>
                  <td className="px-4 py-3 text-zinc-300">{result.team}</td>
                  <td className="px-4 py-3 text-zinc-300">
                    {result.laps ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">
                    {result.gap ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">
                    {result.status ?? "—"}
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