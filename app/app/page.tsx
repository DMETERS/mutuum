"use client";

import Link from "next/link";
import { useUser } from "@/lib/user-context";
import { solicitudes } from "@/data/requests";
import { ScoreGauge } from "@/components/ScoreGauge";
import { Verificado, Insignia, Reputacion, SectionTitle } from "@/components/ui";
import { usd, pct } from "@/lib/format";

export default function Dashboard() {
  const { user } = useUser();
  if (!user) return null;

  const propias = solicitudes.filter((s) => s.autorId === user.id);
  // Oportunidades = solicitudes de la contraparte (si presto, veo tomadores y viceversa).
  const oportunidades = solicitudes.filter((s) => s.autorId !== user.id);

  return (
    <div className="space-y-8">
      <div>
        <p className="font-grotesk text-sm text-[var(--color-gray-500)]">Hola de nuevo,</p>
        <h1 className="text-3xl font-bold">
          {user.nombre} {user.apellido}
        </h1>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid gap-5 md:grid-cols-3">
        <div className="card-minimal flex items-center gap-5 p-6">
          <ScoreGauge score={user.score} size={130} />
          <div>
            <p className="font-grotesk text-xs uppercase tracking-wide text-[var(--color-gray-500)]">
              Score crediticio
            </p>
            <p className="mt-1 text-sm text-[var(--color-gray-600)]">
              Híbrido: bureau externo + comportamiento en la plataforma. Lo ve el prestamista al
              evaluarte.
            </p>
          </div>
        </div>

        <div className="card-minimal p-6">
          <p className="font-grotesk text-xs uppercase tracking-wide text-[var(--color-gray-500)]">
            Reputación
          </p>
          <div className="mt-2">
            <Reputacion valor={user.reputacion} />
          </div>
          <p className="mt-3 font-mono text-3xl font-bold">{user.operaciones}</p>
          <p className="text-sm text-[var(--color-gray-600)]">operaciones cerradas</p>
          <p className="mt-2 font-mono text-xs text-[var(--color-gray-400)]">
            {user.antiguedadMeses} meses en la red
          </p>
        </div>

        <div className="card-minimal p-6">
          <p className="font-grotesk text-xs uppercase tracking-wide text-[var(--color-gray-500)]">
            Insignias
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {user.insignias.map((i) => (
              <Insignia key={i}>{i}</Insignia>
            ))}
          </div>
        </div>
      </div>

      {/* Verificaciones */}
      <div className="card-minimal p-6">
        <p className="font-grotesk mb-3 text-xs uppercase tracking-wide text-[var(--color-gray-500)]">
          Tu cuenta está verificada
        </p>
        <Verificado v={user.verificaciones} />
      </div>

      {/* Mis solicitudes */}
      {propias.length > 0 && (
        <section>
          <SectionTitle title="Tus solicitudes activas" />
          <div className="grid gap-4 md:grid-cols-2">
            {propias.map((s) => (
              <Link
                key={s.id}
                href={`/app/solicitud/${s.id}`}
                className="card-minimal flex items-center justify-between p-5"
              >
                <div>
                  <span className="chip bg-[var(--color-primary-soft)] capitalize text-[var(--color-primary-dark)]">
                    {s.tipo === "prestar" ? "Presto" : "Tomo"}
                  </span>
                  <p className="mt-2 font-mono text-xl font-bold">{usd(s.monto)}</p>
                  <p className="text-sm text-[var(--color-gray-600)]">{s.destino}</p>
                </div>
                <span className="font-mono text-sm text-[var(--color-gray-500)]">
                  {pct(s.tasaMin)}–{pct(s.tasaMax)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Oportunidades */}
      <section>
        <SectionTitle
          eyebrow="Matching"
          title={`${oportunidades.length} oportunidades en el NEA`}
          desc="Solicitudes de colegas que cruzan con tu perfil. Abrí el matching para verlas en el mapa y filtrar."
        />
        <Link href="/app/matching" className="btn-primary">
          Ir al matching →
        </Link>
      </section>
    </div>
  );
}
