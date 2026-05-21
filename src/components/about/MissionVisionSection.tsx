"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faEye } from "@fortawesome/free-solid-svg-icons";

const MissionVisionSection: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-black p-10 md:p-12 rounded-3xl text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faBullseye} className="text-2xl" />
              </div>
              <h2 className="text-3xl font-bold">Nuestra Misión</h2>
            </div>
            <p className="text-lg leading-relaxed text-gray-300 mb-8">
              Inspirar y empoderar a las personas a expresar su individualidad única 
              a través de prendas personalizadas que combinan calidad excepcional, 
              creatividad sin límites y un estilo auténtico que los represente.
            </p>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm text-gray-400 italic">
                "Cada prenda que creamos es una extensión de la personalidad de quien la porta"
              </p>
            </div>
          </div>
          
          <div className="bg-white p-10 md:p-12 rounded-3xl border-2 border-black">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faEye} className="text-2xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-black">Nuestra Visión</h2>
            </div>
            <p className="text-lg leading-relaxed text-gray-600 mb-8">
              Convertirnos en el referente líder de prendas personalizadas en el mercado 
              peruano y latinoamericano, expandiendo la marca Yorusito y dejando una 
              huella positiva en cada cliente y comunidad que tocamos.
            </p>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600 italic">
                "Soñamos con un mundo donde cada persona pueda expresar su autenticidad"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
