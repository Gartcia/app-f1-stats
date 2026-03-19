import Link from "next/link";
import type { Circuit } from "@/types/circuit";

type Props = {
  circuits: Circuit[];
};

export function CircuitsList({ circuits }: Props) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {circuits.map((circuit) => (
        <Link
          key={circuit.id}
          href={`/circuits/${circuit.id}`}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
        >
          <div className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-400">
                {circuit.country}
              </p>

              <h2 className="mt-1 text-lg font-semibold text-white">
                {circuit.name}
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                {circuit.location}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Longitud
                </p>
                <p className="mt-1 font-medium text-white">
                  {circuit.lengthKm} km
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Vueltas
                </p>
                <p className="mt-1 font-medium text-white">{circuit.laps}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">{circuit.type}</span>
              <span className="text-sm font-medium text-white">
                Ver detalle →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}