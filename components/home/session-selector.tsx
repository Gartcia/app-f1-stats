import Link from "next/link";
import type { SessionType } from "@/types/home";

type Props = {
  selectedType: SessionType;
};

const options: { label: string; value: SessionType }[] = [
  { label: "Race", value: "race" },
  { label: "Qualifying", value: "qualifying" },
  { label: "FP1", value: "fp1" },
  { label: "FP2", value: "fp2" },
  { label: "FP3", value: "fp3" },
];

export function SessionSelector({ selectedType }: Props) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#15151E] p-4">
      <div className="mb-4 border-b border-white/10 pb-3">
        <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] italic text-[#949498]">
          Selector de sesión
        </h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option.value === selectedType;

          return (
            <Link
              key={option.value}
              href={`/?type=${option.value}`}
              className={`inline-flex items-center rounded-sm border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                isActive
                  ? "border-[#E10600]/40 bg-[linear-gradient(90deg,#E10600_0%,#8E0400_100%)] text-white shadow-[0_0_18px_rgba(225,6,0,0.16)]"
                  : "border-white/10 bg-white/3 text-[#949498] hover:border-white/20 hover:bg-white/6 hover:text-white"
              }`}
            >
              {option.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}