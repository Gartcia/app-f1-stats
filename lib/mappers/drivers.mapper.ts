import {
  getDrivers,
  getLatestCompletedMeeting,
  getMeetingByKey,
  getMeetingsByYear,
  getSessionsByMeetingKey,
  getSessionResultsSafe,
  getSessionForMeeting,
} from "@/lib/api/openf1";
import { mapOpenF1SessionNameToCircuitSessionType } from "@/lib/api/openf1";
import { circuitVisuals } from "@/lib/data/circuit-visuals";
import type { CircuitSessionType } from "@/types/circuit";

export type DriverWeekendSession = {
  id: string;
  sessionKey: number;
  meetingKey: number;
  sessionName: string;
  sessionType: CircuitSessionType;
  date: string;
  position: number | null;
  lapsCompleted: number;
  gapToLeader: string;
  status: string;
  circuitId?: string;
};

export type DriverWeekend = {
  id: string;
  meetingKey: number;
  year: number;
  meetingName: string;
  location: string;
  country: string;
  circuitName: string;
  circuitId?: string;
  dateStart: string;
  sessions: DriverWeekendSession[];
};

export type DriverListItem = {
  driverNumber: number;
  fullName: string;
  acronym: string;
  teamName: string;
  teamColour?: string;
  headshotUrl?: string | null;
  meetingName: string;
  sessionName: string;
};

export type DriverDetail = {
  driverNumber: number;
  fullName: string;
  acronym: string;
  teamName: string;
  teamColour?: string;
  headshotUrl?: string | null;
  meetingName: string;
  location: string;
  country: string;
  sessionName: string;
  position: number | null;
  lapsCompleted: number;
  gapToLeader: string;
  status: string;
  circuitName: string;
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function includesAlias(value: string, aliases: string[]) {
  const normalizedValue = normalizeText(value);

  return aliases.some((alias) => {
    const normalizedAlias = normalizeText(alias);

    return (
      normalizedValue.includes(normalizedAlias) ||
      normalizedAlias.includes(normalizedValue)
    );
  });
}

function resolveCircuitIdFromSession(params: {
  countryName: string;
  location: string;
  circuitShortName?: string;
  meetingName?: string;
}) {
  const location = normalizeText(params.location);
  const circuitShortName = normalizeText(params.circuitShortName ?? "");
  const meetingName = normalizeText(params.meetingName ?? "");
  const countryName = normalizeText(params.countryName);

  const scored = circuitVisuals
    .map((visual) => {
      const aliases = (visual.aliases ?? []).map(normalizeText);

      let score = 0;

      if (location && includesAlias(location, aliases)) score += 5;
      if (circuitShortName && includesAlias(circuitShortName, aliases)) score += 4;
      if (meetingName && includesAlias(meetingName, aliases)) score += 3;
      if (countryName && includesAlias(countryName, aliases)) score += 1;

      return {
        id: visual.id,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  const best = scored[0];

  if (!best || best.score < 4) {
    return null;
  }

  return best.id;
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatGapToLeader(value: unknown) {
  if (value == null) return "-";

  if (typeof value === "number") {
    return `+${value.toFixed(3)}s`;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || "-";
  }

  return "-";
}

function formatRecentSessionGap(value: unknown) {
  if (value == null) return "-";

  if (typeof value === "number") {
    return `+${value.toFixed(3)}s`;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) return "-";
    if (/^\+?\d+(\.\d+)?s$/.test(trimmed)) return trimmed;
    if (/^\d+(\.\d+)?$/.test(trimmed)) {
      return `+${Number(trimmed).toFixed(3)}s`;
    }

    return "-";
  }

  return "-";
}

function formatStatus(params: {
  position: number | null;
  dnf: boolean;
  dns: boolean;
  dsq: boolean;
}) {
  if (params.dsq) return "DSQ";
  if (params.dns) return "DNS";
  if (params.dnf) return "DNF";
  return "Finished";
}

export async function getDriverRecentWeekends(
  driverNumber: number
): Promise<DriverWeekend[]> {
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
    )
    .slice(0, 3);

  const weekends: DriverWeekend[] = [];

  for (const meeting of completedMeetings) {
    const sessions = await getSessionsByMeetingKey(meeting.meeting_key);
    const collectedSessions: DriverWeekendSession[] = [];

    for (const session of sessions) {
      const mappedType = mapOpenF1SessionNameToCircuitSessionType(
        session.session_name
      );

      if (!mappedType) {
        continue;
      }

      let results;
      try {
        results = await getSessionResultsSafe(session.session_key);
      } catch (error) {
        console.warn(
          `No se pudo obtener session_result para session_key=${session.session_key}`,
          error
        );
        continue;
      }

      const result = results.find((item) => item.driver_number === driverNumber);

      if (!result) {
        continue;
      }

      const circuitId = resolveCircuitIdFromSession({
  countryName: meeting.country_name,
  location: meeting.location,
  circuitShortName: meeting.circuit_short_name,
  meetingName: meeting.meeting_name,
});

      collectedSessions.push({
        id: String(session.session_key),
        sessionKey: session.session_key,
        meetingKey: session.meeting_key,
        sessionName: session.session_name,
        sessionType: mappedType,
        date: formatShortDate(session.date_start),
        position: result.position ?? null,
        lapsCompleted: result.number_of_laps,
        gapToLeader: formatRecentSessionGap(result.gap_to_leader),
        status: formatStatus({
          position: result.position,
          dnf: result.dnf,
          dns: result.dns,
          dsq: result.dsq,
        }),
        circuitId: circuitId ?? undefined,
      });
    }

    const order: Record<CircuitSessionType, number> = {
      Race: 0,
      Qualifying: 1,
      Sprint: 2,
      "Sprint Shootout": 3,
      FP3: 4,
      FP2: 5,
      FP1: 6,
    };

    const validSessions = collectedSessions.sort(
      (a, b) => (order[a.sessionType] ?? 999) - (order[b.sessionType] ?? 999)
    );

    if (validSessions.length === 0) {
      continue;
    }

    const weekendCircuitId =
      validSessions.find((session) => session.circuitId)?.circuitId;

    weekends.push({
      id: String(meeting.meeting_key),
      meetingKey: meeting.meeting_key,
      year: meeting.year,
      meetingName: meeting.meeting_name,
      location: meeting.location,
      country: meeting.country_name,
      circuitName: meeting.circuit_short_name,
      circuitId: weekendCircuitId,
      dateStart: meeting.date_start,
      sessions: validSessions,
    });
  }

  return weekends;
}

export async function getDriversListData(): Promise<DriverListItem[]> {
  const latestMeeting = await getLatestCompletedMeeting();
  const preferredSession = await getSessionForMeeting(
    latestMeeting.meeting_key,
    "race"
  );

  const drivers = await getDrivers(preferredSession.session_key);

  return drivers
    .map((driver) => ({
      driverNumber: driver.driver_number,
      fullName: driver.full_name,
      acronym: driver.name_acronym,
      teamName: driver.team_name,
      teamColour: driver.team_colour,
      headshotUrl: driver.headshot_url,
      meetingName: latestMeeting.meeting_name,
      sessionName: preferredSession.session_name,
    }))
    .sort((a, b) => a.driverNumber - b.driverNumber);
}

export async function getDriverDetailData(
  driverNumber: number
): Promise<DriverDetail | null> {
  const latestMeeting = await getLatestCompletedMeeting();
  const preferredSession = await getSessionForMeeting(
    latestMeeting.meeting_key,
    "race"
  );

  const [drivers, results, meeting] = await Promise.all([
    getDrivers(preferredSession.session_key),
    getSessionResultsSafe(preferredSession.session_key),
    getMeetingByKey(latestMeeting.meeting_key),
  ]);

  const driver = drivers.find((item) => item.driver_number === driverNumber);
  const result = results.find((item) => item.driver_number === driverNumber);

  if (!driver) {
    return null;
  }

  return {
    driverNumber: driver.driver_number,
    fullName: driver.full_name,
    acronym: driver.name_acronym,
    circuitName:
      meeting?.circuit_short_name ?? preferredSession.circuit_short_name,
    teamName: driver.team_name,
    teamColour: driver.team_colour,
    headshotUrl: driver.headshot_url,
    meetingName: meeting?.meeting_name ?? latestMeeting.meeting_name,
    location: meeting?.location ?? latestMeeting.location,
    country: meeting?.country_name ?? latestMeeting.country_name,
    sessionName: preferredSession.session_name,
    position: result?.position ?? null,
    lapsCompleted: result?.number_of_laps ?? 0,
    gapToLeader: result ? formatGapToLeader(result.gap_to_leader) : "-",
    status: result
      ? formatStatus({
          position: result.position,
          dnf: result.dnf,
          dns: result.dns,
          dsq: result.dsq,
        })
      : "Sin resultado",
  };
}