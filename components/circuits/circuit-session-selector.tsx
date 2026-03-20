import Link from "next/link";
import type { CircuitWeekendSession } from "@/types/circuit";

type Props = {
  circuitId: string;
  currentSessionId: string;
  sessions: CircuitWeekendSession[];
};

const SESSION_ORDER: Record<CircuitWeekendSession["sessionType"], number> = {
  Race: 0,
  Qualifying: 1,
  Sprint: 2,
  "Sprint Shootout": 3,
  FP3: 4,
  FP2: 5,
  FP1: 6,
};

export function CircuitSessionSelector({
  circuitId,
  currentSessionId,
  sessions,
}: Props) {
  const availableSessions = [...sessions].sort(
    (a, b) =>
      (SESSION_ORDER[a.sessionType] ?? 999) -
      (SESSION_ORDER[b.sessionType] ?? 999)
  );

  if (availableSessions.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[8px] border border-white/10 bg-[#15151E] p-4">
      <div className="mb-4 border-b border-white/10 pb-3">
        <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] italic text-[#949498]">
          Selector de sesión
        </h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {availableSessions.map((session) => {
          const targetSessionId = String(session.sessionKey);
          const isActive = targetSessionId === currentSessionId;

          return (
            <Link
              key={session.id}
              href={`/circuits/${circuitId}/sessions/${targetSessionId}`}
              className={`inline-flex items-center rounded-[4px] border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                isActive
                  ? "border-[#E10600]/40 bg-[linear-gradient(90deg,#E10600_0%,#8E0400_100%)] text-white shadow-[0_0_18px_rgba(225,6,0,0.16)]"
                  : "border-white/10 bg-white/[0.03] text-[#949498] hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {session.sessionType}
            </Link>
          );
        })}
      </div>
    </section>
  );
}