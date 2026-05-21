"use client";

import React from "react";

interface HeroSectionProps {
  estadisticas: Array<{
    numero: string;
    texto: string;
  }>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ estadisticas }) => {
  return (
    <section className="relative py-20 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-6">
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
              Sobre Nosotros
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-black mb-8 leading-tight">
            Creando Estilo,
            <br />
            <span className="text-gray-400">Definiendo Elegancia</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-12">
            Somos un emprendimiento peruano apasionado por crear prendas personalizadas únicas 
            que reflejan el estilo y personalidad de nuestros clientes.
          </p>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200">
            {estadisticas.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-black mb-2">{stat.numero}</div>
                <div className="text-sm text-gray-600">{stat.texto}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
