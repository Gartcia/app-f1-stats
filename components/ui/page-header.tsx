import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
  watermark?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  backHref,
  backLabel = "Volver",
  actions,
  watermark,
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-[8px] border border-white/10 bg-[#15151E]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(225,6,0,0.10),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.00)_40%)]" />
      </div>

      {watermark ? (
        <div className="pointer-events-none absolute right-4 top-2 text-[64px] font-bold uppercase leading-none tracking-tight text-white/[0.04] sm:text-[96px]">
          {watermark}
        </div>
      ) : null}

      <div className="relative border-b border-white/10 px-6 py-5 sm:px-8 sm:py-6">
        {backHref ? (
          <Link
            href={backHref}
            className="mb-5 inline-flex items-center gap-2 rounded-[4px] border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-[#949498] transition hover:border-white/20 hover:text-white"
          >
            ← {backLabel}
          </Link>
        ) : null}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            {eyebrow ? (
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] italic text-[#949498]">
                {eyebrow}
              </p>
            ) : null}

            <h1 className="mt-2 font-['Rajdhani',sans-serif] text-4xl font-semibold uppercase leading-none tracking-[0.02em] text-white sm:text-5xl">
              {title}
            </h1>

            {description ? (
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#949498]">
                {description}
              </p>
            ) : null}
          </div>

          {actions ? <div className="relative z-10 shrink-0">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}