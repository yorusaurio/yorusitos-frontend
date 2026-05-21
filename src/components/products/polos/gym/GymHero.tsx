"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDumbbell, faShieldAlt, faBolt, faTrophy } from "@fortawesome/free-solid-svg-icons";

export default function GymHero() {
  const gymFeatures = [
    {
      icon: faDumbbell,
      title: "Máximo Rendimiento",
      description: "Diseñados para entrenamientos intensos"
    },
    {
      icon: faShieldAlt,
      title: "Tecnología DriFit",
      description: "Absorbe la humedad y mantiene seco"
    },
    {
      icon: faBolt,
      title: "Flexibilidad Total",
      description: "Máxima libertad de movimiento"
    },
    {
      icon: faTrophy,
      title: "Calidad Premium",
      description: "Materiales de alta resistencia"
    }
  ];

  return (
    <section className="bg-white text-black pt-24 pb-20 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Colección GYM
          </h1>
          <p className="text-xl text-gray-600">
            Ropa deportiva de alto rendimiento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {gymFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-lg text-center hover:bg-gray-100 transition-colors"
            >
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={feature.icon} className="text-2xl" />
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
