import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { CircuitDriversGrid } from "@/components/circuits/circuit-drivers-grid";
import { CircuitHeroCard } from "@/components/circuits/circuit-hero-card";
import { CircuitInfoGrid } from "@/components/circuits/circuit-info-grid";
import { CircuitLayoutCard } from "@/components/circuits/circuit-layout-card";
import { CircuitRecentSessions } from "@/components/circuits/circuit-recent-sessions";
import {
  buildCircuitSessionMockId,
  getDrivers,
  getLatestCompletedMeetingForCircuit,
  getSessionsByMeetingKey,
  mapOpenF1SessionNameToCircuitSessionType,
  pickPreferredSession,
} from "@/lib/api/openf1";
import { circuits } from "@/lib/data/circuits";
import type { CircuitRecentSession } from "@/types/circuit";

type CircuitDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatSessionDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function CircuitDetailPage({
  params,
}: CircuitDetailPageProps) {
  const { id } = await params;

  const circuit = circuits.find((item) => item.id === id);

  if (!circuit) {
    notFound();
  }

  const latestMeeting = await getLatestCompletedMeetingForCircuit({
    id: circuit.id,
    country: circuit.country,
    location: circuit.location,
  });

  let recentSessions: CircuitRecentSession[] = circuit.recentSessions ?? [];

  let circuitDrivers: {
    id: string;
    fullName: string;
    acronym: string;
    number: number;
    teamName: string;
    teamColour?: string;
    headshotUrl?: string | null;
  }[] = [];

  if (latestMeeting) {
  const openF1Sessions = await getSessionsByMeetingKey(latestMeeting.meeting_key);

  const mappedSessionsRaw = openF1Sessions.map((session) => {
    const mappedType = mapOpenF1SessionNameToCircuitSessionType(
      session.session_name
    );

    if (!mappedType) {
      return null;
    }

    const sessionId = buildCircuitSessionMockId(
      circuit.id,
      session.year,
      mappedType
    );

    const hasSessionDetail = true;

    return {
      id: sessionId,
      year: session.year,
      sessionType: mappedType,
      date: formatSessionDate(session.date_start),
      headline: `${mappedType} del ${latestMeeting.meeting_name} en ${latestMeeting.location}.`,
      status: "Completed" as const,
      isAvailable: hasSessionDetail,
    };
  });

  const mappedSessions: CircuitRecentSession[] = mappedSessionsRaw
    .filter(
      (
        session
      ): session is Exclude<(typeof mappedSessionsRaw)[number], null> =>
        session !== null
    )
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

  if (mappedSessions.length > 0) {
    recentSessions = mappedSessions;
  }

  const preferredSession = pickPreferredSession(openF1Sessions);

  if (preferredSession) {
    const drivers = await getDrivers(preferredSession.session_key);

    circuitDrivers = drivers
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
}

  const displayCountry = latestMeeting?.country_name ?? circuit.country;
  const displayLocation = latestMeeting?.location ?? circuit.location;

  return (
    <AppShell activePath="/circuits">
      <div className="space-y-6">
        <Link
          href="/circuits"
          className="inline-flex text-sm text-zinc-400 transition hover:text-white"
        >
          ← Volver a circuitos
        </Link>

        <CircuitHeroCard
          name={circuit.name}
          location={displayLocation}
          country={displayCountry}
          type={circuit.type}
          lengthKm={circuit.lengthKm}
          laps={circuit.laps}
        />

        <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
          <CircuitLayoutCard
            layoutLabel={circuit.layoutLabel}
            layoutImage={circuit.layoutImage}
          />

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Resumen
            </p>

            <h2 className="mt-2 text-lg font-semibold text-white">
              Visión general del trazado
            </h2>

            <p className="mt-4 text-sm leading-7 text-zinc-300">
              {circuit.name} está ubicado en {displayLocation}, {displayCountry}.
              Es un circuito de tipo {circuit.type.toLowerCase()} con una longitud
              de {circuit.lengthKm} km y una distancia de carrera habitual de{" "}
              {circuit.laps} vueltas.
            </p>

            <p className="mt-4 text-sm leading-7 text-zinc-300">
              Esta ficha combina datos base mock con sesiones recientes reales
              obtenidas desde OpenF1 para acercar el módulo de circuitos a una
              versión más conectada con el calendario real.
            </p>
          </section>
        </div>

        <CircuitInfoGrid
          country={displayCountry}
          location={displayLocation}
          lengthKm={circuit.lengthKm}
          laps={circuit.laps}
          firstGp={circuit.firstGp}
          lapRecord={circuit.lapRecord}
        />

        <CircuitDriversGrid drivers={circuitDrivers} />

        <CircuitRecentSessions
          circuitId={circuit.id}
          sessions={recentSessions}
        />
      </div>
    </AppShell>
  );
}