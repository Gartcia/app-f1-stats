type Props = {
  headline: string;
};

export function SessionSummaryCard({ headline }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
        Resumen
      </p>

      <p className="mt-3 text-sm leading-7 text-zinc-300">{headline}</p>
    </section>
  );
}