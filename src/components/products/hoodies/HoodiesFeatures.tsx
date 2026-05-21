import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem, faSnowflake, faCheck, faRocket } from "@fortawesome/free-solid-svg-icons";

const features = [
  {
    icon: faGem,
    title: "Diseños Exclusivos",
    description: "Estampados únicos que no encontrarás en ningún otro lugar"
  },
  {
    icon: faSnowflake,
    title: "Máximo Confort",
    description: "Materiales premium para el máximo confort en cualquier clima"
  },
  {
    icon: faCheck,
    title: "Calidad Premium",
    description: "Algodón 100% peruano de primera calidad y acabados perfectos"
  },
  {
    icon: faRocket,
    title: "Estilo Urbano",
    description: "Diseños modernos perfectos para el estilo de vida urbano"
  }
];

export default function HoodiesFeatures() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Lo que puedes esperar
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos trabajando en nuestra línea de hoodies premium
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
