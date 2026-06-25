import { mockProducts } from "@/data/mockProducts";

import type { AdminInventoryProduct } from "@/lib/admin-data";



export type StorefrontProduct = {

  id: number;

  name: string;

  price: number;

  summary: string;

  category: string;

  collection: string;

  subcollection?: string;

  images: string[];

  colors: string[];

  sizes: string[];

  available: boolean;

  parentSku: string;

};



const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "STD"];



function sortSizes(sizes: string[]) {

  return [...sizes].sort((left, right) => {

    const leftIndex = SIZE_ORDER.indexOf(left);

    const rightIndex = SIZE_ORDER.indexOf(right);

    return (leftIndex === -1 ? 99 : leftIndex) - (rightIndex === -1 ? 99 : rightIndex);

  });

}



function resolveStorefrontImages(product: AdminInventoryProduct) {

  const catalog = product.productId ? mockProducts.find((item) => item.id === product.productId) : undefined;

  const images: string[] = [];



  for (const image of [...product.images, ...(catalog?.images ?? [])]) {

    if (image && !images.includes(image)) images.push(image);

  }



  return images;

}



function resolveSummary(product: AdminInventoryProduct) {

  const catalog = product.productId ? mockProducts.find((item) => item.id === product.productId) : undefined;

  const rawSummary = product.summary || catalog?.description || "";

  return rawSummary.replace(/\s+/g, " ").trim();

}



function resolveDescription(product: AdminInventoryProduct) {

  const catalog = product.productId ? mockProducts.find((item) => item.id === product.productId) : undefined;

  return (product.description || catalog?.detailedDescription || catalog?.description || "").trim();

}



export type StorefrontProductDetail = StorefrontProduct & {

  description: string;

};



function buildStorefrontProduct(product: AdminInventoryProduct): StorefrontProduct | null {

  if (!product.productId || product.status !== "active") return null;



  const activeVariants = product.variants.filter((variant) => (variant.status ?? "active") === "active");

  if (!activeVariants.length) return null;



  const images = resolveStorefrontImages(product);

  if (!images.length) return null;



  const catalog = mockProducts.find((item) => item.id === product.productId);

  const prices = activeVariants.map((variant) => variant.price ?? product.basePrice ?? 0).filter((price) => price > 0);

  const price = prices.length ? Math.min(...prices) : product.basePrice ?? catalog?.price ?? 0;



  const colors = Array.from(new Set(activeVariants.map((variant) => variant.color).filter(Boolean))) as string[];

  const sizes = sortSizes(

    Array.from(new Set(activeVariants.map((variant) => variant.size).filter(Boolean))) as string[],

  );



  const summary = resolveSummary(product);

  if (!summary) return null;



  return {

    id: product.productId,

    name: product.product,

    price,

    summary,

    category: product.category || "Polo",

    collection: product.collection || catalog?.collection || "General",

    subcollection: product.subcollection,

    images,

    colors: colors.length ? colors : catalog?.colors ?? [],

    sizes: sizes.length ? sizes : catalog?.sizes ?? [],

    available: product.totalAvailable > 0,

    parentSku: product.parentSku,

  };

}



export function mapInventoryProductToStorefront(product: AdminInventoryProduct): StorefrontProduct | null {

  return buildStorefrontProduct(product);

}



export function mapInventoryProductToStorefrontDetail(

  product: AdminInventoryProduct,

): StorefrontProductDetail | null {

  const base = buildStorefrontProduct(product);

  if (!base) return null;



  return {

    ...base,

    description: resolveDescription(product),

  };

}



export function findStorefrontProductDetail(

  products: AdminInventoryProduct[],

  productId: number,

): StorefrontProductDetail | null {

  const inventoryProduct = products.find((product) => product.productId === productId);

  return inventoryProduct ? mapInventoryProductToStorefrontDetail(inventoryProduct) : null;

}



export function filterStorefrontProducts(

  products: AdminInventoryProduct[],

  options?: { collection?: string; category?: string; limit?: number },

) {

  let result = products

    .map(mapInventoryProductToStorefront)

    .filter((product): product is StorefrontProduct => product !== null);



  if (options?.category) {

    const category = options.category.toLowerCase();

    result = result.filter((product) => product.category.toLowerCase() === category);

  }



  if (options?.collection) {

    result = result.filter((product) => product.collection === options.collection);

  }



  if (options?.limit && options.limit > 0) {

    result = result.slice(0, options.limit);

  }



  return result;

}



export function sortStorefrontSizes(sizes: string[]) {

  return sortSizes(sizes);

}


