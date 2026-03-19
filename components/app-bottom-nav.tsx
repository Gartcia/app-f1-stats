import Link from "next/link";

type Props = {
  activePath:
    | "/"
    | "/telemetry"
    | "/strategy"
    | "/radio"
    | "/circuits"
    | "/drivers";
};

const items = [
  { label: "Home", href: "/" as const },
  { label: "Telemetría", href: "/telemetry" as const },
  { label: "Estrategia", href: "/strategy" as const },
  { label: "Radios", href: "/radio" as const },
  { label: "Circuitos", href: "/circuits" as const },
  { label: "Pilotos", href: "/drivers" as const },
];

export function AppBottomNav({ activePath }: Props) {
  return (
    <nav className="sticky bottom-4 z-20">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-2 rounded-2xl border border-white/10 bg-zinc-950/90 p-2 shadow-2xl backdrop-blur">
        {items.map((item) => {
          const isActive = item.href === activePath;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 rounded-xl px-3 py-3 text-center text-sm font-medium transition ${
                isActive
                  ? "bg-red-600 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}