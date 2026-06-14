"use client";

import { useUser } from "@/lib/user-context";
import { dentistById } from "@/data/dentists";
import { ScoreGauge } from "@/components/ScoreGauge";
import { Avatar, Reputacion, Verificado, Insignia, SectionTitle } from "@/components/ui";

export default function Perfil() {
  const { user } = useUser();
  if (!user) return null;

  const avalador = user.avaladoPor ? dentistById(user.avaladoPor) : undefined;

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="card-minimal flex flex-col items-start gap-6 p-7 md:flex-row md:items-center">
        <Avatar dentist={user} size={84} />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {user.nombre} {user.apellido}
          </h1>
          <p className="font-mono text-sm text-[var(--color-gray-500)]">
            Mat. {user.matricula} · {user.ciudad}, {user.provincia}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <Reputacion valor={user.reputacion} />
            <span className="font-mono text-xs text-[var(--color-gray-500)]">
              {user.operaciones} operaciones · {user.antiguedadMeses} meses en la red
            </span>
          </div>
          <p className="mt-3 max-w-xl text-sm text-[var(--color-gray-600)]">{user.bio}</p>
        </div>
        <div className="shrink-0">
          <ScoreGauge score={user.score} size={150} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card-minimal p-6">
          <SectionTitle title="Insignias" />
          <div className="flex flex-wrap gap-2">
            {user.insignias.map((i) => (
              <Insignia key={i}>{i}</Insignia>
            ))}
          </div>
        </div>

        <div className="card-minimal p-6">
          <SectionTitle title="Verificaciones" />
          <Verificado v={user.verificaciones} />
          {avalador && (
            <p className="mt-4 text-sm text-[var(--color-gray-600)]">
              Avalado por{" "}
              <strong>
                {avalador.nombre} {avalador.apellido}
              </strong>{" "}
              ({avalador.ciudad}) — su reputación queda vinculada a la tuya.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
