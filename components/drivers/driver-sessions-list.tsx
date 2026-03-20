import Link from "next/link";
import type { DriverWeekend, DriverWeekendSession } from "@/lib/mappers/drivers.mapper";

type Props = {
  weekends: DriverWeekend[];
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

function getSessionTypeClasses(sessionType: string) {
  switch (sessionType) {
    case "Race":
      return "border-red-500/20 bg-red-500/10 text-red-300";
    case "Qualifying":
      return "border-purple-500/20 bg-purple-500/10 text-purple-300";
    case "Sprint":
      return "border-orange-500/20 bg-orange-500/10 text-orange-300";
    case "Sprint Shootout":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    case "FP1":
    case "FP2":
    case "FP3":
      return "border-sky-500/20 bg-sky-500/10 text-sky-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function SessionPill({ session }: { session: DriverWeekendSession }) {
  if (!session.circuitId) {
    return (
      <span
        className={`inline-flex rounded-full border px-3 py-2 text-sm font-medium opacity-70 ${getSessionTypeClasses(
          session.sessionType
        )}`}
      >
        {session.sessionType}
      </span>
    );
  }

  return (
    <Link
      href={`/circuits/${session.circuitId}/sessions/${session.sessionKey}`}
      className={`inline-flex rounded-full border px-3 py-2 text-sm font-medium transition hover:border-white/20 hover:opacity-90 ${getSessionTypeClasses(
        session.sessionType
      )}`}
    >
      {session.sessionType}
    </Link>
  );
}

export function DriverSessionsList({ weekends }: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
          GPs recientes
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          Actividad del piloto
        </h2>
      </div>

      {weekends.length === 0 ? (
        <p className="text-sm text-zinc-400">
          No encontramos GPs recientes para este piloto.
        </p>
      ) : (
        <div className="grid gap-4">
          {weekends.map((weekend) => (
            <article
              key={weekend.id}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    {weekend.meetingName}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {weekend.circuitName} · {weekend.location}, {weekend.country}
                  </p>
                </div>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                  {new Intl.DateTimeFormat("es-AR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(weekend.dateStart))}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {weekend.sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <SessionPill session={session} />

                    <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-xs text-zinc-300">
                      Pos {session.position ?? "-"}
                    </span>

                    <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-xs text-zinc-300">
                      {session.lapsCompleted} vueltas
                    </span>

                    <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-xs text-zinc-300">
                      {session.gapToLeader}
                    </span>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                        session.status
                      )}`}
                    >
                      {session.status}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}