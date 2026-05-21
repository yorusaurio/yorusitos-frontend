"use client";

import { useState, useEffect } from "react";
import { mockProducts } from "@/data/mockProducts";
import SuperstarsHero from "@/components/products/polos/superstars/SuperstarsHero";
import SuperstarsFilters from "@/components/products/polos/superstars/SuperstarsFilters";
import SuperstarsGrid from "@/components/products/polos/superstars/SuperstarsGrid";

export default function SuperStarsPage() {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [sortOption, setSortOption] = useState<string>("");
  const [availabilityFilter, setAvailabilityFilter] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [filteredProducts, setFilteredProducts] = useState(
    mockProducts.filter((product) => product.collection === "SuperStars")
  );

  const toggleFilters = () => setFiltersVisible((prev) => !prev);

  const applyFiltersAndSort = () => {
    let result = mockProducts.filter((product) => product.collection === "SuperStars");

    if (availabilityFilter) {
      result = result.filter((product) => product.available);
    }

    result = result.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "alpha-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "alpha-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  };

  useEffect(() => {
    applyFiltersAndSort();
  }, [sortOption, availabilityFilter, priceRange]);

  return (
    <div className="bg-white min-h-screen">
      <SuperstarsHero />
      
      <SuperstarsFilters
        filtersVisible={filtersVisible}
        toggleFilters={toggleFilters}
        sortOption={sortOption}
        setSortOption={setSortOption}
        availabilityFilter={availabilityFilter}
        setAvailabilityFilter={setAvailabilityFilter}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />
      
      <SuperstarsGrid products={filteredProducts} />
    </div>
  );
}
