"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, TrendingUp, Award, ShieldCheck } from "@/components/icons";
import { useUser } from "@/lib/user-context";
import { isAdmin } from "@/data/dentists";
import { solicitudes } from "@/data/requests";
import { ScoreGauge } from "@/components/ScoreGauge";
import { Verificado, Insignia, Reputacion, SectionTitle, Chip } from "@/components/ui";
import { usd, pct } from "@/lib/format";

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();

  // El operador del equipo no tiene dashboard de odontólogo: va al panel.
  useEffect(() => {
    if (user && isAdmin(user.id)) router.replace("/app/panel");
  }, [user, router]);

  if (!user || isAdmin(user.id)) return null;

  const propias = solicitudes.filter((s) => s.autorId === user.id);
  const oportunidades = solicitudes.filter((s) => s.autorId !== user.id);

  return (
    <div className="space-y-8">
      <div className="animate-in">
        <p className="font-grotesk text-sm text-[var(--color-muted)]">Hola de nuevo,</p>
        <h1 className="font-display text-[2.6rem] leading-tight">
          {user.nombre} {user.apellido}
        </h1>
      </div>

      {/* Bento */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Score — destacado */}
        <div className="card-minimal flex items-center gap-5 p-7 lg:col-span-1">
          <ScoreGauge score={user.score} size={140} />
          <div>
            <p className="eyebrow">Score crediticio</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
              Híbrido: bureau externo + comportamiento en la plataforma. Lo ve el prestamista al
              evaluarte.
            </p>
          </div>
        </div>

        {/* Reputación */}
        <div className="card-minimal p-7">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Reputación</p>
            <TrendingUp size={16} className="text-[var(--color-primary)]" />
          </div>
          <div className="mt-3">
            <Reputacion valor={user.reputacion} size={16} />
          </div>
          <p className="font-display tabular mt-4 text-5xl">{user.operaciones}</p>
          <p className="text-sm text-[var(--color-muted)]">operaciones cerradas</p>
          <p className="mt-2 font-mono text-xs text-[var(--color-faint)]">
            {user.antiguedadMeses} meses en la red
          </p>
        </div>

        {/* Insignias */}
        <div className="card-minimal p-7">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Insignias</p>
            <Award size={16} className="text-[var(--color-brass)]" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {user.insignias.map((i) => (
              <Insignia key={i}>{i}</Insignia>
            ))}
          </div>
        </div>
      </div>

      {/* Verificaciones */}
      <div className="card-minimal flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <ShieldCheck size={20} strokeWidth={1.9} />
          </span>
          <div>
            <p className="font-semibold">Tu cuenta está verificada</p>
            <p className="text-xs text-[var(--color-muted)]">Identidad, matrícula, biometría y aval al día.</p>
          </div>
        </div>
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
                className="card-minimal card-hover-lift flex items-center justify-between p-6"
              >
                <div>
                  <Chip tone={s.tipo === "prestar" ? "green" : "blue"}>
                    {s.tipo === "prestar" ? "Presto" : "Tomo"}
                  </Chip>
                  <p className="font-display tabular mt-3 text-2xl">{usd(s.monto)}</p>
                  <p className="text-sm text-[var(--color-muted)]">{s.destino}</p>
                </div>
                <span className="font-mono text-sm text-[var(--color-muted)]">
                  {pct(s.tasaMin)}–{pct(s.tasaMax)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Oportunidades */}
      <section className="gradient-mutuum relative overflow-hidden rounded-[var(--radius-2xl)] p-8 text-white shadow-[var(--shadow-lg)] md:p-10">
        <div className="relative z-10 flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm text-white/70">
              <Sparkles size={15} /> Matching
            </p>
            <h2 className="font-display mt-1 text-[2rem] leading-tight">
              {oportunidades.length} oportunidades en el NEA
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/80">
              Solicitudes de colegas que cruzan con tu perfil. Mirálas en el mapa y filtrá por
              monto, tasa y score.
            </p>
          </div>
          <Link
            href="/app/matching"
            className="font-grotesk inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-white px-5 py-3 font-semibold text-[var(--color-primary-dark)] shadow-[var(--shadow-md)] transition-transform hover:-translate-y-0.5"
          >
            Ir al matching <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
