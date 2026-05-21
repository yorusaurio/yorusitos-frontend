"use client";

import React from "react";
import Link from "next/link";
import { mockProducts } from "@/data/mockProducts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faStar } from "@fortawesome/free-solid-svg-icons";

const FeaturedProducts: React.FC = () => {
  const featuredProducts = mockProducts.slice(0, 6);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Productos Destacados
            </h2>
            <p className="text-lg text-gray-600">
              Selección exclusiva de nuestras mejores piezas
            </p>
          </div>
          
          <Link href="/products" className="hidden md:flex items-center gap-2 text-black font-semibold hover:gap-4 transition-all duration-300">
            Ver todo
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-12 text-center md:hidden">
          <Link href="/products">
            <button className="px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors duration-300 flex items-center gap-3 mx-auto">
              Ver todos los productos
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Product Card Component
const ProductCard: React.FC<{ product: any; index: number }> = ({ product, index }) => {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500">
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
          
          {/* Badges */}
          {index < 2 && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full">
                Nuevo
              </span>
            </div>
          )}

          {/* Quick View Button */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200">
              Ver Detalles
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                {product.collection}
              </p>
              <h3 className="text-lg font-semibold text-black line-clamp-1">
                {product.name}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-yellow-500">
              <FontAwesomeIcon icon={faStar} className="text-sm" />
              <span className="text-sm font-semibold text-black">4.8</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold text-black">
              S/ {product.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">
              {product.sizes.length} tallas
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedProducts;
