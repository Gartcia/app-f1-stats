import type { CircuitSessionQuickStats } from "@/types/circuit";
import { SectionCard } from "../ui/section-card";

type Props = {
  quickStats?: CircuitSessionQuickStats;
};

type StatCardProps = {
  label: string;
  value: string;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="mt-3 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

export function SessionQuickStats({ quickStats }: Props) {
  return (
    <SectionCard      eyebrow="Resumen rápido"
      title="Estadísticas de la sesión"
      description="Información clave sobre el desempeño de los pilotos en esta sesión.">

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Ganador" value={quickStats?.winner ?? "—"} />
        <StatCard label="Pole" value={quickStats?.pole ?? "—"} />
        <StatCard label="Fastest lap" value={quickStats?.fastestLap ?? "—"} />
        <StatCard label="Top speed" value={quickStats?.topSpeed ?? "—"} />
      </div>
    </SectionCard>
  );
}