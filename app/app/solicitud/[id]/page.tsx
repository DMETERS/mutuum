"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useUser } from "@/lib/user-context";
import { solicitudById } from "@/data/requests";
import { dentistById } from "@/data/dentists";
import { mensajesDeSolicitud } from "@/data/messages";
import type { Mensaje } from "@/lib/types";
import { Avatar, Reputacion, Verificado, Chip, Note, SectionTitle } from "@/components/ui";
import { ScoreGauge } from "@/components/ScoreGauge";
import { usd, pct } from "@/lib/format";

type Etapa = "evaluando" | "acordado" | "contrato" | "comprobante" | "cerrada";

const COMISION_PCT = 0.02; // 2% sobre el monto de la operación
const CVU_INSTITUCIONAL = "0000003100099999999999";

export default function DetalleOperacion() {
  const params = useParams<{ id: string }>();
  const { user } = useUser();
  const solicitud = solicitudById(params.id);

  const [etapa, setEtapa] = useState<Etapa>("evaluando");
  const [texto, setTexto] = useState("");
  const [chat, setChat] = useState<Mensaje[]>(
    solicitud ? mensajesDeSolicitud(solicitud.id) : []
  );

  if (!solicitud) {
    return (
      <div className="card-minimal p-8 text-center">
        <p className="text-[var(--color-gray-600)]">No encontramos esa solicitud.</p>
        <Link href="/app/matching" className="btn-primary mt-4">
          Volver al matching
        </Link>
      </div>
    );
  }

  const autor = dentistById(solicitud.autorId)!;
  const comision = Math.round(solicitud.monto * COMISION_PCT);
  // Identidad completa recién al acordar avanzar (revelación progresiva).
  const revelado = etapa !== "evaluando";

  const enviar = () => {
    if (!texto.trim() || !user) return;
    setChat((prev) => [
      ...prev,
      {
        id: `m-${prev.length + 1}`,
        solicitudId: solicitud.id,
        autorId: user.id,
        texto: texto.trim(),
        hora: "ahora",
      },
    ]);
    setTexto("");
  };

  return (
    <div className="space-y-6">
      <Link href="/app/matching" className="btn-ghost">
        ← Volver al matching
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Columna principal */}
        <div className="space-y-6">
          {/* Cabecera de la operación */}
          <div className="card-minimal p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar dentist={autor} size={56} />
                <div>
                  <p className="font-semibold">
                    {revelado ? `${autor.nombre} ${autor.apellido}` : `${autor.nombre} ${autor.apellido[0]}.`}
                  </p>
                  <p className="font-mono text-xs text-[var(--color-gray-500)]">
                    {revelado
                      ? `Mat. ${autor.matricula} · ${autor.ciudad}, ${autor.provincia}`
                      : `${autor.provincia} · datos completos al acordar`}
                  </p>
                  <div className="mt-1">
                    <Reputacion valor={autor.reputacion} />
                  </div>
                </div>
              </div>
              <Chip tone={solicitud.tipo === "prestar" ? "green" : "blue"}>
                {solicitud.tipo === "prestar" ? "Ofrece capital" : "Busca crédito"}
              </Chip>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-[var(--color-gray-100)] pt-5">
              <div>
                <p className="font-mono text-2xl font-bold">{usd(solicitud.monto)}</p>
                <p className="text-xs text-[var(--color-gray-500)]">Monto</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold">
                  {pct(solicitud.tasaMin)}–{pct(solicitud.tasaMax)}
                </p>
                <p className="text-xs text-[var(--color-gray-500)]">Tasa mensual</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold">{solicitud.plazoMeses}</p>
                <p className="text-xs text-[var(--color-gray-500)]">Meses</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-[var(--color-gray-600)]">{solicitud.destino}</p>
          </div>

          {/* Chat trazable */}
          <div className="card-minimal flex flex-col p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Chat de la operación</h3>
              <span className="chip bg-[var(--color-gray-100)] text-[var(--color-gray-600)]">
                trazable · inmutable
              </span>
            </div>
            <p className="mt-1 text-xs text-[var(--color-gray-500)]">
              Cada mensaje queda con sello de tiempo y no puede editarse ni borrarse: sirve como
              evidencia legal.
            </p>

            <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
              {chat.map((m) => {
                const mio = m.autorId === user?.id;
                return (
                  <div key={m.id} className={`flex ${mio ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-[var(--radius-lg)] px-4 py-2 text-sm ${
                        mio
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-[var(--color-gray-50)] text-[var(--color-ink)]"
                      }`}
                    >
                      <p>{m.texto}</p>
                      <p className={`mt-1 font-mono text-[10px] ${mio ? "text-white/70" : "text-[var(--color-gray-400)]"}`}>
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
              <button onClick={enviar} className="btn-primary">
                Enviar
              </button>
            </div>
          </div>

          {/* Contrato */}
          {(etapa === "contrato" || etapa === "comprobante" || etapa === "cerrada") && (
            <div className="card-minimal animate-in p-6">
              <SectionTitle title="Contrato entre partes" />
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-gray-200)] bg-[var(--color-gray-50)] p-5 font-mono text-xs leading-relaxed text-[var(--color-gray-700)]">
                CONTRATO DE MUTUO — {usd(solicitud.monto)}
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
              <Note>
                El texto legal del contrato y los T&amp;C los provee un abogado del cliente; Mutuum
                lo instrumenta y lo completa con los datos de la operación.
              </Note>
            </div>
          )}

          {/* Cobro de comisión */}
          {(etapa === "comprobante" || etapa === "cerrada") && (
            <div className="card-minimal animate-in p-6">
              <SectionTitle title="Cobro de la comisión" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[var(--radius-lg)] bg-[var(--color-gray-50)] p-4">
                  <p className="text-xs text-[var(--color-gray-500)]">Comisión Mutuum (2%)</p>
                  <p className="font-mono text-2xl font-bold">{usd(comision)}</p>
                  <p className="mt-1 text-xs text-[var(--color-gray-500)]">
                    Sobre la operación, no sobre el capital (que va directo entre las partes).
                  </p>
                </div>
                <div className="rounded-[var(--radius-lg)] bg-[var(--color-gray-50)] p-4">
                  <p className="text-xs text-[var(--color-gray-500)]">CVU institucional</p>
                  <p className="font-mono text-sm font-semibold">{CVU_INSTITUCIONAL}</p>
                  <p className="mt-1 text-xs text-[var(--color-gray-500)]">
                    Transferí la comisión y subí el comprobante para destrabar los datos de la
                    contraparte.
                  </p>
                </div>
              </div>
              {etapa === "comprobante" ? (
                <button onClick={() => setEtapa("cerrada")} className="btn-primary mt-5">
                  ⬆ Subir comprobante (simulado)
                </button>
              ) : (
                <div className="mt-5 rounded-[var(--radius-lg)] border border-[var(--color-primary)] bg-[var(--color-primary-soft)] p-4 text-sm text-[var(--color-primary-dark)]">
                  ✓ Comprobante confirmado por el equipo. Datos de la contraparte destrabados y
                  contrato activo. El capital ahora viaja directo entre los colegas.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Panel lateral: scoring + avance de la operación */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card-minimal p-6">
            <p className="font-grotesk mb-3 text-xs uppercase tracking-wide text-[var(--color-gray-500)]">
              Score del colega
            </p>
            <ScoreGauge score={autor.score} />
            <p className="mt-3 text-center text-xs text-[var(--color-gray-500)]">
              Híbrido (bureau + interno). Visible para el prestamista al evaluar.
            </p>
          </div>

          <div className="card-minimal p-6">
            <p className="font-grotesk mb-3 text-xs uppercase tracking-wide text-[var(--color-gray-500)]">
              Verificaciones
            </p>
            <Verificado v={autor.verificaciones} />
          </div>

          {/* Avance */}
          <div className="card-minimal p-6">
            <p className="font-grotesk mb-3 text-xs uppercase tracking-wide text-[var(--color-gray-500)]">
              Avanzar la operación
            </p>
            <ol className="space-y-2 text-sm">
              {[
                ["evaluando", "Evaluando · chat abierto"],
                ["acordado", "Acordar avanzar · revelar identidad"],
                ["contrato", "Generar contrato"],
                ["comprobante", "Cobrar comisión"],
                ["cerrada", "Operación cerrada"],
              ].map(([key, label], i) => {
                const order: Etapa[] = ["evaluando", "acordado", "contrato", "comprobante", "cerrada"];
                const hecho = order.indexOf(etapa) >= i;
                return (
                  <li key={key} className="flex items-center gap-2">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                        hecho ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-gray-100)] text-[var(--color-gray-400)]"
                      }`}
                    >
                      {hecho ? "✓" : i + 1}
                    </span>
                    <span className={hecho ? "text-[var(--color-ink)]" : "text-[var(--color-gray-400)]"}>
                      {label}
                    </span>
                  </li>
                );
              })}
            </ol>

            <div className="mt-5">
              {etapa === "evaluando" && (
                <button onClick={() => setEtapa("acordado")} className="btn-primary w-full justify-center">
                  Acordar avanzar →
                </button>
              )}
              {etapa === "acordado" && (
                <button onClick={() => setEtapa("contrato")} className="btn-primary w-full justify-center">
                  Generar contrato →
                </button>
              )}
              {etapa === "contrato" && (
                <button onClick={() => setEtapa("comprobante")} className="btn-primary w-full justify-center">
                  Ir al cobro de comisión →
                </button>
              )}
              {etapa === "cerrada" && (
                <p className="text-center text-sm font-semibold text-[var(--color-primary)]">
                  ✓ Operación cerrada
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
