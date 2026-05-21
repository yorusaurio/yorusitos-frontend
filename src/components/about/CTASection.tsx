"use client";

import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          ¿Listo para crear tu prenda única?
        </h2>
        <p className="text-xl text-gray-300 mb-10">
          Únete a nuestra comunidad y descubre el poder de la moda personalizada
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/products" 
            className="group px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3"
          >
            Ver Catálogo
            <FontAwesomeIcon 
              icon={faArrowRight} 
              className="group-hover:translate-x-1 transition-transform duration-300" 
            />
          </Link>
          <Link 
            href="/contact" 
            className="px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-black transition-all duration-300"
          >
            Contactar Ahora
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
