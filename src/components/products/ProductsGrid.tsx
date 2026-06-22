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
    <section className="rounded-[2rem] border border-gray-200 bg-white p-4 shadow-[0_18px_40px_rgba(0,0,0,0.04)] sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">Productos</p>
            <h2 className="text-3xl font-semibold tracking-tight text-black mb-2">
            Todos los Productos
            </h2>
            <p className="text-gray-600">
              {products.length} {products.length === 1 ? 'producto encontrado' : 'productos encontrados'}
            </p>
          </div>
        </div>

        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
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
<<<<<<< HEAD
        <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex">
          <div className="relative w-48 h-48 flex-shrink-0 bg-gray-100 overflow-hidden">
=======
        <div className="group flex overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
          <div className="h-48 w-48 flex-shrink-0 overflow-hidden bg-gray-100">
>>>>>>> b723d4963cdd040f69a4a2348e70c9dd55d3d311
            <img 
              src={product.images[0]} 
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${inStock ? "" : "grayscale opacity-60"}`}
            />
            {!inStock ? <OutOfStockRibbon /> : null}
          </div>
          <div className="flex flex-1 flex-col justify-between p-6">
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
              <span className="text-2xl font-semibold text-black tracking-tight">
                S/ {product.price.toFixed(2)}
              </span>
<<<<<<< HEAD
              <button className={`px-6 py-2 font-semibold rounded-lg transition-colors ${inStock ? "bg-black text-white hover:bg-gray-800" : "bg-zinc-200 text-zinc-600"}`}>
                {inStock ? "Ver Detalles" : "Sin stock"}
=======
              <button className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800">
                Ver Detalles
>>>>>>> b723d4963cdd040f69a4a2348e70c9dd55d3d311
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${inStock ? "" : "grayscale opacity-60"}`}
          />
          {!inStock ? <OutOfStockRibbon /> : null}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          
<<<<<<< HEAD
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200">
              {inStock ? "Ver Detalles" : "SIN STOCK"}
=======
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
            <button className="w-full rounded-full bg-white py-3 text-sm font-semibold text-black shadow-lg shadow-black/10 transition-colors duration-200 hover:bg-gray-100">
              Ver Detalles
>>>>>>> b723d4963cdd040f69a4a2348e70c9dd55d3d311
            </button>
          </div>
        </div>

        <div className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                {product.collection}
              </p>
              <h3 className="text-lg font-semibold tracking-tight text-black line-clamp-1">
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
          
          <div className="flex items-center justify-between pt-1">
            <span className="text-2xl font-semibold tracking-tight text-black">
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
