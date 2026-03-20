import { SectionCard } from "../ui/section-card";

type SessionTopResult = {
  position: number;
  driver: string;
  team: string;
  laps?: number;
  gap?: string;
  status?: string;
};

type Props = {
  results?: SessionTopResult[];
};

export function SessionTopResults({ results }: Props) {
  return (
    <SectionCard      eyebrow="Resultados destacados"
      title="Top 5 de la sesión">

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
    </SectionCard>
  );
}