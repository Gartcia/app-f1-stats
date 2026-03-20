import {
  getDrivers,
  getLatestCompletedMeeting,
  getMeetingByKey,
  getMeetingsByYear,
  getSessionsByMeetingKey,
  getSessionResults,
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

function getAliases(value: string) {
  const normalized = normalizeText(value);

  const aliases: Record<string, string[]> = {
    "albert park": ["albert park", "melbourne"],
    melbourne: ["melbourne", "albert park"],
    shanghai: ["shanghai", "jiading", "shanghai international circuit"],
    jiading: ["jiading", "shanghai", "shanghai international circuit"],
    suzuka: ["suzuka"],
    sakhir: ["sakhir", "bahrain"],
    bahrain: ["bahrain", "sakhir"],
    jeddah: ["jeddah", "jeddah corniche"],
    miami: ["miami", "miami gardens"],
    imola: ["imola", "emilia-romagna", "autodromo enzo e dino ferrari"],
    "emilia-romagna": ["emilia-romagna", "imola"],
    monaco: ["monaco", "monte carlo"],
    montmelo: ["montmelo", "barcelona", "catalunya"],
    barcelona: ["barcelona", "montmelo", "catalunya"],
    catalunya: ["catalunya", "barcelona", "montmelo"],
    montreal: ["montreal", "gilles villeneuve"],
    spielberg: ["spielberg", "red bull ring"],
    "red bull ring": ["red bull ring", "spielberg"],
    silverstone: ["silverstone"],
    spa: ["spa", "spa-francorchamps"],
    "spa-francorchamps": ["spa-francorchamps", "spa"],
    budapest: ["budapest", "hungaroring"],
    hungaroring: ["hungaroring", "budapest"],
    zandvoort: ["zandvoort"],
    monza: ["monza"],
    baku: ["baku"],
    "marina bay": ["marina bay", "singapore"],
    singapore: ["singapore", "marina bay"],
    austin: ["austin", "cota", "circuit of the americas"],
    cota: ["cota", "austin", "circuit of the americas"],
    "mexico city": ["mexico city", "mexico", "autodromo hermanos rodriguez"],
    mexico: ["mexico", "mexico city", "autodromo hermanos rodriguez"],
    "sao paulo": ["sao paulo", "interlagos"],
    interlagos: ["interlagos", "sao paulo"],
    "las vegas": ["las vegas"],
    losail: ["losail", "qatar"],
    qatar: ["qatar", "losail"],
    "yas marina": ["yas marina", "abu dhabi"],
    "abu dhabi": ["abu dhabi", "yas marina"],
  };

  return aliases[normalized] ?? [normalized];
}

function hasAliasMatch(a: string, b: string) {
  const aliasesA = getAliases(a);
  const aliasesB = getAliases(b);

  return aliasesA.some((valueA) =>
    aliasesB.some(
      (valueB) => valueA.includes(valueB) || valueB.includes(valueA)
    )
  );
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

function resolveCircuitIdFromSession(params: {
  countryName: string;
  location: string;
  circuitShortName?: string;
  meetingName?: string;
}) {
  const values = [
    params.countryName,
    params.location,
    params.circuitShortName ?? "",
    params.meetingName ?? "",
  ];

  const match = circuitVisuals.find((visual) =>
    values.some((value) => textMatchesAny(value, visual.aliases))
  );

  return match?.id ?? null;
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
    .slice(0, 5);

  const weekendPayloads: Array<DriverWeekend | null> = await Promise.all(
  completedMeetings.map(async (meeting): Promise<DriverWeekend | null> => {
    const sessions = await getSessionsByMeetingKey(meeting.meeting_key);

    const sessionPayloads = await Promise.all(
      sessions.map(async (session): Promise<DriverWeekendSession | null> => {
        const mappedType = mapOpenF1SessionNameToCircuitSessionType(
          session.session_name
        );

        if (!mappedType) {
          return null;
        }

        const results = await getSessionResults(session.session_key);
        const result = results.find((item) => item.driver_number === driverNumber);

        if (!result) {
          return null;
        }

const circuitId = resolveCircuitIdFromSession({
  countryName: session.country_name,
  location: session.location,
  circuitShortName: session.circuit_short_name,
  meetingName: session.meeting_name,
});

        return {
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
        };
      })
    );

    const validSessions = sessionPayloads
      .filter((session): session is DriverWeekendSession => session !== null)
      .sort((a, b) => {
        const order: Record<CircuitSessionType, number> = {
          Race: 0,
          Qualifying: 1,
          Sprint: 2,
          "Sprint Shootout": 3,
          FP3: 4,
          FP2: 5,
          FP1: 6,
        };

        return (order[a.sessionType] ?? 999) - (order[b.sessionType] ?? 999);
      });

    if (validSessions.length === 0) {
      return null;
    }

    return {
      id: String(meeting.meeting_key),
      meetingKey: meeting.meeting_key,
      year: meeting.year,
      meetingName: meeting.meeting_name,
      location: meeting.location,
      country: meeting.country_name,
      circuitName: meeting.circuit_short_name,
      circuitId: validSessions[0]?.circuitId,
      dateStart: meeting.date_start,
      sessions: validSessions,
    };
  })
);

return weekendPayloads.filter(
  (weekend): weekend is DriverWeekend => weekend !== null
);
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
    getSessionResults(preferredSession.session_key),
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