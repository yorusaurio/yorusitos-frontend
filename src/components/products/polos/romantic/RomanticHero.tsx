"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faGift, faCrown, faMoon } from "@fortawesome/free-solid-svg-icons";

export default function RomanticHero() {
  const romanticFeatures = [
    {
      icon: faHeart,
      title: "Diseños Únicos",
      description: "Perfectos para momentos especiales"
    },
    {
      icon: faGift,
      title: "Regalo Perfecto",
      description: "Ideal para sorprender a tu pareja"
    },
    {
      icon: faCrown,
      title: "Detalles Exclusivos",
      description: "Acabados premium y elegantes"
    },
    {
      icon: faMoon,
      title: "Estilo Romántico",
      description: "Para citas y ocasiones especiales"
    }
  ];

  return (
    <section className="bg-white text-black pt-24 pb-20 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Colección Romantic
          </h1>
          <p className="text-xl text-gray-600">
            Elegancia para tus momentos especiales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {romanticFeatures.map((feature, index) => (
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
