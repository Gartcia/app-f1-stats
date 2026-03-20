import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { CircuitSessionSelector } from "@/components/circuits/circuit-session-selector";
import { QuickStats } from "@/components/home/quick-stats";
import { ResultsTable } from "@/components/home/results-table";
import { SessionSummary } from "@/components/home/session-summary";
import {
  getMeetingsByYear,
  getSessionsByMeetingKey,
  mapOpenF1SessionNameToCircuitSessionType,
} from "@/lib/api/openf1";
import { circuitVisuals } from "@/lib/data/circuit-visuals";
import { getCircuitSessionData } from "@/lib/mappers/circuit-session.mapper";
import type { CircuitWeekendSession } from "@/types/circuit";
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

function resolveMeetingsForCircuitId(
  meetings: OpenF1Meeting[],
  circuitId: string
) {
  const visual = circuitVisuals.find((item) => item.id === circuitId);

  if (!visual) {
    return [];
  }

  return meetings.filter((meeting) => {
    const values = [
      meeting.meeting_name,
      meeting.location,
      meeting.country_name,
      meeting.circuit_short_name,
    ];

    return values.some((value) => textMatchesAny(value, visual.aliases));
  });
}

function mapCircuitSessionToHomeType(
  sessionType:
    | "Race"
    | "Qualifying"
    | "Sprint"
    | "Sprint Shootout"
    | "FP1"
    | "FP2"
    | "FP3"
): SessionType {
  if (sessionType === "Qualifying" || sessionType === "Sprint Shootout") {
    return "qualifying";
  }
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

const SESSION_ORDER: Record<CircuitWeekendSession["sessionType"], number> = {
  Race: 0,
  Qualifying: 1,
  Sprint: 2,
  "Sprint Shootout": 3,
  FP3: 4,
  FP2: 5,
  FP1: 6,
};

export default async function SessionDetailPage({
  params,
}: SessionDetailPageProps) {
  const { id, sessionId } = await params;

  const visual = circuitVisuals.find((item) => item.id === id);

  if (!visual) {
    notFound();
  }

  const sessionKey = Number(sessionId);

  if (Number.isNaN(sessionKey)) {
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

  const circuitMeetings = resolveMeetingsForCircuitId(completedMeetings, id);

  if (circuitMeetings.length === 0) {
    notFound();
  }

  const meetingsToSearch = circuitMeetings.slice(0, 3);

  const sessionsByMeeting = await Promise.all(
    meetingsToSearch.map((meeting) => getSessionsByMeetingKey(meeting.meeting_key))
  );

  const allSessions = sessionsByMeeting.flat();

  const selectedOpenF1Session = allSessions.find(
    (session) => session.session_key === sessionKey
  );

  if (!selectedOpenF1Session) {
    notFound();
  }

  const selectedMeeting = meetingsToSearch.find(
    (meeting) => meeting.meeting_key === selectedOpenF1Session.meeting_key
  );

  if (!selectedMeeting) {
    notFound();
  }

  const sameMeetingSessions = await getSessionsByMeetingKey(
    selectedMeeting.meeting_key
  );

  const availableSessions = sameMeetingSessions
    .map((session): CircuitWeekendSession | null => {
      const mappedType = mapOpenF1SessionNameToCircuitSessionType(
        session.session_name
      );

      if (!mappedType) {
        return null;
      }

      return {
        id: String(session.session_key),
        sessionKey: session.session_key,
        meetingKey: session.meeting_key,
        year: session.year,
        sessionType: mappedType,
        sessionName: session.session_name,
        date: formatSessionDate(session.date_start),
        headline: `${session.session_name} del ${selectedMeeting.meeting_name} en ${selectedMeeting.location}.`,
        status: "Completed",
        isAvailable: true,
      };
    })
    .filter((session): session is CircuitWeekendSession => session !== null)
    .sort(
      (a, b) =>
        (SESSION_ORDER[a.sessionType] ?? 999) -
        (SESSION_ORDER[b.sessionType] ?? 999)
    );

  let sessionData;

  try {
    sessionData = await getCircuitSessionData(id, sessionId);
  } catch {
    notFound();
  }

  const selectedMappedType = mapOpenF1SessionNameToCircuitSessionType(
    selectedOpenF1Session.session_name
  );

  if (!selectedMappedType) {
    notFound();
  }

  const selectedType = mapCircuitSessionToHomeType(selectedMappedType);

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
          currentSessionId={String(sessionKey)}
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