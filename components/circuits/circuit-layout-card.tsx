import Image from "next/image";
import { SectionCard } from "../ui/section-card";

type Props = {
  layoutLabel: string;
  layoutImage?: string;
};

export function CircuitLayoutCard({ layoutLabel, layoutImage }: Props) {
  return (
    <SectionCard      eyebrow="Diseño del circuito"
      title="Vista general del circuito"
      description="Una representación visual del diseño del circuito, mostrando su configuración, curvas, rectas y cualquier característica distintiva que lo haga único.">

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
    </SectionCard>
  );
}