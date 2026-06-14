import { simularPrestamo } from "@/lib/finance";
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
  const lo = simularPrestamo(monto, tasaMin, plazo);
  const hi = simularPrestamo(monto, tasaMax, plazo);
  const esTomar = perspectiva === "tomar";

  const rango = (a: number, b: number) =>
    Math.round(a) === Math.round(b) ? usd(a) : `${usd(a)} – ${usd(b)}`;

  const items: { label: string; valor: string; fuerte?: boolean }[] = [
    {
      label: esTomar ? "Pagás por mes" : "Cobrás por mes",
      valor: rango(lo.cuota, hi.cuota),
      fuerte: true,
    },
    {
      label: esTomar ? "Total a devolver" : "Total a recibir",
      valor: rango(lo.total, hi.total),
    },
    {
      label: esTomar ? "Costo en intereses" : "Ganás en intereses",
      valor: rango(lo.interes, hi.interes),
    },
  ];

  return (
    <div className="card-minimal p-6">
      <div className="flex items-center justify-between">
        <p className="eyebrow flex items-center gap-1.5">
          <Calculator size={13} /> Simulación
        </p>
        <span className="font-mono text-xs text-[var(--color-faint)]">{plazo} meses</span>
      </div>
      <p className="mt-2 text-xs text-[var(--color-muted)]">
        {esTomar
          ? "Lo que pagarías si tomás este préstamo."
          : "Lo que cobrarías si prestás este monto."}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.label}
            className={`rounded-[var(--radius-lg)] p-4 ${
              it.fuerte ? "bg-[var(--color-primary-tint)]" : "bg-[var(--color-paper-2)]"
            }`}
          >
            <p className="text-xs text-[var(--color-muted)]">{it.label}</p>
            <p
              className={`font-display tabular mt-0.5 text-2xl ${
                it.fuerte ? "text-[var(--color-primary-dark)]" : "text-[var(--color-ink)]"
              }`}
            >
              {it.valor}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-[var(--color-faint)]">
        Estimación con sistema francés (cuota fija mensual), tasa{" "}
        {tasaMin === tasaMax ? pct(tasaMin) : `${pct(tasaMin)}–${pct(tasaMax)}`} mensual. El
        capital del préstamo viaja directo entre las partes; Mutuum solo cobra su comisión.
      </p>
    </div>
  );
}
