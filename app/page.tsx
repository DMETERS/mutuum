import Link from "next/link";

const pasos = [
  {
    n: "01",
    t: "Verificás tu identidad",
    d: "Matrícula vigente, validación con Renaper, biometría facial (KYC) y el aval de un colega ya registrado. Todos los que operan son odontólogos reales.",
  },
  {
    n: "02",
    t: "Publicás o buscás",
    d: "Cargás una solicitud para prestar tu excedente o tomar capital. El motor cruza por monto, tasa y distancia, con filtros y un mapa del NEA.",
  },
  {
    n: "03",
    t: "Acordás con respaldo",
    d: "Chat trazable, scoring crediticio visible, contrato entre partes y cobro de la comisión. El capital viaja directo entre colegas; la plataforma documenta todo.",
  },
];

const confianza = [
  ["Matrícula + Renaper", "Acceso solo para odontólogos con matrícula vigente, validados contra el registro oficial."],
  ["Aval de pares (vouching)", "Cada alta queda avalada por un colega ya registrado, que vincula su reputación."],
  ["Chat e historial inmutables", "Toda la comunicación queda registrada con sello de tiempo, utilizable como evidencia."],
  ["Sin custodia de fondos", "El dinero del préstamo va de CVU a CVU entre las partes. Mutuum conecta y documenta, no administra el capital."],
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="font-grotesk text-xl font-bold tracking-tight">
          <span className="text-[var(--color-primary)]">●</span> Mutuum
        </span>
        <Link href="/acceso" className="btn-primary">
          Entrar al demo
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 md:pt-20">
        <div className="animate-in max-w-3xl">
          <span className="chip bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)]">
            P2P · odontólogos del NEA
          </span>
          <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Préstamos entre colegas,{" "}
            <span className="text-[var(--color-primary)]">con la confianza de la matrícula.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--color-gray-600)]">
            Mutuum conecta odontólogos que quieren colocar su excedente con colegas que
            necesitan crédito en mejores condiciones que el banco. Identidad verificada, aval
            de pares, scoring y contrato — sin que la plataforma toque el dinero.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/acceso" className="btn-primary">
              Recorrer el demo →
            </Link>
            <Link href="/onboarding" className="btn-secondary">
              Ver el alta de un colega
            </Link>
          </div>
          <p className="mt-4 font-mono text-xs text-[var(--color-gray-400)]">
            Demo de producto · datos ficticios · arranca por Chaco, Corrientes y Misiones
          </p>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="border-y border-[var(--color-gray-100)] bg-[var(--color-gray-50)]">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-grotesk mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            Cómo funciona
          </h2>
          <p className="mb-10 max-w-xl text-2xl font-bold">Tres pasos, de punta a punta.</p>
          <div className="grid gap-5 md:grid-cols-3">
            {pasos.map((p) => (
              <div key={p.n} className="card-minimal p-6">
                <span className="font-mono text-sm text-[var(--color-primary)]">{p.n}</span>
                <h3 className="mt-3 text-lg font-bold">{p.t}</h3>
                <p className="mt-2 text-sm text-[var(--color-gray-600)]">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Confianza */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-grotesk mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
          Confianza y respaldo
        </h2>
        <p className="mb-10 max-w-xl text-2xl font-bold">
          El peso de la matrícula y la proximidad, como garantía.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {confianza.map(([t, d]) => (
            <div key={t} className="flex gap-3 rounded-[var(--radius-lg)] border border-[var(--color-gray-100)] p-5">
              <span className="mt-1 text-[var(--color-primary)]">◆</span>
              <div>
                <h3 className="font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-[var(--color-gray-600)]">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="gradient-mutuum flex flex-col items-start justify-between gap-6 rounded-[var(--radius-2xl)] p-10 text-white md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold">Probá el recorrido completo</h2>
            <p className="mt-2 max-w-md text-white/80">
              Entrá como prestamista o tomador y recorré el matching, el chat, el contrato y el
              cobro de la comisión.
            </p>
          </div>
          <Link
            href="/acceso"
            className="font-grotesk rounded-[var(--radius-lg)] bg-white px-6 py-3 font-semibold text-[var(--color-primary-dark)]"
          >
            Entrar al demo →
          </Link>
        </div>
      </section>
    </div>
  );
}
