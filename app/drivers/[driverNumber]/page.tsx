import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { DriverRecentResults } from "@/components/drivers/driver-recent-results";
import { DriverSessionsList } from "@/components/drivers/driver-sessions-list";
import {
  getDriverDetailData,
  getDriverRecentWeekends,
} from "@/lib/mappers/drivers.mapper";
import { PageHeader } from "@/components/ui/page-header";

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

const [driver, recentWeekends] = await Promise.all([
  getDriverDetailData(parsedDriverNumber),
  getDriverRecentWeekends(parsedDriverNumber),
]);

  if (!driver) {
    notFound();
  }

  return (
    <AppShell activePath="/drivers">
      <div className="space-y-6">

        <PageHeader
  backHref="/drivers"
  backLabel="Volver a pilotos"
  eyebrow={driver.teamName}
  title={driver.fullName}
  description={`${driver.location}, ${driver.country} · ${driver.sessionName}`}
  watermark={`#${driver.driverNumber}`}
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
<DriverSessionsList weekends={recentWeekends} />
      </div>
    </AppShell>
  );
}