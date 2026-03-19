import { AppShell } from "@/components/app-shell";
import { CircuitsList } from "@/components/circuits/circuits-list";

export default function CircuitsPage() {
  return (
    <AppShell activePath="/circuits">
      <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Circuitos
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white">
          Base de circuitos
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-300">
          Esta sección reúne información base de circuitos para futuras vistas
          de mapa, sectores y métricas de carrera.
        </p>
      </section>

      <CircuitsList />
    </AppShell>
  );
}