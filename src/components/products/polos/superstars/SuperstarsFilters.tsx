"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

interface SuperstarsFiltersProps {
  filtersVisible: boolean;
  toggleFilters: () => void;
  sortOption: string;
  setSortOption: (value: string) => void;
  availabilityFilter: boolean;
  setAvailabilityFilter: (value: boolean) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
}

export default function SuperstarsFilters({
  filtersVisible,
  toggleFilters,
  sortOption,
  setSortOption,
  availabilityFilter,
  setAvailabilityFilter,
  priceRange,
  setPriceRange,
}: SuperstarsFiltersProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <button
            onClick={toggleFilters}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            <FontAwesomeIcon icon={faFilter} />
            Filtros
          </button>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Ordenar por</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="alpha-asc">Nombre: A-Z</option>
              <option value="alpha-desc">Nombre: Z-A</option>
            </select>
          </div>
        </div>

        {filtersVisible && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <input
                    type="checkbox"
                    checked={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.checked)}
                    className="w-4 h-4"
                  />
                  Solo disponibles
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Rango de precio: S/ {priceRange[0]} - S/ {priceRange[1]}
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
