"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { StorefrontProduct } from "@/lib/storefront-products";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faStar } from "@fortawesome/free-solid-svg-icons";

const FeaturedProducts: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<StorefrontProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadFeaturedProducts() {
      try {
        const response = await fetch("/api/products?collection=SuperStars&limit=6", { cache: "no-store" });
        const data = (await response.json()) as { products?: StorefrontProduct[]; error?: string };

        if (!response.ok) {
          throw new Error(data.error || "No se pudieron cargar los productos.");
        }

        if (!cancelled) {
          setFeaturedProducts(data.products ?? []);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setFeaturedProducts([]);
          setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar los productos.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadFeaturedProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-gray-400">SuperStars</p>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Destacados de la colección</h2>
            <p className="text-lg text-gray-600">
              Polos premium con estampados únicos de las leyendas del fútbol
            </p>
          </div>

          <Link
            href="/products/polos?collection=SuperStars"
            className="hidden md:flex items-center gap-2 text-black font-semibold hover:gap-4 transition-all duration-300"
          >
            Ver colección
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-2xl border border-gray-100 bg-gray-50">
                <div className="aspect-[3/4] bg-gray-200" />
                <div className="space-y-3 p-6">
                  <div className="h-3 w-24 rounded bg-gray-200" />
                  <div className="h-5 w-40 rounded bg-gray-200" />
                  <div className="h-4 w-full rounded bg-gray-200" />
                  <div className="h-8 w-28 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">{error}</p>
        ) : featuredProducts.length === 0 ? (
          <p className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4 text-gray-600">
            No hay productos SuperStars disponibles por ahora.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.parentSku} product={product} index={index} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center md:hidden">
          <Link href="/products/polos?collection=SuperStars">
            <button className="px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors duration-300 flex items-center gap-3 mx-auto">
              Ver colección SuperStars
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const ProductCard: React.FC<{ product: StorefrontProduct; index: number }> = ({ product, index }) => {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500">
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {index < 2 && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full">Nuevo</span>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200">
              Ver Detalles
            </button>
          </div>
        </div>

        <div className="p-6 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.collection}</p>
              <h3 className="text-lg font-semibold text-black line-clamp-1">{product.name}</h3>
            </div>
            <div className="flex items-center gap-1 text-yellow-500">
              <FontAwesomeIcon icon={faStar} className="text-sm" />
              <span className="text-sm font-semibold text-black">4.8</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">{product.summary}</p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold text-black">S/ {product.price.toFixed(2)}</span>
            <span className="text-sm text-gray-500">
              {product.sizes.length} {product.sizes.length === 1 ? "talla" : "tallas"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedProducts;
