import { mockProducts } from "@/data/mockProducts";
import type { AccountOrder, WishlistItem } from "@/lib/account-data";

const fallbackImage = "/images/polo.avif";
const featuredProducts = mockProducts.slice(0, 8);

export function getDemoOrders(): AccountOrder[] {
  return [
    {
      id: "ORD-25061",
      placedAt: "18 mayo 2026",
      status: "En camino",
      total: 105,
      shipping: "Lima Metropolitana",
      items: [
        {
          id: featuredProducts[0]?.id ?? 1,
          name: featuredProducts[0]?.name ?? "Producto destacado",
          quantity: 2,
          price: featuredProducts[0]?.price ?? 35,
          image: featuredProducts[0]?.images?.[0] ?? fallbackImage,
        },
        {
          id: featuredProducts[1]?.id ?? 2,
          name: featuredProducts[1]?.name ?? "Producto destacado",
          quantity: 1,
          price: featuredProducts[1]?.price ?? 35,
          image: featuredProducts[1]?.images?.[0] ?? fallbackImage,
        },
      ],
    },
    {
      id: "ORD-24988",
      placedAt: "12 mayo 2026",
      status: "Entregado",
      total: 70,
      shipping: "Recojo en tienda",
      items: [
        {
          id: featuredProducts[2]?.id ?? 3,
          name: featuredProducts[2]?.name ?? "Producto destacado",
          quantity: 2,
          price: featuredProducts[2]?.price ?? 35,
          image: featuredProducts[2]?.images?.[0] ?? fallbackImage,
        },
      ],
    },
  ];
}

export function getDemoWishlist(): WishlistItem[] {
  return featuredProducts.slice(0, 6).map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    collection: product.collection,
    image: product.images?.[0] ?? fallbackImage,
  }));
}
