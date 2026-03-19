import Link from "next/link";
import type { CircuitListItem } from "@/types/circuit";

type Props = {
  circuits: CircuitListItem[];
};

function getCircuitTypeClasses(type?: CircuitListItem["type"]) {
  switch (type) {
    case "Callejero":
      return "border-orange-500/20 bg-orange-500/10 text-orange-300";
    case "Permanente":
      return "border-sky-500/20 bg-sky-500/10 text-sky-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

export function CircuitsList({ circuits }: Props) {
  return (
    <section className="space-y-3">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
          Circuitos
        </p>
        <h2 className="mt-2 text-lg font-semibold text-white">
          Explora el calendario
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {circuits.map((circuit) => (
          <Link
            key={circuit.id}
            href={`/circuits/${circuit.id}`}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-white/20 hover:bg-white/[0.07]"
          >
            <div className="border-b border-white/10 bg-gradient-to-br from-white/10 to-transparent p-5">
              <div className="flex flex-wrap items-center gap-2">
                {circuit.type && (
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getCircuitTypeClasses(
                      circuit.type
                    )}`}
                  >
                    {circuit.type}
                  </span>
                )}

                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
                  {circuit.country}
                </span>

                {circuit.year && (
                  <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
                    {circuit.year}
                  </span>
                )}
              </div>

              <h3 className="mt-4 text-xl font-semibold text-white">
                {circuit.name}
              </h3>

              <p className="mt-2 text-sm text-zinc-400">{circuit.location}</p>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                    Último meeting
                  </p>
                  <p className="mt-2 font-medium text-white">
                    {circuit.lastMeetingName ?? "No disponible"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                    Layout
                  </p>
                  <p className="mt-2 font-medium text-white">
                    {circuit.layoutLabel ?? "Sin layout"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">
                  Ver detalle, pilotos y sesiones
                </p>

                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white transition group-hover:border-white/20 group-hover:bg-white/10">
                  Abrir →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}