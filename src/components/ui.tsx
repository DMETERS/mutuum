import type { ReactNode } from "react";
import {
  Star,
  StarSolid,
  Info,
  BadgeCheck,
  IdCard,
  ScanFace,
  Fingerprint,
  HeartHandshake,
  UserRound,
  Clock,
  type IconType,
} from "@/components/icons";
import type { Dentist, Verificaciones } from "@/lib/types";
import { iniciales } from "@/lib/format";

// ── Avatar con foto (fallback a iniciales) y anillo de marca ──
// `masked` = identidad protegida (descubrimiento): sin foto ni iniciales reales.
export function Avatar({
  dentist,
  size = 44,
  masked = false,
}: {
  dentist: Dentist;
  size?: number;
  masked?: boolean;
}) {
  if (masked) {
    return (
      <div
        aria-hidden
        style={{ width: size, height: size }}
        className="gradient-mutuum flex shrink-0 items-center justify-center rounded-full text-white shadow-[var(--shadow-sm)] ring-2 ring-[var(--color-surface)]"
      >
        <UserRound size={size * 0.5} />
      </div>
    );
  }
  if (dentist.avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={dentist.avatar}
        alt={`${dentist.nombre} ${dentist.apellido}`}
        width={size}
        height={size}
        loading="lazy"
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full object-cover shadow-[var(--shadow-sm)] ring-2 ring-[var(--color-surface)] outline outline-1 outline-[var(--color-primary-soft)]"
      />
    );
  }
  return (
    <div
      aria-hidden
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      className="gradient-mutuum font-grotesk relative flex shrink-0 items-center justify-center rounded-full font-semibold tracking-wide text-white shadow-[var(--shadow-sm)] ring-1 ring-[rgba(255,255,255,0.4)]"
    >
      {iniciales(dentist.nombre, dentist.apellido)}
    </div>
  );
}

// ── Chip de estado / etiqueta ───────────────────────────
const chipClass: Record<string, string> = {
  green: "chip-primary",
  gray: "chip-neutral",
  brass: "chip-brass",
  blue: "bg-sky-50 text-sky-800 border border-sky-100",
  amber: "border border-amber-200 bg-amber-50 text-amber-800",
};

export function Chip({
  children,
  tone = "gray",
  icon: Icon,
}: {
  children: ReactNode;
  tone?: keyof typeof chipClass;
  icon?: IconType;
}) {
  return (
    <span className={`chip ${chipClass[tone]}`}>
      {Icon && <Icon size={12} strokeWidth={2.4} />}
      {children}
    </span>
  );
}

// ── Nota / aclaración ───────────────────────────────────
export function Note({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-primary-tint)] px-4 py-3 text-sm text-[var(--color-ink-soft)]">
      <Info size={16} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
      <div>{children}</div>
    </div>
  );
}

// ── Reputación en estrellas ─────────────────────────────
export function Reputacion({ valor, size = 13 }: { valor: number; size?: number }) {
  const full = Math.round(valor);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) =>
          i < full ? (
            <StarSolid key={i} size={size} className="text-[var(--color-brass)]" />
          ) : (
            <Star key={i} size={size} className="text-[var(--color-line-strong)]" />
          )
        )}
      </span>
      <span className="font-mono text-xs text-[var(--color-muted)]">{valor.toFixed(1)}</span>
    </span>
  );
}

// ── Insignia genérica ───────────────────────────────────
export function Insignia({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-[var(--color-paper)] px-2.5 py-1 text-xs font-medium text-[var(--color-ink-soft)]">
      <BadgeCheck size={13} className="text-[var(--color-primary)]" />
      {children}
    </span>
  );
}

// ── Verificaciones ──────────────────────────────────────
const verifMeta: Record<keyof Verificaciones, { label: string; icon: IconType }> = {
  matricula: { label: "Matrícula vigente", icon: IdCard },
  renaper: { label: "Identidad (Renaper)", icon: ScanFace },
  kyc: { label: "KYC biométrico", icon: Fingerprint },
  vouching: { label: "Aval de colega", icon: HeartHandshake },
};

export function Verificado({ v }: { v: Verificaciones }) {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(verifMeta) as (keyof Verificaciones)[]).map((k) => {
        const { label, icon: Icon } = verifMeta[k];
        const ok = v[k];
        return (
          <span
            key={k}
            className={`chip ${ok ? "chip-primary" : "chip-neutral opacity-60"}`}
          >
            <Icon size={12} strokeWidth={2.2} />
            {label}
          </span>
        );
      })}
    </div>
  );
}

// ── Badge de validación de matrícula ────────────────────
export function ValidacionBadge({
  validado,
  via,
}: {
  validado: boolean;
  via?: string;
}) {
  if (validado) {
    return (
      <span className="chip chip-primary">
        <BadgeCheck size={12} strokeWidth={2.2} />
        Matrícula verificada{via ? ` · ${via}` : ""}
      </span>
    );
  }
  return (
    <span className="chip border border-amber-200 bg-amber-50 text-amber-800">
      <Clock size={12} strokeWidth={2.2} />
      Pendiente de validación
    </span>
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
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h2 className="font-display text-[1.7rem] leading-tight text-[var(--color-ink)]">{title}</h2>
      {desc && <p className="mt-2 max-w-2xl text-sm text-[var(--color-muted)]">{desc}</p>}
    </div>
  );
}
