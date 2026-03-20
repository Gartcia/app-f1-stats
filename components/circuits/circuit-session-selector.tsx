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
    <section className="rounded-2xl border border-white/10 bg-zinc-900 p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Selector de sesión
      </h2>

      <div className="flex flex-wrap gap-2">
        {availableSessions.map((session) => {
          const targetSessionId = String(session.sessionKey);
          const isActive = targetSessionId === currentSessionId;

          return (
            <Link
              key={session.id}
              href={`/circuits/${circuitId}/sessions/${targetSessionId}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-red-600 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
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