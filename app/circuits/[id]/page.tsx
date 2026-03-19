import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { circuits } from "@/lib/data/circuits";
import { CircuitLayoutCard } from "@/components/circuits/circuit-layout-card";
import { CircuitRecentSessions } from "@/components/circuits/circuit-recent-sessions";

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
        <div className="space-y-3">
          <Link
            href="/circuits"
            className="inline-flex text-sm text-zinc-400 transition hover:text-white"
          >
            ← Volver a circuitos
          </Link>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Circuit detail
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-white">
              {circuit.name}
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              {circuit.location}, {circuit.country}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                {circuit.type}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                {circuit.lengthKm} km
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                {circuit.laps} vueltas
              </span>
            </div>
          </section>
        </div>

        <section className="grid gap-4 xl:grid-cols-3">
          <CircuitLayoutCard
            layoutLabel={circuit.layoutLabel}
            layoutImage={circuit.layoutImage}
            />

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Datos rápidos
            </p>

            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="text-zinc-500">Primer GP</p>
                <p className="mt-1 font-medium text-white">{circuit.firstGp}</p>
              </div>

              <div>
                <p className="text-zinc-500">Récord de vuelta</p>
                <p className="mt-1 font-medium text-white">
                  {circuit.lapRecord}
                </p>
              </div>

              <div>
                <p className="text-zinc-500">Formato</p>
                <p className="mt-1 font-medium text-white">
                  {circuit.laps} vueltas / {circuit.lengthKm} km
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-400">País</p>
            <p className="mt-2 text-base font-medium text-white">
              {circuit.country}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-400">
              Ubicación
            </p>
            <p className="mt-2 text-base font-medium text-white">
              {circuit.location}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-400">
              Longitud
            </p>
            <p className="mt-2 text-base font-medium text-white">
              {circuit.lengthKm} km
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-400">
              Vueltas
            </p>
            <p className="mt-2 text-base font-medium text-white">
              {circuit.laps}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            Resumen
          </p>

          <p className="mt-3 text-sm leading-7 text-zinc-300">
            {circuit.name} está ubicado en {circuit.location}, {circuit.country}.
            Es un circuito de tipo {circuit.type.toLowerCase()} con una longitud
            de {circuit.lengthKm} km y una distancia de carrera habitual de{" "}
            {circuit.laps} vueltas.
          </p>

          <p className="mt-3 text-sm leading-7 text-zinc-300">
            Esta ficha forma parte de la primera versión del módulo de circuitos
            y está pensada para crecer después con mapa real, estadísticas
            históricas y relación con sesiones recientes.
          </p>
        </section>
        <CircuitRecentSessions sessions={circuit.recentSessions} />
      </div>
    </AppShell>
  );
}