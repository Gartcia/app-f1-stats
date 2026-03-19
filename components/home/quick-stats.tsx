import type { QuickStat } from "@/types/home";

type Props = {
  stats: QuickStat[];
};

export function QuickStats({ stats }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Resumen rápido
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">Quick stats</h2>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-zinc-950/40 p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {stat.label}
            </p>
            <p className="mt-3 text-base font-semibold text-white">
              {stat.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}