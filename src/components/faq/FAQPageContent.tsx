"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const faqItems = [
  {
    id: 1,
    question: "¿De qué material son los polos?",
    answer:
      "Son de algodón jersey, cómodo y fresco. El estampado aguanta bien los lavados si lo cuidas: lava con agua fría, del revés, y evita la lejía.",
  },
  {
    id: 2,
    question: "¿Cuánto demora la entrega?",
    answer:
      "En Lima suele tardar de 2 a 3 días hábiles. A provincias, de 5 a 7 días hábiles según el courier. Si tienes prisa, escríbenos y vemos qué se puede hacer.",
  },
  {
    id: 3,
    question: "¿Envían a provincias?",
    answer: "Sí, enviamos a todo el Perú por Shalom, Olva y otros couriers. El costo depende de tu ciudad.",
  },
  {
    id: 4,
    question: "¿Puedo personalizar un diseño?",
    answer:
      "Claro. Puedes mandarnos tu idea, logo o frase por WhatsApp y lo armamos contigo. También puedes elegir un diseño del catálogo y pedir cambios.",
  },
  {
    id: 5,
    question: "¿Hacen pedidos al por mayor?",
    answer:
      "Sí. A partir de cierta cantidad hay precios especiales. Escríbenos con lo que necesitas y te pasamos una cotización sin compromiso.",
  },
  {
    id: 6,
    question: "¿Cómo sé qué talla pedir?",
    answer:
      "Trabajamos desde S hasta L (y XL con un costo extra). Si tienes duda, mándanos tus medidas por WhatsApp y te ayudamos a elegir.",
  },
  {
    id: 7,
    question: "¿Qué pasa si llega algo mal?",
    answer:
      "Avísanos dentro de las primeras 48 horas con fotos y lo solucionamos: cambio o devolución según el caso. Queremos que quedes contento.",
  },
  {
    id: 8,
    question: "¿Tienen tienda física?",
    answer:
      "Por ahora vendemos solo online. Así mantenemos mejores precios. Te atendemos por WhatsApp, Instagram y correo.",
  },
];

export default function FAQPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<number | null>(1);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return faqItems;

    return faqItems.filter(
      (item) =>
        item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-white pt-20 text-zinc-950">
      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.42em] text-zinc-400">Ayuda</p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">Preguntas frecuentes</h1>
          <p className="mt-5 text-base leading-8 text-zinc-500">
            Respuestas claras a lo que más nos preguntan. Si no encuentras lo tuyo, escríbenos.
          </p>

          <div className="mt-8">
            <input
              type="search"
              placeholder="Buscar una pregunta..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {filteredItems.length === 0 ? (
          <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-6 py-8 text-center text-sm text-zinc-500">
            No encontramos nada con &ldquo;{searchQuery}&rdquo;. Prueba con otras palabras o{" "}
            <Link href="/contact" className="font-medium text-zinc-950 underline underline-offset-2">
              escríbenos
            </Link>
            .
          </p>
        ) : (
          <div className="divide-y divide-zinc-200 border-y border-zinc-200">
            {filteredItems.map((item) => {
              const isOpen = openId === item.id;

              return (
                <div key={item.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="flex w-full items-start justify-between gap-4 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-medium leading-7 text-zinc-950">{item.question}</span>
                    <span className="mt-1 shrink-0 text-lg leading-none text-zinc-400">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen ? (
                    <p className="pb-5 text-sm leading-7 text-zinc-500">{item.answer}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-12 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-zinc-500">¿Te quedó alguna duda?</p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-zinc-950 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-zinc-800"
          >
            Escríbenos
          </Link>
        </div>
      </section>
    </main>
  );
}
