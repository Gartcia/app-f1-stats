import { SectionCard } from "../ui/section-card";

type Props = {
  meetingName: string;
  circuitName: string;
  sessionName: string;
  position: number | null;
  lapsCompleted: number;
  gapToLeader: string;
  status: string;
};

function getStatusClasses(status: string) {
  switch (status) {
    case "Finished":
      return "border-[#00D2BE]/30 bg-[#00D2BE]/10 text-[#00D2BE]";
    case "DNF":
    case "DNS":
    case "DSQ":
      return "border-[#E10600]/30 bg-[#E10600]/10 text-[#E10600]";
    default:
      return "border-white/10 bg-white/[0.04] text-[#949498]";
  }
}

function ResultCard({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string | number;
  mono?: boolean;
}) {
  return (
    <div className="rounded-[8px] border border-white/10 bg-[#0F1014] p-4 transition hover:border-white/15 hover:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#949498]">
        {label}
      </p>
      <p
        className={`mt-3 text-base font-semibold text-white ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </p>
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
    <SectionCard      eyebrow="Resultados recientes"
      title={meetingName}
      description={`${sessionName} - ${circuitName}`}
    >

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ResultCard label="Meeting" value={meetingName} />
        <ResultCard label="Circuito" value={circuitName} />
        <ResultCard label="Sesión" value={sessionName} />
        <ResultCard label="Posición" value={position ?? "-"} mono />
        <ResultCard label="Vueltas" value={lapsCompleted} mono />
        <ResultCard label="Gap" value={gapToLeader} mono />

        <div className="rounded-[8px] border border-white/10 bg-[#0F1014] p-4 transition hover:border-white/15 hover:bg-white/[0.03]">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#949498]">
            Estado
          </p>
          <div className="mt-3">
            <span
              className={`inline-flex rounded-[4px] border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getStatusClasses(
                status
              )}`}
            >
              {status}
            </span>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}