"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, ArrowLeftRight, MapPin } from "@/components/icons";
import { useUser } from "@/lib/user-context";
import { demoProfiles, dentistById } from "@/data/dentists";
import { Avatar, Reputacion, Chip } from "@/components/ui";

const rolTone: Record<string, "green" | "blue" | "brass"> = {
  prestamista: "green",
  tomador: "blue",
  admin: "brass",
};

export default function Acceso() {
  const { signIn } = useUser();
  const router = useRouter();

  const entrar = (dentistId: string) => {
    signIn(dentistId);
    router.push("/app");
  };

  return (
    <div className="hero-mesh min-h-screen">
      <header className="mx-auto max-w-5xl px-5 py-5">
        <Link href="/" className="wordmark text-2xl">Mutuum</Link>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-12 max-w-2xl animate-in">
          <span className="chip chip-primary">Acceso demo</span>
          <h1 className="font-display mt-5 text-[2.6rem] leading-tight">
            Elegí con qué perfil recorrer la plataforma
          </h1>
          <p className="mt-3 text-[var(--color-muted)]">
            Sin contraseña: son cuentas de demostración ya verificadas. Podés cambiar de perfil
            en cualquier momento desde «Salir».
          </p>
          <p className="mt-3 flex items-start gap-1.5 text-xs text-[var(--color-faint)]">
            <ArrowLeftRight size={13} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
            Los roles son solo para guiar el recorrido: cualquier colega puede prestar y tomar —
            el rol se define en cada operación.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {demoProfiles.map((p, i) => {
            const d = dentistById(p.dentistId)!;
            return (
              <button
                key={p.dentistId}
                onClick={() => entrar(p.dentistId)}
                className={`card-minimal card-hover-lift animate-in delay-${i + 1} group flex flex-col items-start gap-4 p-6 text-left`}
              >
                <div className="flex w-full items-center justify-between">
                  <Avatar dentist={d} size={54} />
                  <Chip tone={rolTone[p.rol]}>{p.rol}</Chip>
                </div>
                <div>
                  <h2 className="text-lg font-semibold leading-tight">{p.titulo}</h2>
                  <p className="font-mono text-xs text-[var(--color-faint)]">
                    <MapPin size={11} className="-mt-0.5 inline" /> {d.ciudad}, {d.provincia} · Mat. {d.matricula}
                  </p>
                </div>
                <Reputacion valor={d.reputacion} />
                <p className="text-sm leading-relaxed text-[var(--color-muted)]">{p.descripcion}</p>
                <span className="font-grotesk mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)]">
                  Entrar como {d.nombre}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link href="/onboarding" className="btn-secondary">
            ¿Cómo es el alta de un colega nuevo?
          </Link>
          <Link href="/" className="btn-ghost">
            <ArrowLeft size={15} /> Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}
