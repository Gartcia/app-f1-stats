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
    <section className="rounded-2xl border border-white/10 bg-zinc-900 p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Selector de sesión
      </h2>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option.value === selectedType;

          return (
            <Link
              key={option.value}
              href={`/?type=${option.value}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-red-600 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
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