import Link from "next/link";
import type { CircuitRecentSession } from "@/types/circuit";

type Props = {
  circuitId: string;
  sessions?: CircuitRecentSession[];
};

function getSessionTypeClasses(sessionType: string) {
  switch (sessionType) {
    case "Race":
      return "border-red-500/20 bg-red-500/10 text-red-300";
    case "Qualifying":
      return "border-purple-500/20 bg-purple-500/10 text-purple-300";
    case "Sprint":
      return "border-orange-500/20 bg-orange-500/10 text-orange-300";
    case "FP1":
    case "FP2":
    case "FP3":
      return "border-sky-500/20 bg-sky-500/10 text-sky-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function SessionCard({
  circuitId,
  session,
}: {
  circuitId: string;
  session: CircuitRecentSession;
}) {
  const isAvailable = session.isAvailable ?? true;

  const content = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getSessionTypeClasses(
            session.sessionType
          )}`}
        >
          {session.sessionType}
        </span>

        <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
          {session.year}
        </span>

        <span className="text-xs text-zinc-500">{session.date}</span>
      </div>

      <p className="mt-3 text-sm leading-6 text-zinc-200">{session.headline}</p>

      <p className="mt-4 text-xs font-medium text-zinc-400">
        {isAvailable ? "Ver sesión →" : "Detalle próximamente"}
      </p>
    </>
  );

  if (!isAvailable) {
    return (
      <div className="block rounded-2xl border border-white/10 bg-black/20 p-4 opacity-80">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={`/circuits/${circuitId}/sessions/${session.id}`}
      className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-white/20 hover:bg-white/5"
    >
      {content}
    </Link>
  );
}

export function CircuitRecentSessions({ circuitId, sessions }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
          Sesiones recientes
        </p>
        <h2 className="mt-2 text-lg font-semibold text-white">
          Actividad reciente en este circuito
        </h2>
      </div>

      {!sessions || sessions.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-black/20 p-6">
          <p className="text-sm leading-6 text-zinc-400">
            Todavía no cargamos sesiones recientes para este circuito.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              circuitId={circuitId}
              session={session}
            />
          ))}
        </div>
      )}
    </section>
  );
}