"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/lib/user-context";
import { Avatar } from "./ui";

const nav = [
  { href: "/app", label: "Inicio" },
  { href: "/app/matching", label: "Matching" },
  { href: "/app/nueva", label: "Nueva solicitud" },
  { href: "/app/perfil", label: "Mi perfil" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, ready, signOut } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/acceso");
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-[var(--color-gray-500)]">
        Cargando…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-white)]">
      <header className="sticky top-0 z-10 border-b border-[var(--color-gray-100)] bg-[color-mix(in_srgb,var(--color-white)_85%,transparent)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-6">
            <Link href="/app" className="font-grotesk text-lg font-bold tracking-tight">
              <span className="text-[var(--color-primary)]">●</span> Mutuum
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {nav.map((item) => {
                const active =
                  item.href === "/app"
                    ? pathname === "/app"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`font-grotesk rounded-[var(--radius-md)] px-3 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)]"
                        : "text-[var(--color-gray-600)] hover:bg-[var(--color-gray-50)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight">
                {user.nombre} {user.apellido}
              </p>
              <p className="font-mono text-xs text-[var(--color-gray-500)]">
                Mat. {user.matricula}
              </p>
            </div>
            <Avatar dentist={user} size={38} />
            <button
              onClick={() => {
                signOut();
                router.push("/acceso");
              }}
              className="btn-ghost"
            >
              Salir
            </button>
          </div>
        </div>
        {/* Nav móvil */}
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-[var(--color-gray-100)] px-4 py-2 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-grotesk whitespace-nowrap rounded-[var(--radius-md)] px-3 py-1 text-sm text-[var(--color-gray-600)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
      <footer className="mx-auto max-w-6xl px-5 py-8 text-center text-xs text-[var(--color-gray-400)]">
        Mutuum · demo de producto por Dmeter · datos ficticios
      </footer>
    </div>
  );
}
