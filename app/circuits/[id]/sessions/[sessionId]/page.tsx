import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { QuickStats } from "@/components/home/quick-stats";
import { ResultsTable } from "@/components/home/results-table";
import { SessionSummary } from "@/components/home/session-summary";
import { getCircuitSessionData } from "@/lib/mappers/circuit-session.mapper";
import { circuits } from "@/lib/data/circuits";
import type { SessionType } from "@/types/home";
import { CircuitSessionSelector } from "@/components/circuits/circuit-session-selector";
import {
  buildCircuitSessionMockId,
  getLatestCompletedMeetingForCircuit,
  getSessionsByMeetingKey,
  mapOpenF1SessionNameToCircuitSessionType,
  parseCircuitSessionMockId,
} from "@/lib/api/openf1";
import type { CircuitRecentSession } from "@/types/circuit";

type SessionDetailPageProps = {
  params: Promise<{
    id: string;
    sessionId: string;
  }>;
};

function mapCircuitSessionToHomeType(
  sessionType: "Race" | "Qualifying" | "Sprint" | "FP1" | "FP2" | "FP3"
): SessionType {
  if (sessionType === "Qualifying") return "qualifying";
  if (sessionType === "FP1") return "fp1";
  if (sessionType === "FP2") return "fp2";
  if (sessionType === "FP3") return "fp3";
  return "race";
}

function formatSessionDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function SessionDetailPage({
  params,
}: SessionDetailPageProps) {
  const { id, sessionId } = await params;

  const circuit = circuits.find((item) => item.id === id);

  if (!circuit) {
    notFound();
  }

  const parsedSession = parseCircuitSessionMockId(sessionId);

  if (!parsedSession || parsedSession.circuitId !== circuit.id) {
    notFound();
  }

  const latestMeeting = await getLatestCompletedMeetingForCircuit({
    id: circuit.id,
    country: circuit.country,
    location: circuit.location,
  });

  if (!latestMeeting) {
    notFound();
  }

  const openF1Sessions = await getSessionsByMeetingKey(latestMeeting.meeting_key);

  const availableSessions = openF1Sessions
  .map((session): CircuitRecentSession | null => {
    const mappedType = mapOpenF1SessionNameToCircuitSessionType(
      session.session_name
    );

    if (!mappedType) {
      return null;
    }

    return {
      id: buildCircuitSessionMockId(circuit.id, session.year, mappedType),
      year: session.year,
      sessionType: mappedType,
      date: formatSessionDate(session.date_start),
      headline: `${mappedType} del ${latestMeeting.meeting_name} en ${latestMeeting.location}.`,
      status: "Completed",
      isAvailable: true,
    };
  })
  .filter((session): session is CircuitRecentSession => session !== null);

  let sessionData;

  try {
    sessionData = await getCircuitSessionData(circuit.id, sessionId);
  } catch {
    notFound();
  }

  const selectedType = mapCircuitSessionToHomeType(parsedSession.sessionType);

  return (
    <AppShell activePath="/circuits">
      <div className="space-y-6">
        <Link
          href={`/circuits/${circuit.id}`}
          className="inline-flex text-sm text-zinc-400 transition hover:text-white"
        >
          ← Volver al circuito
        </Link>

        <CircuitSessionSelector
          circuitId={circuit.id}
          currentSessionId={sessionId}
          sessions={availableSessions}
        />

        <SessionSummary summary={sessionData.summary} />
        <QuickStats stats={sessionData.quickStats} />
        <ResultsTable
          results={sessionData.results}
          sessionType={selectedType}
        />
      </div>
    </AppShell>
  );
}