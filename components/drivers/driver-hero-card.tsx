type Props = {
  fullName: string;
  driverNumber: number;
  acronym: string;
  teamName: string;
  teamColour?: string;
  headshotUrl?: string | null;
  meetingName: string;
  location: string;
  country: string;
  sessionName: string;
};

export function DriverHeroCard({
  fullName,
  driverNumber,
  acronym,
  teamName,
  teamColour,
  headshotUrl,
  meetingName,
  location,
  country,
  sessionName,
}: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="border-b border-white/10 bg-linear-to-br from-white/10 to-transparent p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          {headshotUrl ? (
            <img
              src={headshotUrl}
              alt={fullName}
              className="h-32 w-32 rounded-3xl object-cover object-top"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-white/5 text-3xl font-semibold text-zinc-200">
              {acronym}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
              Driver profile
            </p>

            <div className="mt-3 flex items-center gap-3">
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                {fullName}
              </h1>

              <span
                className="inline-flex rounded-full border px-3 py-1 text-sm font-medium"
                style={{
                  borderColor: `#${teamColour ?? "3f3f46"}33`,
                  color: `#${teamColour ?? "ffffff"}`,
                  backgroundColor: `#${teamColour ?? "18181b"}1A`,
                }}
              >
                #{driverNumber}
              </span>
            </div>

            <p className="mt-3 text-sm text-zinc-300">{teamName}</p>
            <p className="mt-2 text-sm text-zinc-500">
              {meetingName} · {sessionName}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              {location}, {country}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}