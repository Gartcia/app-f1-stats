import Link from "next/link";
import type { CircuitRecentSession } from "@/types/circuit";

type Props = {
  circuitId: string;
  currentSessionId: string;
  sessions: CircuitRecentSession[];
};

const SESSION_ORDER = {
  Race: 0,
  Qualifying: 1,
  Sprint: 2,
  FP1: 3,
  FP2: 4,
  FP3: 5,
} as const;

export function CircuitSessionSelector({
  circuitId,
  currentSessionId,
  sessions,
}: Props) {
  const availableSessions = [...sessions].sort(
    (a, b) => SESSION_ORDER[a.sessionType] - SESSION_ORDER[b.sessionType]
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
          const isActive = session.id === currentSessionId;

          return (
            <Link
              key={session.id}
              href={`/circuits/${circuitId}/sessions/${session.id}`}
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