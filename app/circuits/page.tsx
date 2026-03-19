import { AppShell } from "@/components/app-shell";
import { CircuitsList } from "@/components/circuits/circuits-list";
import { circuits } from "@/lib/data/circuits";

export default function CircuitsPage() {
  return (
    <AppShell activePath="/circuits">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div className="border-b border-white/10 bg-gradient-to-br from-white/10 to-transparent p-6">
            <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
              Circuits
            </p>

            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Calendario de circuitos
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
              Explora los circuitos del calendario y accede a una ficha rápida
              con información base, layout visual y sesiones recientes de cada
              trazado.
            </p>
          </div>

          <div className="grid gap-3 p-6 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                Total
              </p>
              <p className="mt-2 text-base font-medium text-white">
                {circuits.length} circuitos
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                Callejeros
              </p>
              <p className="mt-2 text-base font-medium text-white">
                {circuits.filter((circuit) => circuit.type === "Callejero").length}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                Permanentes
              </p>
              <p className="mt-2 text-base font-medium text-white">
                {circuits.filter((circuit) => circuit.type === "Permanente").length}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                Módulo
              </p>
              <p className="mt-2 text-base font-medium text-white">
                Explorer V1
              </p>
            </div>
          </div>
        </section>

        <CircuitsList circuits={circuits} />
      </div>
    </AppShell>
  );
}