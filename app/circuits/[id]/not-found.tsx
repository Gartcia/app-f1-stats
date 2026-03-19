import Link from "next/link";
import { AppShell } from "@/components/app-shell";

export default function CircuitNotFound() {
  return (
    <AppShell activePath="/circuits">
      <div className="space-y-6">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            Circuitos
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-white">
            Circuito no encontrado
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            No encontramos el circuito que estás buscando. Puede que el id no
            exista o que el enlace esté mal escrito.
          </p>

          <div className="mt-5 flex gap-3">
            <Link
              href="/circuits"
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/15"
            >
              Volver a circuitos
            </Link>

            <Link
              href="/"
              className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              Ir al inicio
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}