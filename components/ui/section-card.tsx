import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function SectionCard({
  eyebrow,
  title,
  description,
  children,
  className = "",
  contentClassName = "",
}: Props) {
  return (
    <section
      className={`rounded-[8px] border border-white/10 bg-[#15151E] ${className}`}
    >
      {(eyebrow || title || description) && (
        <div className="border-b border-white/10 px-6 py-5">
          {eyebrow ? (
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] italic text-[#949498]">
              {eyebrow}
            </p>
          ) : null}

          {title ? (
            <h2 className="mt-2 font-['Rajdhani',sans-serif] text-3xl font-semibold uppercase tracking-[0.02em] text-white">
              {title}
            </h2>
          ) : null}

          {description ? (
            <p className="mt-3 text-sm leading-6 text-[#949498]">
              {description}
            </p>
          ) : null}
        </div>
      )}

      <div className={`p-6 ${contentClassName}`}>{children}</div>
    </section>
  );
}