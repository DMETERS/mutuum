"use client";

import { useState } from "react";
import { simularPrestamo, type Modalidad } from "@/lib/finance";
import { usd, pct } from "@/lib/format";
import { Calculator } from "@/components/icons";
import type { TipoSolicitud } from "@/lib/types";

// Simulación de pago/cobro de un préstamo.
// `perspectiva` = qué hace el usuario que mira: "tomar" (paga) o "prestar" (cobra).
export function LoanSim({
  monto,
  tasaMin,
  tasaMax,
  plazo,
  perspectiva,
}: {
  monto: number;
  tasaMin: number;
  tasaMax: number;
  plazo: number;
  perspectiva: TipoSolicitud;
}) {
  const [modalidad, setModalidad] = useState<Modalidad>("mensual");
  const lo = simularPrestamo(monto, tasaMin, plazo, modalidad);
  const hi = simularPrestamo(monto, tasaMax, plazo, modalidad);
  const esTomar = perspectiva === "tomar";
  const esMensual = modalidad === "mensual";

  const rango = (a: number, b: number) =>
    Math.round(a) === Math.round(b) ? usd(a) : `${usd(a)} – ${usd(b)}`;

  const principal = esMensual
    ? {
        label: esTomar ? "Pagás por mes" : "Cobrás por mes",
        valor: rango(lo.cuota, hi.cuota),
        sub: `durante ${plazo} meses`,
      }
    : {
        label: esTomar ? "Pagás al final" : "Cobrás al final",
        valor: rango(lo.total, hi.total),
        sub: `en un solo pago a ${plazo} meses`,
      };

  const items = [
    principal,
    esMensual
      ? { label: esTomar ? "Total a devolver" : "Total a recibir", valor: rango(lo.total, hi.total) }
      : { label: "Capital", valor: usd(monto) },
    {
      label: esTomar ? "Costo en intereses" : "Ganás en intereses",
      valor: rango(lo.interes, hi.interes),
    },
  ];

  return (
    <div className="card-minimal p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow flex items-center gap-1.5">
          <Calculator size={13} /> Simulación
        </p>
        {/* Selector de modalidad de repago */}
        <div className="inline-flex rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-paper-2)] p-1 text-xs">
          {(
            [
              { k: "mensual" as Modalidad, label: "Cuota mensual" },
              { k: "unico" as Modalidad, label: "Pago único" },
            ]
          ).map((m) => (
            <button
              key={m.k}
              type="button"
              onClick={() => setModalidad(m.k)}
              className={`font-grotesk rounded-[var(--radius-sm)] px-3 py-1.5 font-semibold transition-colors ${
                modalidad === m.k
                  ? "bg-[var(--color-surface)] text-[var(--color-primary-dark)] shadow-[var(--shadow-xs)]"
                  : "text-[var(--color-muted)]"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-2 text-xs text-[var(--color-muted)]">
        {esTomar
          ? "Lo que pagarías si tomás este préstamo."
          : "Lo que cobrarías si prestás este monto."}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {items.map((it, idx) => (
          <div
            key={it.label}
            className={`rounded-[var(--radius-lg)] p-4 ${
              idx === 0 ? "bg-[var(--color-primary-tint)]" : "bg-[var(--color-paper-2)]"
            }`}
          >
            <p className="text-xs text-[var(--color-muted)]">{it.label}</p>
            <p
              className={`font-display tabular mt-0.5 text-2xl ${
                idx === 0 ? "text-[var(--color-primary-dark)]" : "text-[var(--color-ink)]"
              }`}
            >
              {it.valor}
            </p>
            {idx === 0 && "sub" in it && it.sub && (
              <p className="mt-0.5 text-[11px] text-[var(--color-faint)]">{it.sub}</p>
            )}
          </div>
        ))}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-[var(--color-faint)]">
        {esMensual
          ? "Estimación con sistema francés (cuota fija mensual)"
          : "Pago único al final: capital + interés simple"}
        , tasa {tasaMin === tasaMax ? pct(tasaMin) : `${pct(tasaMin)}–${pct(tasaMax)}`} mensual.
        El capital del préstamo viaja directo entre las partes; Mutuum solo cobra su comisión.
      </p>
    </div>
  );
}
