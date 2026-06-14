"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user-context";

const steps = [
  {
    key: "matricula",
    titulo: "Matrícula profesional",
    desc: "Validamos automáticamente que tu matrícula esté vigente en el colegio de odontólogos.",
    detalle: "Matrícula OCH-2418 · Colegio de Odontólogos del Chaco · estado: vigente",
    cta: "Validar matrícula",
  },
  {
    key: "renaper",
    titulo: "Identidad — Renaper",
    desc: "Contrastamos los datos de tu documento contra el registro nacional de las personas.",
    detalle: "DNI verificado contra Renaper · nombre y fecha de nacimiento coinciden",
    cta: "Verificar identidad",
  },
  {
    key: "kyc",
    titulo: "Biometría facial (KYC)",
    desc: "Documento + prueba de vida + coincidencia de rostro con antifraude llave en mano.",
    detalle: "Prueba de vida superada · rostro coincide con el documento · sin alertas de fraude",
    cta: "Hacer la verificación facial",
  },
  {
    key: "vouching",
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

  return (
    <div className="min-h-screen">
      <header className="mx-auto max-w-3xl px-5 py-5">
        <Link href="/" className="font-grotesk text-xl font-bold tracking-tight">
          <span className="text-[var(--color-primary)]">●</span> Mutuum
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10">
        <div className="mb-8">
          <span className="chip bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)]">
            Alta de colega
          </span>
          <h1 className="mt-4 text-3xl font-bold">Verificación en cuatro pasos</h1>
          <p className="mt-2 text-[var(--color-gray-600)]">
            Así se da de alta un odontólogo nuevo. Todo simulado para el demo.
          </p>
        </div>

        {/* Progreso */}
        <div className="mb-8 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.key} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  done[i]
                    ? "bg-[var(--color-primary)] text-white"
                    : i === current
                      ? "bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)]"
                      : "bg-[var(--color-gray-100)] text-[var(--color-gray-400)]"
                }`}
              >
                {done[i] ? "✓" : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 ${done[i] ? "bg-[var(--color-primary)]" : "bg-[var(--color-gray-100)]"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Paso actual */}
        <div className="card-minimal p-7">
          <p className="font-mono text-xs text-[var(--color-primary)]">
            Paso {current + 1} de {steps.length}
          </p>
          <h2 className="mt-2 text-2xl font-bold">{steps[current].titulo}</h2>
          <p className="mt-2 text-[var(--color-gray-600)]">{steps[current].desc}</p>

          <div className="mt-5 rounded-[var(--radius-lg)] bg-[var(--color-gray-50)] p-4 font-mono text-xs text-[var(--color-gray-700)]">
            {done[current] ? "✓ " : "› "}
            {steps[current].detalle}
          </div>

          <div className="mt-6 flex items-center gap-3">
            {!done[current] ? (
              <button onClick={() => completar(current)} className="btn-primary">
                {steps[current].cta}
              </button>
            ) : (
              <span className="font-grotesk text-sm font-semibold text-[var(--color-primary)]">
                ✓ Paso verificado
              </span>
            )}
            {current > 0 && (
              <button onClick={() => setCurrent(current - 1)} className="btn-ghost">
                ← Anterior
              </button>
            )}
          </div>
        </div>

        {/* Cierre */}
        {todoListo && (
          <div className="animate-in mt-6 rounded-[var(--radius-xl)] border border-[var(--color-primary)] bg-[var(--color-primary-soft)] p-6">
            <h3 className="text-lg font-bold text-[var(--color-primary-dark)]">
              ✓ Cuenta verificada
            </h3>
            <p className="mt-1 text-sm text-[var(--color-gray-700)]">
              Identidad, matrícula, biometría y aval confirmados. Ya podés operar en Mutuum.
            </p>
            <button
              onClick={() => {
                signIn("d-martin");
                router.push("/app");
              }}
              className="btn-primary mt-4"
            >
              Entrar a la plataforma →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
