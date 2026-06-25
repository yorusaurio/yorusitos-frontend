"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { StorefrontProduct } from "@/lib/storefront-products";
import { sortStorefrontSizes } from "@/lib/storefront-products";
import ProductsSidebar from "@/components/products/ProductsSidebar";
import ProductsGrid from "@/components/products/ProductsGrid";
import { useProductStock } from "@/hooks/useProductStock";

type PolosCatalogProps = {
  initialCollection?: string;
};

const PolosCatalog: React.FC<PolosCatalogProps> = ({ initialCollection = "all" }) => {
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string>(initialCollection);
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<number>(1);
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { stock, loading: stockLoading } = useProductStock();

  useEffect(() => {
    setSelectedCollection(initialCollection || "all");
  }, [initialCollection]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      try {
        const response = await fetch("/api/products?category=Polo", { cache: "no-store" });
        const data = (await response.json()) as { products?: StorefrontProduct[]; error?: string };

        if (!response.ok) {
          throw new Error(data.error || "No se pudieron cargar los polos.");
        }

        if (!cancelled) {
          const loaded = data.products ?? [];
          setProducts(loaded);
          setError(null);

          if (loaded.length) {
            const prices = loaded.map((product) => product.price);
            const priceMin = Math.floor(Math.min(...prices));
            const priceMax = Math.ceil(Math.max(...prices));
            setMinPrice(priceMin);
            setMaxPrice(priceMax);
          }
        }
      } catch (loadError) {
        if (!cancelled) {
          setProducts([]);
          setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar los polos.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const availableCollections = useMemo(
    () => Array.from(new Set(products.map((product) => product.collection))).sort((a, b) => a.localeCompare(b, "es")),
    [products],
  );

  const availableColors = useMemo(
    () => Array.from(new Set(products.flatMap((product) => product.colors))).sort((a, b) => a.localeCompare(b, "es")),
    [products],
  );

  const availableSizes = useMemo(
    () => sortStorefrontSizes(Array.from(new Set(products.flatMap((product) => product.sizes)))),
    [products],
  );

  const priceBounds = useMemo(() => {
    if (!products.length) return { min: 1, max: 200 };
    const prices = products.map((product) => product.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const priceFloor = Math.min(minPrice, maxPrice);
    const priceCeiling = Math.max(minPrice, maxPrice);

    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.subcollection ?? "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCollection = selectedCollection === "all" || product.collection === selectedCollection;
      const matchesColor = selectedColor === "all" || product.colors.includes(selectedColor);
      const matchesSize = selectedSize === "all" || product.sizes.includes(selectedSize);
      const matchesPrice = product.price >= priceFloor && product.price <= priceCeiling;

      return matchesSearch && matchesCollection && matchesColor && matchesSize && matchesPrice;
    });
  }, [products, searchTerm, selectedCollection, selectedColor, selectedSize, minPrice, maxPrice]);

  const gridTitle = selectedCollection === "all" ? "Polos" : selectedCollection;

  return (
    <main className="min-h-screen bg-zinc-50 pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid items-start gap-6 lg:grid-cols-[300px,1fr] lg:gap-8">
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
            priceMin={priceBounds.min}
            priceMax={priceBounds.max}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            colors={availableColors}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            sizes={availableSizes}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                  <div className="aspect-[3/4] bg-zinc-200" />
                  <div className="space-y-3 p-4">
                    <div className="h-3 w-20 rounded bg-zinc-200" />
                    <div className="h-5 w-32 rounded bg-zinc-200" />
                    <div className="h-4 w-full rounded bg-zinc-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-red-700">{error}</div>
          ) : (
            <ProductsGrid
              products={filteredProducts}
              viewMode={viewMode}
              stock={stock}
              stockLoading={stockLoading}
              title={gridTitle}
              subtitle="Catálogo de polos premium"
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default PolosCatalog;
