"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface Value {
  icon: IconDefinition;
  title: string;
  description: string;
}

interface ValuesSectionProps {
  valores: Value[];
}

const ValuesSection: React.FC<ValuesSectionProps> = ({ valores }) => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Nuestros Valores
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Los principios que guían cada decisión y cada diseño que creamos
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {valores.map((valor, index) => (
            <div key={index} className="group bg-gray-50 p-8 rounded-2xl hover:bg-black hover:text-white transition-all duration-300">
              <div className="w-14 h-14 bg-black group-hover:bg-white rounded-xl flex items-center justify-center mb-6 transition-colors duration-300">
                <FontAwesomeIcon icon={valor.icon} className="text-2xl text-white group-hover:text-black transition-colors duration-300" />
              </div>
              
              <h3 className="text-xl font-bold text-black group-hover:text-white mb-4 transition-colors duration-300">
                {valor.title}
              </h3>
              <p className="text-gray-600 group-hover:text-gray-300 leading-relaxed transition-colors duration-300">
                {valor.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
