import Image from "next/image";

type Props = {
  layoutLabel: string;
  layoutImage?: string;
};

export function CircuitLayoutCard({ layoutLabel, layoutImage }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
          Layout
        </p>
        <h2 className="mt-2 text-lg font-semibold text-white">
          Trazado del circuito
        </h2>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
        {layoutImage ? (
          <div className="relative h-72 w-full">
            <Image
              src={layoutImage}
              alt={layoutLabel}
              fill
              className="object-contain p-6"
            />
          </div>
        ) : (
          <div className="flex h-72 items-center justify-center border border-dashed border-white/10">
            <div className="text-center">
              <p className="text-sm font-medium text-white">{layoutLabel}</p>
              <p className="mt-2 text-xs text-zinc-500">
                Placeholder visual del circuito
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}