import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { SessionQuickStats } from "@/components/circuits/session-quick-stats";
import { SessionResultsTable } from "@/components/circuits/session-results-table";
import { SessionSummaryCard } from "@/components/circuits/session-summary-card";
import { circuits } from "@/lib/data/circuits";
import { SessionHeroCard } from "@/components/circuits/session-hero-card";

type SessionDetailPageProps = {
  params: Promise<{
    id: string;
    sessionId: string;
  }>;
};

export default async function SessionDetailPage({
  params,
}: SessionDetailPageProps) {
  const { id, sessionId } = await params;

  const circuit = circuits.find((item) => item.id === id);

  if (!circuit) {
    notFound();
  }

  const session = circuit.recentSessions?.find((item) => item.id === sessionId);

  if (!session) {
    notFound();
  }

  return (
    <AppShell activePath="/circuits">
      <div className="space-y-6">
        <div className="space-y-3">
          <Link
            href={`/circuits/${circuit.id}`}
            className="inline-flex text-sm text-zinc-400 transition hover:text-white"
          >
            ← Volver al circuito
          </Link>

          <SessionHeroCard
  circuitName={circuit.name}
  circuitLocation={circuit.location}
  sessionType={session.sessionType}
  sessionDate={session.date}
  season={session.year}
  status={session.status}
/>
        </div>

        <SessionSummaryCard headline={session.headline} />
        <SessionQuickStats quickStats={session.quickStats} />
        <SessionResultsTable results={session.results} />
      </div>
    </AppShell>
  );
}