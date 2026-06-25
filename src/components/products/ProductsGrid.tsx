"use client";

import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import type { StorefrontProduct } from "@/lib/storefront-products";
import type { ProductStockMap } from "@/lib/product-stock";
import { colorToHex } from "@/lib/catalog/catalog-utils";

interface ProductsGridProps {
  products: StorefrontProduct[];
  viewMode: "grid" | "list";
  stock?: ProductStockMap;
  stockLoading?: boolean;
  title?: string;
  subtitle?: string;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  viewMode,
  stock = {},
  stockLoading = false,
  title = "Productos",
  subtitle,
}) => {
  if (products.length === 0) {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white px-6 py-16 text-center shadow-sm">
        <p className="text-4xl">🔍</p>
        <h3 className="mt-4 text-xl font-semibold text-zinc-950">No se encontraron productos</h3>
        <p className="mt-2 text-sm text-zinc-500">Prueba con otros filtros o términos de búsqueda.</p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-zinc-200 pb-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">{subtitle ?? "Catálogo"}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">{title}</h2>
        </div>
        <p className="text-sm text-zinc-500">
          {products.length} {products.length === 1 ? "producto" : "productos"}
        </p>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
            : "space-y-4"
        }
      >
        {products.map((product) => (
          <ProductCard
            key={product.parentSku}
            product={product}
            viewMode={viewMode}
            inStock={stockLoading || (stock[product.id]?.available ?? 0) > 0}
          />
        ))}
      </div>
    </section>
  );
};

const ProductCard: React.FC<{
  product: StorefrontProduct;
  viewMode: "grid" | "list";
  inStock: boolean;
}> = ({ product, viewMode, inStock }) => {
  if (viewMode === "list") {
    return (
      <Link href={`/products/${product.id}`} className="group block">
        <article className="flex overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:border-zinc-300 hover:shadow-md">
          <div className="relative h-44 w-40 shrink-0 overflow-hidden bg-zinc-100 sm:h-48 sm:w-48">
            <img
              src={product.images[0]}
              alt={product.name}
              className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${inStock ? "" : "opacity-60 grayscale"}`}
            />
            {!inStock ? <OutOfStockBadge /> : null}
          </div>

          <div className="flex flex-1 flex-col justify-between p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                {product.subcollection || product.collection}
              </p>
              <div className="mt-1 flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-zinc-950">{product.name}</h3>
                <RatingBadge />
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-zinc-500">{product.summary}</p>
              <ColorDots colors={product.colors} className="mt-3" />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-xl font-bold text-zinc-950">S/ {product.price.toFixed(2)}</p>
              <span
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                  inStock ? "bg-zinc-950 text-white" : "bg-zinc-200 text-zinc-600"
                }`}
              >
                {inStock ? "Ver producto" : "Sin stock"}
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg">
        <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${inStock ? "" : "opacity-60 grayscale"}`}
          />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-700 shadow-sm backdrop-blur">
              {product.collection}
            </span>
            {!inStock ? <OutOfStockBadge compact /> : null}
          </div>

          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 transition duration-300 group-hover:translate-y-0">
            <span className="inline-flex w-full items-center justify-center rounded-full bg-white py-2.5 text-xs font-semibold uppercase tracking-wide text-zinc-950">
              Ver producto
            </span>
          </div>
        </div>

        <div className="space-y-2 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
            {product.subcollection || "Polo"}
          </p>
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-base font-semibold text-zinc-950">{product.name}</h3>
            <RatingBadge />
          </div>
          <p className="line-clamp-2 text-sm text-zinc-500">{product.summary}</p>
          <div className="flex items-center justify-between pt-1">
            <p className="text-lg font-bold text-zinc-950">S/ {product.price.toFixed(2)}</p>
            <span className="text-xs text-zinc-400">{product.sizes.length} tallas</span>
          </div>
          <ColorDots colors={product.colors} />
        </div>
      </article>
    </Link>
  );
};

function RatingBadge() {
  return (
    <div className="flex shrink-0 items-center gap-1 text-amber-500">
      <FontAwesomeIcon icon={faStar} className="text-xs" />
      <span className="text-xs font-semibold text-zinc-700">4.8</span>
    </div>
  );
}

function ColorDots({ colors, className = "" }: { colors: string[]; className?: string }) {
  if (!colors.length) return null;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {colors.slice(0, 4).map((color) => (
        <span
          key={color}
          title={color}
          className="h-3.5 w-3.5 rounded-full border border-zinc-200"
          style={{ backgroundColor: colorToHex(color) }}
        />
      ))}
      {colors.length > 4 ? <span className="text-[10px] text-zinc-400">+{colors.length - 4}</span> : null}
    </div>
  );
}

function OutOfStockBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`rounded-full bg-red-600 font-bold uppercase tracking-wide text-white ${
        compact ? "px-2 py-1 text-[10px]" : "px-3 py-1 text-xs"
      }`}
    >
      Sin stock
    </span>
  );
}

export default ProductsGrid;
