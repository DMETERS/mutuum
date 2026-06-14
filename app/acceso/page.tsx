"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user-context";
import { demoProfiles, dentistById } from "@/data/dentists";
import { Avatar, Reputacion } from "@/components/ui";

export default function Acceso() {
  const { signIn } = useUser();
  const router = useRouter();

  const entrar = (dentistId: string) => {
    signIn(dentistId);
    router.push("/app");
  };

  return (
    <div className="min-h-screen">
      <header className="mx-auto max-w-5xl px-5 py-5">
        <Link href="/" className="font-grotesk text-xl font-bold tracking-tight">
          <span className="text-[var(--color-primary)]">●</span> Mutuum
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-10 max-w-2xl">
          <span className="chip bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)]">
            Acceso demo
          </span>
          <h1 className="mt-4 text-3xl font-bold">Elegí con qué perfil recorrer la plataforma</h1>
          <p className="mt-2 text-[var(--color-gray-600)]">
            Sin contraseña: son cuentas de demostración ya verificadas. Podés cambiar de perfil
            en cualquier momento desde &laquo;Salir&raquo;.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {demoProfiles.map((p) => {
            const d = dentistById(p.dentistId)!;
            return (
              <button
                key={p.dentistId}
                onClick={() => entrar(p.dentistId)}
                className="card-minimal flex flex-col items-start gap-4 p-6 text-left"
              >
                <div className="flex w-full items-center justify-between">
                  <Avatar dentist={d} size={52} />
                  <span className="chip bg-[var(--color-gray-100)] capitalize text-[var(--color-gray-700)]">
                    {p.rol}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-bold leading-tight">{p.titulo}</h2>
                  <p className="font-mono text-xs text-[var(--color-gray-500)]">
                    {d.ciudad}, {d.provincia} · Mat. {d.matricula}
                  </p>
                </div>
                <Reputacion valor={d.reputacion} />
                <p className="text-sm text-[var(--color-gray-600)]">{p.descripcion}</p>
                <span className="font-grotesk mt-auto text-sm font-semibold text-[var(--color-primary)]">
                  Entrar como {d.nombre} →
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10">
          <Link href="/onboarding" className="btn-secondary">
            ¿Cómo es el alta de un colega nuevo? Ver onboarding
          </Link>
        </div>
      </main>
    </div>
  );
}
