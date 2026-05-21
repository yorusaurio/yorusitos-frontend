"use client";

import React from "react";

const FounderSection: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Conoce al Fundador
          </h2>
          <p className="text-xl text-gray-600">
            La mente creativa y el corazón apasionado detrás de cada diseño
          </p>
        </div>
        
        <div className="bg-gray-50 p-10 md:p-12 rounded-3xl">
          <div className="text-center mb-8">
            <div className="w-32 h-32 bg-black rounded-full mx-auto mb-6 overflow-hidden">
              <img
                src="/images/team-member1.jpg"
                alt="Sebastián Ramírez - Fundador de Yorusito"
                className="w-full h-full object-cover"
              />
            </div>
            
            <h3 className="text-2xl font-bold text-black mb-2">Sebastián Ramírez</h3>
            <p className="text-gray-600 font-semibold mb-6">Fundador y CEO de Yorusito</p>
          </div>
          
          <p className="text-lg leading-relaxed text-gray-600 text-center max-w-2xl mx-auto mb-8">
            Como emprendedor apasionado y visionario, me encargo de cada aspecto del negocio, 
            desde el diseño conceptual y la producción artesanal hasta la atención personalizada 
            al cliente y las estrategias de crecimiento. Mi objetivo es crear una experiencia 
            única que conecte profundamente con las historias y sueños de cada cliente.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 bg-black text-white rounded-full text-sm font-semibold">
              Diseñador Creativo
            </span>
            <span className="px-4 py-2 bg-white text-black border-2 border-black rounded-full text-sm font-semibold">
              Emprendedor Visionario
            </span>
            <span className="px-4 py-2 bg-white text-black border-2 border-black rounded-full text-sm font-semibold">
              Especialista en Personalización
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
