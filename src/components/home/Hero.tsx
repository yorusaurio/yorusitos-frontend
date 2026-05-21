"use client";

import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faShirt, faTruck, faAward } from "@fortawesome/free-solid-svg-icons";

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen bg-white flex items-center pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="space-y-8 lg:pr-12">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="text-sm font-semibold uppercase tracking-wider text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                  Colección 2026
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black leading-tight">
                Elegancia
                <br />
                <span className="text-gray-400">Redefinida</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl">
                Descubre prendas exclusivas diseñadas para el hombre moderno que valora el estilo, la calidad y la personalización.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <button className="group w-full sm:w-auto px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-3">
                  Explorar Colección
                  <FontAwesomeIcon 
                    icon={faArrowRight} 
                    className="group-hover:translate-x-1 transition-transform duration-300" 
                  />
                </button>
              </Link>
              
              <Link href="/contact">
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-lg border-2 border-black hover:bg-black hover:text-white transition-all duration-300">
                  Personalizar Diseño
                </button>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <Feature 
                icon={faShirt}
                title="Premium"
                description="Telas de alta calidad"
              />
              <Feature 
                icon={faTruck}
                title="Envío"
                description="Rápido y seguro"
              />
              <Feature 
                icon={faAward}
                title="Garantía"
                description="100% satisfacción"
              />
            </div>
          </div>

          {/* Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden group">
                  <img 
                    src="/images/polo.avif" 
                    alt="Polo elegante" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden group">
                  <img 
                    src="/images/gym/gym1.webp" 
                    alt="Ropa deportiva" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              
              <div className="space-y-4 pt-8">
                <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden group">
                  <img 
                    src="/images/superstars/superstars1.webp" 
                    alt="Colección SuperStars" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden group">
                  <img 
                    src="/images/girlfriend/girlfriend1.webp" 
                    alt="Estilo romántico" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-gray-50 to-transparent rounded-full blur-3xl opacity-50"></div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 pt-12 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Stat value="500+" label="Clientes Satisfechos" />
            <Stat value="50+" label="Diseños Únicos" />
            <Stat value="100%" label="Calidad Premium" />
            <Stat value="24/7" label="Atención al Cliente" />
          </div>
        </div>
      </div>
    </section>
  );
};

// Componentes auxiliares
const Feature: React.FC<{ icon: any; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="text-center space-y-2">
    <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mx-auto">
      <FontAwesomeIcon icon={icon} className="text-lg" />
    </div>
    <div>
      <p className="font-semibold text-black text-sm">{title}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  </div>
);

const Stat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="text-center">
    <p className="text-3xl md:text-4xl font-bold text-black mb-2">{value}</p>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
);

export default Hero;
