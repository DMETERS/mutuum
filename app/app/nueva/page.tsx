"use client";

import Link from "next/link";
import { useState } from "react";
import type { TipoSolicitud } from "@/lib/types";
import { categorias, categoriaById } from "@/data/categories";
import { SectionTitle, Note } from "@/components/ui";
import { usd } from "@/lib/format";

export default function NuevaSolicitud() {
  const [tipo, setTipo] = useState<TipoSolicitud>("tomar");
  const [monto, setMonto] = useState(2000);
  const [tasaMin, setTasaMin] = useState(3.5);
  const [tasaMax, setTasaMax] = useState(5);
  const [plazo, setPlazo] = useState(6);
  const [categoriaId, setCategoriaId] = useState<string>("");
  const [destino, setDestino] = useState("");
  const [enviada, setEnviada] = useState(false);

  const cat = categoriaById(categoriaId);
  const desvio =
    cat && cat.precioRef > 0 ? Math.round(((monto - cat.precioRef) / cat.precioRef) * 100) : null;

  if (enviada) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="card-minimal animate-in p-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-[var(--color-primary-soft)] text-2xl text-[var(--color-primary)]">
            ✓
          </div>
          <h1 className="text-2xl font-bold">Solicitud publicada</h1>
          <p className="mt-2 text-[var(--color-gray-600)]">
            Tu solicitud para {tipo === "prestar" ? "prestar" : "tomar"} {usd(monto)} ya está
            activa. El motor empezará a sugerir matches con colegas del NEA.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/app/matching" className="btn-primary">
              Ver matches →
            </Link>
            <Link href="/app" className="btn-secondary">
              Volver al inicio
            </Link>
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

      <div className="card-minimal space-y-6 p-7">
        {/* Tipo */}
        <div>
          <label className="font-grotesk text-sm font-semibold">¿Qué querés hacer?</label>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {(["tomar", "prestar"] as TipoSolicitud[]).map((t) => (
              <button
                key={t}
                onClick={() => setTipo(t)}
                className={`rounded-[var(--radius-lg)] border p-4 text-left transition-colors ${
                  tipo === t
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                    : "border-[var(--color-gray-200)] hover:border-[var(--color-gray-300)]"
                }`}
              >
                <p className="font-semibold">{t === "tomar" ? "Tomar crédito" : "Prestar capital"}</p>
                <p className="text-xs text-[var(--color-gray-600)]">
                  {t === "tomar"
                    ? "Necesito financiar algo"
                    : "Tengo excedente para colocar"}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Monto */}
        <div>
          <label className="font-grotesk text-sm font-semibold">
            Monto · {usd(monto)}
          </label>
          <input
            type="range"
            min={500}
            max={10000}
            step={250}
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--color-primary)]"
          />
        </div>

        {/* Tasa + plazo */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="font-grotesk text-xs font-semibold text-[var(--color-gray-500)]">
              Tasa mín. (% mensual)
            </label>
            <input
              type="number"
              step={0.1}
              value={tasaMin}
              onChange={(e) => setTasaMin(Number(e.target.value))}
              className="input-minimal mt-1 font-mono"
            />
          </div>
          <div>
            <label className="font-grotesk text-xs font-semibold text-[var(--color-gray-500)]">
              Tasa máx. (% mensual)
            </label>
            <input
              type="number"
              step={0.1}
              value={tasaMax}
              onChange={(e) => setTasaMax(Number(e.target.value))}
              className="input-minimal mt-1 font-mono"
            />
          </div>
          <div>
            <label className="font-grotesk text-xs font-semibold text-[var(--color-gray-500)]">
              Plazo (meses)
            </label>
            <input
              type="number"
              value={plazo}
              onChange={(e) => setPlazo(Number(e.target.value))}
              className="input-minimal mt-1 font-mono"
            />
          </div>
        </div>

        {/* Categoría + destino (solo tomar) */}
        {tipo === "tomar" && (
          <>
            <div>
              <label className="font-grotesk text-sm font-semibold">Destino del préstamo</label>
              <select
                className="select-minimal mt-1"
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
              >
                <option value="">Elegí una categoría…</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.grupo} · {c.nombre} (ref. {usd(c.precioRef)})
                  </option>
                ))}
              </select>
            </div>
            {cat && desvio !== null && (
              <Note>
                Precio de referencia para <strong>{cat.nombre}</strong>: {usd(cat.precioRef)}.{" "}
                {Math.abs(desvio) <= 10
                  ? "Tu monto está alineado con el mercado."
                  : desvio > 10
                    ? `Tu monto está ${desvio}% por encima de la referencia — conviene justificarlo en el chat.`
                    : `Tu monto está ${Math.abs(desvio)}% por debajo de la referencia.`}
              </Note>
            )}
          </>
        )}

        <div>
          <label className="font-grotesk text-sm font-semibold">Justificación / detalle</label>
          <textarea
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            rows={3}
            placeholder="Ej: equipo de rayos X portátil para el consultorio nuevo"
            className="input-minimal mt-1 resize-none"
          />
        </div>

        <button onClick={() => setEnviada(true)} className="btn-primary w-full justify-center">
          Publicar solicitud
        </button>
      </div>
    </div>
  );
}
