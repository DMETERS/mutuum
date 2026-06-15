"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { ArrowRight, MapPin, SlidersHorizontal, Gauge, Lock } from "@/components/icons";
import { useUser } from "@/lib/user-context";
import { solicitudes } from "@/data/requests";
import { dentistById } from "@/data/dentists";
import type { Provincia, TipoSolicitud } from "@/lib/types";
import { Avatar, Reputacion, Chip, SectionTitle, ValidacionBadge } from "@/components/ui";
import { ScoreGauge } from "@/components/ScoreGauge";
import { usd, pct } from "@/lib/format";

const MatchingMap = dynamic(() => import("@/components/MatchingMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full min-h-[420px] place-items-center bg-[var(--color-paper-2)] text-sm text-[var(--color-faint)]">
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
      <div className="card-minimal p-5">
        <p className="eyebrow mb-4 flex items-center gap-1.5">
          <SlidersHorizontal size={13} /> Filtros
        </p>
        <div className="grid gap-5 md:grid-cols-4">
          <div>
            <label className="font-grotesk text-xs font-semibold text-[var(--color-muted)]">Tipo</label>
            <select
              aria-label="Tipo de solicitud"
              className="select-minimal mt-1.5"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoSolicitud | "todas")}
            >
              <option value="todas">Todas</option>
              <option value="tomar">Buscan crédito (tomadores)</option>
              <option value="prestar">Ofrecen capital (prestamistas)</option>
            </select>
          </div>
          <div>
            <label className="font-grotesk text-xs font-semibold text-[var(--color-muted)]">Provincia</label>
            <select
              aria-label="Provincia"
              className="select-minimal mt-1.5"
              value={provincia}
              onChange={(e) => setProvincia(e.target.value as Provincia | "Todas")}
            >
              {provincias.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-grotesk text-xs font-semibold text-[var(--color-muted)]">
              Monto máximo · <span className="font-mono text-[var(--color-ink)]">{usd(montoMax)}</span>
            </label>
            <input
              type="range" min={500} max={7000} step={250} value={montoMax}
              aria-label="Monto máximo" aria-valuetext={usd(montoMax)}
              onChange={(e) => setMontoMax(Number(e.target.value))}
              className="mt-4 w-full accent-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="font-grotesk text-xs font-semibold text-[var(--color-muted)]">
              Score mínimo · <span className="font-mono text-[var(--color-ink)]">{scoreMin}</span>
            </label>
            <input
              type="range" min={300} max={850} step={10} value={scoreMin}
              aria-label="Score mínimo" aria-valuetext={String(scoreMin)}
              onChange={(e) => setScoreMin(Number(e.target.value))}
              className="mt-4 w-full accent-[var(--color-primary)]"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        {/* Lista */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-xs text-[var(--color-muted)]">
              {filtradas.length} resultado{filtradas.length === 1 ? "" : "s"}
            </p>
            <span className="flex items-center gap-1.5 text-xs text-[var(--color-faint)]">
              <Lock size={12} /> Identidad protegida hasta avanzar
            </span>
          </div>
          {filtradas.map(({ s, autor }) => (
            <div
              key={s.id}
              onMouseEnter={() => setSelected(s.id)}
              onClick={() => setSelected(s.id)}
              onFocus={() => setSelected(s.id)}
              tabIndex={0}
              aria-label={`Solicitud de ${autor.nombre} ${autor.apellido[0]}., ${usd(s.monto)}`}
              className={`card-minimal cursor-pointer p-5 transition-all ${
                selected === s.id ? "border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar dentist={autor} size={46} masked />
                  <div>
                    <p className="font-semibold leading-tight">{autor.nombre} {autor.apellido[0]}.</p>
                    <p className="font-mono text-xs text-[var(--color-faint)]">
                      <MapPin size={11} className="-mt-0.5 inline" /> {autor.ciudad}, {autor.provincia} · {s.distanciaKm} km
                    </p>
                    <div className="mt-1.5"><Reputacion valor={autor.reputacion} /></div>
                    {!autor.validado && (
                      <div className="mt-2"><ValidacionBadge validado={false} /></div>
                    )}
                  </div>
                </div>
                <Chip tone={s.tipo === "prestar" ? "green" : "blue"}>
                  {s.tipo === "prestar" ? "Ofrece" : "Busca"}
                </Chip>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="font-display tabular text-3xl">{usd(s.monto)}</p>
                  <p className="text-sm text-[var(--color-muted)]">{s.destino}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold text-[var(--color-primary-dark)]">
                    {pct(s.tasaMin)}–{pct(s.tasaMax)}
                  </p>
                  <p className="font-mono text-xs text-[var(--color-faint)]">{s.plazoMeses} meses</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[var(--color-line)] pt-3">
                <span className="flex items-center gap-1.5 font-mono text-xs text-[var(--color-muted)]">
                  <Gauge size={13} className="text-[var(--color-primary)]" /> Score {autor.score} · {s.publicada}
                </span>
                <Link href={`/app/solicitud/${s.id}`} className="btn-ghost">
                  Ver operación <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
          {filtradas.length === 0 && (
            <div className="card-minimal p-8 text-center text-sm text-[var(--color-muted)]">
              No hay solicitudes con esos filtros. Probá ampliar el monto o bajar el score mínimo.
            </div>
          )}
        </div>

        {/* Mapa + match destacado */}
        <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="card-minimal overflow-hidden p-0">
            <div className="h-[440px]">
              <MatchingMap pins={pins} selectedId={selected} onSelect={setSelected} />
            </div>
          </div>
          <div className="flex items-center gap-5 px-1 text-xs text-[var(--color-muted)]">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#0c6b4f" }} /> Ofrece capital
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#2f6f8f" }} /> Busca crédito
            </span>
          </div>
          {sel && (
            <div className="card-minimal flex items-center gap-5 p-5">
              <ScoreGauge score={sel.autor.score} size={118} />
              <div>
                <p className="eyebrow">Match destacado</p>
                <p className="mt-1.5 font-semibold">
                  {sel.autor.nombre} {sel.autor.apellido[0]}. · <span className="font-mono">{usd(sel.s.monto)}</span>
                </p>
                <p className="text-sm text-[var(--color-muted)]">{sel.s.destino}</p>
                <Link href={`/app/solicitud/${sel.s.id}`} className="btn-primary mt-3">
                  Avanzar con esta operación <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
