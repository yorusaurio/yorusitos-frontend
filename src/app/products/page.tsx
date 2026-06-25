import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faShirt, faWind, faPersonWalking } from "@fortawesome/free-solid-svg-icons";

const categories = [
  {
    name: "Polos",
    href: "/products/polos",
    description: "Diseños exclusivos, estampados premium y opciones personalizables.",
    icon: faShirt,
    featured: true,
  },
  {
    name: "Hoodies",
    href: "/products/hoodies",
    description: "Comodidad y estilo para el día a día o entrenamientos.",
    icon: faWind,
    featured: false,
  },
  {
    name: "Pantalones",
    href: "/products/pants",
    description: "Prendas versátiles con acabados pensados para moverte con estilo.",
    icon: faPersonWalking,
    featured: false,
  },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,0,0,0.04),_transparent_30%),linear-gradient(to_bottom,_#ffffff,_#f7f7f7)] pt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <section className="mb-12 overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="p-8 sm:p-10 lg:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Catálogo general</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-black sm:text-5xl lg:text-6xl">
                Explora por categoría
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
                Elige el tipo de prenda que buscas y entra directo al catálogo correspondiente.
              </p>
            </div>

            <div className="flex items-end border-t border-gray-200 bg-gradient-to-br from-black via-zinc-900 to-zinc-700 p-8 text-white lg:border-l lg:border-t-0 lg:p-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Yorusito</p>
                <p className="mt-3 text-3xl font-semibold">Prendas con identidad</p>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
                  Polos, hoodies y pantalones diseñados para destacar con calidad premium.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.name} href={category.href} className="group">
              <article className="flex h-full flex-col rounded-[1.75rem] border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-xl">
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
                    <FontAwesomeIcon icon={category.icon} className="text-xl" />
                  </div>
                  {category.featured ? (
                    <span className="rounded-full bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                      Principal
                    </span>
                  ) : null}
                </div>

                <h2 className="text-2xl font-bold text-black">{category.name}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">{category.description}</p>

                <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-5 text-sm font-semibold text-black">
                  <span>Ver catálogo</span>
                  <FontAwesomeIcon icon={faArrowRight} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
