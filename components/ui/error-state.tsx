import Link from "next/link";

type Props = {
  title?: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function ErrorState({
  title = "No pudimos cargar esta vista",
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Error</p>
      <h2 className="mt-2 text-3xl font-semibold text-white">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
        {description}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {primaryHref && primaryLabel ? (
          <Link
            href={primaryHref}
            className="inline-flex rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/15"
          >
            {primaryLabel}
          </Link>
        ) : null}

        {secondaryHref && secondaryLabel ? (
          <Link
            href={secondaryHref}
            className="inline-flex rounded-full border border-white/10 bg-black/20 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/5"
          >
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}