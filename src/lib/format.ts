// Helpers de formato y scoring (demo).

export const usd = (n: number): string =>
  "USD " + n.toLocaleString("es-AR", { maximumFractionDigits: 0 });

export const pct = (n: number): string =>
  n.toLocaleString("es-AR", { maximumFractionDigits: 1 }) + "%";

export const iniciales = (nombre: string, apellido: string): string =>
  (nombre[0] ?? "") + (apellido[0] ?? "");

/** Categoría cualitativa del score crediticio 300–850. */
export function scoreBand(score: number): {
  label: string;
  color: string;
  pct: number;
} {
  const p = Math.max(0, Math.min(1, (score - 300) / 550));
  if (score >= 750) return { label: "Excelente", color: "var(--color-success)", pct: p };
  if (score >= 670) return { label: "Bueno", color: "var(--color-primary-light)", pct: p };
  if (score >= 600) return { label: "Aceptable", color: "var(--color-warning)", pct: p };
  return { label: "A revisar", color: "var(--color-danger)", pct: p };
}

/** Estrellas en texto para una reputación 0–5. */
export function estrellas(rep: number): string {
  const full = Math.round(rep);
  return "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full);
}
