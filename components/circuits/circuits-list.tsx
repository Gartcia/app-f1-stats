"use client";

import { useMemo, useState } from "react";
import { circuits } from "@/lib/data/circuits";

const circuitTypes = ["Todos", "Permanente", "Callejero"] as const;

export function CircuitsList() {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] =
    useState<(typeof circuitTypes)[number]>("Todos");

  const filteredCircuits = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return circuits.filter((circuit) => {
      const matchesQuery =
        !normalizedQuery ||
        circuit.name.toLowerCase().includes(normalizedQuery) ||
        circuit.country.toLowerCase().includes(normalizedQuery) ||
        circuit.location.toLowerCase().includes(normalizedQuery) ||
        circuit.type.toLowerCase().includes(normalizedQuery);

      const matchesType =
        selectedType === "Todos" || circuit.type === selectedType;

      return matchesQuery && matchesType;
    });
  }, [query, selectedType]);

  return (
    <section className="flex flex-col gap-4">
      <div className="rounded-2xl border border-white/10 bg-zinc-900 p-4">
        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="circuits-search"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500"
            >
              Buscar circuito
            </label>

            <input
              id="circuits-search"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre, país, ciudad o tipo"
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500/50"
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Tipo de circuito
            </p>

            <div className="flex flex-wrap gap-2">
              {circuitTypes.map((type) => {
                const isActive = selectedType === type;

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-red-600 text-white"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {filteredCircuits.length === 0 ? (
        <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-400">No se encontraron circuitos.</p>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCircuits.map((circuit) => (
            <article
              key={circuit.id}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                    {circuit.country}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-white">
                    {circuit.name}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    {circuit.location}
                  </p>
                </div>

                <span className="rounded-full border border-white/10 bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300">
                  {circuit.type}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-zinc-950/40 p-3">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Longitud
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {circuit.lengthKm} km
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-zinc-950/40 p-3">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Vueltas
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {circuit.laps}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </section>
  );
}