import { AppShell } from "@/components/app-shell";
import { CircuitsList } from "@/components/circuits/circuits-list";
import { circuits } from "@/lib/data/circuits";

export default function CircuitsPage() {
  return (
    <AppShell activePath="/circuits">
      <div className="space-y-6">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            Circuitos
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-white">
            Calendario de circuitos
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Explora los circuitos del calendario y accede a una ficha rápida con
            información base de cada uno.
          </p>
        </section>

        <CircuitsList circuits={circuits} />
      </div>
    </AppShell>
  );
}