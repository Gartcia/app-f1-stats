import type { QuickStat } from "@/types/home";
import { SectionCard } from "@/components/ui/section-card";

type Props = {
  stats: QuickStat[];
};

export function QuickStats({ stats }: Props) {
  return (
    <SectionCard eyebrow="Resumen rápido" title="Quick stats">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-[8px] border border-white/10 bg-[#0F1014] p-4 transition hover:border-white/15 hover:bg-white/[0.03]"
          >
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#949498]">
              {stat.label}
            </p>

            <p className="mt-3 font-mono text-xl font-semibold text-white">
              {stat.value}
            </p>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}