import Link from "next/link";
import {
  ArrowRight,
  IdCard,
  Search,
  ScrollText,
  ShieldCheck,
  HeartHandshake,
  MessageSquareText,
  Wallet,
  MapPin,
  StarSolid,
  Gauge,
} from "@/components/icons";

const pasos = [
  {
    n: "01",
    icon: IdCard,
    t: "Verificás tu identidad",
    d: "Matrícula vigente, validación con Renaper, biometría facial (KYC) y el aval de un colega ya registrado. Todos los que operan son odontólogos reales.",
  },
  {
    n: "02",
    icon: Search,
    t: "Publicás o buscás",
    d: "Cargás una solicitud para prestar tu excedente o tomar capital. El motor cruza por monto, tasa y distancia, con filtros y un mapa del NEA.",
  },
  {
    n: "03",
    icon: ScrollText,
    t: "Acordás con respaldo",
    d: "Chat trazable, scoring crediticio visible, contrato entre partes y cobro de la comisión. El capital viaja directo entre colegas; la plataforma documenta todo.",
  },
];

const confianza = [
  { icon: IdCard, t: "Matrícula + Renaper", d: "Acceso solo para odontólogos con matrícula vigente, validados contra el registro oficial." },
  { icon: HeartHandshake, t: "Aval de pares (vouching)", d: "Cada alta queda avalada por un colega ya registrado, que vincula su reputación." },
  { icon: MessageSquareText, t: "Chat e historial inmutables", d: "Toda la comunicación queda con sello de tiempo, utilizable como evidencia legal." },
  { icon: ShieldCheck, t: "Sin custodia de fondos", d: "El dinero del préstamo va de CVU a CVU entre las partes. Mutuum conecta y documenta, no administra el capital." },
];

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="wordmark text-[1.7rem]">Mutuum</span>
        <div className="flex items-center gap-2">
          <Link href="/onboarding" className="btn-ghost hidden sm:inline-flex">
            Ver el alta
          </Link>
          <Link href="/acceso" className="btn-primary">
            Entrar al demo <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-mesh relative">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-10 md:pt-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-in">
            <span className="chip chip-brass">
              <StarSolid size={12} className="text-[var(--color-brass)]" /> P2P · odontólogos del NEA
            </span>
            <h1 className="font-display mt-6 text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.02] tracking-[-0.03em]">
              Préstamos entre colegas,{" "}
              <span className="italic text-[var(--color-primary)]">con la confianza de la matrícula.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
              Mutuum conecta odontólogos que quieren colocar su excedente con colegas que
              necesitan crédito en mejores condiciones que el banco. Identidad verificada, aval
              de pares, scoring y contrato — sin que la plataforma toque el dinero.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/acceso" className="btn-primary">
                Recorrer el demo <ArrowRight size={16} />
              </Link>
              <Link href="/onboarding" className="btn-secondary">
                Ver el alta de un colega
              </Link>
            </div>
            <p className="mt-6 font-mono text-xs text-[var(--color-faint)]">
              Demo de producto · datos ficticios · arranca por Chaco, Corrientes y Misiones
            </p>
          </div>

          {/* Tarjeta de operación flotante */}
          <div className="animate-in delay-2 relative mx-auto w-full max-w-sm">
            <div className="card-minimal relative z-10 p-6 shadow-[var(--shadow-lg)]">
              <div className="flex items-center justify-between">
                <span className="chip chip-primary">
                  <Wallet size={12} /> Match sugerido
                </span>
                <span className="font-mono text-xs text-[var(--color-faint)]">hace 2 días</span>
              </div>
              <div className="mt-5 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/avatars/martin.jpg"
                  alt="Dr. Martín Ferreyra"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-[var(--color-surface)] outline outline-1 outline-[var(--color-primary-soft)]"
                />
                <div>
                  <p className="font-semibold leading-tight">Dr. Martín Ferreyra</p>
                  <p className="font-mono text-xs text-[var(--color-muted)]">
                    <MapPin size={11} className="-mt-0.5 inline" /> Corrientes · 18 km
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-end justify-between border-t border-[var(--color-line)] pt-4">
                <div>
                  <p className="font-display tabular text-3xl">USD 2.200</p>
                  <p className="text-sm text-[var(--color-muted)]">Equipo de rayos X</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold text-[var(--color-primary-dark)]">3,5–5%</p>
                  <p className="font-mono text-xs text-[var(--color-faint)]">6 meses</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-[var(--radius-md)] bg-[var(--color-primary-tint)] px-3 py-2">
                <span className="flex items-center gap-1.5 text-xs text-[var(--color-ink-soft)]">
                  <Gauge size={14} className="text-[var(--color-primary)]" /> Score 688 · Bueno
                </span>
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarSolid key={i} size={12} className="text-[var(--color-brass)]" />
                  ))}
                </span>
              </div>
            </div>
            {/* sombra/eco detrás */}
            <div className="absolute -bottom-4 left-4 right-4 -z-0 h-24 rounded-[var(--radius-xl)] bg-[var(--color-primary)]/10 blur-2xl" />
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="border-y border-[var(--color-line)] bg-[var(--color-paper-2)]">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="eyebrow">Cómo funciona</p>
          <h2 className="font-display mt-2 max-w-xl text-4xl leading-tight">Tres pasos, de punta a punta.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {pasos.map((p) => (
              <div key={p.n} className="card-minimal card-hover-lift p-7">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                    <p.icon size={20} strokeWidth={1.8} />
                  </span>
                  <span className="font-mono text-sm text-[var(--color-faint)]">{p.n}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            ["3", "provincias del NEA al lanzar"],
            ["0%", "del capital lo toca la plataforma"],
            ["100%", "de las operaciones documentadas"],
          ].map(([n, l]) => (
            <div key={l} className="text-center">
              <p className="font-display text-5xl text-[var(--color-primary)]">{n}</p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Confianza */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <p className="eyebrow">Confianza y respaldo</p>
        <h2 className="font-display mt-2 max-w-2xl text-4xl leading-tight">
          El peso de la matrícula y la proximidad, como garantía.
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {confianza.map(({ icon: Icon, t, d }) => (
            <div key={t} className="flex gap-4 rounded-[var(--radius-xl)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <Icon size={20} strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="font-semibold">{t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="gradient-mutuum relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[var(--radius-2xl)] p-10 text-white shadow-[var(--shadow-lg)] md:flex-row md:items-center md:p-12">
          <div className="relative z-10">
            <h2 className="font-display text-[2.4rem] leading-tight">Probá el recorrido completo</h2>
            <p className="mt-3 max-w-md text-white/80">
              Entrá como prestamista o tomador y recorré el matching, el chat, el contrato y el
              cobro de la comisión.
            </p>
          </div>
          <Link
            href="/acceso"
            className="font-grotesk relative z-10 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-white px-6 py-3.5 font-semibold text-[var(--color-primary-dark)] shadow-[var(--shadow-md)] transition-transform hover:-translate-y-0.5"
          >
            Entrar al demo <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-5 pb-10">
        <hr className="rule-soft mb-6" />
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <span className="wordmark text-xl">Mutuum</span>
          <p className="text-xs text-[var(--color-faint)]">
            Demo de producto por Dmeter · datos ficticios · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
