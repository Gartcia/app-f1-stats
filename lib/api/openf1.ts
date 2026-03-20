import { CircuitSessionType } from "@/types/circuit";
import { cache } from "react";

const OPENF1_BASE_URL = "https://api.openf1.org/v1";


export type OpenF1Session = {
  session_key: number;
  meeting_key: number;
  session_type: string;
  session_name: string;
  meeting_name?: string;
  circuit_short_name: string;
  country_name: string;
  location: string;
  date_start: string;
  date_end: string;
  gmt_offset?: string;
  year: number;
};

export type OpenF1Meeting = {
  meeting_key: number;
  meeting_name: string;
  meeting_official_name?: string;
  location: string;
  country_name: string;
  circuit_short_name: string;
  date_start: string;
  date_end: string;
  year: number;
};

type OpenF1Weather = {
  air_temperature: number;
  track_temperature: number;
  humidity: number;
  rainfall: number;
  wind_speed: number;
  date: string;
};

type OpenF1SessionResult = {
  position: number | null;
  driver_number: number;
  number_of_laps: number;
  dnf: boolean;
  dns: boolean;
  dsq: boolean;
  gap_to_leader: number | string | null;
  meeting_key: number;
  session_key: number;
  duration: number | number[] | null;
};

export type OpenF1Driver = {
  meeting_key: number;
  session_key: number;
  driver_number: number;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour?: string;
  headshot_url?: string | null;
};

type OpenF1StartingGrid = {
  driver_number: number;
  lap_duration: number;
  meeting_key: number;
  position: number;
  session_key: number;
};

type OpenF1Pit = {
  date: string;
  driver_number: number;
  lane_duration: number;
  lap_number: number;
  meeting_key: number;
  pit_duration?: number;
  session_key: number;
  stop_duration?: number | null;
};

type OpenF1Stint = {
  meeting_key: number;
  session_key: number;
  driver_number: number;
  stint_number: number;
  lap_start: number | null;
  lap_end: number | null;
  compound: string | null;
  tyre_age_at_start?: number | null;
};

export class SessionNotAvailableError extends Error {
  constructor(type: string, meetingName?: string) {
    super(
      meetingName
        ? `No hay sesión disponible para type=${type} en ${meetingName}`
        : `No hay sesión disponible para type=${type}`
    );
    this.name = "SessionNotAvailableError";
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchOpenF1<T>(path: string): Promise<T> {
  const url = `${OPENF1_BASE_URL}${path}`;
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        next: { revalidate: 3600 },
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return response.json();
      }

      if (response.status === 429 || response.status >= 500) {
        lastError = new Error(`OpenF1 error: ${response.status}`);

        if (attempt < 2) {
          await sleep(500 * (attempt + 1));
          continue;
        }
      }

      throw new Error(`OpenF1 error: ${response.status}`);
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;

      if (attempt < 2) {
        await sleep(500 * (attempt + 1));
        continue;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("OpenF1 request failed");
}

function getSessionNamesByType(
  type: "race" | "qualifying" | "fp1" | "fp2" | "fp3"
) {
  if (type === "race") {
    return ["Race"];
  }

  if (type === "qualifying") {
    return ["Qualifying", "Sprint Qualifying"];
  }

  if (type === "fp1") {
    return ["Practice 1"];
  }

  if (type === "fp2") {
    return ["Practice 2"];
  }

  return ["Practice 3"];
}

export async function getLatestCompletedMeeting(): Promise<OpenF1Meeting> {
  const currentYear = new Date().getUTCFullYear();

  const meetings = await fetchOpenF1<OpenF1Meeting[]>(
    `/meetings?year=${currentYear}`
  );

  const completedMeetings = meetings
    .filter((meeting) => new Date(meeting.date_end).getTime() <= Date.now())
    .sort(
      (a, b) =>
        new Date(b.date_end).getTime() - new Date(a.date_end).getTime()
    );

  if (completedMeetings.length > 0) {
    return completedMeetings[0];
  }

  const previousYearMeetings = await fetchOpenF1<OpenF1Meeting[]>(
    `/meetings?year=${currentYear - 1}`
  );

  const completedPreviousYearMeetings = previousYearMeetings
    .filter((meeting) => new Date(meeting.date_end).getTime() <= Date.now())
    .sort(
      (a, b) =>
        new Date(b.date_end).getTime() - new Date(a.date_end).getTime()
    );

  if (completedPreviousYearMeetings.length === 0) {
    throw new Error("No se encontró un meeting finalizado");
  }

  return completedPreviousYearMeetings[0];
}

export const getMeetingsByYear = cache(async function getMeetingsByYear(
  year: number
) {
  return fetchOpenF1<OpenF1Meeting[]>(`/meetings?year=${year}`);
});

export const getMeetingByKey = cache(async function getMeetingByKey(
  meetingKey: number
) {
  const meetings = await fetchOpenF1<OpenF1Meeting[]>(
    `/meetings?meeting_key=${meetingKey}`
  );

  return meetings[0] ?? null;
});

export const getSessionsByMeetingKey = cache(async function getSessionsByMeetingKey(
  meetingKey: number
) {
  return fetchOpenF1<OpenF1Session[]>(`/sessions?meeting_key=${meetingKey}`);
});

export async function getSessionForMeeting(
  meetingKey: number,
  type: "race" | "qualifying" | "fp1" | "fp2" | "fp3"
): Promise<OpenF1Session> {
  const sessions = await getSessionsByMeetingKey(meetingKey);
  const allowedNames = getSessionNamesByType(type);

  const matchingSessions = sessions
    .filter((session) => allowedNames.includes(session.session_name))
    .sort(
      (a, b) =>
        new Date(b.date_start).getTime() - new Date(a.date_start).getTime()
    );

  const selected = matchingSessions[0];

  if (!selected) {
    const meeting = await getMeetingByKey(meetingKey);
    throw new SessionNotAvailableError(type, meeting?.meeting_name);
  }

  return selected;
}

export async function getLatestWeatherForSession(sessionKey: number) {
  const weather = await fetchOpenF1<OpenF1Weather[]>(
    `/weather?session_key=${sessionKey}`
  );

  if (weather.length === 0) {
    return null;
  }

  return weather.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
}

export async function getSessionResults(sessionKey: number) {
  return fetchOpenF1<OpenF1SessionResult[]>(
    `/session_result?session_key=${sessionKey}`
  );
}
export async function getSessionResultsSafe(sessionKey: number) {
  try {
    return await getSessionResults(sessionKey);
  } catch (error) {
    console.warn(
      `No se pudo obtener session_result para session_key=${sessionKey}`,
      error
    );
    return [];
  }
}

export async function getDrivers(sessionKey: number) {
  return fetchOpenF1<OpenF1Driver[]>(`/drivers?session_key=${sessionKey}`);
}

export async function getStartingGrid(sessionKey: number) {
  try {
    return await fetchOpenF1<OpenF1StartingGrid[]>(
      `/starting_grid?session_key=${sessionKey}`
    );
  } catch (error) {
    console.warn(
      `No se pudo obtener starting_grid para session_key=${sessionKey}`,
      error
    );

    return [];
  }
}

export async function getPitStops(sessionKey: number) {
  try {
    return await fetchOpenF1<OpenF1Pit[]>(`/pit?session_key=${sessionKey}`);
  } catch (error) {
    console.warn(`No se pudo obtener pit para session_key=${sessionKey}`, error);
    return [];
  }
}

export async function getStints(sessionKey: number) {
  try {
    return await fetchOpenF1<OpenF1Stint[]>(`/stints?session_key=${sessionKey}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    if (message.includes("429")) {
      console.warn(
        `OpenF1 rate limit en stints para session_key=${sessionKey}. Se usa fallback vacío.`
      );
      return [];
    }

    console.warn(
      `No se pudo obtener stints para session_key=${sessionKey}`,
      error
    );

    return [];
  }
}

type CircuitLookupInput = {
  id: string;
  country: string;
  location: string;
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function matchesCircuitMeeting(
  meeting: OpenF1Meeting,
  circuit: CircuitLookupInput
) {
  const meetingCountry = normalizeText(meeting.country_name);
  const meetingLocation = normalizeText(meeting.location);

  const circuitCountry = normalizeText(circuit.country);
  const circuitLocation = normalizeText(circuit.location);

  if (meetingCountry !== circuitCountry) {
    return false;
  }

  const meetingAliases = getLocationAliases(meetingLocation);
  const circuitAliases = getLocationAliases(circuitLocation);

  return meetingAliases.some((meetingAlias) =>
    circuitAliases.some(
      (circuitAlias) =>
        meetingAlias.includes(circuitAlias) ||
        circuitAlias.includes(meetingAlias)
    )
  );
}

function getLocationAliases(value: string) {
  const normalized = normalizeText(value);

  const aliases: Record<string, string[]> = {
    shanghai: ["shanghai", "jiading"],
    jiading: ["jiading", "shanghai"],
    "sao paulo": ["sao paulo", "interlagos"],
    interlagos: ["interlagos", "sao paulo"],
    spielberg: ["spielberg", "red bull ring"],
    "red bull ring": ["red bull ring", "spielberg"],
    imola: ["imola", "emilia-romagna"],
    "emilia-romagna": ["emilia-romagna", "imola"],
    sakhir: ["sakhir", "bahrain"],
    bahrain: ["bahrain", "sakhir"],
    montmelo: ["montmelo", "barcelona"],
    barcelona: ["barcelona", "montmelo"],
  };

  return aliases[normalized] ?? [normalized];
}

export async function getLatestCompletedMeetingForCircuit(
  circuit: CircuitLookupInput
) {
  const currentYear = new Date().getUTCFullYear();

  const [currentYearMeetings, previousYearMeetings] = await Promise.all([
    fetchOpenF1<OpenF1Meeting[]>(`/meetings?year=${currentYear}`),
    fetchOpenF1<OpenF1Meeting[]>(`/meetings?year=${currentYear - 1}`),
  ]);

  const allMeetings = [...currentYearMeetings, ...previousYearMeetings];

  const matchingMeetings = allMeetings
    .filter((meeting) => new Date(meeting.date_end).getTime() <= Date.now())
    .filter((meeting) => matchesCircuitMeeting(meeting, circuit))
    .sort(
      (a, b) =>
        new Date(b.date_end).getTime() - new Date(a.date_end).getTime()
    );

  return matchingMeetings[0] ?? null;
}

export function mapOpenF1SessionNameToCircuitSessionType(
  sessionName: string
): CircuitSessionType | null {
  const normalized = sessionName.trim().toLowerCase();

  if (normalized === "race") return "Race";
  if (normalized === "qualifying") return "Qualifying";
  if (normalized === "sprint") return "Sprint";
  if (normalized === "sprint shootout") return "Sprint Shootout";
  if (normalized === "sprint qualifying") return "Sprint Shootout";
  if (normalized === "practice 1" || normalized === "fp1") return "FP1";
  if (normalized === "practice 2" || normalized === "fp2") return "FP2";
  if (normalized === "practice 3" || normalized === "fp3") return "FP3";

  return null;
}

export function pickPreferredSession(sessions: OpenF1Session[]) {
  const SESSION_PRIORITY = [
    "Race",
    "Sprint",
    "Qualifying",
    "Sprint Qualifying",
    "Practice 3",
    "Practice 2",
    "Practice 1",
  ];

  for (const sessionName of SESSION_PRIORITY) {
    const match = sessions.find((session) => session.session_name === sessionName);
    if (match) return match;
  }

  return null;
}