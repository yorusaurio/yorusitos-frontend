import Link from "next/link";

const pillars = [
  {
    title: "Buena calidad",
    text: "Usamos algodón cómodo y estampados que aguantan los lavados. Polos hechos para usarlos de verdad.",
  },
  {
    title: "Diseños propios",
    text: "No vendemos lo mismo de siempre. Cada colección tiene su propio estilo y sus propios diseños.",
  },
  {
    title: "Lo adaptamos contigo",
    text: "¿Te gusta un diseño pero quieres cambiar algo? Escríbenos y lo vemos juntos. Sin complicaciones.",
  },
];

export default function AboutPageContent() {
  return (
    <main className="min-h-screen bg-white pt-20 text-zinc-950">
      {/* Hero */}
      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          <p className="text-[11px] font-bold uppercase tracking-[0.42em] text-zinc-400">Quiénes somos</p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Ropa con onda, hecha en Perú
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-zinc-500 sm:text-lg">
            Somos Yorusito. Hacemos polos con estampados únicos para que lleves algo que de verdad te
            guste, sin dar tantas vueltas.
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="border-b border-zinc-200">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-zinc-400">Nuestra historia</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Todo empezó con una pregunta simple
            </h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-zinc-600">
              <p>
                ¿Por qué es tan difícil encontrar un polo que no sea aburrido? Esa fue la idea. Queríamos
                ropa con personalidad, hecha acá, con cariño en cada detalle.
              </p>
              <p>
                Así nació Yorusito. Hoy tenemos colecciones como SuperStars, Romantic y GYM. Puedes elegir
                un diseño listo o pedirnos que lo personalicemos para ti.
              </p>
            </div>
            <p className="mt-8 text-sm text-zinc-400">Desde 2023 · Lima, Perú</p>
          </div>

          <div className="overflow-hidden rounded-2xl bg-zinc-100">
            <img
              src="/images/herocristiano.png"
              alt="Colección Yorusito"
              className="aspect-[16/10] w-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Pilares */}
      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-zinc-400">Lo que nos importa</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Tres cosas que siempre cuidamos
            </h2>
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="border-t border-zinc-200 pt-6">
                <h3 className="text-lg font-semibold text-zinc-950">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-500">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Misión */}
      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-24">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-zinc-400">Lo que hacemos</p>
            <p className="mt-4 text-2xl font-medium leading-10 text-zinc-800 sm:text-3xl">
              Ayudarte a encontrar un polo que te encante, de buena calidad y sin complicarte la vida.
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-zinc-400">A dónde vamos</p>
            <p className="mt-4 text-base leading-8 text-zinc-600">
              Queremos que cuando pienses en un polo con diseño propio en Perú, pienses en Yorusito. Una
              marca cercana, con buenos diseños y gente que te responde de verdad.
            </p>
          </div>
        </div>
      </section>

      {/* Fundador */}
      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-zinc-400">Quién está detrás</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">Sebastián Ramírez</h2>
          <p className="mt-2 text-sm text-zinc-400">Fundador de Yorusito</p>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-zinc-600">
            Empecé Yorusito porque quería hacer polos que la gente de verdad quisiera usar. Me encargo de
            los diseños, la producción y de hablar contigo si necesitas algo a tu medida. Cada pedido lo
            tomamos en serio.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-zinc-950">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:px-8 lg:py-20">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              ¿Quieres ver los diseños?
            </h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-zinc-400">
              Mira el catálogo de polos o escríbenos si quieres armar algo a tu gusto.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/products/polos"
              className="inline-flex items-center justify-center bg-white px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-zinc-950 transition hover:bg-zinc-100"
            >
              Ver polos
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-zinc-600 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:border-zinc-400"
            >
              Escríbenos
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
