import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faShirt, faStar, faFire } from "@fortawesome/free-solid-svg-icons";

const benefits = [
  {
    icon: faCheck,
    title: "Calidad Premium",
    description: "Algodón 100% peruano de primera calidad"
  },
  {
    icon: faShirt,
    title: "Diseños Únicos",
    description: "Estampados exclusivos que no encontrarás en otro lugar"
  },
  {
    icon: faStar,
    title: "Personalización",
    description: "Adaptamos el diseño a tu talla y preferencias"
  },
  {
    icon: faFire,
    title: "Tendencia",
    description: "Siempre a la vanguardia de las últimas modas"
  }
];

export default function PolosBenefits() {
  return (
    <section className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">
            Por qué elegir Yorusito
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="text-center group hover:scale-105 transition-transform"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white text-black rounded-full mb-4 group-hover:bg-gray-200 transition-colors">
                <FontAwesomeIcon icon={benefit.icon} className="text-2xl" />
              </div>
              
              <h3 className="text-lg font-bold mb-2">
                {benefit.title}
              </h3>
              
              <p className="text-sm text-gray-400">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
