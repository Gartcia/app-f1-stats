export function AppHeader() {
  return (
    <header className="border-b border-white/10 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
            F1 App
          </p>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        </div>

        <nav className="text-sm text-zinc-400">MVP inicial</nav>
      </div>
    </header>
  );
}