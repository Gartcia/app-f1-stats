import Link from "next/link";
import type { DriverListItem } from "@/lib/mappers/drivers.mapper";

type Props = {
  drivers: DriverListItem[];
};

function DriverAvatar({ driver }: { driver: DriverListItem }) {
  if (driver.headshotUrl) {
    return (
      <img
        src={driver.headshotUrl}
        alt={driver.fullName}
        className="h-24 w-24 rounded-2xl object-cover object-top"
      />
    );
  }

  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/5 text-lg font-semibold text-zinc-200">
      {driver.acronym}
    </div>
  );
}

export function DriversGrid({ drivers }: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-950/60 p-6">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
          Drivers
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          Grilla de pilotos
        </h2>
      </div>

      {drivers.length === 0 ? (
        <p className="text-sm text-zinc-400">
          No encontramos pilotos para la última sesión disponible.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {drivers.map((driver) => (
            <Link
              key={driver.driverNumber}
              href={`/drivers/${driver.driverNumber}`}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              <DriverAvatar driver={driver} />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-white">
                    #{driver.driverNumber}
                  </span>
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: `#${driver.teamColour ?? "737373"}` }}
                  />
                </div>

                <h3 className="truncate text-base font-medium text-zinc-100">
                  {driver.fullName}
                </h3>

                <p className="truncate text-sm text-zinc-400">{driver.teamName}</p>

                <p className="mt-2 text-xs text-zinc-500">
                  {driver.meetingName} · {driver.sessionName}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}