import { AppHeader } from "@/components/app-header";
import { QuickStats } from "@/components/home/quick-stats";
import { ResultsTable } from "@/components/home/results-table";
import { SessionSelector } from "@/components/home/session-selector";
import { SessionSummary } from "@/components/home/session-summary";
import { SessionNotAvailableError } from "@/lib/api/openf1";
import { getHomeLatestData } from "@/lib/mappers/home-latest.mapper";
import type { SessionType } from "@/types/home";

type HomePageProps = {
  searchParams: Promise<{
    type?: string;
  }>;
};

const ALLOWED_TYPES: SessionType[] = [
  "race",
  "qualifying",
  "fp1",
  "fp2",
  "fp3",
];

function getSelectedType(type?: string): SessionType {
  if (type && ALLOWED_TYPES.includes(type as SessionType)) {
    return type as SessionType;
  }

  return "race";
}

function getSessionLabel(type: SessionType) {
  if (type === "fp1") return "FP1";
  if (type === "fp2") return "FP2";
  if (type === "fp3") return "FP3";
  if (type === "qualifying") return "Qualifying";
  return "Race";
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const selectedType = getSelectedType(params.type);

  try {
    const homeData = await getHomeLatestData(selectedType);

    return (
      <main className="min-h-screen bg-black px-6 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <AppHeader />
          <SessionSelector selectedType={selectedType} />
          <SessionSummary summary={homeData.summary} />
          <QuickStats stats={homeData.quickStats} />
          <ResultsTable results={homeData.results} />

          <section className="rounded-2xl border border-white/10 bg-zinc-900 p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Módulos futuros
            </h2>

            <div className="flex flex-wrap gap-2 text-sm text-zinc-300">
              <span className="rounded-full bg-zinc-800 px-3 py-2">Telemetría</span>
              <span className="rounded-full bg-zinc-800 px-3 py-2">Estrategia</span>
              <span className="rounded-full bg-zinc-800 px-3 py-2">Radios</span>
              <span className="rounded-full bg-zinc-800 px-3 py-2">Circuitos</span>
            </div>
          </section>
        </div>
      </main>
    );
  } catch (error) {
    if (error instanceof SessionNotAvailableError) {
      return (
        <main className="min-h-screen bg-black px-6 py-8 text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            <AppHeader />
            <SessionSelector selectedType={selectedType} />

            <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
              <p className="text-sm uppercase tracking-wide text-zinc-400">
                Sesión no disponible
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-white">
                {getSessionLabel(selectedType)} no existe para este fin de semana
              </h2>

              <p className="mt-3 text-zinc-300">
                Este GP no tiene esa sesión cargada en OpenF1 o ese formato de fin
                de semana no la incluye.
              </p>
            </section>
          </div>
        </main>
      );
    }

    throw error;
  }
}