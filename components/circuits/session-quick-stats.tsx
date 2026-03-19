type Props = {
  quickStats?: {
    winner?: string;
    pole?: string;
    fastestLap?: string;
    topSpeed?: string;
  };
};

export function SessionQuickStats({ quickStats }: Props) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-wide text-zinc-400">
          Ganador
        </p>
        <p className="mt-2 text-base font-medium text-white">
          {quickStats?.winner ?? "—"}
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-wide text-zinc-400">Pole</p>
        <p className="mt-2 text-base font-medium text-white">
          {quickStats?.pole ?? "—"}
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-wide text-zinc-400">
          Fastest lap
        </p>
        <p className="mt-2 text-base font-medium text-white">
          {quickStats?.fastestLap ?? "—"}
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-wide text-zinc-400">
          Top speed
        </p>
        <p className="mt-2 text-base font-medium text-white">
          {quickStats?.topSpeed ?? "—"}
        </p>
      </div>
    </section>
  );
}