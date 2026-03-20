import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { CircuitSessionSelector } from "@/components/circuits/circuit-session-selector";
import { QuickStats } from "@/components/home/quick-stats";
import { ResultsTable } from "@/components/home/results-table";
import { SessionSummary } from "@/components/home/session-summary";
import {
  buildCircuitSessionMockId,
  getMeetingsByYear,
  getSessionsByMeetingKey,
  mapOpenF1SessionNameToCircuitSessionType,
  parseCircuitSessionMockId,
} from "@/lib/api/openf1";
import { circuitVisuals } from "@/lib/data/circuit-visuals";
import { getCircuitSessionData } from "@/lib/mappers/circuit-session.mapper";
import type { CircuitRecentSession } from "@/types/circuit";
import type { SessionType } from "@/types/home";

type SessionDetailPageProps = {
  params: Promise<{
    id: string;
    sessionId: string;
  }>;
};

type OpenF1Meeting = Awaited<ReturnType<typeof getMeetingsByYear>>[number];

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function textMatchesAny(value: string, candidates?: string[]) {
  if (!candidates || candidates.length === 0) {
    return false;
  }

  const normalizedValue = normalizeText(value);

  return candidates.some((candidate) => {
    const normalizedCandidate = normalizeText(candidate);

    return (
      normalizedValue.includes(normalizedCandidate) ||
      normalizedCandidate.includes(normalizedValue)
    );
  });
}

function resolveMeetingForCircuitId(
  meetings: OpenF1Meeting[],
  circuitId: string
) {
  const visual = circuitVisuals.find((item) => item.id === circuitId);

  if (!visual) {
    return null;
  }

  return (
    meetings.find((meeting) => {
      const values = [
        meeting.meeting_name,
        meeting.location,
        meeting.country_name,
        meeting.circuit_short_name,
      ];

      return values.some((value) => textMatchesAny(value, visual.aliases));
    }) ?? null
  );
}

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

  const visual = circuitVisuals.find((item) => item.id === id);

  if (!visual) {
    notFound();
  }

  const parsedSession = parseCircuitSessionMockId(sessionId);

  if (!parsedSession || parsedSession.circuitId !== id) {
    notFound();
  }

  const currentYear = new Date().getUTCFullYear();

  const [currentMeetings, previousMeetings] = await Promise.all([
    getMeetingsByYear(currentYear),
    getMeetingsByYear(currentYear - 1),
  ]);

  const completedMeetings = [...currentMeetings, ...previousMeetings]
    .filter((meeting) => new Date(meeting.date_end).getTime() <= Date.now())
    .sort(
      (a, b) =>
        new Date(b.date_end).getTime() - new Date(a.date_end).getTime()
    );

  const latestMeeting = resolveMeetingForCircuitId(completedMeetings, id);

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
        id: buildCircuitSessionMockId(id, session.year, mappedType),
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
    sessionData = await getCircuitSessionData(id, sessionId);
  } catch {
    notFound();
  }

  const selectedType = mapCircuitSessionToHomeType(parsedSession.sessionType);

  return (
    <AppShell activePath="/circuits">
      <div className="space-y-6">
        <Link
          href={`/circuits/${id}`}
          className="inline-flex text-sm text-zinc-400 transition hover:text-white"
        >
          ← Volver al circuito
        </Link>

        <CircuitSessionSelector
          circuitId={id}
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