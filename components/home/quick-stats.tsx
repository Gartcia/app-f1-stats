import type { QuickStat } from "@/types/home";

type Props = {
  stats: QuickStat[];
};

export function QuickStats({ stats }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900 p-4">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Quick stats
      </h2>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/10 bg-zinc-800 p-4"
          >
            <p className="text-sm text-zinc-400">{stat.label}</p>
            <p className="mt-1 text-lg font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}