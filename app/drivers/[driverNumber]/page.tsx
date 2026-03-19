import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { DriverHeroCard } from "@/components/drivers/driver-hero-card";
import { DriverRecentResults } from "@/components/drivers/driver-recent-results";
import { DriverSessionsList } from "@/components/drivers/driver-sessions-list";
import {
  getDriverDetailData,
  getDriverRecentSessions,
} from "@/lib/mappers/drivers.mapper";

type DriverDetailPageProps = {
  params: Promise<{
    driverNumber: string;
  }>;
};

export default async function DriverDetailPage({
  params,
}: DriverDetailPageProps) {
  const { driverNumber } = await params;
  const parsedDriverNumber = Number(driverNumber);

  if (!Number.isFinite(parsedDriverNumber)) {
    notFound();
  }

const [driver, recentSessions] = await Promise.all([
  getDriverDetailData(parsedDriverNumber),
  getDriverRecentSessions(parsedDriverNumber),
]);

  if (!driver) {
    notFound();
  }

  return (
    <AppShell activePath="/drivers">
      <div className="space-y-6">
        <Link
          href="/drivers"
          className="inline-flex text-sm text-zinc-400 transition hover:text-white"
        >
          ← Volver a pilotos
        </Link>

        <DriverHeroCard
          fullName={driver.fullName}
          driverNumber={driver.driverNumber}
          acronym={driver.acronym}
          teamName={driver.teamName}
          teamColour={driver.teamColour}
          headshotUrl={driver.headshotUrl}
          meetingName={driver.meetingName}
          location={driver.location}
          country={driver.country}
          sessionName={driver.sessionName}
        />

        <DriverRecentResults
  meetingName={driver.meetingName}
  circuitName={driver.circuitName}
  sessionName={driver.sessionName}
  position={driver.position}
  lapsCompleted={driver.lapsCompleted}
  gapToLeader={driver.gapToLeader}
  status={driver.status}
/>
<DriverSessionsList sessions={recentSessions} />
      </div>
    </AppShell>
  );
}