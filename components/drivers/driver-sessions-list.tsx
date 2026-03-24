import Link from "next/link";
import type {
  DriverWeekend,
  DriverWeekendSession,
} from "@/lib/mappers/drivers.mapper";
import { SectionCard } from "../ui/section-card";

type Props = {
  weekends: DriverWeekend[];
};

function getStatusClasses(status: string) {
  switch (status) {
    case "Finished":
      return "border-[#00D2BE]/30 bg-[#00D2BE]/10 text-[#00D2BE]";
    case "DNF":
    case "DNS":
    case "DSQ":
      return "border-[#E10600]/30 bg-[#E10600]/10 text-[#E10600]";
    default:
      return "border-white/10 bg-white/[0.04] text-[#949498]";
  }
}

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

function DataChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-sm border border-white/10 bg-black/20 px-2.5 py-1 font-mono text-[11px] text-white/80">
      {children}
    </span>
  );
}

function SessionTag({ session }: { session: DriverWeekendSession }) {
  const classes = `inline-flex items-center rounded-[4px] border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${getSessionTypeClasses(
    session.sessionType
  )}`;

  if (!session.circuitId) {
    return <span className={`${classes} opacity-70`}>{session.sessionType}</span>;
  }

  return (
    <Link
      href={`/circuits/${session.circuitId}/sessions/${session.sessionKey}`}
      className={`${classes} transition hover:brightness-110 hover:shadow-[0_0_14px_rgba(225,6,0,0.12)]`}
    >
      {session.sessionType}
    </Link>
  );
}

export function DriverSessionsList({ weekends }: Props) {
  return (
    <SectionCard      eyebrow="GPs recientes"
      title="Sesiones recientes"
      description="Un resumen de las últimas sesiones en las que participó este piloto."
    >

      {weekends.length === 0 ? (
        <p className="text-sm text-[#949498]">
          No encontramos GPs recientes para este piloto.
        </p>
      ) : (
        <div className="grid gap-4">
          {weekends.map((weekend) => (
            <article
              key={weekend.id}
              className="rounded-lg border border-white/10 bg-[#0F1014] p-4"
            >
              <div className="flex flex-col gap-3 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-['Rajdhani',sans-serif] text-xl font-semibold uppercase tracking-[0.02em] text-white">
                    {weekend.meetingName}
                  </p>
                  <p className="mt-1 text-sm text-[#949498]">
                    {weekend.circuitName} · {weekend.location}, {weekend.country}
                  </p>
                </div>

                <span className="inline-flex rounded-sm border border-white/10 bg-white/4 px-3 py-1 font-mono text-[11px] text-white/80">
                  {new Intl.DateTimeFormat("es-AR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(weekend.dateStart))}
                </span>
              </div>

              <div className="mt-4 grid gap-3">
                {weekend.sessions.map((session) => (
                  <div
                    key={session.id}
                    className="border-l-2 border-white/10 bg-white/2 px-3 py-3 transition hover:border-[#E10600]/50 hover:bg-white/4"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <SessionTag session={session} />

                        <span className="font-mono text-[11px] text-[#949498]">
                          {session.date}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <DataChip>Pos {session.position ?? "-"}</DataChip>
                        <DataChip>{session.lapsCompleted} vueltas</DataChip>
                        <DataChip>{session.gapToLeader}</DataChip>

                        <span
                          className={`inline-flex rounded-sm border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getStatusClasses(
                            session.status
                          )}`}
                        >
                          {session.status}
                        </span>
                      </div>
                    </div>
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