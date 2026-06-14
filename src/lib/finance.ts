// Simulación de préstamo — sistema francés (cuota fija mensual).

export interface Simulacion {
  /** Cuota mensual fija. */
  cuota: number;
  /** Total a pagar/recibir a lo largo del plazo. */
  total: number;
  /** Intereses (total − capital). */
  interes: number;
}

/**
 * Cuota fija por sistema francés.
 * @param monto capital del préstamo (USD)
 * @param tasaPctMensual tasa de interés mensual en % (ej. 4 = 4%/mes)
 * @param meses plazo en meses
 */
export function simularPrestamo(
  monto: number,
  tasaPctMensual: number,
  meses: number
): Simulacion {
  const n = Math.max(1, Math.round(meses));
  const i = tasaPctMensual / 100;
  const cuota = i === 0 ? monto / n : (monto * i) / (1 - Math.pow(1 + i, -n));
  const total = cuota * n;
  return { cuota, total, interes: total - monto };
}
