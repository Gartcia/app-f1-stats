import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { CircuitDriversGrid } from "@/components/circuits/circuit-drivers-grid";
import { CircuitHeroCard } from "@/components/circuits/circuit-hero-card";
import { CircuitInfoGrid } from "@/components/circuits/circuit-info-grid";
import { CircuitLayoutCard } from "@/components/circuits/circuit-layout-card";
import { CircuitRecentSessions } from "@/components/circuits/circuit-recent-sessions";
import { getCircuitDetailData } from "@/lib/mappers/circuit-detail.mapper";
import { SectionCard } from "@/components/ui/section-card";

type CircuitDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CircuitDetailPage({
  params,
}: CircuitDetailPageProps) {
  const { id } = await params;

  const circuit = await getCircuitDetailData(id);

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
            layoutLabel={circuit.layoutLabel ?? "Layout"}
            layoutImage={circuit.layoutImage}
          />

          <SectionCard      eyebrow="Resumen"
            title="Visión general del trazado"
            description="Una vista general del diseño del circuito, mostrando su ubicación, tipo y características principales.">
            <p className="mt-4 text-sm leading-7 text-zinc-300">
              {circuit.name} está ubicado en {circuit.location}, {circuit.country}.
              {circuit.type ? ` Es un circuito de tipo ${circuit.type.toLowerCase()}.` : ""}
            </p>

            <p className="mt-4 text-sm leading-7 text-zinc-300">
              Esta ficha usa meetings, sesiones y pilotos reales de OpenF1,
              complementados con metadata visual local para layouts e identidad del circuito.
            </p>
          </SectionCard>
        </div>

        <CircuitInfoGrid
          country={circuit.country}
          location={circuit.location}
          lengthKm={circuit.lengthKm}
          laps={circuit.laps}
          firstGp={circuit.firstGp}
          lapRecord={circuit.lapRecord}
        />

        <CircuitDriversGrid drivers={circuit.drivers} />

        <CircuitRecentSessions
  circuitId={circuit.id}
  weekends={circuit.recentWeekends}
/>
      </div>
    </AppShell>
  );
}