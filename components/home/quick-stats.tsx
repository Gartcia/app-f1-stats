import type { QuickStat } from "@/types/home";

type Props = {
  stats: QuickStat[];
};

export function QuickStats({ stats }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Resumen rápido
        </p>
        <h2 className="mt-2 text-lg font-semibold text-white">
          Quick stats
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
              {stat.label}
            </p>
            <p className="mt-3 text-lg font-semibold text-white">
              {stat.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}