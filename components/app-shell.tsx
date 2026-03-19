import type { ReactNode } from "react";
import { AppBottomNav } from "@/components/app-bottom-nav";
import { AppHeader } from "@/components/app-header";

type Props = {
  children: ReactNode;
  activePath: "/" | "/telemetry" | "/strategy" | "/radio" | "/circuits";
};

export function AppShell({ children, activePath }: Props) {
  return (
    <main className="min-h-screen bg-black px-6 py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <AppHeader />
        {children}
        <AppBottomNav activePath={activePath} />
      </div>
    </main>
  );
}