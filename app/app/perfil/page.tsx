"use client";

import { Award, ShieldCheck, MapPin, ArrowLeftRight } from "@/components/icons";
import { useUser } from "@/lib/user-context";
import { dentistById } from "@/data/dentists";
import { ScoreGauge } from "@/components/ScoreGauge";
import { Avatar, Reputacion, Verificado, Insignia, SectionTitle, ValidacionBadge } from "@/components/ui";

export default function Perfil() {
  const { user } = useUser();
  if (!user) return null;

  const avalador = user.avaladoPor ? dentistById(user.avaladoPor) : undefined;

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="card-minimal flex flex-col items-start gap-6 p-8 md:flex-row md:items-center">
        <Avatar dentist={user} size={88} />
        <div className="flex-1">
          <h1 className="font-display text-3xl">{user.nombre} {user.apellido}</h1>
          <p className="font-mono text-sm text-[var(--color-faint)]">
            <MapPin size={12} className="-mt-0.5 inline" /> Mat. {user.matricula} · {user.ciudad}, {user.provincia}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <Reputacion valor={user.reputacion} size={15} />
            <ValidacionBadge validado={user.validado} via={user.validacionVia} />
            <span className="font-mono text-xs text-[var(--color-faint)]">
              {user.operaciones} operaciones · {user.antiguedadMeses} meses en la red
            </span>
          </div>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-muted)]">{user.bio}</p>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--color-faint)]">
            <ArrowLeftRight size={13} className="shrink-0 text-[var(--color-primary)]" />
            Perfil unificado: operás como prestamista o tomador según cada operación.
          </p>
        </div>
        <div className="shrink-0">
          <ScoreGauge score={user.score} size={150} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card-minimal p-7">
          <SectionTitle title="Insignias" />
          <div className="flex flex-wrap gap-2">
            {user.insignias.map((i) => (
              <Insignia key={i}>{i}</Insignia>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-[var(--color-faint)]">
            <Award size={13} className="text-[var(--color-brass)]" /> Reconocimientos por trayectoria y cumplimiento.
          </p>
        </div>

        <div className="card-minimal p-7">
          <SectionTitle title="Verificaciones" />
          <Verificado v={user.verificaciones} />
          {avalador && (
            <p className="mt-4 flex items-start gap-1.5 text-sm text-[var(--color-muted)]">
              <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
              <span>
                Avalado por <strong>{avalador.nombre} {avalador.apellido}</strong> ({avalador.ciudad}) — su
                reputación queda vinculada a la tuya.
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
