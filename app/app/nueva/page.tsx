"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowLeftRight, Check, HandCoins, Wallet } from "@/components/icons";
import type { TipoSolicitud } from "@/lib/types";
import { categorias, categoriaById } from "@/data/categories";
import { SectionTitle, Note } from "@/components/ui";
import { LoanSim } from "@/components/LoanSim";
import { usd } from "@/lib/format";

export default function NuevaSolicitud() {
  const [tipo, setTipo] = useState<TipoSolicitud>("tomar");
  const [monto, setMonto] = useState(2000);
  const [tasaMin, setTasaMin] = useState(1.5);
  const [tasaMax, setTasaMax] = useState(2.2);
  const [plazo, setPlazo] = useState(6);
  const [categoriaId, setCategoriaId] = useState<string>("");
  const [destino, setDestino] = useState("");
  const [enviada, setEnviada] = useState(false);

  const cat = categoriaById(categoriaId);
  // El monto no puede superar el precio de referencia del insumo (cuando hay categoría).
  const montoMax = tipo === "tomar" && cat ? cat.precioRef : 10000;

  if (enviada) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="card-minimal animate-in p-9 text-center">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <Check size={30} strokeWidth={2.4} />
          </div>
          <h1 className="font-display text-3xl">Solicitud publicada</h1>
          <p className="mt-3 text-[var(--color-muted)]">
            Tu solicitud para {tipo === "prestar" ? "prestar" : "tomar"} {usd(monto)} ya está
            activa. El motor empezará a sugerir matches con colegas del NEA.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Link href="/app/matching" className="btn-primary">
              Ver matches <ArrowRight size={16} />
            </Link>
            <Link href="/app" className="btn-secondary">Volver al inicio</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <SectionTitle
        eyebrow="Nueva solicitud"
        title="Publicá una operación"
        desc="Cargá los datos. El capital viaja directo entre las partes; Mutuum solo documenta y cobra su comisión."
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setEnviada(true);
        }}
        className="card-minimal space-y-7 p-8"
      >
        {/* Tipo */}
        <div>
          <label className="font-grotesk text-sm font-semibold">¿Qué querés hacer?</label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {([
              { t: "tomar" as TipoSolicitud, icon: HandCoins, title: "Tomar crédito", sub: "Necesito financiar algo" },
              { t: "prestar" as TipoSolicitud, icon: Wallet, title: "Prestar capital", sub: "Tengo excedente para colocar" },
            ]).map(({ t, icon: Icon, title, sub }) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(t)}
                className={`flex items-start gap-3 rounded-[var(--radius-lg)] border p-4 text-left transition-all ${
                  tipo === t
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-tint)] ring-1 ring-[var(--color-primary)]"
                    : "border-[var(--color-line-strong)] hover:border-[var(--color-ink-soft)]"
                }`}
              >
                <Icon size={20} className={tipo === t ? "text-[var(--color-primary)]" : "text-[var(--color-faint)]"} />
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="block text-xs text-[var(--color-muted)]">{sub}</span>
                </span>
              </button>
            ))}
          </div>
          <p className="mt-2.5 flex items-center gap-1.5 text-xs text-[var(--color-faint)]">
            <ArrowLeftRight size={12} className="shrink-0 text-[var(--color-primary)]" />
            Es la misma cuenta: elegís el rol en cada operación.
          </p>
        </div>

        {/* Monto */}
        <div>
          <label className="font-grotesk text-sm font-semibold">Monto</label>
          <p className="font-display tabular text-3xl text-[var(--color-primary)]">{usd(monto)}</p>
          <input
            type="range" min={500} max={montoMax} step={250} value={Math.min(monto, montoMax)}
            aria-label="Monto" aria-valuetext={usd(monto)}
            onChange={(e) => setMonto(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--color-primary)]"
          />
        </div>

        {/* Tasa + plazo */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <label className="font-grotesk block whitespace-nowrap text-xs font-semibold text-[var(--color-muted)]">
              Tasa mín. <span className="text-[var(--color-faint)]">%/mes</span>
            </label>
            <input type="number" min={0} max={tasaMax} step={0.1} value={tasaMin} onChange={(e) => setTasaMin(Number(e.target.value))} className="input-minimal mt-1.5 font-mono" />
          </div>
          <div>
            <label className="font-grotesk block whitespace-nowrap text-xs font-semibold text-[var(--color-muted)]">
              Tasa máx. <span className="text-[var(--color-faint)]">%/mes</span>
            </label>
            <input type="number" min={tasaMin} step={0.1} value={tasaMax} onChange={(e) => setTasaMax(Number(e.target.value))} className="input-minimal mt-1.5 font-mono" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="font-grotesk block whitespace-nowrap text-xs font-semibold text-[var(--color-muted)]">
              Plazo <span className="text-[var(--color-faint)]">meses</span>
            </label>
            <input type="number" min={1} max={36} value={plazo} onChange={(e) => setPlazo(Number(e.target.value))} className="input-minimal mt-1.5 font-mono" />
          </div>
        </div>

        {/* Simulación en vivo */}
        <LoanSim monto={monto} tasaMin={tasaMin} tasaMax={tasaMax} plazo={plazo} perspectiva={tipo} />

        {/* Categoría + destino (solo tomar) */}
        {tipo === "tomar" && (
          <>
            <div>
              <label className="font-grotesk text-sm font-semibold">Destino del préstamo</label>
              <select
                aria-label="Destino del préstamo"
                className="select-minimal mt-1.5"
                value={categoriaId}
                onChange={(e) => {
                  const id = e.target.value;
                  setCategoriaId(id);
                  const c = categoriaById(id);
                  if (c && monto > c.precioRef) setMonto(c.precioRef);
                }}
              >
                <option value="">Elegí una categoría…</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.grupo} · {c.nombre} (ref. {usd(c.precioRef)})</option>
                ))}
              </select>
            </div>
            {cat && (
              <Note>
                Tope por destino: el monto no puede superar el precio de referencia de{" "}
                <strong>{cat.nombre}</strong> ({usd(cat.precioRef)}). No se puede pedir más de lo
                que cuesta el insumo.
              </Note>
            )}
          </>
        )}

        <div>
          <label className="font-grotesk text-sm font-semibold">Justificación / detalle</label>
          <textarea
            value={destino} onChange={(e) => setDestino(e.target.value)} rows={3}
            placeholder="Ej: equipo de rayos X portátil para el consultorio nuevo"
            className="input-minimal mt-1.5 resize-none"
          />
        </div>

        <button type="submit" className="btn-primary w-full justify-center">
          Publicar solicitud <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}
