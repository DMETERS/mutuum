import type { ReactNode } from "react";
import type { Dentist, Verificaciones } from "@/lib/types";
import { iniciales, estrellas } from "@/lib/format";

// ── Avatar con iniciales ────────────────────────────────
export function Avatar({
  dentist,
  size = 44,
}: {
  dentist: Dentist;
  size?: number;
}) {
  return (
    <div
      aria-hidden
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className="gradient-mutuum font-grotesk flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
    >
      {iniciales(dentist.nombre, dentist.apellido)}
    </div>
  );
}

// ── Chip de estado / etiqueta ───────────────────────────
const chipTones: Record<string, string> = {
  green: "bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)]",
  gray: "bg-[var(--color-gray-100)] text-[var(--color-gray-700)]",
  amber: "bg-amber-100 text-amber-800",
  blue: "bg-sky-100 text-sky-800",
};

export function Chip({
  children,
  tone = "gray",
}: {
  children: ReactNode;
  tone?: keyof typeof chipTones;
}) {
  return <span className={`chip ${chipTones[tone]}`}>{children}</span>;
}

// ── Nota / aclaración (estilo Dmeter) ───────────────────
export function Note({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[var(--radius-lg)] border-l-2 border-[var(--color-primary)] bg-[var(--color-gray-50)] px-4 py-3 text-sm text-[var(--color-gray-700)]">
      {children}
    </div>
  );
}

// ── Reputación en estrellas ─────────────────────────────
export function Reputacion({ valor }: { valor: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span className="tracking-tight text-[var(--color-warning)]">{estrellas(valor)}</span>
      <span className="font-mono text-xs text-[var(--color-gray-500)]">{valor.toFixed(1)}</span>
    </span>
  );
}

// ── Insignia genérica ───────────────────────────────────
export function Insignia({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-gray-200)] px-2.5 py-1 text-xs text-[var(--color-gray-600)]">
      <span className="text-[var(--color-primary)]">◆</span>
      {children}
    </span>
  );
}

// ── Verificaciones (matrícula / Renaper / KYC / vouching) ─
const labels: Record<keyof Verificaciones, string> = {
  matricula: "Matrícula vigente",
  renaper: "Identidad (Renaper)",
  kyc: "KYC biométrico",
  vouching: "Aval de colega",
};

export function Verificado({ v }: { v: Verificaciones }) {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(labels) as (keyof Verificaciones)[]).map((k) => (
        <span
          key={k}
          className={`chip ${
            v[k]
              ? "bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)]"
              : "bg-[var(--color-gray-100)] text-[var(--color-gray-400)]"
          }`}
        >
          {v[k] ? "✓" : "·"} {labels[k]}
        </span>
      ))}
    </div>
  );
}

// ── Encabezado de sección ───────────────────────────────
export function SectionTitle({
  eyebrow,
  title,
  desc,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="font-grotesk mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-bold text-[var(--color-ink)]">{title}</h2>
      {desc && <p className="mt-1 max-w-2xl text-sm text-[var(--color-gray-600)]">{desc}</p>}
    </div>
  );
}
