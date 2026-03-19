import type { HomeLatestResponse, SessionType } from "@/types/home";
import {
  getDrivers,
  getLatestCompletedMeeting,
  getLatestWeatherForSession,
  getMeetingByKey,
  getPitStops,
  getSessionForMeeting,
  getSessionResults,
  getSessionsByMeetingKey,
  getStartingGrid,
} from "@/lib/api/openf1";

function formatSessionDate(date: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function buildWeatherSummary(
  weather: Awaited<ReturnType<typeof getLatestWeatherForSession>>
) {
  if (!weather) {
    return "Sin datos de clima";
  }

  const rainText = weather.rainfall ? "Lluvia" : "Seco";

  return `${rainText}, aire ${Math.round(
    weather.air_temperature
  )}°C, pista ${Math.round(weather.track_temperature)}°C`;
}

function resolveGrandPrixName(
  meeting: Awaited<ReturnType<typeof getMeetingByKey>>
) {
  if (meeting?.meeting_name?.trim()) {
    return meeting.meeting_name;
  }

  if (meeting?.country_name?.trim()) {
    return `${meeting.country_name} Grand Prix`;
  }

  return "Grand Prix";
}

function formatGapOrStatus(result: {
  position: number | null;
  gap_to_leader: number | string | null;
  dnf: boolean;
  dns: boolean;
  dsq: boolean;
}) {
  if (result.dsq) return "DSQ";
  if (result.dns) return "DNS";
  if (result.dnf) return "DNF";

  if (result.position === 1) {
    return "Finished";
  }

  if (typeof result.gap_to_leader === "string" && result.gap_to_leader.trim()) {
    return result.gap_to_leader;
  }

  if (typeof result.gap_to_leader === "number") {
    return `+${result.gap_to_leader.toFixed(3)}s`;
  }

  return "-";
}

async function resolveStartingGridRows(
  type: SessionType,
  currentSessionKey: number,
  meetingKey: number
) {
  if (type === "fp1" || type === "fp2" || type === "fp3") {
    return [];
  }

  if (type === "qualifying") {
    return getStartingGrid(currentSessionKey);
  }

  const sessions = await getSessionsByMeetingKey(meetingKey);

  const qualifyingSource = sessions
    .filter((session) =>
      ["Qualifying", "Sprint Qualifying"].includes(session.session_name)
    )
    .sort(
      (a, b) =>
        new Date(b.date_start).getTime() - new Date(a.date_start).getTime()
    )[0];

  if (!qualifyingSource) {
    return [];
  }

  return getStartingGrid(qualifyingSource.session_key);
}

function getStartPosition(
  startingGridByDriverNumber: Map<number, { position: number }>,
  driverNumber: number
) {
  return startingGridByDriverNumber.get(driverNumber)?.position ?? null;
}

function getDeltaPositions(
  startPosition: number | null,
  finalPosition: number | null
) {
  if (startPosition == null || finalPosition == null) {
    return null;
  }

  return startPosition - finalPosition;
}

function getPrimaryStatLabel(type: SessionType) {
  if (type === "race") return "Ganador";
  if (type === "qualifying") return "Pole";
  return "Más rápido";
}

function countPitStopsByDriverNumber(
  pitRows: Awaited<ReturnType<typeof getPitStops>>
) {
  const counts = new Map<number, number>();

  for (const row of pitRows) {
    const currentCount = counts.get(row.driver_number) ?? 0;
    counts.set(row.driver_number, currentCount + 1);
  }

  return counts;
}

export async function getHomeLatestData(
  type: SessionType
): Promise<HomeLatestResponse> {
  const latestMeeting = await getLatestCompletedMeeting();
  const session = await getSessionForMeeting(latestMeeting.meeting_key, type);

  const [weather, meeting, sessionResults, drivers, startingGrid, pitRows] =
    await Promise.all([
      getLatestWeatherForSession(session.session_key),
      getMeetingByKey(session.meeting_key),
      getSessionResults(session.session_key),
      getDrivers(session.session_key),
      resolveStartingGridRows(type, session.session_key, session.meeting_key),
      getPitStops(session.session_key),
    ]);

  const driversByNumber = new Map(
    drivers.map((driver) => [driver.driver_number, driver])
  );

  const startingGridByDriverNumber = new Map(
    startingGrid.map((row) => [row.driver_number, row])
  );

  const pitStopsByDriverNumber = countPitStopsByDriverNumber(pitRows);

  const sortedResults = [...sessionResults].sort((a, b) => {
    const aPos = a.position ?? 999;
    const bPos = b.position ?? 999;
    return aPos - bPos;
  });

  const leader = sortedResults.find((result) => result.position === 1);
  const leaderDriver = leader
    ? driversByNumber.get(leader.driver_number)
    : null;

  return {
    summary: {
      grandPrixName: resolveGrandPrixName(meeting),
      circuitName: meeting?.circuit_short_name ?? session.circuit_short_name,
      location: meeting
        ? `${meeting.location}, ${meeting.country_name}`
        : `${session.location}, ${session.country_name}`,
      date: formatSessionDate(session.date_start),
      sessionType: session.session_name,
      weatherSummary: buildWeatherSummary(weather),
    },
    quickStats: [
      {
        label: getPrimaryStatLabel(type),
        value: leaderDriver?.full_name ?? "-",
      },
      { label: "Sesión", value: session.session_name },
      { label: "Temporada", value: String(session.year) },
      { label: "Fuente", value: "OpenF1" },
    ],
    results: sortedResults.map((result) => {
      const driver = driversByNumber.get(result.driver_number);
      const startPosition = getStartPosition(
        startingGridByDriverNumber,
        result.driver_number
      );
      const finalPosition = result.position;

      return {
        position: finalPosition ?? 0,
        driverName: driver?.full_name ?? `#${result.driver_number}`,
        teamName: driver?.team_name ?? "-",
        startPosition: startPosition ?? -1,
        deltaPositions: getDeltaPositions(startPosition, finalPosition) ?? -999,
        lapsCompleted: result.number_of_laps,
        pitStops: pitStopsByDriverNumber.get(result.driver_number) ?? 0,
        tyres: "-",
        topSpeed: "-",
        status: formatGapOrStatus(result),
      };
    }),
  };
}