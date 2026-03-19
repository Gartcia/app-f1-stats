import { AppBottomNav } from "@/components/app-bottom-nav";
import { AppHeader } from "@/components/app-header";

export default function StrategyPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <AppHeader />

        <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Próximamente
          </p>
          <h1 className="mt-2 text-2xl font-bold text-white">Estrategia</h1>
          <p className="mt-3 max-w-2xl text-zinc-300">
            Esta pantalla va a mostrar stints, paradas, compuestos, ventanas de
            pit y lectura de estrategia por piloto.
          </p>
        </section>

        <AppBottomNav activePath="/strategy" />
      </div>
    </main>
  );
}