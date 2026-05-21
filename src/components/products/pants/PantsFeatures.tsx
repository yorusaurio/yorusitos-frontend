import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem, faLeaf, faCheck, faCut } from "@fortawesome/free-solid-svg-icons";

const features = [
  {
    icon: faGem,
    title: "Diseños Versátiles",
    description: "Pantalones que se adaptan a cualquier ocasión y estilo personal"
  },
  {
    icon: faLeaf,
    title: "Materiales Sostenibles",
    description: "Comprometidos con el medio ambiente usando materiales eco-friendly"
  },
  {
    icon: faCheck,
    title: "Ajuste Perfecto",
    description: "Múltiples tallas y cortes para que encuentres tu ajuste ideal"
  },
  {
    icon: faCut,
    title: "Cortes Modernos",
    description: "Desde joggers relajados hasta pantalones elegantes de vestir"
  }
];

export default function PantsFeatures() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Lo que puedes esperar
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos desarrollando nuestra línea de pantalones premium
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-6 border-2 border-gray-200 hover:border-black transition-colors"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white mb-4">
                <FontAwesomeIcon icon={feature.icon} className="text-2xl" />
              </div>
              
              <h3 className="text-lg font-bold mb-2">
                {feature.title}
              </h3>
              
              <p className="text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
