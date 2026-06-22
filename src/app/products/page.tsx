"use client";

import React, { useMemo, useState } from "react";
import { mockProducts } from "@/data/mockProducts";
import ProductsSidebar from "@/components/products/ProductsSidebar";
import ProductsGrid from "@/components/products/ProductsGrid";
import { useProductStock } from "@/hooks/useProductStock";

const ProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<number>(1);
  const [maxPrice, setMaxPrice] = useState<number>(210);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { stock, loading: stockLoading } = useProductStock();

  const availableCollections = useMemo(
    () => Array.from(new Set(mockProducts.map((product) => product.collection))),
    []
  );

  const availableColors = useMemo(
    () => Array.from(new Set(mockProducts.flatMap((product) => product.colors ?? []))),
    []
  );

  const availableSizes = useMemo(
    () => Array.from(new Set(mockProducts.flatMap((product) => product.sizes ?? []))),
    []
  );

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCollection = selectedCollection === "all" || product.collection === selectedCollection;
    const matchesColor = selectedColor === "all" || (product.colors ?? []).includes(selectedColor);
    const matchesSize = selectedSize === "all" || (product.sizes ?? []).includes(selectedSize);
    const priceFloor = Math.min(minPrice, maxPrice);
    const priceCeiling = Math.max(minPrice, maxPrice);
    const matchesPrice = product.price >= priceFloor && product.price <= priceCeiling;

    return matchesSearch && matchesCollection && matchesColor && matchesSize && matchesPrice;
  });

  return (
<<<<<<< HEAD
    <main className="bg-white min-h-screen pt-20">
      <SearchFilterBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        viewMode={viewMode}
        setViewMode={setViewMode}
        resultsCount={filteredProducts.length}
      />
      
      <CategoriesGrid categories={categories} />
      
      <CollectionsGrid collections={collections} />
      
      <ProductsGrid products={filteredProducts} viewMode={viewMode} stock={stock} stockLoading={stockLoading} />
=======
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,0,0,0.05),_transparent_28%),linear-gradient(to_bottom,_#ffffff,_#fafafa)] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <section className="mb-10 overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <div className="grid gap-8 lg:grid-cols-[1.3fr,0.7fr]">
            <div className="p-8 sm:p-10 lg:p-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-gray-600">
                Catálogo
              </div>
              <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-black sm:text-5xl lg:text-6xl">
                Encuentra piezas con más presencia y menos ruido visual.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
                Explora todos los productos y afina la búsqueda con filtros claros, visuales y cómodos de usar.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-gray-600">
                <span className="rounded-full bg-gray-100 px-4 py-2 font-medium text-gray-700">Colecciones</span>
                <span className="rounded-full bg-gray-100 px-4 py-2 font-medium text-gray-700">Precio</span>
                <span className="rounded-full bg-gray-100 px-4 py-2 font-medium text-gray-700">Color</span>
                <span className="rounded-full bg-gray-100 px-4 py-2 font-medium text-gray-700">Talla</span>
              </div>
            </div>

            <div className="flex items-end justify-between border-t border-gray-200 bg-gradient-to-br from-black via-zinc-900 to-zinc-700 p-8 text-white lg:border-l lg:border-t-0 lg:p-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Resultados</p>
                <p className="mt-3 text-5xl font-semibold leading-none">{filteredProducts.length}</p>
                <p className="mt-3 max-w-xs text-sm leading-6 text-white/70">
                  {filteredProducts.length === 1 ? "producto encontrado" : "productos encontrados"} con los filtros actuales.
                </p>
              </div>
              <div className="hidden rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm md:block">
                <p className="text-xs uppercase tracking-[0.25em] text-white/55">Vista actual</p>
                <p className="mt-2 text-sm font-medium">{viewMode === "grid" ? "Cuadrícula" : "Lista"}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[340px,1fr] items-start">
          <ProductsSidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCollection={selectedCollection}
            setSelectedCollection={setSelectedCollection}
            collections={availableCollections}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            priceMin={1}
            priceMax={210}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            colors={availableColors}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            sizes={availableSizes}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          <ProductsGrid products={filteredProducts} viewMode={viewMode} />
        </div>
      </div>
>>>>>>> b723d4963cdd040f69a4a2348e70c9dd55d3d311
    </main>
  );
};

export default ProductsPage;
