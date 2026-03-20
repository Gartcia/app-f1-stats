import { getDrivers, getMeetingsByYear, getSessionsByMeetingKey } from "@/lib/api/openf1";
import { circuitVisuals } from "@/lib/data/circuit-visuals";
import { mapOpenF1SessionNameToCircuitSessionType, pickPreferredSession } from "@/lib/api/openf1";
import type { CircuitWeekend, CircuitWeekendSession } from "@/types/circuit";

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

function resolveMeetingsForCircuitId(
  meetings: OpenF1Meeting[],
  circuitId: string
) {
  const visual = resolveVisualById(circuitId);

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
  recentWeekends: CircuitWeekend[];
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

  const matchingMeetings = resolveMeetingsForCircuitId(
    completedMeetings,
    circuitId
  );

  const visual = resolveVisualById(circuitId);

  if (matchingMeetings.length === 0) {
    return null;
  }

  const recentMeetings = matchingMeetings.slice(0, 3);

  const weekendsWithSessions = await Promise.all(
    recentMeetings.map(async (meeting) => {
      const sessions = await getSessionsByMeetingKey(meeting.meeting_key);

      const mappedSessions: CircuitWeekendSession[] = sessions
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
            headline: `${session.session_name} del ${meeting.meeting_name} en ${meeting.location}.`,
            status: "Completed",
            isAvailable: true,
          };
        })
        .filter(
          (session): session is CircuitWeekendSession => session !== null
        )
        .sort((a, b) => {
          const order: Record<CircuitWeekendSession["sessionType"], number> = {
            Race: 0,
            Qualifying: 1,
            Sprint: 2,
            "Sprint Shootout": 3,
            FP3: 4,
            FP2: 5,
            FP1: 6,
          };

          return order[a.sessionType] - order[b.sessionType];
        });

      return {
        id: String(meeting.meeting_key),
        meetingKey: meeting.meeting_key,
        year: meeting.year,
        meetingName: meeting.meeting_name,
        officialName: meeting.meeting_official_name,
        location: meeting.location,
        country: meeting.country_name,
        circuitShortName: meeting.circuit_short_name,
        dateStart: meeting.date_start,
        dateEnd: meeting.date_end,
        sessions: mappedSessions,
      } satisfies CircuitWeekend;
    })
  );

  const preferredSession = weekendsWithSessions
    .flatMap((weekend) => weekend.sessions)
    .sort((a, b) => {
      const order: Record<CircuitWeekendSession["sessionType"], number> = {
        Race: 0,
        Qualifying: 1,
        Sprint: 2,
        "Sprint Shootout": 3,
        FP3: 4,
        FP2: 5,
        FP1: 6,
      };

      return order[a.sessionType] - order[b.sessionType];
    })[0];

  let drivers: CircuitDetailData["drivers"] = [];

  if (preferredSession) {
    const rawDrivers = await getDrivers(preferredSession.sessionKey);

    drivers = rawDrivers
      .map((driver) => ({
        id: `${preferredSession.sessionKey}-${driver.driver_number}`,
        fullName: driver.full_name,
        acronym: driver.name_acronym,
        number: driver.driver_number,
        teamName: driver.team_name,
        teamColour: driver.team_colour,
        headshotUrl: driver.headshot_url,
      }))
      .sort((a, b) => a.number - b.number);
  }

  const latestMeeting = recentMeetings[0];

  return {
    id: circuitId,
    name: visual?.name ?? latestMeeting.circuit_short_name,
    country: latestMeeting.country_name,
    location: latestMeeting.location,
    type: visual?.type,
    layoutLabel: visual?.layoutLabel,
    layoutImage: visual?.layoutImage,
    recentWeekends: weekendsWithSessions,
    drivers,
  };
}