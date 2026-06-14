"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft, ArrowRight, Send, ScrollText, Upload, Check, Lock, Gauge, ShieldCheck, FileSignature,
  Zap, TrendingDown,
} from "@/components/icons";
import { useUser } from "@/lib/user-context";
import { solicitudById } from "@/data/requests";
import { dentistById } from "@/data/dentists";
import { mensajesDeSolicitud } from "@/data/messages";
import type { Mensaje } from "@/lib/types";
import { Avatar, Reputacion, Verificado, Chip, Note, SectionTitle } from "@/components/ui";
import { ScoreGauge } from "@/components/ScoreGauge";
import { usd, pct } from "@/lib/format";

type Etapa = "evaluando" | "acordado" | "contrato" | "comprobante" | "cerrada";

const COMISION_PCT = 0.02;
const CVU_INSTITUCIONAL = "0000003100099999999999";
const ORDER: Etapa[] = ["evaluando", "acordado", "contrato", "comprobante", "cerrada"];

export default function DetalleOperacion() {
  const params = useParams<{ id: string }>();
  const { user } = useUser();
  const solicitud = solicitudById(params.id);

  const [etapa, setEtapa] = useState<Etapa>("evaluando");
  const [cobroModo, setCobroModo] = useState<"auto" | "manual">("auto");
  const [texto, setTexto] = useState("");
  const [chat, setChat] = useState<Mensaje[]>(solicitud ? mensajesDeSolicitud(solicitud.id) : []);

  if (!solicitud) {
    return (
      <div className="card-minimal p-8 text-center">
        <p className="text-[var(--color-muted)]">No encontramos esa solicitud.</p>
        <Link href="/app/matching" className="btn-primary mt-4">Volver al matching</Link>
      </div>
    );
  }

  const autor = dentistById(solicitud.autorId)!;
  const comision = Math.round(solicitud.monto * COMISION_PCT);
  const revelado = etapa !== "evaluando";

  const enviar = () => {
    if (!texto.trim() || !user) return;
    setChat((prev) => [
      ...prev,
      { id: `m-${prev.length + 1}`, solicitudId: solicitud.id, autorId: user.id, texto: texto.trim(), hora: "ahora" },
    ]);
    setTexto("");
  };

  return (
    <div className="space-y-6">
      <Link href="/app/matching" className="btn-ghost">
        <ArrowLeft size={15} /> Volver al matching
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Columna principal */}
        <div className="space-y-6">
          {/* Cabecera */}
          <div className="card-minimal p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar dentist={autor} size={58} />
                <div>
                  <p className="flex items-center gap-1.5 font-semibold">
                    {revelado ? `${autor.nombre} ${autor.apellido}` : `${autor.nombre} ${autor.apellido[0]}.`}
                    {!revelado && <Lock size={13} className="text-[var(--color-faint)]" />}
                  </p>
                  <p className="font-mono text-xs text-[var(--color-faint)]">
                    {revelado
                      ? `Mat. ${autor.matricula} · ${autor.ciudad}, ${autor.provincia}`
                      : `${autor.provincia} · datos completos al acordar`}
                  </p>
                  <div className="mt-1.5"><Reputacion valor={autor.reputacion} /></div>
                </div>
              </div>
              <Chip tone={solicitud.tipo === "prestar" ? "green" : "blue"}>
                {solicitud.tipo === "prestar" ? "Ofrece capital" : "Busca crédito"}
              </Chip>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-[var(--color-line)] pt-5">
              <div>
                <p className="font-display tabular text-3xl">{usd(solicitud.monto)}</p>
                <p className="text-xs text-[var(--color-faint)]">Monto</p>
              </div>
              <div>
                <p className="font-display tabular text-3xl">{pct(solicitud.tasaMin)}–{pct(solicitud.tasaMax)}</p>
                <p className="text-xs text-[var(--color-faint)]">Tasa mensual</p>
              </div>
              <div>
                <p className="font-display tabular text-3xl">{solicitud.plazoMeses}</p>
                <p className="text-xs text-[var(--color-faint)]">Meses</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-[var(--color-muted)]">{solicitud.destino}</p>
          </div>

          {/* Referencia de mercado (Fase 2) */}
          <div className="card-minimal p-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold">
                <TrendingDown size={18} className="text-[var(--color-primary)]" /> Referencia de mercado
              </h3>
              <Chip tone="green"><Zap size={11} /> Fase 2</Chip>
            </div>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              Tasa mensual de esta operación vs. el mercado formal. Operar por Mutuum conviene a
              ambas partes.
            </p>
            <div className="mt-4 space-y-2.5">
              {[
                { label: "Mutuum · esta operación", tasa: solicitud.tasaMin, fuerte: true },
                { label: "Banco · préstamo personal", tasa: 9, fuerte: false },
                { label: "Financiera", tasa: 13, fuerte: false },
              ].map((r) => (
                <div key={r.label} className="flex items-center gap-3">
                  <span className="w-44 shrink-0 text-xs text-[var(--color-muted)]">{r.label}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-[var(--color-paper-2)]">
                    <div
                      className={`h-full rounded-full ${r.fuerte ? "gradient-mutuum" : "bg-[var(--color-line-strong)]"}`}
                      style={{ width: `${Math.min(100, (r.tasa / 13) * 100)}%` }}
                    />
                  </div>
                  <span className={`w-14 text-right font-mono text-xs ${r.fuerte ? "font-semibold text-[var(--color-primary)]" : "text-[var(--color-muted)]"}`}>
                    {pct(r.tasa)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat trazable */}
          <div className="card-minimal flex flex-col p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Chat de la operación</h3>
              <Chip tone="gray"><Lock size={11} /> trazable · inmutable</Chip>
            </div>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              Cada mensaje queda con sello de tiempo y no puede editarse ni borrarse: sirve como
              evidencia legal.
            </p>

            <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
              {chat.map((m) => {
                const mio = m.autorId === user?.id;
                return (
                  <div key={m.id} className={`flex ${mio ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-[var(--radius-lg)] px-4 py-2.5 text-sm ${
                        mio
                          ? "gradient-mutuum text-white shadow-[var(--shadow-sm)]"
                          : "bg-[var(--color-paper-2)] text-[var(--color-ink)]"
                      }`}
                    >
                      <p>{m.texto}</p>
                      <p className={`mt-1 font-mono text-[10px] ${mio ? "text-white/70" : "text-[var(--color-faint)]"}`}>
                        {m.hora}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && enviar()}
                placeholder="Escribí un mensaje…"
                className="input-minimal"
              />
              <button onClick={enviar} className="btn-primary" aria-label="Enviar">
                <Send size={16} />
              </button>
            </div>
          </div>

          {/* Contrato */}
          {(etapa === "contrato" || etapa === "comprobante" || etapa === "cerrada") && (
            <div className="card-minimal animate-in p-6">
              <SectionTitle title="Contrato entre partes" />
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-line-strong)] bg-[var(--color-paper-2)] p-5 font-mono text-xs leading-relaxed text-[var(--color-ink-soft)]">
                <span className="flex items-center gap-2 font-semibold text-[var(--color-ink)]">
                  <FileSignature size={14} className="text-[var(--color-brass)]" /> CONTRATO DE MUTUO — {usd(solicitud.monto)}
                </span>
                <br />
                Prestamista: {solicitud.tipo === "prestar" ? `${autor.nombre} ${autor.apellido}` : `${user?.nombre} ${user?.apellido}`}
                <br />
                Tomador: {solicitud.tipo === "tomar" ? `${autor.nombre} ${autor.apellido}` : `${user?.nombre} ${user?.apellido}`}
                <br />
                Tasa: {pct(solicitud.tasaMin)} mensual · Plazo: {solicitud.plazoMeses} meses
                <br />
                Destino: {solicitud.destino}
                <br />— Generado por Mutuum sobre la estructura legal provista por el cliente.
                El chat de esta operación integra el contrato como evidencia.
              </div>
              <div className="mt-4">
                <Note>
                  El texto legal del contrato y los T&amp;C los provee un abogado del cliente; Mutuum
                  lo instrumenta y lo completa con los datos de la operación.
                </Note>
              </div>
            </div>
          )}

          {/* Cobro de comisión */}
          {(etapa === "comprobante" || etapa === "cerrada") && (
            <div className="card-minimal animate-in p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold">Cobro de la comisión</h3>
                {/* Toggle modo de cobro */}
                <div className="inline-flex rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-paper-2)] p-1 text-xs">
                  {([
                    { k: "auto" as const, label: "Fase 2 · Automático" },
                    { k: "manual" as const, label: "Fase 1 · Manual" },
                  ]).map((m) => (
                    <button
                      key={m.k}
                      onClick={() => setCobroModo(m.k)}
                      disabled={etapa === "cerrada"}
                      className={`font-grotesk rounded-[var(--radius-sm)] px-3 py-1.5 font-semibold transition-colors disabled:opacity-60 ${
                        cobroModo === m.k ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-[var(--shadow-xs)]" : "text-[var(--color-muted)]"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[var(--radius-lg)] bg-[var(--color-primary-tint)] p-4">
                  <p className="text-xs text-[var(--color-muted)]">Comisión Mutuum (2%)</p>
                  <p className="font-display tabular text-3xl text-[var(--color-primary)]">{usd(comision)}</p>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    Sobre la operación, no sobre el capital (que va directo entre las partes).
                  </p>
                </div>
                {cobroModo === "manual" ? (
                  <div className="rounded-[var(--radius-lg)] bg-[var(--color-paper-2)] p-4">
                    <p className="text-xs text-[var(--color-muted)]">CVU institucional</p>
                    <p className="font-mono text-sm font-semibold">{CVU_INSTITUCIONAL}</p>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      Transferí la comisión y subí el comprobante; el equipo lo confirma desde el
                      panel y recién ahí se destraban los datos.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-[var(--radius-lg)] bg-[var(--color-paper-2)] p-4">
                    <p className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                      <Zap size={12} className="text-[var(--color-primary)]" /> CVU único de esta operación
                    </p>
                    <p className="font-mono text-sm font-semibold">CVU·OP·{solicitud.id.toUpperCase()}·{comision}</p>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      El proveedor detecta el pago al instante y destraba los datos sin intervención
                      humana. Acreditación inmediata, sin contracargos.
                    </p>
                  </div>
                )}
              </div>

              {etapa === "comprobante" ? (
                cobroModo === "manual" ? (
                  <button onClick={() => setEtapa("cerrada")} className="btn-primary mt-5">
                    <Upload size={16} /> Subir comprobante (simulado)
                  </button>
                ) : (
                  <button onClick={() => setEtapa("cerrada")} className="btn-primary mt-5">
                    <Zap size={16} /> Simular acreditación automática
                  </button>
                )
              ) : (
                <div className="mt-5 flex items-start gap-2.5 rounded-[var(--radius-lg)] border border-[var(--color-primary)] bg-[var(--color-primary-tint)] p-4 text-sm text-[var(--color-primary-dark)]">
                  <Check size={18} strokeWidth={2.6} className="mt-0.5 shrink-0" />
                  <span>
                    {cobroModo === "manual"
                      ? "Comprobante confirmado por el equipo desde el panel. Datos de la contraparte destrabados y contrato activo."
                      : "Pago detectado al instante por el CVU de la operación. Datos destrabados automáticamente, sin intervención del equipo."}{" "}
                    El capital ahora viaja directo entre los colegas.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Panel lateral */}
        <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="card-minimal p-6">
            <p className="eyebrow mb-3 flex items-center gap-1.5"><Gauge size={13} /> Score del colega</p>
            <ScoreGauge score={autor.score} />
            <p className="mt-3 text-center text-xs text-[var(--color-muted)]">
              Híbrido (bureau + interno). Visible para el prestamista al evaluar.
            </p>
          </div>

          <div className="card-minimal p-6">
            <p className="eyebrow mb-3 flex items-center gap-1.5"><ShieldCheck size={13} /> Verificaciones</p>
            <Verificado v={autor.verificaciones} />
          </div>

          {/* Avance */}
          <div className="card-minimal p-6">
            <p className="eyebrow mb-4 flex items-center gap-1.5"><ScrollText size={13} /> Avanzar la operación</p>
            <ol className="space-y-2.5 text-sm">
              {[
                ["evaluando", "Evaluando · chat abierto"],
                ["acordado", "Acordar avanzar · revelar identidad"],
                ["contrato", "Generar contrato"],
                ["comprobante", "Cobrar comisión"],
                ["cerrada", "Operación cerrada"],
              ].map(([key, label], i) => {
                const hecho = ORDER.indexOf(etapa) >= i;
                return (
                  <li key={key} className="flex items-center gap-2.5">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                        hecho ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-paper-2)] text-[var(--color-faint)]"
                      }`}
                    >
                      {hecho ? <Check size={12} strokeWidth={3} /> : i + 1}
                    </span>
                    <span className={hecho ? "text-[var(--color-ink)]" : "text-[var(--color-faint)]"}>{label}</span>
                  </li>
                );
              })}
            </ol>

            <div className="mt-5">
              {etapa === "evaluando" && (
                <button onClick={() => setEtapa("acordado")} className="btn-primary w-full justify-center">
                  Acordar avanzar <ArrowRight size={15} />
                </button>
              )}
              {etapa === "acordado" && (
                <button onClick={() => setEtapa("contrato")} className="btn-primary w-full justify-center">
                  Generar contrato <ArrowRight size={15} />
                </button>
              )}
              {etapa === "contrato" && (
                <button onClick={() => setEtapa("comprobante")} className="btn-primary w-full justify-center">
                  Ir al cobro de comisión <ArrowRight size={15} />
                </button>
              )}
              {etapa === "cerrada" && (
                <p className="flex items-center justify-center gap-1.5 text-center text-sm font-semibold text-[var(--color-primary)]">
                  <Check size={16} strokeWidth={3} /> Operación cerrada
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
