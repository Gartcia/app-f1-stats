import { AppShell } from "@/components/app-shell";
import { DriversGrid } from "@/components/drivers/drivers-grid";
import { getDriversListData } from "@/lib/mappers/drivers.mapper";
import { PageHeader } from "@/components/ui/page-header";

export default async function DriversPage() {
  const drivers = await getDriversListData();

  return (
    <AppShell activePath="/drivers">
      <div className="space-y-6">
        
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <PageHeader
  eyebrow="Drivers"
  title="Pilotos"
  description="Explora pilotos reales obtenidos desde OpenF1 a partir de la última sesión disponible."
  watermark="F1"
/>
          <div className="grid gap-3 p-6 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                Total
              </p>
              <p className="mt-2 text-base font-medium text-white">
                {drivers.length} pilotos
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                Fuente
              </p>
              <p className="mt-2 text-base font-medium text-white">OpenF1</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                Vista
              </p>
              <p className="mt-2 text-base font-medium text-white">
                Última sesión
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                Módulo
              </p>
              <p className="mt-2 text-base font-medium text-white">
                Drivers V1
              </p>
            </div>
          </div>
        </section>

        <DriversGrid drivers={drivers} />
      </div>
    </AppShell>
  );
}