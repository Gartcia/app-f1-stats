import { AppShell } from "@/components/app-shell";

export default function RadioPage() {
  return (
    <AppShell activePath="/radio">
      <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Próximamente
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white">Radios</h1>
        <p className="mt-3 max-w-2xl text-zinc-300">
          Esta pantalla va a agrupar mensajes de radio por sesión, piloto y
          momento de carrera.
        </p>
      </section>
    </AppShell>
  );
}