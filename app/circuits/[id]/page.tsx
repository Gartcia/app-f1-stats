import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { CircuitHeroCard } from "@/components/circuits/circuit-hero-card";
import { CircuitInfoGrid } from "@/components/circuits/circuit-info-grid";
import { CircuitLayoutCard } from "@/components/circuits/circuit-layout-card";
import { CircuitRecentSessions } from "@/components/circuits/circuit-recent-sessions";
import { circuits } from "@/lib/data/circuits";

type CircuitDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CircuitDetailPage({
  params,
}: CircuitDetailPageProps) {
  const { id } = await params;

  const circuit = circuits.find((item) => item.id === id);

  if (!circuit) {
    notFound();
  }

  return (
    <AppShell activePath="/circuits">
      <div className="space-y-6">
        <Link
          href="/circuits"
          className="inline-flex text-sm text-zinc-400 transition hover:text-white"
        >
          ← Volver a circuitos
        </Link>

        <CircuitHeroCard
          name={circuit.name}
          location={circuit.location}
          country={circuit.country}
          type={circuit.type}
          lengthKm={circuit.lengthKm}
          laps={circuit.laps}
        />

        <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
          <CircuitLayoutCard
            layoutLabel={circuit.layoutLabel}
            layoutImage={circuit.layoutImage}
          />

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Resumen
            </p>

            <h2 className="mt-2 text-lg font-semibold text-white">
              Visión general del trazado
            </h2>

            <p className="mt-4 text-sm leading-7 text-zinc-300">
              {circuit.name} está ubicado en {circuit.location}, {circuit.country}.
              Es un circuito de tipo {circuit.type.toLowerCase()} con una longitud
              de {circuit.lengthKm} km y una distancia de carrera habitual de{" "}
              {circuit.laps} vueltas.
            </p>

            <p className="mt-4 text-sm leading-7 text-zinc-300">
              Esta ficha forma parte de la primera versión del módulo de circuitos
              y está pensada para crecer con mejores visuales, estadísticas
              históricas y relación con sesiones recientes del calendario.
            </p>
          </section>
        </div>

        <CircuitInfoGrid
          country={circuit.country}
          location={circuit.location}
          lengthKm={circuit.lengthKm}
          laps={circuit.laps}
          firstGp={circuit.firstGp}
          lapRecord={circuit.lapRecord}
        />

        <CircuitRecentSessions
          circuitId={circuit.id}
          sessions={circuit.recentSessions}
        />
      </div>
    </AppShell>
  );
}