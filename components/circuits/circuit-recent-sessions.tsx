import Link from "next/link";
import type { CircuitRecentSession } from "@/types/circuit";

type Props = {
  circuitId: string;
  sessions?: CircuitRecentSession[];
};

export function CircuitRecentSessions({ circuitId, sessions }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
        Sesiones recientes
      </p>

      {!sessions || sessions.length === 0 ? (
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Todavía no cargamos sesiones recientes para este circuito.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={`/circuits/${circuitId}/sessions/${session.id}`}
              className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-white/20 hover:bg-white/5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
                  {session.year}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
                  {session.sessionType}
                </span>

                <span className="text-xs text-zinc-500">{session.date}</span>
              </div>

              <p className="mt-3 text-sm leading-6 text-zinc-200">
                {session.headline}
              </p>

              <p className="mt-3 text-xs font-medium text-zinc-400">
                Ver sesión →
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}