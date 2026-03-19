import type { DriverSessionResult } from "@/lib/mappers/drivers.mapper";
import Link from "next/link";

type Props = {
  sessions: DriverSessionResult[];
};

function getStatusClasses(status: string) {
  switch (status) {
    case "Finished":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "DNF":
    case "DNS":
    case "DSQ":
      return "border-red-500/20 bg-red-500/10 text-red-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

export function DriverSessionsList({ sessions }: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
          Sesiones recientes
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          Actividad del piloto
        </h2>
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm text-zinc-400">
          No encontramos sesiones recientes para este piloto.
        </p>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <Link
  key={session.sessionKey}
  href={`/circuits/${session.circuitId}/sessions/${session.sessionId}`}
  className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-white/20 hover:bg-white/5"
>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    {session.meetingName}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {session.circuitName} · {session.sessionName} · {session.date}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                    Pos {session.position ?? "-"}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                    {session.lapsCompleted} vueltas
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                    {session.gapToLeader}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                      session.status
                    )}`}
                  >
                    {session.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}