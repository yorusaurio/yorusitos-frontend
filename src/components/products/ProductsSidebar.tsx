"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch, faThLarge, faList } from "@fortawesome/free-solid-svg-icons";

interface ProductsSidebarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCollection: string;
  setSelectedCollection: (collection: string) => void;
  collections: string[];
  minPrice: number;
  setMinPrice: (value: number) => void;
  maxPrice: number;
  setMaxPrice: (value: number) => void;
  priceMin: number;
  priceMax: number;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  colors: string[];
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  sizes: string[];
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

const ProductsSidebar: React.FC<ProductsSidebarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCollection,
  setSelectedCollection,
  collections,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  priceMin,
  priceMax,
  selectedColor,
  setSelectedColor,
  colors,
  selectedSize,
  setSelectedSize,
  sizes,
  viewMode,
  setViewMode,
}) => {
  const updateNumberValue = (setter: (value: number) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = Number(event.target.value);
    setter(Number.isFinite(parsedValue) ? parsedValue : 0);
  };

  const activePriceMin = Math.min(minPrice, maxPrice);
  const activePriceMax = Math.max(minPrice, maxPrice);

  return (
    <aside className="space-y-6">
      <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.05)]">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white shadow-lg shadow-black/10">
            <FontAwesomeIcon icon={faSearch} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">Buscar</p>
            <h2 className="text-xl font-semibold tracking-tight text-black">Encuentra rápido</h2>
          </div>
        </div>

        <input
          type="text"
          placeholder="Buscar productos"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white"
        />
      </div>

      <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.05)]">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white shadow-lg shadow-black/10">
            <FontAwesomeIcon icon={faFilter} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">Filtrar por</p>
            <h2 className="text-xl font-semibold tracking-tight text-black">Ajusta tu selección</h2>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Colecciones</p>
              <span className="text-xs text-gray-400">{collections.length + 1} opciones</span>
            </div>
            <div className="space-y-2">
              <CollectionItem label="Todas" active={selectedCollection === "all"} onClick={() => setSelectedCollection("all")} />
              {collections.map((collection) => (
                <CollectionItem
                  key={collection}
                  label={collection}
                  active={selectedCollection === collection}
                  onClick={() => setSelectedCollection(collection)}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Precio</p>
              <span className="text-xs text-gray-400">PEN</span>
            </div>
            <div className="space-y-4 rounded-[1.5rem] bg-gray-50 p-4 ring-1 ring-gray-100">
              <div className="relative h-12">
                <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gray-200" />
                <div
                  className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-black"
                  style={{
                    left: `${((activePriceMin - priceMin) / (priceMax - priceMin || 1)) * 100}%`,
                    right: `${100 - ((activePriceMax - priceMin) / (priceMax - priceMin || 1)) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  min={priceMin}
                  max={priceMax}
                  value={activePriceMin}
                  onChange={updateNumberValue(setMinPrice)}
                  className="range-thumb pointer-events-auto absolute inset-0 h-12 w-full appearance-none bg-transparent"
                />
                <input
                  type="range"
                  min={priceMin}
                  max={priceMax}
                  value={activePriceMax}
                  onChange={updateNumberValue(setMaxPrice)}
                  className="range-thumb pointer-events-auto absolute inset-0 h-12 w-full appearance-none bg-transparent"
                />
              </div>
              <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                <span>{activePriceMin} PEN</span>
                <span>{activePriceMax} PEN</span>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-gray-900">Color</p>
            <div className="flex flex-wrap gap-3">
              <ColorSwatch
                label="Todos"
                active={selectedColor === "all"}
                onClick={() => setSelectedColor("all")}
                swatchClassName="bg-gradient-to-br from-gray-300 to-gray-100"
              />
              {colors.map((color) => (
                <ColorSwatch
                  key={color}
                  label={color}
                  active={selectedColor === color}
                  onClick={() => setSelectedColor(color)}
                  swatchClassName={getColorSwatchClassName(color)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-gray-900">Talla</p>
            <div className="flex flex-wrap gap-2">
              <FilterPill label="Todas" active={selectedSize === "all"} onClick={() => setSelectedSize("all")} />
              {sizes.map((size) => (
                <FilterPill
                  key={size}
                  label={size}
                  active={selectedSize === size}
                  onClick={() => setSelectedSize(size)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.05)]">
        <p className="mb-3 text-sm font-semibold text-gray-900">Vista</p>
        <div className="flex gap-2 rounded-[1.5rem] bg-gray-100 p-1.5">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[1.15rem] px-4 py-3 text-sm font-semibold transition ${
              viewMode === "grid" ? "bg-black text-white shadow-lg shadow-black/10" : "text-gray-600 hover:bg-white hover:text-black"
            }`}
          >
            <FontAwesomeIcon icon={faThLarge} />
            Cuadrícula
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[1.15rem] px-4 py-3 text-sm font-semibold transition ${
              viewMode === "list" ? "bg-black text-white shadow-lg shadow-black/10" : "text-gray-600 hover:bg-white hover:text-black"
            }`}
          >
            <FontAwesomeIcon icon={faList} />
            Lista
          </button>
        </div>
      </div>
    </aside>
  );
};

const CollectionItem: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center justify-between rounded-[1.25rem] border px-4 py-3 text-left transition ${
        active
          ? "border-black bg-black text-white shadow-lg shadow-black/10"
          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:text-black"
      }`}
    >
      <span className="font-medium">{label}</span>
      <span className={`h-2.5 w-2.5 rounded-full transition ${active ? "bg-white" : "bg-gray-300 group-hover:bg-black"}`} />
    </button>
  );
};

const ColorSwatch: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
  swatchClassName: string;
}> = ({ label, active, onClick, swatchClassName }) => {
  return (
    <button
      onClick={onClick}
      className="flex w-16 flex-col items-center gap-2 text-center"
    >
      <span
        className={`h-10 w-10 rounded-full border-2 shadow-sm transition ${swatchClassName} ${
          active ? "border-black ring-2 ring-black/10 ring-offset-2" : "border-gray-200"
        }`}
      />
      <span className={`text-xs font-medium ${active ? "text-black" : "text-gray-600"}`}>{label}</span>
    </button>
  );
};

const FilterPill: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
        active
          ? "border-black bg-black text-white"
          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:text-black"
      }`}
    >
      {label}
    </button>
  );
};

const getColorSwatchClassName = (color: string) => {
  const normalizedColor = color.toLowerCase();

  if (normalizedColor.includes("blanco")) return "bg-white";
  if (normalizedColor.includes("negro")) return "bg-black";
  if (normalizedColor.includes("rojo")) return "bg-red-500";
  if (normalizedColor.includes("azul")) return "bg-blue-500";
  if (normalizedColor.includes("verde")) return "bg-green-500";
  if (normalizedColor.includes("gris") || normalizedColor.includes("melange")) return "bg-gray-400";
  if (normalizedColor.includes("amarillo")) return "bg-yellow-400";
  if (normalizedColor.includes("rosa") || normalizedColor.includes("pink")) return "bg-pink-400";
  if (normalizedColor.includes("marr") || normalizedColor.includes("cafe")) return "bg-amber-800";

  return "bg-gradient-to-br from-gray-200 to-gray-400";
};

export default ProductsSidebar;