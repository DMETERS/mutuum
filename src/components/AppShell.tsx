"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutGrid, Sparkles, PlusCircle, UserRound, ClipboardCheck, LogOut, type IconType } from "@/components/icons";
import { useUser } from "@/lib/user-context";
import { isAdmin } from "@/data/dentists";
import { Avatar } from "./ui";

const baseNav: { href: string; label: string; icon: IconType }[] = [
  { href: "/app", label: "Inicio", icon: LayoutGrid },
  { href: "/app/matching", label: "Matching", icon: Sparkles },
  { href: "/app/nueva", label: "Nueva solicitud", icon: PlusCircle },
  { href: "/app/perfil", label: "Mi perfil", icon: UserRound },
];

const panelNav = { href: "/app/panel", label: "Panel", icon: ClipboardCheck };

function isActive(href: string, pathname: string) {
  return href === "/app" ? pathname === "/app" : pathname.startsWith(href);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, ready, signOut } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/acceso");
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-[var(--color-muted)]">
        Cargando…
      </div>
    );
  }

  const nav = isAdmin(user.id) ? [...baseNav, panelNav] : baseNav;

  return (
    <div className="min-h-screen">
      <header className="glass sticky top-0 z-20 border-b border-[var(--color-line)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-7">
            <Link href="/app" className="wordmark text-2xl">
              Mutuum
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {nav.map(({ href, label, icon: Icon }) => {
                const active = isActive(href, pathname);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`font-grotesk flex items-center gap-1.5 rounded-[var(--radius-md)] px-3 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)]"
                        : "text-[var(--color-muted)] hover:bg-[var(--color-paper-2)] hover:text-[var(--color-ink)]"
                    }`}
                  >
                    <Icon size={15} strokeWidth={2.1} />
                    {label}
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
              <p className="font-mono text-xs text-[var(--color-faint)]">Mat. {user.matricula}</p>
            </div>
            <Avatar dentist={user} size={38} />
            <button
              onClick={() => {
                signOut();
                router.push("/acceso");
              }}
              className="btn-ghost"
              aria-label="Salir"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
        {/* Nav móvil */}
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-[var(--color-line)] px-4 py-2 md:hidden">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`font-grotesk flex items-center gap-1.5 whitespace-nowrap rounded-[var(--radius-md)] px-3 py-1.5 text-sm ${
                isActive(href, pathname)
                  ? "bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)]"
                  : "text-[var(--color-muted)]"
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
      <footer className="mx-auto max-w-6xl px-5 pb-10 pt-4">
        <hr className="rule-soft mb-5" />
        <p className="text-center text-xs text-[var(--color-faint)]">
          Mutuum · demo de producto por Dmeter · datos ficticios
        </p>
      </footer>
    </div>
  );
}
