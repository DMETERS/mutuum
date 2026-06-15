"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IdCard, ScanFace, Fingerprint, HeartHandshake, Check, ArrowRight, ArrowLeft, type IconType } from "@/components/icons";
import { useUser } from "@/lib/user-context";

const steps: { key: string; icon: IconType; titulo: string; desc: string; detalle: string; cta: string }[] = [
  {
    key: "matricula",
    icon: IdCard,
    titulo: "Matrícula profesional",
    desc: "Validación automática contra REFEPS (Registro Federal de Profesionales de la Salud). Si no figurás, seguimos por tu colegio provincial y, si hace falta, subís tu credencial.",
    detalle: "REFEPS · Matrícula OCH-2418 · Colegio de Odontólogos del Chaco · vigente",
    cta: "Validar con REFEPS",
  },
  {
    key: "renaper",
    icon: ScanFace,
    titulo: "Identidad — Renaper",
    desc: "Contrastamos los datos de tu documento contra el registro nacional de las personas.",
    detalle: "DNI verificado contra Renaper · nombre y fecha de nacimiento coinciden",
    cta: "Verificar identidad",
  },
  {
    key: "kyc",
    icon: Fingerprint,
    titulo: "Biometría facial (KYC)",
    desc: "Documento + prueba de vida + coincidencia de rostro con antifraude llave en mano.",
    detalle: "Prueba de vida superada · rostro coincide con el documento · sin alertas de fraude",
    cta: "Hacer la verificación facial",
  },
  {
    key: "vouching",
    icon: HeartHandshake,
    titulo: "Aval de un colega",
    desc: "Un odontólogo ya registrado avala tu ingreso y vincula su reputación a la tuya.",
    detalle: "Avalada por la Dra. Laura Benítez (Resistencia) · reputación 4.9",
    cta: "Confirmar aval",
  },
];

export default function Onboarding() {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState<boolean[]>([false, false, false, false]);
  const router = useRouter();
  const { signIn } = useUser();

  const completar = (i: number) => {
    const next = [...done];
    next[i] = true;
    setDone(next);
    if (i < steps.length - 1) setCurrent(i + 1);
  };

  const todoListo = done.every(Boolean);
  const Icon = steps[current].icon;

  return (
    <div className="hero-mesh min-h-screen">
      <header className="mx-auto max-w-3xl px-5 py-5">
        <Link href="/" className="wordmark text-2xl">Mutuum</Link>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10">
        <div className="mb-10">
          <span className="chip chip-primary">Alta de colega</span>
          <h1 className="font-display mt-5 text-[2.4rem] leading-tight">Verificación en cuatro pasos</h1>
          <p className="mt-2 text-[var(--color-muted)]">
            Así se da de alta un odontólogo nuevo. Todo simulado para el demo.
          </p>
        </div>

        {/* Progreso */}
        <div className="mb-8 flex items-center">
          {steps.map((s, i) => (
            <div key={s.key} className="flex flex-1 items-center last:flex-none">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  done[i]
                    ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-primary)]"
                    : i === current
                      ? "bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)] ring-2 ring-[var(--color-primary)]"
                      : "bg-[var(--color-paper-2)] text-[var(--color-faint)]"
                }`}
              >
                {done[i] ? <Check size={16} strokeWidth={3} /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`mx-2 h-0.5 flex-1 rounded-full ${done[i] ? "bg-[var(--color-primary)]" : "bg-[var(--color-line)]"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Paso actual */}
        <div className="card-minimal p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
              <Icon size={22} strokeWidth={1.8} />
            </span>
            <div>
              <p className="font-mono text-xs text-[var(--color-primary)]">
                Paso {current + 1} de {steps.length}
              </p>
              <h2 className="font-display mt-1 text-2xl">{steps[current].titulo}</h2>
            </div>
          </div>
          <p className="mt-4 text-[var(--color-muted)]">{steps[current].desc}</p>

          <div className="mt-5 flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-paper-2)] p-4 font-mono text-xs text-[var(--color-ink-soft)]">
            {done[current] ? (
              <Check size={14} className="shrink-0 text-[var(--color-primary)]" strokeWidth={3} />
            ) : (
              <ArrowRight size={14} className="shrink-0 text-[var(--color-faint)]" />
            )}
            {steps[current].detalle}
          </div>

          <div className="mt-6 flex items-center gap-3">
            {!done[current] ? (
              <button onClick={() => completar(current)} className="btn-primary">
                {steps[current].cta} <ArrowRight size={16} />
              </button>
            ) : (
              <span className="font-grotesk inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)]">
                <Check size={16} strokeWidth={3} /> Paso verificado
              </span>
            )}
            {current > 0 && (
              <button onClick={() => setCurrent(current - 1)} className="btn-ghost">
                <ArrowLeft size={15} /> Anterior
              </button>
            )}
          </div>
        </div>

        {/* Cascada de validación de matrícula (sin gaps) */}
        {current === 0 && (
          <div className="mt-4 rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-paper-2)] p-4 text-xs text-[var(--color-muted)]">
            <p className="font-grotesk mb-2 font-semibold text-[var(--color-ink-soft)]">
              Cómo validamos la matrícula (sin gaps)
            </p>
            <ol className="space-y-1">
              <li>1 · Automático con REFEPS — estado de matrícula vigente.</li>
              <li>2 · Si no figura, adaptador del colegio provincial (Chaco / Corrientes / Misiones).</li>
              <li>3 · Si aún no se confirma, quedás «pendiente de validación» y subís tu credencial; el equipo la aprueba desde el panel.</li>
              <li>4 · El aval de un colega suma como refuerzo (no reemplaza la matrícula).</li>
            </ol>
          </div>
        )}

        {/* Cierre */}
        {todoListo && (
          <div className="animate-in mt-6 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-primary)] bg-[var(--color-primary-tint)] p-7">
            <h3 className="font-display flex items-center gap-2 text-xl text-[var(--color-primary-dark)]">
              <Check size={20} strokeWidth={3} /> Cuenta verificada
            </h3>
            <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
              Identidad, matrícula, biometría y aval confirmados. Ya podés operar en Mutuum.
            </p>
            <button
              onClick={() => {
                signIn("d-martin");
                router.push("/app");
              }}
              className="btn-primary mt-5"
            >
              Entrar a la plataforma <ArrowRight size={16} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
