import { AppShell } from "@/components/app-shell";

export default function CircuitsPage() {
  return (
    <AppShell activePath="/circuits">
      <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Próximamente
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white">Circuitos</h1>
        <p className="mt-3 max-w-2xl text-zinc-300">
          Esta pantalla va a incluir información de trazados, mapas, sectores,
          longitud y datos clave de cada circuito.
        </p>
      </section>
    </AppShell>
  );
}