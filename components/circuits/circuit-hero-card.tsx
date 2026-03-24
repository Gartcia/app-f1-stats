type Props = {
  name: string;
  location: string;
  country: string;
  type?: string;
  lengthKm?: string;
  laps?: number;
};

function getCircuitTypeClasses(type?: string) {
  switch (type) {
    case "Callejero":
      return "border-orange-500/20 bg-orange-500/10 text-orange-300";
    case "Permanente":
      return "border-sky-500/20 bg-sky-500/10 text-sky-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

export function CircuitHeroCard({
  name,
  location,
  country,
  type,
  lengthKm,
  laps,
}: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="border-b border-white/10 bg-linear-to-br from-white/10 to-transparent p-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
          Circuit detail
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
          {name}
        </h1>

        <p className="mt-2 text-sm text-zinc-400">
          {location}, {country}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {type && (
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getCircuitTypeClasses(
                type
              )}`}
            >
              {type}
            </span>
          )}

          {lengthKm && (
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300">
              {lengthKm} km
            </span>
          )}

          {typeof laps === "number" && (
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300">
              {laps} vueltas
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-3 p-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">
            Ubicación
          </p>
          <p className="mt-2 text-base font-medium text-white">{location}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">
            País
          </p>
          <p className="mt-2 text-base font-medium text-white">{country}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">
            Tipo
          </p>
          <p className="mt-2 text-base font-medium text-white">
            {type ?? "No disponible"}
          </p>
        </div>
      </div>
    </section>
  );
}