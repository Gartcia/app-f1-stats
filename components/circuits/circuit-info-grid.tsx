type Props = {
  country: string;
  location: string;
  lengthKm?: string;
  laps?: number;
  firstGp?: number;
  lapRecord?: string;
};

type InfoCardProps = {
  label: string;
  value: string | number;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="mt-3 text-base font-semibold text-white">{value}</p>
    </div>
  );
}

export function CircuitInfoGrid({
  country,
  location,
  lengthKm,
  laps,
  firstGp,
  lapRecord,
}: Props) {
  const items = [
    { label: "País", value: country },
    { label: "Ubicación", value: location },
    ...(lengthKm ? [{ label: "Longitud", value: `${lengthKm} km` }] : []),
    ...(typeof laps === "number" ? [{ label: "Vueltas", value: laps }] : []),
    ...(typeof firstGp === "number" ? [{ label: "Primer GP", value: firstGp }] : []),
    ...(lapRecord ? [{ label: "Récord de vuelta", value: lapRecord }] : []),
  ];

  return (
    <section className="space-y-3">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
          Datos del circuito
        </p>
        <h2 className="mt-2 text-lg font-semibold text-white">
          Información base
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <InfoCard key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
    </section>
  );
}