"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useUser } from "@/lib/user-context";
import { solicitudes } from "@/data/requests";
import { dentistById } from "@/data/dentists";
import type { Provincia, TipoSolicitud } from "@/lib/types";
import { Avatar, Reputacion, Chip, SectionTitle } from "@/components/ui";
import { ScoreGauge } from "@/components/ScoreGauge";
import { usd, pct } from "@/lib/format";

// El mapa usa Leaflet (window) → sin SSR.
const MatchingMap = dynamic(() => import("@/components/MatchingMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full min-h-[380px] place-items-center rounded-[var(--radius-lg)] bg-[var(--color-gray-50)] text-sm text-[var(--color-gray-400)]">
      Cargando mapa del NEA…
    </div>
  ),
});

const provincias: (Provincia | "Todas")[] = ["Todas", "Chaco", "Corrientes", "Misiones"];

export default function Matching() {
  const { user } = useUser();
  const [tipo, setTipo] = useState<TipoSolicitud | "todas">("todas");
  const [provincia, setProvincia] = useState<Provincia | "Todas">("Todas");
  const [montoMax, setMontoMax] = useState(7000);
  const [scoreMin, setScoreMin] = useState(300);
  const [selected, setSelected] = useState<string | null>(null);

  const filtradas = useMemo(() => {
    return solicitudes
      .filter((s) => s.autorId !== user?.id)
      .map((s) => ({ s, autor: dentistById(s.autorId)! }))
      .filter(({ s, autor }) => {
        if (tipo !== "todas" && s.tipo !== tipo) return false;
        if (provincia !== "Todas" && autor.provincia !== provincia) return false;
        if (s.monto > montoMax) return false;
        if (autor.score < scoreMin) return false;
        return true;
      });
  }, [user?.id, tipo, provincia, montoMax, scoreMin]);

  const pins = filtradas.map(({ s, autor }) => ({ solicitud: s, autor }));
  const sel = filtradas.find(({ s }) => s.id === selected);

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Motor de matching"
        title="Solicitudes activas en el NEA"
        desc="Cruzá por tipo, monto, provincia y score. El mapa refuerza la proximidad como factor de confianza."
      />

      {/* Filtros */}
      <div className="card-minimal grid gap-4 p-5 md:grid-cols-4">
        <div>
          <label className="font-grotesk text-xs font-semibold text-[var(--color-gray-500)]">Tipo</label>
          <select
            className="select-minimal mt-1"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoSolicitud | "todas")}
          >
            <option value="todas">Todas</option>
            <option value="tomar">Buscan crédito (tomadores)</option>
            <option value="prestar">Ofrecen capital (prestamistas)</option>
          </select>
        </div>
        <div>
          <label className="font-grotesk text-xs font-semibold text-[var(--color-gray-500)]">Provincia</label>
          <select
            className="select-minimal mt-1"
            value={provincia}
            onChange={(e) => setProvincia(e.target.value as Provincia | "Todas")}
          >
            {provincias.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-grotesk text-xs font-semibold text-[var(--color-gray-500)]">
            Monto máximo · {usd(montoMax)}
          </label>
          <input
            type="range"
            min={500}
            max={7000}
            step={250}
            value={montoMax}
            onChange={(e) => setMontoMax(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--color-primary)]"
          />
        </div>
        <div>
          <label className="font-grotesk text-xs font-semibold text-[var(--color-gray-500)]">
            Score mínimo · {scoreMin}
          </label>
          <input
            type="range"
            min={300}
            max={850}
            step={10}
            value={scoreMin}
            onChange={(e) => setScoreMin(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--color-primary)]"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        {/* Lista */}
        <div className="space-y-4">
          <p className="font-mono text-xs text-[var(--color-gray-500)]">
            {filtradas.length} resultado{filtradas.length === 1 ? "" : "s"}
          </p>
          {filtradas.map(({ s, autor }) => (
            <div
              key={s.id}
              onMouseEnter={() => setSelected(s.id)}
              className={`card-minimal p-5 transition-shadow ${
                selected === s.id ? "ring-2 ring-[var(--color-primary)]" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar dentist={autor} size={44} />
                  <div>
                    <p className="font-semibold leading-tight">
                      {autor.nombre} {autor.apellido}
                    </p>
                    <p className="font-mono text-xs text-[var(--color-gray-500)]">
                      {autor.ciudad}, {autor.provincia} · {s.distanciaKm} km
                    </p>
                    <div className="mt-1">
                      <Reputacion valor={autor.reputacion} />
                    </div>
                  </div>
                </div>
                <Chip tone={s.tipo === "prestar" ? "green" : "blue"}>
                  {s.tipo === "prestar" ? "Ofrece" : "Busca"}
                </Chip>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="font-mono text-2xl font-bold">{usd(s.monto)}</p>
                  <p className="text-sm text-[var(--color-gray-600)]">{s.destino}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold text-[var(--color-primary)]">
                    {pct(s.tasaMin)}–{pct(s.tasaMax)}
                  </p>
                  <p className="font-mono text-xs text-[var(--color-gray-400)]">
                    {s.plazoMeses} meses
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[var(--color-gray-100)] pt-3">
                <span className="font-mono text-xs text-[var(--color-gray-500)]">
                  Score {autor.score} · publicada {s.publicada}
                </span>
                <Link href={`/app/solicitud/${s.id}`} className="btn-ghost">
                  Ver operación →
                </Link>
              </div>
            </div>
          ))}
          {filtradas.length === 0 && (
            <div className="card-minimal p-8 text-center text-sm text-[var(--color-gray-500)]">
              No hay solicitudes con esos filtros. Probá ampliar el monto o bajar el score
              mínimo.
            </div>
          )}
        </div>

        {/* Mapa + match destacado */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card-minimal overflow-hidden p-0">
            <div className="h-[420px]">
              <MatchingMap pins={pins} selectedId={selected} onSelect={setSelected} />
            </div>
          </div>
          {sel && (
            <div className="card-minimal flex items-center gap-5 p-5">
              <ScoreGauge score={sel.autor.score} size={120} />
              <div>
                <p className="font-grotesk text-xs uppercase tracking-wide text-[var(--color-gray-500)]">
                  Match destacado
                </p>
                <p className="mt-1 font-semibold">
                  {sel.autor.nombre} {sel.autor.apellido} · {usd(sel.s.monto)}
                </p>
                <p className="text-sm text-[var(--color-gray-600)]">{sel.s.destino}</p>
                <Link href={`/app/solicitud/${sel.s.id}`} className="btn-primary mt-3">
                  Avanzar con esta operación →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
