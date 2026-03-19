type Props = {
  meetingName: string;
  circuitName: string;
  sessionName: string;
  position: number | null;
  lapsCompleted: number;
  gapToLeader: string;
  status: string;
};

function ResultCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-[11px] uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-base font-medium text-white">{value}</p>
    </div>
  );
}

export function DriverRecentResults({
  meetingName,
  circuitName,
  sessionName,
  position,
  lapsCompleted,
  gapToLeader,
  status,
}: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
          Última sesión
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          Resultado reciente
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <ResultCard label="Meeting" value={meetingName} />
        <ResultCard label="Circuito" value={circuitName} />
        <ResultCard label="Sesión" value={sessionName} />
        <ResultCard label="Posición" value={position ?? "-"} />
        <ResultCard label="Vueltas" value={lapsCompleted} />
        <ResultCard label="Gap" value={gapToLeader} />
        <ResultCard label="Estado" value={status} />
      </div>
    </section>
  );
}