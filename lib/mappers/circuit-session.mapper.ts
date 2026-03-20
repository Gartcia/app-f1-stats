import type { HomeLatestResponse, SessionType } from "@/types/home";
import {
  getDrivers,
  getLatestWeatherForSession,
  getMeetingByKey,
  getMeetingsByYear,
  getPitStops,
  getSessionResults,
  getSessionsByMeetingKey,
  getStartingGrid,
  getStints,
  mapOpenF1SessionNameToCircuitSessionType,
} from "@/lib/api/openf1";
import { circuitVisuals } from "@/lib/data/circuit-visuals";

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

function mapCircuitSessionTypeToHomeType(
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

function normalizeCompound(compound: string | null) {
  if (!compound) {
    return null;
  }

  const value = compound.toUpperCase();

  if (value.includes("SOFT")) return "S";
  if (value.includes("MEDIUM")) return "M";
  if (value.includes("HARD")) return "H";
  if (value.includes("INTER")) return "I";
  if (value.includes("WET")) return "W";

  return value;
}

function buildTyresByDriverNumber(
  stintRows: Awaited<ReturnType<typeof getStints>>
) {
  const map = new Map<number, string>();
  const stintsByDriver = new Map<number, typeof stintRows>();

  for (const row of stintRows) {
    const current = stintsByDriver.get(row.driver_number) ?? [];
    current.push(row);
    stintsByDriver.set(row.driver_number, current);
  }

  for (const [driverNumber, rows] of stintsByDriver.entries()) {
    const ordered = [...rows].sort((a, b) => a.stint_number - b.stint_number);

    const compounds = ordered
      .map((row) => normalizeCompound(row.compound))
      .filter((value): value is string => Boolean(value));

    const uniqueSequence = compounds.filter((compound, index) => {
      return index === 0 || compounds[index - 1] !== compound;
    });

    map.set(
      driverNumber,
      uniqueSequence.length > 0 ? uniqueSequence.join("-") : "-"
    );
  }

  return map;
}

function getDriverName(
  driversByNumber: Map<number, { full_name: string }>,
  driverNumber: number | undefined
) {
  if (driverNumber == null) {
    return "-";
  }

  return driversByNumber.get(driverNumber)?.full_name ?? `#${driverNumber}`;
}

function getFirstCompoundFromSequence(sequence: string | undefined) {
  if (!sequence || sequence === "-") {
    return "-";
  }

  return sequence.split("-")[0] ?? "-";
}

function buildQuickStats(params: {
  type: SessionType;
  sortedResults: Array<{
    position: number | null;
    driver_number: number;
  }>;
  driversByNumber: Map<number, { full_name: string }>;
  tyresByDriverNumber: Map<number, string>;
  startingGridByDriverNumber: Map<number, { position: number }>;
}) {
  const {
    type,
    sortedResults,
    driversByNumber,
    tyresByDriverNumber,
    startingGridByDriverNumber,
  } = params;

  const p1 = sortedResults.find((result) => result.position === 1);
  const p2 = sortedResults.find((result) => result.position === 2);
  const p3 = sortedResults.find((result) => result.position === 3);

  if (type === "race") {
    let bestGainDriverName = "-";
    let bestGainValue = 0;

    for (const result of sortedResults) {
      const startPosition =
        startingGridByDriverNumber.get(result.driver_number)?.position ?? null;

      if (startPosition == null || result.position == null) {
        continue;
      }

      const delta = startPosition - result.position;

      if (delta > bestGainValue) {
        bestGainValue = delta;
        bestGainDriverName = getDriverName(driversByNumber, result.driver_number);
      }
    }

    return [
      {
        label: "Ganador",
        value: getDriverName(driversByNumber, p1?.driver_number),
      },
      {
        label: "Pole",
        value: getDriverName(
          driversByNumber,
          Array.from(startingGridByDriverNumber.entries()).find(
            ([, row]) => row.position === 1
          )?.[0]
        ),
      },
      {
        label: "Mayor avance",
        value:
          bestGainValue > 0 ? `${bestGainDriverName} (+${bestGainValue})` : "-",
      },
      {
        label: "Neumático ganador",
        value: getFirstCompoundFromSequence(
          tyresByDriverNumber.get(p1?.driver_number ?? -1)
        ),
      },
    ];
  }

  if (type === "qualifying") {
    return [
      {
        label: "Pole",
        value: getDriverName(driversByNumber, p1?.driver_number),
      },
      {
        label: "P2",
        value: getDriverName(driversByNumber, p2?.driver_number),
      },
      {
        label: "P3",
        value: getDriverName(driversByNumber, p3?.driver_number),
      },
      {
        label: "Compuesto pole",
        value: getFirstCompoundFromSequence(
          tyresByDriverNumber.get(p1?.driver_number ?? -1)
        ),
      },
    ];
  }

  return [
    {
      label: "Más rápido",
      value: getDriverName(driversByNumber, p1?.driver_number),
    },
    {
      label: "P2",
      value: getDriverName(driversByNumber, p2?.driver_number),
    },
    {
      label: "P3",
      value: getDriverName(driversByNumber, p3?.driver_number),
    },
    {
      label: "Compuesto más rápido",
      value: getFirstCompoundFromSequence(
        tyresByDriverNumber.get(p1?.driver_number ?? -1)
      ),
    },
  ];
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

export async function getCircuitSessionData(
  circuitId: string,
  sessionId: string
): Promise<HomeLatestResponse> {
  const sessionKey = Number(sessionId);

  if (Number.isNaN(sessionKey)) {
    throw new Error("sessionId inválido");
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

  const circuitMeeting = resolveMeetingForCircuitId(completedMeetings, circuitId);

  if (!circuitMeeting) {
    throw new Error("No se encontró un meeting para el circuito");
  }

  const candidateMeetings = resolveMeetingsForCircuitId(
    completedMeetings,
    circuitId
  );

  const allSessions = (
    await Promise.all(
      candidateMeetings.slice(0, 5).map((meeting) =>
        getSessionsByMeetingKey(meeting.meeting_key)
      )
    )
  ).flat();

  const openF1Session = allSessions.find(
    (session) => session.session_key === sessionKey
  );

  if (!openF1Session) {
    throw new Error("No se encontró la sesión en OpenF1");
  }

  const mappedType = mapOpenF1SessionNameToCircuitSessionType(
    openF1Session.session_name
  );

  if (!mappedType) {
    throw new Error("Tipo de sesión no soportado");
  }

  const type = mapCircuitSessionTypeToHomeType(mappedType);
  const isPractice = type === "fp1" || type === "fp2" || type === "fp3";
  const isSprint = mappedType === "Sprint";
  const isSprintShootout = mappedType === "Sprint Shootout";
  const shouldFetchStartingGrid =
    type === "race" || type === "qualifying" || isSprint || isSprintShootout;
  const shouldFetchPitStops = type === "race" || isSprint;
  const shouldFetchStints = type === "race" || isSprint;

  const [
    weather,
    meeting,
    sessionResults,
    drivers,
    startingGrid,
    pitRows,
    stintRows,
  ] = await Promise.all([
    getLatestWeatherForSession(openF1Session.session_key).catch(() => null),
    getMeetingByKey(openF1Session.meeting_key).catch(() => null),
    getSessionResults(openF1Session.session_key),
    getDrivers(openF1Session.session_key),
    shouldFetchStartingGrid && !isPractice
      ? resolveStartingGridRows(
          type,
          openF1Session.session_key,
          openF1Session.meeting_key
        ).catch((error) => {
          console.warn(
            `No se pudo obtener starting_grid para session_key=${openF1Session.session_key}`,
            error
          );
          return [];
        })
      : Promise.resolve([]),
    shouldFetchPitStops
      ? getPitStops(openF1Session.session_key).catch((error) => {
          console.warn(
            `No se pudo obtener pit para session_key=${openF1Session.session_key}`,
            error
          );
          return [];
        })
      : Promise.resolve([]),
    shouldFetchStints
      ? getStints(openF1Session.session_key).catch((error) => {
          console.warn(
            `No se pudo obtener stints para session_key=${openF1Session.session_key}`,
            error
          );
          return [];
        })
      : Promise.resolve([]),
  ]);

  const driversByNumber = new Map(
    drivers.map((driver) => [driver.driver_number, driver])
  );

  const startingGridByDriverNumber = new Map(
    startingGrid.map((row) => [row.driver_number, row])
  );

  const pitStopsByDriverNumber = countPitStopsByDriverNumber(pitRows);
  const tyresByDriverNumber = buildTyresByDriverNumber(stintRows);

  const sortedResults = [...sessionResults].sort((a, b) => {
    const aPos = a.position ?? 999;
    const bPos = b.position ?? 999;
    return aPos - bPos;
  });

  return {
    summary: {
      grandPrixName: meeting
  ? resolveGrandPrixName(meeting)
  : openF1Session.meeting_name ?? openF1Session.circuit_short_name,
      circuitName:
        meeting?.circuit_short_name ?? openF1Session.circuit_short_name,
      location: meeting
        ? `${meeting.location}, ${meeting.country_name}`
        : `${openF1Session.location}, ${openF1Session.country_name}`,
      date: formatSessionDate(openF1Session.date_start),
      sessionType: openF1Session.session_name,
      weatherSummary: weather ? buildWeatherSummary(weather) : "Sin datos de clima",
    },
    quickStats: buildQuickStats({
      type,
      sortedResults,
      driversByNumber,
      tyresByDriverNumber,
      startingGridByDriverNumber,
    }),
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
        tyres: tyresByDriverNumber.get(result.driver_number) ?? "-",
        topSpeed: "-",
        status: formatGapOrStatus(result),
      };
    }),
  };
}