"use client";

import React from "react";

const HistorySection: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-block">
              <span className="text-sm font-semibold uppercase tracking-wider text-gray-500 bg-white px-4 py-2 rounded-full">
                Nuestra Historia
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight">
              Desde el inicio
              <br />
              <span className="text-gray-400">hasta hoy</span>
            </h2>
            
            <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
              <p>
                Yorusito nació del sueño de democratizar la moda personalizada en el Perú. 
                Todo comenzó con una simple idea: <span className="text-black font-semibold">
                ¿por qué no podemos todos tener prendas que realmente nos representen?</span>
              </p>
              
              <p>
                Desde nuestros humildes inicios, nos hemos dedicado a construir una marca 
                que priorice la calidad, la originalidad y, sobre todo, la satisfacción 
                de nuestros clientes. Cada diseño cuenta una historia única.
              </p>
              
              <p>
                Hoy, Yorusito es más que una marca de ropa; es una comunidad de personas 
                que valoran la expresión personal y la calidad artesanal en cada prenda.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <span className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold">
                Fundado en 2023
              </span>
              <span className="px-4 py-2 bg-white text-black border-2 border-black rounded-lg text-sm font-semibold">
                100% Peruano
              </span>
              <span className="px-4 py-2 bg-gray-100 text-black rounded-lg text-sm font-semibold">
                Calidad Premium
              </span>
            </div>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden">
                  <img
                    src="/images/polo.avif"
                    alt="Productos Yorusito"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-[4/3] bg-gray-200 rounded-2xl overflow-hidden">
                  <img
                    src="/images/gym/gym1.webp"
                    alt="Colección GYM"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-[4/3] bg-gray-200 rounded-2xl overflow-hidden">
                  <img
                    src="/images/superstars/superstars1.webp"
                    alt="Colección SuperStars"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden">
                  <img
                    src="/images/girlfriend/girlfriend1.webp"
                    alt="Diseños personalizados"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
