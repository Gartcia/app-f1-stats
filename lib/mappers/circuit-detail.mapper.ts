import { getDrivers, getMeetingsByYear, getSessionsByMeetingKey } from "@/lib/api/openf1";
import { buildCircuitSessionMockId, mapOpenF1SessionNameToCircuitSessionType, pickPreferredSession } from "@/lib/api/openf1";
import { circuitVisuals } from "@/lib/data/circuit-visuals";
import type { CircuitRecentSession } from "@/types/circuit";

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

function resolveVisualById(circuitId: string) {
  return circuitVisuals.find((item) => item.id === circuitId) ?? null;
}

function resolveMeetingForCircuitId(
  meetings: OpenF1Meeting[],
  circuitId: string
) {
  const visual = resolveVisualById(circuitId);

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

function formatSessionDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export type CircuitDetailData = {
  id: string;
  name: string;
  country: string;
  location: string;
  type?: "Permanente" | "Callejero";
  layoutLabel?: string;
  layoutImage?: string;
  lengthKm?: string;
  laps?: number;
  firstGp?: number;
  lapRecord?: string;
  recentSessions: CircuitRecentSession[];
  drivers: {
    id: string;
    fullName: string;
    acronym: string;
    number: number;
    teamName: string;
    teamColour?: string;
    headshotUrl?: string | null;
  }[];
};

export async function getCircuitDetailData(
  circuitId: string
): Promise<CircuitDetailData | null> {
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

  const meeting = resolveMeetingForCircuitId(completedMeetings, circuitId);
  const visual = resolveVisualById(circuitId);

  if (!meeting) {
    return null;
  }

  const sessions = await getSessionsByMeetingKey(meeting.meeting_key);

  const recentSessions: CircuitRecentSession[] = sessions
    .map((session): CircuitRecentSession | null => {
      const mappedType = mapOpenF1SessionNameToCircuitSessionType(
        session.session_name
      );

      if (!mappedType) {
        return null;
      }

      return {
        id: buildCircuitSessionMockId(circuitId, session.year, mappedType),
        year: session.year,
        sessionType: mappedType,
        date: formatSessionDate(session.date_start),
        headline: `${mappedType} del ${meeting.meeting_name} en ${meeting.location}.`,
        status: "Completed",
        isAvailable: true,
      };
    })
    .filter((session): session is CircuitRecentSession => session !== null)
    .sort((a, b) => {
      const order: Record<CircuitRecentSession["sessionType"], number> = {
        Race: 0,
        Qualifying: 1,
        Sprint: 2,
        FP3: 3,
        FP2: 4,
        FP1: 5,
      };

      return order[a.sessionType] - order[b.sessionType];
    });

  const preferredSession = pickPreferredSession(sessions);

  let drivers: CircuitDetailData["drivers"] = [];

  if (preferredSession) {
    const rawDrivers = await getDrivers(preferredSession.session_key);

    drivers = rawDrivers
      .map((driver) => ({
        id: `${preferredSession.session_key}-${driver.driver_number}`,
        fullName: driver.full_name,
        acronym: driver.name_acronym,
        number: driver.driver_number,
        teamName: driver.team_name,
        teamColour: driver.team_colour,
        headshotUrl: driver.headshot_url,
      }))
      .sort((a, b) => a.number - b.number);
  }

  return {
    id: circuitId,
    name: visual?.name ?? meeting.circuit_short_name,
    country: meeting.country_name,
    location: meeting.location,
    type: visual?.type,
    layoutLabel: visual?.layoutLabel,
    layoutImage: visual?.layoutImage,
    recentSessions,
    drivers,
  };
}