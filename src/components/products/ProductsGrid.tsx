"use client";

import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import type { ProductStockMap } from "@/lib/product-stock";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  collection: string;
}

interface ProductsGridProps {
  products: Product[];
  viewMode: "grid" | "list";
  stock?: ProductStockMap;
  stockLoading?: boolean;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({ products, viewMode, stock = {}, stockLoading = false }) => {
  if (products.length === 0) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-black mb-2">No se encontraron productos</h3>
          <p className="text-gray-600">Intenta con otros términos de búsqueda</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black mb-2">
            Todos los Productos
          </h2>
          <p className="text-gray-600">
            {products.length} {products.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </p>
        </div>

        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" 
            : "space-y-6"
        }>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} viewMode={viewMode} inStock={stockLoading || (stock[product.id]?.available ?? 0) > 0} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Product Card Component
const ProductCard: React.FC<{ product: Product; viewMode: "grid" | "list"; inStock: boolean }> = ({ product, viewMode, inStock }) => {
  if (viewMode === "list") {
    return (
      <Link href={`/products/${product.id}`}>
        <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex">
          <div className="relative w-48 h-48 flex-shrink-0 bg-gray-100 overflow-hidden">
            <img 
              src={product.images[0]} 
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${inStock ? "" : "grayscale opacity-60"}`}
            />
            {!inStock ? <OutOfStockRibbon /> : null}
          </div>
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    {product.collection}
                  </p>
                  <h3 className="text-xl font-bold text-black">
                    {product.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <FontAwesomeIcon icon={faStar} className="text-sm" />
                  <span className="text-sm font-semibold text-black">4.8</span>
                </div>
              </div>
              <p className="text-gray-600 line-clamp-2 mb-4">
                {product.description}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-black">
                S/ {product.price.toFixed(2)}
              </span>
              <button className={`px-6 py-2 font-semibold rounded-lg transition-colors ${inStock ? "bg-black text-white hover:bg-gray-800" : "bg-zinc-200 text-zinc-600"}`}>
                {inStock ? "Ver Detalles" : "Sin stock"}
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500">
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${inStock ? "" : "grayscale opacity-60"}`}
          />
          {!inStock ? <OutOfStockRibbon /> : null}
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
          
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200">
              {inStock ? "Ver Detalles" : "SIN STOCK"}
            </button>
          </div>
        </div>

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
            {!inStock ? (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-red-700">
                Sin stock
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
};

function OutOfStockRibbon() {
  return (
    <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-black uppercase tracking-wide text-white shadow">
      Sin stock
    </span>
  );
}

export default ProductsGrid;
