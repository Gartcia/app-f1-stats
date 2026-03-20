import { SectionCard } from "../ui/section-card";

type Props = {
  headline: string;
};

export function SessionSummaryCard({ headline }: Props) {
  return (
    <SectionCard      eyebrow="Resumen de la sesión"
      title={headline}
      description="Un breve resumen de los aspectos más destacados de esta sesión, incluyendo eventos clave, desempeño de los pilotos, y cualquier incidente relevante que haya ocurrido durante la sesión.">
      <p className="text-sm text-zinc-500">
        Aquí encontrarás un resumen conciso de lo que sucedió en esta sesión, destacando los momentos más importantes y el rendimiento general de los pilotos.
      </p>
    </SectionCard>
  );
}