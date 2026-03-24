import Link from "next/link";
import type { CircuitWeekend, CircuitWeekendSession } from "@/types/circuit";
import { SectionCard } from "../ui/section-card";

type Props = {
  circuitId: string;
  weekends?: CircuitWeekend[];
};

function getSessionTypeClasses(sessionType: string) {
  switch (sessionType) {
    case "Race":
      return "border-[#E10600]/30 bg-[linear-gradient(90deg,rgba(225,6,0,0.18)_0%,rgba(142,4,0,0.18)_100%)] text-white";
    case "Qualifying":
      return "border-purple-500/30 bg-purple-500/10 text-purple-300";
    case "Sprint":
      return "border-orange-500/30 bg-orange-500/10 text-orange-300";
    case "Sprint Shootout":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "FP1":
    case "FP2":
    case "FP3":
      return "border-sky-500/30 bg-sky-500/10 text-sky-300";
    default:
      return "border-white/10 bg-white/[0.04] text-[#949498]";
  }
}

function SessionTag({
  circuitId,
  session,
}: {
  circuitId: string;
  session: CircuitWeekendSession;
}) {
  const isAvailable = session.isAvailable ?? true;

  const classes = `inline-flex items-center rounded-[4px] border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${getSessionTypeClasses(
    session.sessionType
  )}`;

  if (!isAvailable) {
    return <span className={`${classes} opacity-70`}>{session.sessionType}</span>;
  }

  return (
    <Link
      href={`/circuits/${circuitId}/sessions/${session.sessionKey}`}
      className={`${classes} transition hover:brightness-110 hover:shadow-[0_0_14px_rgba(225,6,0,0.12)]`}
    >
      {session.sessionType}
    </Link>
  );
}

function MetaChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-sm border border-white/10 bg-black/20 px-2.5 py-1 font-mono text-[11px] text-white/80">
      {children}
    </span>
  );
}

export function CircuitRecentSessions({ circuitId, weekends }: Props) {
  return (
    <SectionCard      eyebrow="GPs recientes"
      title="Sesiones recientes"
      description="Un resumen de las últimas sesiones que se llevaron a cabo en este circuito.">

      {!weekends || weekends.length === 0 ? (
        <div className="rounded-lg border border-dashed border-white/10 bg-[#0F1014] p-6">
          <p className="text-sm leading-6 text-[#949498]">
            Todavía no cargamos GPs recientes para este circuito.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {weekends.map((weekend) => (
            <article
              key={weekend.id}
              className="rounded-lg border border-white/10 bg-[#0F1014] p-4"
            >
              <div className="flex flex-col gap-3 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <MetaChip>{weekend.year}</MetaChip>
                    <MetaChip>{weekend.location}</MetaChip>

                    {weekend.dateStart ? (
                      <span className="font-mono text-[11px] text-[#949498]">
                        {new Intl.DateTimeFormat("es-AR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(weekend.dateStart))}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-3 font-['Rajdhani',sans-serif] text-xl font-semibold uppercase tracking-[0.02em] text-white">
                    {weekend.meetingName}
                  </h3>

                  <p className="mt-1 text-sm text-[#949498]">
                    {weekend.officialName ?? `${weekend.location}, ${weekend.country}`}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {weekend.sessions.map((session) => (
                  <div
                    key={session.id}
                    className="border-l-2 border-white/10 bg-white/2 px-3 py-3 transition hover:border-[#E10600]/50 hover:bg-white/4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <SessionTag circuitId={circuitId} session={session} />

                      <span className="font-mono text-[11px] text-[#949498]">
                        {session.date}
                      </span>
                    </div>

                    {session.headline ? (
                      <p className="mt-2 text-sm leading-6 text-white/80">
                        {session.headline}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </SectionCard>
  );
}