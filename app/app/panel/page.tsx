"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock, Zap, ClipboardCheck, ArrowRight, IdCard, BadgeCheck } from "@/components/icons";
import { useUser } from "@/lib/user-context";
import { isAdmin, dentistById } from "@/data/dentists";
import { comisiones as seedComisiones } from "@/data/commissions";
import { validacionesPendientes as seedValidaciones } from "@/data/validations";
import type { Comision } from "@/lib/types";
import type { ValidacionPendiente } from "@/data/validations";
import { Avatar, Chip, SectionTitle, Note } from "@/components/ui";
import { usd } from "@/lib/format";

type ValItem = ValidacionPendiente & { resuelto?: "aprobada" | "rechazada" };

function ParteOperacion({ id, rol }: { id: string; rol: string }) {
  const d = dentistById(id);
  if (!d) return null;
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Avatar dentist={d} size={32} />
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-medium">{d.nombre} {d.apellido}</p>
        <p className="font-mono text-[11px] text-[var(--color-faint)]">{rol}</p>
      </div>
    </div>
  );
}

// ── Tarjeta de comisión (responsive) ──────────────────────
// Mobile: partes apiladas (flecha vertical) → monto + acción en fila.
// Desktop (lg): partes en fila a la izquierda · monto + acción a la derecha.
function ComisionCard({ c, action }: { c: Comision; action: ReactNode }) {
  return (
    <div className="card-minimal flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-x-5 sm:gap-y-2">
        <ParteOperacion id={c.tomadorId} rol="tomador" />
        <ArrowRight size={16} className="hidden shrink-0 rotate-90 text-[var(--color-faint)] sm:block sm:rotate-0" />
        <ParteOperacion id={c.prestamistaId} rol="prestamista" />
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-[var(--color-line)] pt-3 sm:gap-6 lg:shrink-0 lg:justify-end lg:border-t-0 lg:pt-0">
        <div className="text-left lg:text-right">
          <p className="font-mono text-sm font-semibold text-[var(--color-primary-dark)]">{usd(c.comision)}</p>
          <p className="font-mono text-[11px] text-[var(--color-faint)]">de {usd(c.monto)} · {c.hora}</p>
        </div>
        {action}
      </div>
    </div>
  );
}

const estadoVal: Record<ValidacionPendiente["estado"], { label: string; tone: "blue" | "amber" | "gray" }> = {
  credencial_subida: { label: "Credencial subida", tone: "blue" },
  auto_pendiente: { label: "Adaptador reintentando", tone: "amber" },
  esperando_credencial: { label: "Esperando credencial", tone: "gray" },
};

export default function Panel() {
  const { user, ready } = useUser();
  const router = useRouter();
  const [comis, setComis] = useState<Comision[]>(seedComisiones);
  const [vals, setVals] = useState<ValItem[]>(seedValidaciones);

  useEffect(() => {
    if (ready && user && !isAdmin(user.id)) router.replace("/app");
  }, [ready, user, router]);

  const fase1 = useMemo(() => comis.filter((c) => c.fase === 1), [comis]);
  const fase2 = useMemo(() => comis.filter((c) => c.fase === 2), [comis]);
  const pendientesC = fase1.filter((c) => c.estado === "pendiente").length;
  const pendientesV = vals.filter((v) => !v.resuelto).length;

  const confirmarComision = (id: string) =>
    setComis((prev) => prev.map((c) => (c.id === id ? { ...c, estado: "confirmada" } : c)));
  const resolverVal = (id: string, r: "aprobada" | "rechazada") =>
    setVals((prev) => prev.map((v) => (v.id === id ? { ...v, resuelto: r } : v)));

  if (!ready || !user || !isAdmin(user.id)) {
    return <div className="grid place-items-center py-20 text-sm text-[var(--color-muted)]">Acceso restringido al equipo…</div>;
  }

  return (
    <div className="space-y-10">
      <SectionTitle
        eyebrow="Panel del equipo"
        title="Operación interna"
        desc="Validación de matrículas pendientes y confirmación de comisiones. Lo que no resuelve la automatización, se aprueba a mano acá."
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card-minimal p-5">
          <p className="eyebrow flex items-center gap-1.5"><IdCard size={13} /> Matrículas a validar</p>
          <p className="font-display tabular mt-2 text-4xl">{pendientesV}</p>
        </div>
        <div className="card-minimal p-5">
          <p className="eyebrow flex items-center gap-1.5"><Clock size={13} /> Comisiones pendientes</p>
          <p className="font-display tabular mt-2 text-4xl">{pendientesC}</p>
        </div>
        <div className="card-minimal p-5">
          <p className="eyebrow flex items-center gap-1.5"><Zap size={13} className="text-[var(--color-primary)]" /> Cobros automáticos</p>
          <p className="font-display tabular mt-2 text-4xl">{fase2.length}</p>
        </div>
      </div>

      {/* ── Validaciones de matrícula ── */}
      <section>
        <div className="mb-2 flex items-center gap-2">
          <IdCard size={18} className="text-[var(--color-primary)]" />
          <h3 className="font-semibold">Validaciones de matrícula</h3>
        </div>
        <p className="mb-4 text-sm text-[var(--color-muted)]">
          Casos que no resolvió la validación automática (REFEPS → adaptador provincial). El
          usuario opera marcado como «pendiente» hasta que se apruebe acá.
        </p>
        <div className="space-y-3">
          {vals.map((v) => {
            const meta = estadoVal[v.estado];
            return (
              <div key={v.id} className="card-minimal flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{v.nombre} {v.apellido}</p>
                    <span className="font-mono text-[11px] text-[var(--color-faint)]">
                      Mat. {v.matricula} · {v.provincia}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{v.detalle}</p>
                  <p className="mt-1 font-mono text-[11px] text-[var(--color-faint)]">{v.hora}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {v.resuelto ? (
                    <Chip tone={v.resuelto === "aprobada" ? "green" : "gray"}>
                      {v.resuelto === "aprobada" ? <><Check size={12} strokeWidth={3} /> Validada</> : "Rechazada"}
                    </Chip>
                  ) : v.estado === "credencial_subida" ? (
                    <>
                      <button onClick={() => resolverVal(v.id, "rechazada")} className="btn-ghost">
                        Rechazar
                      </button>
                      <button onClick={() => resolverVal(v.id, "aprobada")} className="btn-primary">
                        <BadgeCheck size={15} /> Aprobar matrícula
                      </button>
                    </>
                  ) : (
                    <Chip tone={meta.tone}><Clock size={12} /> {meta.label}</Chip>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Comisiones ── */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <ClipboardCheck size={18} className="text-[var(--color-primary)]" />
          <h3 className="font-semibold">Comisiones · Fase 1 (confirmación manual)</h3>
        </div>
        <div className="space-y-3">
          {fase1.map((c) => {
            const confirmada = c.estado === "confirmada";
            return (
              <ComisionCard
                key={c.id}
                c={c}
                action={
                  confirmada ? (
                    <Chip tone="green"><Check size={12} strokeWidth={3} /> Confirmada</Chip>
                  ) : c.comprobante ? (
                    <button onClick={() => confirmarComision(c.id)} className="btn-primary shrink-0">
                      <Check size={15} /> Confirmar
                    </button>
                  ) : (
                    <Chip tone="gray"><Clock size={12} /> Esperando comprobante</Chip>
                  )
                }
              />
            );
          })}
        </div>

        <div className="mb-4 mt-6 flex items-center gap-2">
          <Zap size={18} className="text-[var(--color-primary)]" />
          <h3 className="font-semibold">Comisiones · Fase 2 (cobro automático)</h3>
          <Chip tone="green">CVU por operación</Chip>
        </div>
        <div className="space-y-3">
          {fase2.map((c) => (
            <ComisionCard
              key={c.id}
              c={c}
              action={<Chip tone="green"><Zap size={12} /> Acreditada al instante</Chip>}
            />
          ))}
        </div>
        <div className="mt-4">
          <Note>
            En Fase 2 el proveedor de cobro genera un CVU único por operación, detecta el pago al
            instante y destraba los datos sin intervención humana. El panel queda para auditoría y
            para los casos de Fase 1.
          </Note>
        </div>
      </section>

      <Link href="/acceso" className="btn-ghost">← Cambiar de cuenta</Link>
    </div>
  );
}
