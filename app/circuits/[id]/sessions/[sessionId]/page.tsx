import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { SessionQuickStats } from "@/components/circuits/session-quick-stats";
import { SessionResultsTable } from "@/components/circuits/session-results-table";
import { SessionSummaryCard } from "@/components/circuits/session-summary-card";
import { circuits } from "@/lib/data/circuits";

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

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Session detail
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-white">
              {circuit.name}
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              {session.sessionType} · {session.date}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                {session.year}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                {session.sessionType}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                {circuit.location}
              </span>
            </div>
          </section>
        </div>

        <SessionSummaryCard headline={session.headline} />
        <SessionQuickStats quickStats={session.quickStats} />
        <SessionResultsTable results={session.top3} />
      </div>
    </AppShell>
  );
}