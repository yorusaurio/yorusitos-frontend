import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faHeart, faDumbbell, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const collections = [
  {
    name: "SuperStars",
    slug: "superstars",
    description: "Diseños exclusivos de tus estrellas deportivas favoritas",
    icon: faCrown,
    count: "12+ diseños",
    featured: true,
    tags: ["Fútbol", "Leyendas", "Premium"]
  },
  {
    name: "Romantic",
    slug: "romantic",
    description: "Diseños tiernos y románticos para expresar tu amor",
    icon: faHeart,
    count: "8+ diseños",
    featured: false,
    tags: ["Amor", "Regalos", "Parejas"]
  },
  {
    name: "GYM",
    slug: "gym",
    description: "Motivación y fuerza para tus entrenamientos",
    icon: faDumbbell,
    count: "15+ diseños",
    featured: true,
    tags: ["Fitness", "Motivación", "Deporte"]
  }
];

export default function PolosCollections() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Colecciones Especiales
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra el diseño perfecto para tu estilo
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              href={collection.slug === "superstars" ? "/products/polos?collection=SuperStars" : `/products/polos/${collection.slug}`}
              className="group"
            >
              <div className="bg-white border-2 border-black p-8 hover:bg-black hover:text-white transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <FontAwesomeIcon 
                    icon={collection.icon} 
                    className="text-4xl"
                  />
                  {collection.featured && (
                    <span className="text-xs font-bold px-3 py-1 bg-black text-white group-hover:bg-white group-hover:text-black border border-black">
                      DESTACADO
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold mb-3">
                  {collection.name}
                </h3>
                
                <p className="text-sm mb-4 opacity-80">
                  {collection.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {collection.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="text-xs px-2 py-1 border border-current opacity-60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-current">
                  <span className="text-sm font-semibold">
                    {collection.count}
                  </span>
                  <FontAwesomeIcon 
                    icon={faArrowRight}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
