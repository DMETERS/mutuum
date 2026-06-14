// Simulación de préstamo. Dos modalidades de repago:
//  - "mensual": cuota fija mensual (sistema francés).
//  - "unico":   un solo pago al final = capital + interés simple.

export type Modalidad = "mensual" | "unico";

export interface Simulacion {
  /** Cuota mensual (modalidad mensual) o pago único al final (modalidad unico). */
  cuota: number;
  /** Total a pagar/recibir a lo largo del plazo. */
  total: number;
  /** Intereses (total − capital). */
  interes: number;
}

/**
 * @param monto capital del préstamo (USD)
 * @param tasaPctMensual tasa de interés mensual en % (ej. 2 = 2%/mes)
 * @param meses plazo en meses
 * @param modalidad esquema de repago
 */
export function simularPrestamo(
  monto: number,
  tasaPctMensual: number,
  meses: number,
  modalidad: Modalidad = "mensual"
): Simulacion {
  const n = Math.max(1, Math.round(meses));
  const i = tasaPctMensual / 100;

  if (modalidad === "unico") {
    const interes = monto * i * n; // interés simple
    const total = monto + interes;
    return { cuota: total, total, interes };
  }

  // Sistema francés (cuota fija)
  const cuota = i === 0 ? monto / n : (monto * i) / (1 - Math.pow(1 + i, -n));
  const total = cuota * n;
  return { cuota, total, interes: total - monto };
}
