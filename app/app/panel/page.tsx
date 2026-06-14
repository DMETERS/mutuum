"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock, Zap, ClipboardCheck, ArrowRight } from "@/components/icons";
import { useUser } from "@/lib/user-context";
import { isAdmin, dentistById } from "@/data/dentists";
import { comisiones as seed } from "@/data/commissions";
import type { Comision } from "@/lib/types";
import { Avatar, Chip, SectionTitle, Note } from "@/components/ui";
import { usd } from "@/lib/format";

function ParteOperacion({ id, rol }: { id: string; rol: string }) {
  const d = dentistById(id);
  if (!d) return null;
  return (
    <div className="flex items-center gap-2">
      <Avatar dentist={d} size={32} />
      <div className="leading-tight">
        <p className="text-sm font-medium">{d.nombre} {d.apellido}</p>
        <p className="font-mono text-[11px] text-[var(--color-faint)]">{rol}</p>
      </div>
    </div>
  );
}

export default function Panel() {
  const { user, ready } = useUser();
  const router = useRouter();
  const [items, setItems] = useState<Comision[]>(seed);

  // Guard: solo operadores del equipo (admin).
  useEffect(() => {
    if (ready && user && !isAdmin(user.id)) router.replace("/app");
  }, [ready, user, router]);

  const fase1 = useMemo(() => items.filter((c) => c.fase === 1), [items]);
  const fase2 = useMemo(() => items.filter((c) => c.fase === 2), [items]);
  const pendientes = fase1.filter((c) => c.estado === "pendiente").length;
  const totalDia = items.reduce((a, c) => a + c.comision, 0);

  const confirmar = (id: string) =>
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, estado: "confirmada" } : c)));

  if (!ready || !user || !isAdmin(user.id)) {
    return <div className="grid place-items-center py-20 text-sm text-[var(--color-muted)]">Acceso restringido al equipo…</div>;
  }

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Panel del equipo"
        title="Confirmación de comisiones"
        desc="Consola interna para destrabar operaciones. La Fase 1 confirma el comprobante a mano; la Fase 2 acredita en automático con un CVU por operación."
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card-minimal p-5">
          <p className="eyebrow">Comisiones del día</p>
          <p className="font-display tabular mt-2 text-4xl text-[var(--color-primary)]">{usd(totalDia)}</p>
        </div>
        <div className="card-minimal p-5">
          <p className="eyebrow flex items-center gap-1.5"><Clock size={13} /> Pendientes (Fase 1)</p>
          <p className="font-display tabular mt-2 text-4xl">{pendientes}</p>
        </div>
        <div className="card-minimal p-5">
          <p className="eyebrow flex items-center gap-1.5"><Zap size={13} className="text-[var(--color-primary)]" /> Auto (Fase 2)</p>
          <p className="font-display tabular mt-2 text-4xl">{fase2.length}</p>
        </div>
      </div>

      {/* Fase 1 — manual */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <ClipboardCheck size={18} className="text-[var(--color-primary)]" />
          <h3 className="font-semibold">Fase 1 · confirmación manual</h3>
          <Chip tone="gray">comprobante + panel</Chip>
        </div>
        <div className="space-y-3">
          {fase1.map((c) => {
            const confirmada = c.estado === "confirmada";
            return (
              <div key={c.id} className="card-minimal flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <ParteOperacion id={c.tomadorId} rol="tomador" />
                  <ArrowRight size={16} className="hidden text-[var(--color-faint)] sm:block" />
                  <ParteOperacion id={c.prestamistaId} rol="prestamista" />
                </div>
                <div className="flex items-center justify-between gap-6">
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold text-[var(--color-primary)]">{usd(c.comision)}</p>
                    <p className="font-mono text-[11px] text-[var(--color-faint)]">de {usd(c.monto)} · {c.hora}</p>
                  </div>
                  {confirmada ? (
                    <Chip tone="green"><Check size={12} strokeWidth={3} /> Confirmada</Chip>
                  ) : c.comprobante ? (
                    <button onClick={() => confirmar(c.id)} className="btn-primary">
                      <Check size={15} /> Confirmar
                    </button>
                  ) : (
                    <Chip tone="gray"><Clock size={12} /> Esperando comprobante</Chip>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Fase 2 — automático */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Zap size={18} className="text-[var(--color-primary)]" />
          <h3 className="font-semibold">Fase 2 · cobro automático</h3>
          <Chip tone="green">CVU por operación</Chip>
        </div>
        <div className="space-y-3">
          {fase2.map((c) => (
            <div key={c.id} className="card-minimal flex flex-col gap-4 p-5 opacity-95 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <ParteOperacion id={c.tomadorId} rol="tomador" />
                <ArrowRight size={16} className="hidden text-[var(--color-faint)] sm:block" />
                <ParteOperacion id={c.prestamistaId} rol="prestamista" />
              </div>
              <div className="flex items-center justify-between gap-6">
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold text-[var(--color-primary)]">{usd(c.comision)}</p>
                  <p className="font-mono text-[11px] text-[var(--color-faint)]">de {usd(c.monto)} · {c.hora}</p>
                </div>
                <Chip tone="green"><Zap size={12} /> Acreditada al instante</Chip>
              </div>
            </div>
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

      <Link href="/app" className="btn-ghost">← Volver al inicio</Link>
    </div>
  );
}
